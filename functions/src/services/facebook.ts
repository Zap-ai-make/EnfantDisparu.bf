import { logger } from "firebase-functions";
import { AnnouncementDoc } from "../types";
import { FACEBOOK_PAGE_ID, FACEBOOK_PAGE_TOKEN, BASE_URL } from "../config";
import { fetchWithRetry } from "../utils/http";

const GRAPH_API_VERSION = "v19.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
const FACEBOOK_TIMEOUT_MS = 20000; // 20 secondes (posts avec image peuvent être lents)

// ─── Formatage Unicode (style yaytext.com) ────────────────────────────────────

/**
 * Convertit du texte en caractères Unicode gras (𝗕𝗼𝗹𝗱)
 */
function toBold(text: string): string {
  const boldMap: Record<string, string> = {
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
  return text.split("").map(c => boldMap[c] || c).join("");
}

// ─── Messages émotionnels pour encourager l'engagement ────────────────────────

const EMOTIONAL_MESSAGES = [
  "💔 𝘜𝘯 𝘱𝘢𝘳𝘦𝘯𝘵 𝘷𝘪𝘵 𝘶𝘯 𝘤𝘢𝘶𝘤𝘩𝘦𝘮𝘢𝘳 𝘦𝘯 𝘤𝘦 𝘮𝘰𝘮𝘦𝘯𝘵. Votre partage peut ramener cet enfant à la maison. 🙏",
  "🙏 𝘊𝘩𝘢𝘲𝘶𝘦 𝘱𝘢𝘳𝘵𝘢𝘨𝘦 𝘤𝘰𝘮𝘱𝘵𝘦. Quelque part, une mère pleure. Aidez-la à retrouver son enfant.",
  "❤️ 𝘐𝘮𝘢𝘨𝘪𝘯𝘦𝘻 𝘴𝘪 𝘤'𝘦́𝘵𝘢𝘪𝘵 𝘷𝘰𝘵𝘳𝘦 𝘦𝘯𝘧𝘢𝘯𝘵. Un clic peut tout changer. Partagez, commentez, sauvez une vie.",
  "😢 𝘜𝘯𝘦 𝘧𝘢𝘮𝘪𝘭𝘭𝘦 𝘦𝘯𝘵𝘪𝘦̀𝘳𝘦 𝘴𝘰𝘶𝘧𝘧𝘳𝘦. Votre partage est un acte d'humanité. Ne scrollez pas, agissez! 💪",
  "🕯️ 𝘊𝘩𝘢𝘲𝘶𝘦 𝘮𝘪𝘯𝘶𝘵𝘦 𝘤𝘰𝘮𝘱𝘵𝘦. Plus on partage, plus on a de chances de retrouver cet enfant. Ensemble! 🤝",
  "💫 𝘝𝘰𝘵𝘳𝘦 𝘱𝘢𝘳𝘵𝘢𝘨𝘦 𝘱𝘦𝘶𝘵 𝘴𝘢𝘶𝘷𝘦𝘳 𝘶𝘯𝘦 𝘷𝘪𝘦. Quelqu'un dans votre liste d'amis a peut-être vu cet enfant. 👀",
  "🆘 𝘜𝘳𝘨𝘦𝘯𝘵! Aucun parent ne devrait vivre cette angoisse. Partagez, commentez, faisons circuler l'alerte! 🚨",
  "💝 𝘓'𝘶𝘯𝘪𝘰𝘯 𝘧𝘢𝘪𝘵 𝘭𝘢 𝘧𝘰𝘳𝘤𝘦. Ensemble, retrouvons cet enfant. Un partage = un espoir de plus. ✨",
];

/**
 * Sélectionne un message émotionnel aléatoire
 */
function getRandomEmotionalMessage(): string {
  const index = Math.floor(Math.random() * EMOTIONAL_MESSAGES.length);
  return EMOTIONAL_MESSAGES[index];
}

interface FacebookPostResponse {
  id: string;
}

interface FacebookInsightsResponse {
  data: Array<{
    name: string;
    values: Array<{ value: number }>;
  }>;
}

/**
 * Poste une nouvelle alerte sur la page Facebook
 */
export async function postAnnouncementToFacebook(
  announcement: AnnouncementDoc,
  docId: string
): Promise<string | null> {
  const pageToken = FACEBOOK_PAGE_TOKEN.value();
  const pageId = FACEBOOK_PAGE_ID.value();

  if (!pageToken || !pageId) {
    logger.warn("Facebook credentials not configured, skipping post");
    return null;
  }

  const announcementUrl = `${BASE_URL.value()}/annonce/${announcement.shortCode}`;

  // Formatage du titre en gras Unicode
  const alertTitle = toBold("ALERTE ENFANT DISPARU");
  const zoneBold = toBold(announcement.zoneName.toUpperCase());
  const childNameBold = toBold(announcement.childName);
  const ageBold = toBold(`${announcement.childAge} ans`);

  // Message émotionnel aléatoire
  const emotionalMessage = getRandomEmotionalMessage();

  // Hashtag nettoyé (sans caractères spéciaux)
  const zoneHashtag = announcement.zoneName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever accents
    .replace(/[^a-zA-Z0-9]/g, ""); // Garder que lettres et chiffres

  // Texte du post avec formatage Unicode
  const message = `
🚨 ${alertTitle} — ${zoneBold}

👦 ${childNameBold}, ${ageBold} (${announcement.childGender === "M" ? "Garçon" : "Fille"})
📍 𝗩𝘂 𝗽𝗼𝘂𝗿 𝗹𝗮 𝗱𝗲𝗿𝗻𝗶𝗲̀𝗿𝗲 𝗳𝗼𝗶𝘀: ${announcement.lastSeenPlace}
🕐 ${formatDate(announcement.lastSeenAt.toDate())}

📝 ${announcement.description}
${announcement.distinctiveSign ? `✨ 𝗦𝗶𝗴𝗻𝗲 𝗱𝗶𝘀𝘁𝗶𝗻𝗰𝘁𝗶𝗳: ${announcement.distinctiveSign}` : ""}

👁️ 𝗦𝗶 𝘃𝗼𝘂𝘀 𝗹'𝗮𝘃𝗲𝘇 𝘃𝘂, 𝘀𝗶𝗴𝗻𝗮𝗹𝗲𝘇 𝗶𝗺𝗺𝗲́𝗱𝗶𝗮𝘁𝗲𝗺𝗲𝗻𝘁:
🔗 ${announcementUrl}

📱 𝗣𝗮𝗿𝘁𝗮𝗴𝗲𝘇 𝗺𝗮𝘀𝘀𝗶𝘃𝗲𝗺𝗲𝗻𝘁 pour aider à retrouver cet enfant!

━━━━━━━━━━━━━━━━━━━━━
${emotionalMessage}
━━━━━━━━━━━━━━━━━━━━━

#EnfantDisparu #${zoneHashtag} #BurkinaFaso #Alerte #Partage #Urgent
`.trim();

  try {
    // Post avec photo si disponible
    let response: Response;
    let endpoint: string;

    if (announcement.alertCardURL) {
      // Post avec image
      endpoint = `${GRAPH_API_BASE}/${pageId}/photos`;
      const params = new URLSearchParams({
        url: announcement.alertCardURL,
        caption: message,
        access_token: pageToken,
      });
      response = await fetchWithRetry(`${endpoint}?${params}`, {
        method: "POST",
        timeoutMs: FACEBOOK_TIMEOUT_MS,
        maxRetries: 2,
      });
    } else {
      // Post texte seul
      endpoint = `${GRAPH_API_BASE}/${pageId}/feed`;
      const params = new URLSearchParams({
        message,
        link: announcementUrl,
        access_token: pageToken,
      });
      response = await fetchWithRetry(`${endpoint}?${params}`, {
        method: "POST",
        timeoutMs: FACEBOOK_TIMEOUT_MS,
        maxRetries: 2,
      });
    }

    if (!response.ok) {
      const error = await response.text();
      logger.error("Facebook post failed", { error, status: response.status });
      return null;
    }

    const data = (await response.json()) as FacebookPostResponse;
    logger.info("Facebook post created", { postId: data.id, docId });
    return data.id;
  } catch (error) {
    logger.error("Facebook post error", { error, docId });
    return null;
  }
}

/**
 * Poste un message de retrouvailles
 */
export async function postResolutionToFacebook(
  announcement: AnnouncementDoc,
  docId: string
): Promise<string | null> {
  const pageToken = FACEBOOK_PAGE_TOKEN.value();
  const pageId = FACEBOOK_PAGE_ID.value();

  if (!pageToken || !pageId) {
    logger.warn("Facebook credentials not configured, skipping resolution post");
    return null;
  }

  const childNameBold = toBold(announcement.childName.toUpperCase());
  const retrouvaillesTitle = toBold("RETROUVAILLES");

  const message = `
🎉✨ ${retrouvaillesTitle} — ${childNameBold} 𝗔 𝗘́𝗧𝗘́ 𝗥𝗘𝗧𝗥𝗢𝗨𝗩𝗘́(𝗘)! ✨🎉

𝘌𝘹𝘤𝘦𝘭𝘭𝘦𝘯𝘵𝘦 𝘯𝘰𝘶𝘷𝘦𝘭𝘭𝘦! L'enfant signalé disparu à ${announcement.zoneName} a été retrouvé sain et sauf.

🙏 𝗠𝗲𝗿𝗰𝗶 𝗮̀ 𝘁𝗼𝘂𝘀 pour votre mobilisation et vos partages!
💪 Ensemble, nous faisons la différence.
❤️ Chaque partage compte, chaque action sauve des vies.

━━━━━━━━━━━━━━━━━━━━━
💚 ${toBold("EnfentDisparu.bf")} — Retrouvons nos enfants ensemble
━━━━━━━━━━━━━━━━━━━━━

#Retrouvailles #BonneNouvelle #BurkinaFaso #Victoire #Ensemble
`.trim();

  try {
    const endpoint = `${GRAPH_API_BASE}/${pageId}/feed`;
    const params = new URLSearchParams({
      message,
      access_token: pageToken,
    });
    const response = await fetchWithRetry(`${endpoint}?${params}`, {
      method: "POST",
      timeoutMs: FACEBOOK_TIMEOUT_MS,
      maxRetries: 2,
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error("Facebook resolution post failed", { error });
      return null;
    }

    const data = (await response.json()) as FacebookPostResponse;
    logger.info("Facebook resolution post created", { postId: data.id, docId });
    return data.id;
  } catch (error) {
    logger.error("Facebook resolution post error", { error, docId });
    return null;
  }
}

/**
 * Récupère les statistiques d'un post Facebook
 */
export async function getFacebookPostStats(
  postId: string
): Promise<{ reach: number; shares: number; clicks: number } | null> {
  const pageToken = FACEBOOK_PAGE_TOKEN.value();

  if (!pageToken) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      fields: "shares,insights.metric(post_impressions,post_clicks)",
      access_token: pageToken,
    });

    const response = await fetchWithRetry(`${GRAPH_API_BASE}/${postId}?${params}`, {
      timeoutMs: 10000, // Stats sont moins critiques, timeout plus court
      maxRetries: 1,
    });

    if (!response.ok) {
      logger.warn("Failed to fetch Facebook post stats", { postId });
      return null;
    }

    const data = await response.json();
    const insights = data.insights?.data as FacebookInsightsResponse["data"] | undefined;

    const reach = insights?.find((i) => i.name === "post_impressions")?.values[0]?.value ?? 0;
    const clicks = insights?.find((i) => i.name === "post_clicks")?.values[0]?.value ?? 0;
    const shares = data.shares?.count ?? 0;

    return { reach, shares, clicks };
  } catch (error) {
    logger.error("Facebook stats fetch error", { error, postId });
    return null;
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
