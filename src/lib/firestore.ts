import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  runTransaction,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { db, storage } from "./firebase";
import type { Announcement, AnnouncementStatus, AnnouncementType, CreateAnnouncementInput, Sighting } from "@/types/announcement";
import type { Ambassador, AmbassadorAuditLog, SubmitApplicationInput, SubmitApplicationResult, ApproveAmbassadorResult, AuditAction } from "@/types/ambassador";
import { getZoneById } from "./zones";
import { generateRefCodeCandidate, generateAccessToken, normalizePhone, validateZoneHierarchy, isMinimumAge, getDashboardUrl } from "./ambassador-utils";

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Génère un code court unique pour l'annonce (ex: EPB-A7xK9mP2)
 * Utilise nanoid pour une génération cryptographiquement sécurisée
 */
function generateShortCode(): string {
  // nanoid génère des IDs URL-safe avec 21 caractères par défaut
  // On utilise 8 caractères pour un bon équilibre lisibilité/unicité
  const id = nanoid(8);
  return `EPB-${id}`;
}

/**
 * Génère un token secret cryptographiquement sécurisé
 * Utilisé pour les liens de gestion d'annonce
 */
function generateSecretToken(): string {
  // 32 caractères hex = 128 bits d'entropie (très sécurisé)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Masque un numero de telephone pour affichage public
 * +22670123456 → +226 70 XX XX XX
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 11) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} XX XX XX`;
  }
  return phone.slice(0, 6) + "XXXXXX";
}

/**
 * Retourne les stats par defaut pour une nouvelle annonce
 */
export function getDefaultStats() {
  return {
    facebookPostId: null,
    facebookReach: 0,
    facebookLikes: 0,
    facebookShares: 0,
    facebookClicks: 0,
    // Instagram
    instagramPostId: null,
    instagramReach: 0,
    instagramLikes: 0,
    instagramShares: 0,
    instagramComments: 0,
    // Twitter/X
    twitterPostId: null,
    twitterImpressions: 0,
    twitterLikes: 0,
    twitterRetweets: 0,
    twitterReplies: 0,
    // WhatsApp
    whatsappChannelReach: 0,
    whatsappSent: 0,
    whatsappDelivered: 0,
    whatsappRead: 0,
    // Push notifications
    pushSent: 0,
    pushClicked: 0,
    // Page analytics
    pageViews: 0,
    alertSubscribers: 0,
    // TikTok
    tiktokVideoId: null,
    tiktokViews: 0,
    tiktokLikes: 0,
    tiktokShares: 0,
    tiktokComments: 0,
  };
}

// ─── Upload photo ────────────────────────────────────────────────────────────

export async function uploadAnnouncementPhoto(
  file: File,
  shortCode: string
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const storageRef = ref(storage, `announcement-photos/${shortCode}.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Créer une annonce ───────────────────────────────────────────────────────

export async function createAnnouncement(
  input: CreateAnnouncementInput
): Promise<{ shortCode: string; secretToken: string; docId: string }> {
  const shortCode = generateShortCode();
  const secretToken = generateSecretToken();
  const zone = getZoneById(input.zoneId);
  // zoneName : priorité à l'override (zones "autres"), sinon auto-calculé depuis la liste
  const zoneName =
    input.zoneName?.trim() ||
    (zone ? `${zone.name} — ${zone.city}, ${zone.countryName}` : input.zoneId);

  // Upload photo d'abord
  const childPhotoURL = await uploadAnnouncementPhoto(input.childPhoto, shortCode);

  // Normaliser le téléphone pour stockage cohérent
  const normalizedPhone = normalizePhone(input.parentPhone);

  const now = serverTimestamp();

  const docRef = await addDoc(collection(db, "announcements"), {
    shortCode,
    secretToken,
    createdAt: now,
    updatedAt: now,
    status: "active" as AnnouncementStatus,
    type: "missing" as AnnouncementType,

    childName: input.childName.trim(),
    childAge: input.childAge,
    childGender: input.childGender,
    childPhotoURL,
    description: input.description.trim(),
    distinctiveSign: input.distinctiveSign.trim(),

    zoneId: input.zoneId,
    zoneName,
    lastSeenPlace: input.lastSeenPlace.trim(),
    lastSeenAt: new Date(input.lastSeenAt),

    parentPhone: normalizedPhone,
    parentPhoneDisplay: maskPhone(normalizedPhone),

    isSecureID: false,
    linkedProfileId: null,
    linkedBraceletId: null,
    lastGpsLat: null,
    lastGpsLng: null,

    stats: getDefaultStats(),

    remindersSent: 0,
    nextReminderAt: null,
    resolvedAt: null,
    alertCardURL: null,
  });

  return { shortCode, secretToken, docId: docRef.id };
}

