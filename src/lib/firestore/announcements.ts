import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { db, storage } from "../firebase";
import type { Announcement, AnnouncementStatus, AnnouncementType, CreateAnnouncementInput } from "@/types/announcement";
import { getZoneById } from "../zones";
import { normalizePhone } from "../ambassador-utils";
import { generateShortCode, generateSecretToken, maskPhone, getDefaultStats } from "./utils";

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
