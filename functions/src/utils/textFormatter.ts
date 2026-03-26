/**
 * Utilitaire pour le formatage de texte
 * Consolide les fonctions dupliquées dans facebook.ts, tiktok.ts, etc.
 */

/**
 * Map des caractères vers leur équivalent Unicode bold (sans-serif)
 */
const BOLD_MAP: Record<string, string> = {
  // Lettres majuscules
  A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
  J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
  S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
  // Lettres minuscules
  a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
  j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
  s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
  // Chiffres
  "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰",
  "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵",
};

/**
 * Convertit un texte en caractères Unicode bold (sans-serif)
 * @param text Texte à convertir
 * @returns Texte avec caractères bold
 */
export function toBold(text: string): string {
  return text
    .split("")
    .map((char) => BOLD_MAP[char] || char)
    .join("");
}

/**
 * Messages émotionnels pour les posts réseaux sociaux - ENFANT DISPARU
 * Utilisés dans facebook.ts et tiktok.ts
 */
export const EMOTIONAL_MESSAGES_MISSING = [
  "Aidez-nous à le retrouver ! 🙏",
  "Chaque partage compte ! 💔",
  "Ensemble, ramenons-le à sa famille ! ❤️",
  "Votre aide peut faire la différence ! 🔍",
  "Partagez, quelqu'un le connaît peut-être ! 🌟",
  "Un enfant a besoin de rentrer chez lui ! 🏠",
  "Soyons solidaires ! 🤝",
  "Chaque seconde compte ! ⏰",
];

/**
 * Messages émotionnels pour les posts réseaux sociaux - ENFANT TROUVÉ
 * Utilisés dans facebook.ts et tiktok.ts
 */
export const EMOTIONAL_MESSAGES_FOUND = [
  "Cet enfant cherche sa famille ! 🏠",
  "Connaissez-vous cet enfant ? 🔍",
  "Aidez-nous à retrouver sa famille ! 🙏",
  "Chaque partage peut réunir cette famille ! ❤️",
  "Quelqu'un reconnaît cet enfant ? 🌟",
  "Aidons cet enfant à retrouver les siens ! 🤝",
  "Partagez, sa famille le cherche peut-être ! 💔",
  "Ensemble, réunissons cette famille ! ⏰",
];

/**
 * Messages émotionnels (rétrocompatibilité)
 * @deprecated Utilisez EMOTIONAL_MESSAGES_MISSING ou EMOTIONAL_MESSAGES_FOUND
 */
export const EMOTIONAL_MESSAGES = EMOTIONAL_MESSAGES_MISSING;

/**
 * Retourne un message émotionnel aléatoire
 * @param messages Liste de messages (défaut: EMOTIONAL_MESSAGES_MISSING)
 * @returns Message aléatoire
 */
export function getRandomMessage(messages: string[] = EMOTIONAL_MESSAGES_MISSING): string {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

/**
 * Retourne les messages appropriés selon le type d'annonce
 * @param announcementType Type d'annonce ("missing" ou "found")
 * @returns Liste de messages émotionnels
 */
export function getMessagesForType(announcementType: "missing" | "found"): string[] {
  return announcementType === "found" ? EMOTIONAL_MESSAGES_FOUND : EMOTIONAL_MESSAGES_MISSING;
}

/**
 * Formate une date pour l'affichage en français
 * @param date Date à formater
 * @returns Date formatée (ex: "lundi 25 mars 2024, à 14h30")
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formate une date pour la synthèse vocale
 * @param date Date à formater
 * @returns Date formatée pour TTS (ex: "lundi 25 mars, à 14 heures 30")
 */
export function formatDateForSpeech(date: Date): string {
  const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let timeStr = `${hours} heure${hours > 1 ? "s" : ""}`;
  if (minutes > 0) {
    timeStr += ` ${minutes}`;
  }

  return `${dayName} ${day} ${month}, à ${timeStr}`;
}

/**
 * Tronque un texte à une longueur maximale avec ellipse
 * @param text Texte à tronquer
 * @param maxLength Longueur maximale
 * @returns Texte tronqué avec "..." si nécessaire
 */
export function truncateWithEllipsis(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Nettoie un texte pour l'utiliser comme hashtag
 * @param text Texte à nettoyer
 * @returns Hashtag sans espaces ni caractères spéciaux
 */
export function cleanHashtag(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-zA-Z0-9]/g, "") // Garde uniquement alphanumériques
    .replace(/\s+/g, ""); // Supprime les espaces
}