// ─── Créer une annonce "enfant trouvé" ──────────────────────────────────────

export interface CreateFoundChildInput {
  childPhoto: File;
  estimatedAge: number;
  childGender: "M" | "F";
  description: string;
  distinctiveSign: string;
  childSaidName?: string;
  zoneId: string;
  zoneName?: string;
  foundPlace: string;
  foundAt: string;
  finderPhone: string;
  finderName?: string;
}

export async function createFoundChildAnnouncement(
  input: CreateFoundChildInput
): Promise<{ shortCode: string; secretToken: string; docId: string }> {
  const shortCode = `ETR-${nanoid(8)}`; // ETR = Enfant TRouvé
  const secretToken = generateSecretToken();
  const zone = getZoneById(input.zoneId);
  const zoneName =
    input.zoneName?.trim() ||
    (zone ? `${zone.name} — ${zone.city}, ${zone.countryName}` : input.zoneId);

  const childPhotoURL = await uploadAnnouncementPhoto(input.childPhoto, shortCode);
  const now = serverTimestamp();

  // Nom : soit ce que l'enfant a dit, soit "Enfant trouvé"
  const childName = input.childSaidName?.trim() || "Enfant trouvé";

  // Normaliser le téléphone pour stockage cohérent
  const normalizedPhone = normalizePhone(input.finderPhone);

  const docRef = await addDoc(collection(db, "announcements"), {
    shortCode,
    secretToken,
    createdAt: now,
    updatedAt: now,
    status: "active" as AnnouncementStatus,
    type: "found" as AnnouncementType,

    childName,
    childAge: input.estimatedAge,
    childGender: input.childGender,
    childPhotoURL,
    description: input.description.trim(),
    distinctiveSign: input.distinctiveSign.trim(),

    zoneId: input.zoneId,
    zoneName,
    lastSeenPlace: input.foundPlace.trim(), // "foundPlace" pour les enfants trouvés
    lastSeenAt: new Date(input.foundAt),

    // Le "finder" (celui qui a trouvé) prend la place du "parent"
    parentPhone: normalizedPhone,
    parentPhoneDisplay: maskPhone(normalizedPhone),
    finderName: input.finderName?.trim() || null,

    isSecureID: false,
    linkedProfileId: null,
    linkedBraceletId: null,
    lastGpsLat: null,
    lastGpsLng: null,

    stats: getDefaultStats(),

    remindersSent: 0,
    nextReminderAt: null,
    resolvedAt: null,
    alertCardURL: null,
  });

  return { shortCode, secretToken, docId: docRef.id };
}

// ─── Lire une annonce par shortCode ─────────────────────────────────────────

