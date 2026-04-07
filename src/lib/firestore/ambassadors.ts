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
  serverTimestamp,
  increment,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Ambassador, AmbassadorAuditLog, SubmitApplicationInput, SubmitApplicationResult, ApproveAmbassadorResult, AuditAction } from "@/types/ambassador";
import { generateRefCodeCandidate, generateAccessToken, normalizePhone, validateZoneHierarchy, isMinimumAge, getDashboardUrl } from "../ambassador-utils";

// ─── Constantes ──────────────────────────────────────────────────────────────

const MAX_ZONES_PER_AMBASSADOR = 5;
const ACCESS_TOKEN_EXPIRY_DAYS = 7;

// ─── Helper pour créer un log d'audit ────────────────────────────────────────

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

// ─── Soumettre une candidature ambassadeur ───────────────────────────────────

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

// ─── Récupérer un ambassadeur par téléphone ──────────────────────────────────

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

// ─── Récupérer un ambassadeur par code ref ───────────────────────────────────

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

// ─── Récupérer un ambassadeur par access token ───────────────────────────────

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

// ─── Approuver un ambassadeur ────────────────────────────────────────────────

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

// ─── Rejeter un ambassadeur ──────────────────────────────────────────────────

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

// ─── Ajouter une zone à un ambassadeur ───────────────────────────────────────

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

// ─── Régénérer l'access token ────────────────────────────────────────────────

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

// ─── Incrémenter une stat d'ambassadeur ──────────────────────────────────────

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

// ─── Compter les ambassadeurs approuvés ──────────────────────────────────────

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

// ─── Lister les ambassadeurs par status ──────────────────────────────────────

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

// ─── Récupérer le classement des ambassadeurs ────────────────────────────────

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

// ─── Calculer le score d'un ambassadeur ──────────────────────────────────────

export function calculateAmbassadorScore(stats: Ambassador["stats"]): number {
  return (
    stats.notificationsActivated * 1 +
    stats.alertsShared * 2 +
    stats.ambassadorsRecruited * 5 +
    stats.viewsGenerated * 0.1
  );
}

// ─── Récupérer le rang d'un ambassadeur ──────────────────────────────────────

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

// ─── Statistiques globales des ambassadeurs ──────────────────────────────────

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
