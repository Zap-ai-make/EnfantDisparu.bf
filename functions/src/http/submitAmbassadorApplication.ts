import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

const db = admin.firestore();

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubmitApplicationInput {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  city: string;
  zoneId: string;
  dateOfBirth: {
    day: number;
    month: number;
    year: number;
  };
  catAnswer: "yes" | "no" | "maybe";
  honeypot?: string;
}

interface SubmitApplicationResult {
  success: boolean;
  refCode?: string;
  error?: string;
  existingAmbassadorId?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALPHANUMERIC_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateRefCodeCandidate(): string {
  let code = "";
  const bytes = crypto.randomBytes(4);
  for (let i = 0; i < 4; i++) {
    code += ALPHANUMERIC_CHARS[bytes[i] % ALPHANUMERIC_CHARS.length];
  }
  return `AMB-${code}`;
}

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  if (cleaned.startsWith("00226")) {
    cleaned = "+226" + cleaned.slice(5);
  }

  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+226" + cleaned.slice(1);
  }

  if (/^\d{8}$/.test(cleaned)) {
    cleaned = "+226" + cleaned;
  }

  if (cleaned.startsWith("+226")) {
    const rest = cleaned.slice(4).replace(/\D/g, "");
    cleaned = "+226" + rest;
  }

  return cleaned;
}

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function isMinimumAge(year: number, month: number, day: number, minAge: number): boolean {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= minAge;
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────

async function checkRateLimit(ipHash: string, maxPerHour = 3): Promise<boolean> {
  const docRef = db.collection("rate_limits").doc(ipHash);
  const docSnap = await docRef.get();

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  if (!docSnap.exists) {
    await docRef.set({
      count: 1,
      windowStart: admin.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  }

  const data = docSnap.data()!;
  const windowStart = data.windowStart?.toDate() || new Date(0);

  if (windowStart < oneHourAgo) {
    await docRef.set({
      count: 1,
      windowStart: admin.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  }

  const currentCount = data.count || 0;

  if (currentCount >= maxPerHour) {
    return false;
  }

  await docRef.update({
    count: admin.firestore.FieldValue.increment(1),
  });

  return true;
}

// ─── Main Function ────────────────────────────────────────────────────────────

export const submitAmbassadorApplication = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
    return;
  }

  try {
    const input: SubmitApplicationInput = req.body;

    // Vérifier honeypot (rejet silencieux)
    if (input.honeypot && input.honeypot.trim() !== "") {
      res.status(200).json({ success: true, refCode: "AMB-XXXX" } as SubmitApplicationResult);
      return;
    }

    // Extraire et hasher l'IP
    const ip = req.headers["x-forwarded-for"] as string || req.ip || "unknown";
    const ipHash = hashIP(ip.split(",")[0].trim());

    // Vérifier rate limit
    const allowed = await checkRateLimit(ipHash);
    if (!allowed) {
      res.status(429).json({ success: false, error: "rate_limited" } as SubmitApplicationResult);
      return;
    }

    // Valider l'âge
    if (!isMinimumAge(
      input.dateOfBirth.year,
      input.dateOfBirth.month,
      input.dateOfBirth.day,
      20
    )) {
      res.status(400).json({ success: false, error: "too_young" } as SubmitApplicationResult);
      return;
    }

    // Normaliser le téléphone
    const normalizedPhone = normalizePhone(input.phone);

    // Vérifier doublon
    const existingQuery = db.collection("ambassadors")
      .where("phone", "==", normalizedPhone)
      .limit(1);
    const existingSnap = await existingQuery.get();

    if (!existingSnap.empty) {
      const existing = existingSnap.docs[0];
      const data = existing.data();

      const error = `duplicate_${data.status}` as SubmitApplicationResult["error"];
      res.status(200).json({
        success: false,
        error,
        existingAmbassadorId: existing.id,
      } as SubmitApplicationResult);
      return;
    }

    // Générer refCode unique
    let refCode: string | null = null;

    for (let attempt = 0; attempt < 5; attempt++) {
      const candidateCode = generateRefCodeCandidate();
      const refCodeQuery = db.collection("ambassadors")
        .where("refCode", "==", candidateCode)
        .limit(1);
      const refCodeSnap = await refCodeQuery.get();

      if (refCodeSnap.empty) {
        refCode = candidateCode;
        break;
      }
    }

    if (!refCode) {
      res.status(500).json({ success: false, error: "Could not generate unique refCode" });
      return;
    }

    // Créer le document
    const dob = new Date(
      input.dateOfBirth.year,
      input.dateOfBirth.month - 1,
      input.dateOfBirth.day
    );

    await db.collection("ambassadors").add({
      refCode,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: normalizedPhone,
      zones: [input.zoneId],
      dateOfBirth: admin.firestore.Timestamp.fromDate(dob),
      catAnswer: input.catAnswer,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedAt: null,
      stats: {
        notificationsActivated: 0,
        alertsShared: 0,
        ambassadorsRecruited: 0,
        viewsGenerated: 0,
      },
    });

    res.status(200).json({ success: true, refCode } as SubmitApplicationResult);
  } catch (error) {
    console.error("Error submitting ambassador application:", error);
    res.status(500).json({ success: false, error: "unknown" } as SubmitApplicationResult);
  }
});