export async function getAnnouncementByShortCode(
  shortCode: string
): Promise<Announcement | null> {
  const q = query(
    collection(db, "announcements"),
    where("shortCode", "==", shortCode),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Announcement;
}

// ─── Lire une annonce par secretToken ───────────────────────────────────────

export async function getAnnouncementByToken(
  secretToken: string
): Promise<Announcement | null> {
  const q = query(
    collection(db, "announcements"),
    where("secretToken", "==", secretToken),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Announcement;
}

// ─── Écouter les annonces actives (realtime) ─────────────────────────────────

export function subscribeToActiveAnnouncements(
  callback: (announcements: Announcement[]) => void,
  zoneId?: string,
  maxResults = 20
): Unsubscribe {
  let q = query(
    collection(db, "announcements"),
    where("status", "==", "active"),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  if (zoneId) {
    q = query(
      collection(db, "announcements"),
      where("status", "==", "active"),
      where("zoneId", "==", zoneId),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );
  }

  return onSnapshot(q, (snapshot) => {
    const announcements = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Announcement)
    );
    callback(announcements);
  });
}

// ─── Écouter les annonces avec filtre statut + zone (homepage) ───────────────

export function subscribeToFilteredAnnouncements(
  callback: (announcements: Announcement[]) => void,
  options: {
    status: "active" | "resolved" | "all";
    zoneId?: string;
    maxResults?: number;
  }
): Unsubscribe {
  const { status, zoneId, maxResults = 50 } = options;

  const buildQuery = (s: "active" | "resolved") => {
    if (zoneId) {
      return query(
        collection(db, "announcements"),
        where("status", "==", s),
        where("zoneId", "==", zoneId),
        orderBy("createdAt", "desc"),
        limit(maxResults)
      );
    }
    return query(
      collection(db, "announcements"),
      where("status", "==", s),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );
  };

  const toList = (snapshot: { docs: Array<{ id: string; data: () => Record<string, unknown> }> }) =>
    snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement));

  if (status !== "all") {
    return onSnapshot(buildQuery(status), (snap) => callback(toList(snap)));
  }

  // "all" — deux abonnements fusionnés côté client
  let activeList: Announcement[] = [];
  let resolvedList: Announcement[] = [];

  const merge = () => {
    const merged = [...activeList, ...resolvedList].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    callback(merged.slice(0, maxResults));
  };

  const unsub1 = onSnapshot(buildQuery("active"), (snap) => {
    activeList = toList(snap);
    merge();
  });
  const unsub2 = onSnapshot(buildQuery("resolved"), (snap) => {
    resolvedList = toList(snap);
    merge();
  });

  return () => {
    unsub1();
    unsub2();
  };
}

// ─── Écouter une annonce spécifique (realtime — pour les stats) ──────────────

export function subscribeToAnnouncement(
  shortCode: string,
  callback: (a: Announcement | null) => void
): Unsubscribe {
  const q = query(
    collection(db, "announcements"),
    where("shortCode", "==", shortCode),
    limit(1)
  );
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
      return;
    }
    const d = snapshot.docs[0];
    callback({ id: d.id, ...d.data() } as Announcement);
  });
}

// ─── Marquer comme retrouvé ──────────────────────────────────────────────────

