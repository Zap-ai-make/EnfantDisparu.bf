import { COUNTRIES, CITIES_BY_COUNTRY, ZONES_BY_CITY } from "./zones";

// ─── Ref Code Generation ──────────────────────────────────────────────────────

const ALPHANUMERIC_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Génère un candidat de code ref au format AMB-XXXX
 * 4 caractères alphanumériques majuscules aléatoires
 * L'unicité est vérifiée via transaction Firestore
 */
export function generateRefCodeCandidate(): string {
  let code = "";
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  for (let i = 0; i < 4; i++) {
    code += ALPHANUMERIC_CHARS[array[i] % ALPHANUMERIC_CHARS.length];
  }
  return `AMB-${code}`;
}

/**
 * Valide le format d'un ref code
 */
export function isValidRefCode(refCode: string): boolean {
  return /^AMB-[A-Z0-9]{4}$/.test(refCode);
}

// ─── Access Token Generation ──────────────────────────────────────────────────

/**
 * Génère un token d'accès unique pour le dashboard
 * Utilise crypto.randomUUID() pour 36 caractères
 */
export function generateAccessToken(): string {
  return crypto.randomUUID();
}

// ─── Age Calculation ──────────────────────────────────────────────────────────

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Vérifie si une personne a au moins l'âge minimum requis
 */
export function isMinimumAge(dateOfBirth: Date, minAge: number): boolean {
  return calculateAge(dateOfBirth) >= minAge;
}

/**
 * Retourne l'année maximale de naissance pour avoir au moins minAge ans
 * Utilisé pour la validation du formulaire
 */
export function getMaxBirthYear(minAge: number): number {
  return new Date().getFullYear() - minAge;
}

// ─── Phone Normalization ──────────────────────────────────────────────────────

/**
 * Normalise un numéro de téléphone au format E.164 (+226XXXXXXXX)
 * Gère différents formats d'entrée:
 * - "70 00 00 00" → "+22670000000"
 * - "0022670000000" → "+22670000000"
 * - "+226 70 00 00 00" → "+22670000000"
 * - "70000000" → "+22670000000"
 */
export function normalizePhone(phone: string): string {
  // Supprimer espaces, tirets, parenthèses
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Convertir 00226 → +226
  if (cleaned.startsWith("00226")) {
    cleaned = "+226" + cleaned.slice(5);
  }

  // Ajouter +226 si commence par 0 (numéro local avec 0)
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+226" + cleaned.slice(1);
  }

  // Ajouter +226 si c'est juste 8 chiffres
  if (/^\d{8}$/.test(cleaned)) {
    cleaned = "+226" + cleaned;
  }

  // Si commence déjà par +226, nettoyer
  if (cleaned.startsWith("+226")) {
    const rest = cleaned.slice(4).replace(/\D/g, "");
    cleaned = "+226" + rest;
  }

  return cleaned;
}

/**
 * Valide le format d'un numéro de téléphone normalisé
 */
export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // Format +226 suivi de 8 chiffres
  return /^\+226\d{8}$/.test(normalized);
}

// ─── Zone Validation ──────────────────────────────────────────────────────────

/**
 * Vérifie que la hiérarchie pays/ville/quartier est cohérente
 */
export function validateZoneHierarchy(
  countryCode: string,
  city: string,
  zoneId: string
): { valid: boolean; error?: string } {
  // Vérifier que le pays existe
  const countryExists = COUNTRIES.some((c) => c.code === countryCode);
  if (!countryExists) {
    return { valid: false, error: "Pays invalide" };
  }

  // Vérifier que la ville appartient au pays
  const citiesInCountry = CITIES_BY_COUNTRY[countryCode] ?? [];
  if (!citiesInCountry.includes(city)) {
    return { valid: false, error: "Ville invalide pour ce pays" };
  }

  // Vérifier que le quartier appartient à la ville
  const zonesInCity = ZONES_BY_CITY[city] ?? [];
  const zoneExists = zonesInCity.some((z) => z.id === zoneId);
  if (!zoneExists) {
    return { valid: false, error: "Quartier invalide pour cette ville" };
  }

  return { valid: true };
}

// ─── IP Hashing ───────────────────────────────────────────────────────────────

/**
 * Hash une adresse IP avec SHA256 pour le rate limiting
 * On ne stocke jamais l'IP en clair
 */
export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Version synchrone du hash IP pour usage côté serveur
 * Utilise une méthode simple de hash pour le rate limiting
 */
export function hashIPSync(ip: string): string {
  // Simple hash pour usage côté serveur (remplacé par crypto côté Cloud Functions)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

// ─── Base URL ─────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://enfentdisparu.bf";

// ─── Messages Pré-écrits ──────────────────────────────────────────────────────

export const SHARE_MESSAGES = {
  whatsappInvitation: (refCode: string) => `🚨 Enfants disparus au Burkina Faso

Reçois une alerte instantanée si un enfant disparaît dans ton quartier.

👉 Active les notifications : ${BASE_URL}/?ref=${refCode}

Ensemble, on peut les retrouver. 🙏`,

  whatsappAmbassador: (refCode: string) => `Tu veux aider à retrouver les enfants disparus ?

Deviens Ambassadeur EnfantDisparu.bf et aide ton quartier à se mobiliser.

👉 Inscris-toi : ${BASE_URL}/ambassadeur?ref=${refCode}`,

  socialMedia: (refCode: string) => `🚨 Au Burkina, des enfants disparaissent chaque jour.

J'ai rejoint EnfantDisparu.bf pour recevoir les alertes et aider à les retrouver.

Toi aussi, active les notifications 👉 ${BASE_URL}/?ref=${refCode}

#EnfantDisparuBF #Solidarité`,
};

// ─── Dashboard URL ────────────────────────────────────────────────────────────

export function getDashboardUrl(accessToken: string): string {
  return `${BASE_URL}/ambassadeur/dashboard?t=${accessToken}`;
}

export function getShareUrl(refCode: string): string {
  return `${BASE_URL}/?ref=${refCode}`;
}