export async function resolveAnnouncement(announcementId: string): Promise<void> {
  await updateDoc(doc(db, "announcements", announcementId), {
    status: "resolved",
    resolvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ─── Mettre à jour une annonce ───────────────────────────────────────────────

export async function updateAnnouncement(
  announcementId: string,
  data: Partial<Pick<Announcement, "description" | "distinctiveSign" | "childPhotoURL">>
): Promise<void> {
  await updateDoc(doc(db, "announcements", announcementId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── Incrémenter les vues ────────────────────────────────────────────────────

export async function incrementPageViews(announcementId: string): Promise<void> {
  await updateDoc(doc(db, "announcements", announcementId), {
    "stats.pageViews": increment(1),
  });
}

// ─── Stats globales ──────────────────────────────────────────────────────────

export async function getGlobalStats(): Promise<{
  totalResolved: number;
  totalActive: number;
}> {
  const [resolvedSnap, activeSnap] = await Promise.all([
    getDocs(query(collection(db, "announcements"), where("status", "==", "resolved"))),
    getDocs(query(collection(db, "announcements"), where("status", "==", "active"))),
  ]);
  return {
    totalResolved: resolvedSnap.size,
    totalActive: activeSnap.size,
  };
}

// ─── Retrouver une annonce par numéro de tel (fallback) ─────────────────────

export async function getAnnouncementsByPhone(
  phone: string
): Promise<Announcement[]> {
  // Normaliser le numéro pour correspondre au format stocké
  const normalizedPhone = normalizePhone(phone);

  // Chercher avec le numéro normalisé ET le numéro original (fallback ancien format)
  const [normalizedResults, originalResults] = await Promise.all([
    getDocs(
      query(
        collection(db, "announcements"),
        where("parentPhone", "==", normalizedPhone),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      )
    ),
    // Fallback: chercher aussi avec le format original si différent
    normalizedPhone !== phone
      ? getDocs(
          query(
            collection(db, "announcements"),
            where("parentPhone", "==", phone),
            where("status", "==", "active"),
            orderBy("createdAt", "desc")
          )
        )
      : Promise.resolve({ docs: [] }),
  ]);

  // Combiner et dédupliquer les résultats
  const seen = new Set<string>();
  const results: Announcement[] = [];

  for (const doc of [...normalizedResults.docs, ...originalResults.docs]) {
    if (!seen.has(doc.id)) {
      seen.add(doc.id);
      results.push({ id: doc.id, ...doc.data() } as Announcement);
    }
  }

  return results;
}

// ─── Signalements (Sightings) ────────────────────────────────────────────────

export async function createSighting(data: {
  announcementId: string;
  place: string;
  description: string;
  reporterPhone?: string;
  anonymous?: boolean;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "sightings"), {
    announcementId: data.announcementId,
    place: data.place.trim(),
    description: data.description.trim(),
    reporterPhone: data.reporterPhone || null,
    anonymous: data.anonymous ?? true,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function subscribeToSightings(
  announcementId: string,
  callback: (sightings: Sighting[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "sightings"),
    where("announcementId", "==", announcementId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const sightings = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() || new Date(),
    })) as Sighting[];
    callback(sightings);
  });
}

export async function getSightingsForAnnouncement(
  announcementId: string
): Promise<Sighting[]> {
  const q = query(
    collection(db, "sightings"),
    where("announcementId", "==", announcementId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() || new Date(),
  })) as Sighting[];
}

// ─── Abonnés d'alerte (alert_subscribers) ────────────────────────────────────

export async function subscribeToAlertUpdates(
  announcementId: string,
  phone: string
): Promise<void> {
  // Créer un hash simple du téléphone pour l'ID du document
  const phoneHash = btoa(phone).replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);

  const subRef = doc(db, `announcements/${announcementId}/alert_subscribers`, phoneHash);
  const existing = await getDoc(subRef);

  if (!existing.exists()) {
    await addDoc(collection(db, `announcements/${announcementId}/alert_subscribers`), {
      phoneHash,
      waPhone: phone,
      createdAt: serverTimestamp(),
      notified: false,
    });

    // Incrémenter le compteur
    await updateDoc(doc(db, "announcements", announcementId), {
      "stats.alertSubscribers": increment(1),
    });
  }
}

// ─── Annonces résolues (retrouvailles) ───────────────────────────────────────

export async function getResolvedAnnouncements(
  maxResults = 10
): Promise<Announcement[]> {
  const q = query(
    collection(db, "announcements"),
    where("status", "==", "resolved"),
    orderBy("resolvedAt", "desc"),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement));
}

// ─── Annonces par zone ───────────────────────────────────────────────────────

export function subscribeToZoneAnnouncements(
  zoneId: string,
  callback: (announcements: Announcement[]) => void,
  maxResults = 20
): Unsubscribe {
  const q = query(
    collection(db, "announcements"),
    where("status", "==", "active"),
    where("zoneId", "==", zoneId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  return onSnapshot(q, (snapshot) => {
    const announcements = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Announcement)
    );
    callback(announcements);
  });
}

// ─── Vigies communautaires ────────────────────────────────────────────────────

export interface Vigie {
  id: string;
  name: string;
  phone: string;
  zoneId: string;
  motivation: string;
  status: "active" | "inactive";
  createdAt: Date;
  alertsReceived: number;
  sightingsReported: number;
}

export interface RegisterVigieInput {
  name: string;
  phone: string;
  zoneId: string;
  motivation?: string;
}

export async function registerVigie(input: RegisterVigieInput): Promise<string> {
  // Vérifier si la vigie existe déjà avec ce numéro
  const existingQuery = query(
    collection(db, "vigies"),
    where("phone", "==", input.phone),
    limit(1)
  );
  const existingSnap = await getDocs(existingQuery);

  if (!existingSnap.empty) {
    // Réactiver la vigie existante
    const existingDoc = existingSnap.docs[0];
    await updateDoc(doc(db, "vigies", existingDoc.id), {
      status: "active",
      zoneId: input.zoneId,
      name: input.name.trim(),
      motivation: input.motivation?.trim() || "",
      updatedAt: serverTimestamp(),
    });
    return existingDoc.id;
  }

  // Créer une nouvelle vigie
  const docRef = await addDoc(collection(db, "vigies"), {
    name: input.name.trim(),
    phone: input.phone.trim(),
    zoneId: input.zoneId,
    motivation: input.motivation?.trim() || "",
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    alertsReceived: 0,
    sightingsReported: 0,
  });

  return docRef.id;
}

export async function getVigiesByZone(zoneId: string): Promise<Vigie[]> {
  const q = query(
    collection(db, "vigies"),
    where("zoneId", "==", zoneId),
    where("status", "==", "active")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() || new Date(),
  })) as Vigie[];
}

export async function getVigieCount(): Promise<number> {
  const q = query(collection(db, "vigies"), where("status", "==", "active"));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// ─── Ambassadeurs ─────────────────────────────────────────────────────────────

const MAX_ZONES_PER_AMBASSADOR = 5;
const ACCESS_TOKEN_EXPIRY_DAYS = 7;

/**
 * Helper pour créer un log d'audit
 */
async function createAuditLog(
  ambassadorId: string,
  action: AuditAction,
  performedBy: string,
  details?: Record<string, unknown>
): Promise<void> {
  await addDoc(collection(db, "ambassador_audit_log"), {
    ambassadorId,
    action,
    performedBy,
    timestamp: serverTimestamp(),
    details: details ?? null,
  });
}

/**
 * Soumet une candidature ambassadeur
 */
export async function submitAmbassadorApplication(
  input: SubmitApplicationInput
): Promise<SubmitApplicationResult> {
  // Vérifier honeypot
  if (input.honeypot && input.honeypot.trim() !== "") {
    // Rejet silencieux - on retourne success pour ne pas informer le bot
    return { success: true, refCode: "AMB-XXXX" };
  }

  // Normaliser le téléphone
  const normalizedPhone = normalizePhone(input.phone);

  // Valider la hiérarchie des zones
  const zoneValidation = validateZoneHierarchy(input.countryCode, input.city, input.zoneId);
  if (!zoneValidation.valid) {
    return { success: false, error: "invalid_zone" };
  }

  // Valider l'âge (minimum 20 ans)
  const dob = new Date(input.dateOfBirth.year, input.dateOfBirth.month - 1, input.dateOfBirth.day);
  if (!isMinimumAge(dob, 20)) {
    return { success: false, error: "too_young" };
  }

  // Vérifier si le téléphone existe déjà
  const existingQuery = query(
    collection(db, "ambassadors"),
    where("phone", "==", normalizedPhone),
    limit(1)
  );
  const existingSnap = await getDocs(existingQuery);

  if (!existingSnap.empty) {
    const existing = existingSnap.docs[0];
    const data = existing.data() as Ambassador;

    if (data.status === "pending") {
      return { success: false, error: "duplicate_pending", existingAmbassadorId: existing.id };
    }
    if (data.status === "approved") {
      return { success: false, error: "duplicate_approved", existingAmbassadorId: existing.id };
    }
    if (data.status === "rejected") {
      return { success: false, error: "duplicate_rejected", existingAmbassadorId: existing.id };
    }
  }

  // Générer un refCode unique via transaction
  let refCode: string | null = null;
  let docId: string | null = null;

  await runTransaction(db, async (transaction) => {
    // Essayer jusqu'à 5 fois de générer un refCode unique
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidateCode = generateRefCodeCandidate();

      // Vérifier unicité
      const refCodeQuery = query(
        collection(db, "ambassadors"),
        where("refCode", "==", candidateCode),
        limit(1)
      );
      const refCodeSnap = await getDocs(refCodeQuery);

      if (refCodeSnap.empty) {
        refCode = candidateCode;
        break;
      }
    }

    if (!refCode) {
      throw new Error("Could not generate unique refCode after 5 attempts");
    }

    // Créer le document
    const newDocRef = doc(collection(db, "ambassadors"));
    docId = newDocRef.id;

    transaction.set(newDocRef, {
      refCode,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: normalizedPhone,
      zones: [input.zoneId],
      dateOfBirth: Timestamp.fromDate(dob),
      catAnswer: input.catAnswer,
      status: "pending",
      createdAt: serverTimestamp(),
      approvedAt: null,
      stats: {
        notificationsActivated: 0,
        alertsShared: 0,
        ambassadorsRecruited: 0,
        viewsGenerated: 0,
      },
    });
  });

  return { success: true, refCode: refCode! };
}

/**
 * Récupère un ambassadeur par téléphone (normalisé)
 */
export async function getAmbassadorByPhone(phone: string): Promise<Ambassador | null> {
  const normalizedPhone = normalizePhone(phone);
  const q = query(
    collection(db, "ambassadors"),
    where("phone", "==", normalizedPhone),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Ambassador;
}

/**
 * Récupère un ambassadeur par code ref
 */
export async function getAmbassadorByRefCode(refCode: string): Promise<Ambassador | null> {
  const q = query(
    collection(db, "ambassadors"),
    where("refCode", "==", refCode),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Ambassador;
}

/**
 * Récupère un ambassadeur par access token et vérifie l'expiration
 */
export async function getAmbassadorByAccessToken(token: string): Promise<{ ambassador: Ambassador | null; expired: boolean }> {
  const q = query(
    collection(db, "ambassadors"),
    where("accessToken", "==", token),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return { ambassador: null, expired: false };

  const docSnap = snapshot.docs[0];
  const ambassador = { id: docSnap.id, ...docSnap.data() } as Ambassador;

  // Vérifier expiration
  if (ambassador.accessTokenExpiresAt) {
    const expiresAt = ambassador.accessTokenExpiresAt.toDate();
    if (expiresAt < new Date()) {
      return { ambassador, expired: true };
    }
  }

  return { ambassador, expired: false };
}

/**
 * Approuve un ambassadeur et génère son access token
 */
export async function approveAmbassador(
  ambassadorId: string,
  adminId: string
): Promise<ApproveAmbassadorResult> {
  const docRef = doc(db, "ambassadors", ambassadorId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { success: false, error: "Ambassador not found" };
  }

  const accessToken = generateAccessToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ACCESS_TOKEN_EXPIRY_DAYS);

  await updateDoc(docRef, {
    status: "approved",
    approvedAt: serverTimestamp(),
    approvedBy: adminId,
    accessToken,
    accessTokenExpiresAt: Timestamp.fromDate(expiresAt),
  });

  await createAuditLog(ambassadorId, "approved", adminId);

  const dashboardUrl = getDashboardUrl(accessToken);

  return { success: true, accessToken, dashboardUrl };
}

/**
 * Rejette un ambassadeur
 */
export async function rejectAmbassador(
  ambassadorId: string,
  adminId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const docRef = doc(db, "ambassadors", ambassadorId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { success: false, error: "Ambassador not found" };
  }

  await updateDoc(docRef, {
    status: "rejected",
    rejectedAt: serverTimestamp(),
    rejectionReason: reason ?? null,
  });

  await createAuditLog(ambassadorId, "rejected", adminId, { reason });

  return { success: true };
}

/**
 * Ajoute une zone à un ambassadeur existant
 */
export async function addZoneToAmbassador(
  ambassadorId: string,
  zoneId: string
): Promise<{ success: boolean; error?: string }> {
  const docRef = doc(db, "ambassadors", ambassadorId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { success: false, error: "Ambassador not found" };
  }

  const data = docSnap.data() as Ambassador;

  // Vérifier que l'ambassadeur est approuvé
  if (data.status !== "approved") {
    return { success: false, error: "Ambassador not approved" };
  }

  // Vérifier la limite de zones
  if (data.zones.length >= MAX_ZONES_PER_AMBASSADOR) {
    return { success: false, error: `Maximum ${MAX_ZONES_PER_AMBASSADOR} quartiers atteint` };
  }

  // Vérifier que la zone n'est pas déjà présente
  if (data.zones.includes(zoneId)) {
    return { success: false, error: "Zone déjà ajoutée" };
  }

  await updateDoc(docRef, {
    zones: [...data.zones, zoneId],
  });

  await createAuditLog(ambassadorId, "zone_added", "system", { zoneId });

  return { success: true };
}

/**
 * Régénère l'access token d'un ambassadeur
 */
export async function regenerateAccessToken(
  ambassadorId: string
): Promise<{ success: boolean; accessToken?: string; dashboardUrl?: string; error?: string }> {
  const docRef = doc(db, "ambassadors", ambassadorId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { success: false, error: "Ambassador not found" };
  }

  const data = docSnap.data() as Ambassador;

  if (data.status !== "approved") {
    return { success: false, error: "Ambassador not approved" };
  }

  const accessToken = generateAccessToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ACCESS_TOKEN_EXPIRY_DAYS);

  await updateDoc(docRef, {
    accessToken,
    accessTokenExpiresAt: Timestamp.fromDate(expiresAt),
  });

  await createAuditLog(ambassadorId, "token_regenerated", "system");

  const dashboardUrl = `https://enfentdisparu.bf/ambassadeur/dashboard?t=${accessToken}`;

  return { success: true, accessToken, dashboardUrl };
}

/**
 * Incrémente une stat d'ambassadeur
 */
export async function incrementAmbassadorStat(
  refCode: string,
  statKey: keyof Ambassador["stats"]
): Promise<boolean> {
  const ambassador = await getAmbassadorByRefCode(refCode);
  if (!ambassador || ambassador.status !== "approved") {
    return false;
  }

  const docRef = doc(db, "ambassadors", ambassador.id);
  await updateDoc(docRef, {
    [`stats.${statKey}`]: increment(1),
  });

  return true;
}

/**
 * Compte les ambassadeurs approuvés
 */
let ambassadorCountCache: { count: number; timestamp: number } | null = null;
const AMBASSADOR_COUNT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getAmbassadorCount(): Promise<number> {
  // Vérifier le cache
  if (ambassadorCountCache && Date.now() - ambassadorCountCache.timestamp < AMBASSADOR_COUNT_CACHE_TTL) {
    return ambassadorCountCache.count;
  }

  const q = query(collection(db, "ambassadors"), where("status", "==", "approved"));
  const snapshot = await getDocs(q);
  const count = snapshot.size;

  // Mettre à jour le cache
  ambassadorCountCache = { count, timestamp: Date.now() };

  return count;
}

/**
 * Liste les ambassadeurs par status
 */
export async function getAmbassadorsByStatus(
  status: Ambassador["status"],
  maxResults = 50
): Promise<Ambassador[]> {
  const q = query(
    collection(db, "ambassadors"),
    where("status", "==", status),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Ambassador));
}

/**
 * Récupère le classement des ambassadeurs (top N par score total)
 */
export async function getAmbassadorLeaderboard(
  maxResults = 10
): Promise<{ ambassador: Ambassador; rank: number; totalScore: number }[]> {
  const q = query(
    collection(db, "ambassadors"),
    where("status", "==", "approved"),
    limit(100) // On récupère plus pour trier côté client
  );
  const snapshot = await getDocs(q);

  const ambassadors = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Ambassador[];

  // Calculer le score total pour chaque ambassadeur
  const scored = ambassadors.map((amb) => ({
    ambassador: amb,
    totalScore: calculateAmbassadorScore(amb.stats),
  }));

  // Trier par score décroissant
  scored.sort((a, b) => b.totalScore - a.totalScore);

  // Ajouter le rang et limiter
  return scored.slice(0, maxResults).map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

/**
 * Calcule le score total d'un ambassadeur
 * Pondération: notifications=1, partages=2, recrutés=5, vues=0.1
 */
export function calculateAmbassadorScore(stats: Ambassador["stats"]): number {
  return (
    stats.notificationsActivated * 1 +
    stats.alertsShared * 2 +
    stats.ambassadorsRecruited * 5 +
    stats.viewsGenerated * 0.1
  );
}

/**
 * Récupère le rang d'un ambassadeur spécifique
 */
export async function getAmbassadorRank(
  ambassadorId: string
): Promise<{ rank: number; total: number; score: number } | null> {
  const q = query(
    collection(db, "ambassadors"),
    where("status", "==", "approved")
  );
  const snapshot = await getDocs(q);

  const ambassadors = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Ambassador[];

  const scored = ambassadors.map((amb) => ({
    id: amb.id,
    score: calculateAmbassadorScore(amb.stats),
  }));

  scored.sort((a, b) => b.score - a.score);

  const index = scored.findIndex((item) => item.id === ambassadorId);
  if (index === -1) return null;

  return {
    rank: index + 1,
    total: scored.length,
    score: scored[index].score,
  };
}

/**
 * Statistiques globales des ambassadeurs
 */
export interface AmbassadorGlobalStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalNotificationsActivated: number;
  totalAlertsShared: number;
  totalAmbassadorsRecruited: number;
  totalViewsGenerated: number;
  totalScore: number;
}

/**
 * Récupère les statistiques globales des ambassadeurs
 */
export async function getAmbassadorGlobalStats(): Promise<AmbassadorGlobalStats> {
  // Récupérer tous les ambassadeurs
  const [pendingSnap, approvedSnap, rejectedSnap] = await Promise.all([
    getDocs(query(collection(db, "ambassadors"), where("status", "==", "pending"))),
    getDocs(query(collection(db, "ambassadors"), where("status", "==", "approved"))),
    getDocs(query(collection(db, "ambassadors"), where("status", "==", "rejected"))),
  ]);

  // Calculer les totaux des stats des ambassadeurs approuvés
  let totalNotificationsActivated = 0;
  let totalAlertsShared = 0;
  let totalAmbassadorsRecruited = 0;
  let totalViewsGenerated = 0;

  approvedSnap.docs.forEach((doc) => {
    const data = doc.data() as Ambassador;
    if (data.stats) {
      totalNotificationsActivated += data.stats.notificationsActivated || 0;
      totalAlertsShared += data.stats.alertsShared || 0;
      totalAmbassadorsRecruited += data.stats.ambassadorsRecruited || 0;
      totalViewsGenerated += data.stats.viewsGenerated || 0;
    }
  });

  const totalScore =
    totalNotificationsActivated * 1 +
    totalAlertsShared * 2 +
    totalAmbassadorsRecruited * 5 +
    totalViewsGenerated * 0.1;

  return {
    totalPending: pendingSnap.size,
    totalApproved: approvedSnap.size,
    totalRejected: rejectedSnap.size,
    totalNotificationsActivated,
    totalAlertsShared,
    totalAmbassadorsRecruited,
    totalViewsGenerated,
    totalScore: Math.round(totalScore),
  };
}

// ─── Custom Zones ───────────────────────────────────────────────────────────

export interface CustomZone {
  id: string;
  countryCode: string;
  countryName: string;
  city: string;
  neighborhood: string;
  createdAt: Date;
  usageCount: number;
}

/**
 * Sauvegarde une zone personnalisée (ville/quartier entré manuellement)
 * Incrémente le compteur d'utilisation si elle existe déjà
 */
export async function saveCustomZone(
  countryCode: string,
  countryName: string,
  city: string,
  neighborhood: string
): Promise<void> {
  const customZonesRef = collection(db, "customZones");

  // Créer un ID unique basé sur la localisation
  const zoneId = `${countryCode.toLowerCase()}_${city.toLowerCase()}_${neighborhood.toLowerCase()}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9_]/g, "_"); // Replace special chars with underscore

  const zoneRef = doc(customZonesRef, zoneId);
  const zoneSnap = await getDoc(zoneRef);

  if (zoneSnap.exists()) {
    // Incrémenter le compteur d'utilisation
    await updateDoc(zoneRef, {
      usageCount: increment(1),
    });
  } else {
    // Créer une nouvelle zone personnalisée
    await setDoc(zoneRef, {
      countryCode,
      countryName,
      city,
      neighborhood,
      createdAt: serverTimestamp(),
      usageCount: 1,
    });
  }
}

/**
 * Récupère toutes les zones personnalisées, triées par utilisation
 */
export async function getCustomZones(): Promise<CustomZone[]> {
  const customZonesRef = collection(db, "customZones");
  const q = query(customZonesRef, orderBy("usageCount", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      countryCode: data.countryCode,
      countryName: data.countryName,
      city: data.city,
      neighborhood: data.neighborhood,
      createdAt: data.createdAt?.toDate() || new Date(),
      usageCount: data.usageCount || 0,
    };
  });
}

/**
 * Récupère les zones personnalisées pour un pays spécifique
 */
export async function getCustomZonesByCountry(countryCode: string): Promise<CustomZone[]> {
  const customZonesRef = collection(db, "customZones");
  const q = query(
    customZonesRef,
    where("countryCode", "==", countryCode),
    orderBy("usageCount", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      countryCode: data.countryCode,
      countryName: data.countryName,
      city: data.city,
      neighborhood: data.neighborhood,
      createdAt: data.createdAt?.toDate() || new Date(),
      usageCount: data.usageCount || 0,
    };
  });
}
