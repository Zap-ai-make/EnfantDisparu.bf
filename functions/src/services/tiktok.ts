import { logger } from "firebase-functions";
import { AnnouncementDoc } from "../types";
import { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, BASE_URL, db } from "../config";
import { fetchWithRetry } from "../utils/http";

const TIKTOK_API_VERSION = "v2";
const TIKTOK_API_BASE = `https://open.tiktokapis.com/${TIKTOK_API_VERSION}`;
const TIKTOK_TIMEOUT_MS = 30000; // 30 secondes (upload d'images peut être lent)

// ─── Formatage Unicode (style yaytext.com) ────────────────────────────────────

function toBold(text: string): string {
  const boldMap: Record<string, string> = {
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
    J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
    S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
    j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
    s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
    "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰",
    "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵",
  };
  return text.split("").map(c => boldMap[c] || c).join("");
}

// Messages émotionnels pour TikTok (plus courts pour le format vidéo)
const TIKTOK_EMOTIONAL_MESSAGES = [
  "💔 Un parent vit un cauchemar. Partagez, sauvez une vie! 🙏",
  "❤️ Et si c'était votre enfant? Partagez maintenant! 💪",
  "🙏 Chaque partage = un espoir. Aidez cette famille! 😢",
  "🆘 Urgent! Votre partage peut tout changer! 🚨",
];

function getRandomTikTokMessage(): string {
  const index = Math.floor(Math.random() * TIKTOK_EMOTIONAL_MESSAGES.length);
  return TIKTOK_EMOTIONAL_MESSAGES[index];
}

// Interface pour future implémentation OAuth
// interface TikTokTokenResponse {
//   access_token: string;
//   expires_in: number;
//   refresh_token: string;
//   refresh_expires_in: number;
//   token_type: string;
//   scope: string;
// }

interface TikTokPhotoUploadResponse {
  data: {
    photo_id: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

interface TikTokPostResponse {
  data: {
    post_id: string;
    share_url: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Récupère l'access token TikTok depuis Firestore
 */
async function getTikTokAccessToken(): Promise<string | null> {
  try {
    const configDoc = await db.collection("app_config").doc("tiktok").get();

    if (!configDoc.exists) {
      logger.warn("TikTok not configured in Firestore");
      return null;
    }

    const config = configDoc.data();
    if (!config) return null;

    // Vérifier si le token est expiré
    if (config.expiresAt && config.expiresAt < Date.now()) {
      logger.warn("TikTok access token expired", {
        expiresAt: new Date(config.expiresAt).toISOString(),
      });
      // TODO: Implémenter le refresh token
      return null;
    }

    return config.accessToken || null;
  } catch (error) {
    logger.error("Error fetching TikTok access token", { error });
    return null;
  }
}

/**
 * Poste une nouvelle alerte sur TikTok (Photo Carousel)
 *
 * Récupère automatiquement l'access token depuis Firestore.
 * Si accessToken est fourni en paramètre, il sera utilisé à la place.
 */
export async function postAnnouncementToTikTok(
  announcement: AnnouncementDoc,
  docId: string,
  accessToken?: string
): Promise<string | null> {
  const clientKey = TIKTOK_CLIENT_KEY.value();
  const clientSecret = TIKTOK_CLIENT_SECRET.value();

  if (!clientKey || !clientSecret) {
    logger.warn("TikTok credentials not configured, skipping post");
    return null;
  }

  // Si aucun access token fourni, récupérer depuis Firestore
  let token: string | null = accessToken ?? null;
  if (!token) {
    token = await getTikTokAccessToken();
    if (!token) {
      logger.warn("TikTok access token not available, skipping post");
      return null;
    }
  }

  if (!announcement.alertCardURL) {
    logger.warn("Alert card URL not available, cannot post to TikTok");
    return null;
  }

  const announcementUrl = `${BASE_URL.value()}/annonce/${announcement.shortCode}`;

  // Formatage
  const alertTitle = toBold("ALERTE ENFANT DISPARU");
  const childNameBold = toBold(announcement.childName);
  const emotionalMsg = getRandomTikTokMessage();

  // Hashtag nettoyé
  const zoneHashtag = announcement.zoneName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");

  // Caption du post TikTok (max 2200 caractères)
  const caption = `
🚨 ${alertTitle} — ${toBold(announcement.zoneName.toUpperCase())}

👦 ${childNameBold}, ${toBold(`${announcement.childAge} ans`)}
📍 ${announcement.lastSeenPlace}
🕐 ${formatDate(announcement.lastSeenAt.toDate())}

👁️ 𝗦𝗶 𝘃𝗼𝘂𝘀 𝗹'𝗮𝘃𝗲𝘇 𝘃𝘂, 𝘀𝗶𝗴𝗻𝗮𝗹𝗲𝘇:
🔗 ${announcementUrl}

━━━━━━━━━━━━━━━━
${emotionalMsg}
━━━━━━━━━━━━━━━━

#EnfantDisparu #${zoneHashtag} #BurkinaFaso #Alerte #MissingChild #Partage #Urgent
`.trim();

  try {
    // Étape 1: Uploader la photo d'alerte vers TikTok
    logger.info("Uploading photo to TikTok", { docId, alertCardURL: announcement.alertCardURL });

    // TikTok nécessite un upload en 2 étapes:
    // 1. Initialiser l'upload et obtenir l'URL d'upload
    const initResponse = await fetchWithRetry(`${TIKTOK_API_BASE}/post/photo/init/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        source_info: {
          source: "PULL_FROM_URL",
          photo_url: announcement.alertCardURL,
        },
      }),
      timeoutMs: TIKTOK_TIMEOUT_MS,
      maxRetries: 2,
    });

    if (!initResponse.ok) {
      const error = await initResponse.text();
      logger.error("TikTok photo init failed", { error, status: initResponse.status, docId });
      return null;
    }

    const uploadData = (await initResponse.json()) as TikTokPhotoUploadResponse;

    if (uploadData.error) {
      logger.error("TikTok photo upload error", { error: uploadData.error, docId });
      return null;
    }

    const photoId = uploadData.data.photo_id;
    logger.info("Photo uploaded to TikTok", { photoId, docId });

    // Étape 2: Publier le post avec la photo
    const publishResponse = await fetchWithRetry(`${TIKTOK_API_BASE}/post/photo/publish/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        photo_ids: [photoId],
        post_info: {
          title: caption,
          privacy_level: "PUBLIC_TO_EVERYONE",
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 0,
        },
        source_info: {
          source: "PULL_FROM_URL",
        },
      }),
      timeoutMs: TIKTOK_TIMEOUT_MS,
      maxRetries: 2,
    });

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      logger.error("TikTok post publish failed", { error, status: publishResponse.status, docId });
      return null;
    }

    const publishData = (await publishResponse.json()) as TikTokPostResponse;

    if (publishData.error) {
      logger.error("TikTok publish error", { error: publishData.error, docId });
      return null;
    }

    logger.info("TikTok post created", {
      postId: publishData.data.post_id,
      shareUrl: publishData.data.share_url,
      docId
    });

    return publishData.data.post_id;
  } catch (error) {
    logger.error("TikTok post error", { error, docId });
    return null;
  }
}

/**
 * Poste un message de retrouvailles sur TikTok
 */
export async function postResolutionToTikTok(
  announcement: AnnouncementDoc,
  docId: string,
  accessToken?: string
): Promise<string | null> {
  const clientKey = TIKTOK_CLIENT_KEY.value();

  if (!clientKey || !accessToken) {
    logger.warn("TikTok not configured or no access token, skipping resolution post");
    return null;
  }

  const childNameBold = toBold(announcement.childName.toUpperCase());

  const caption = `
🎉✨ ${toBold("RETROUVAILLES")} — ${childNameBold} 𝗔 𝗘́𝗧𝗘́ 𝗥𝗘𝗧𝗥𝗢𝗨𝗩𝗘́! ✨🎉

𝘌𝘹𝘤𝘦𝘭𝘭𝘦𝘯𝘵𝘦 𝘯𝘰𝘶𝘷𝘦𝘭𝘭𝘦! L'enfant signalé disparu à ${announcement.zoneName} a été retrouvé sain et sauf.

🙏 Merci à tous pour vos partages!
💪 Ensemble, nous faisons la différence!

💚 ${toBold("EnfentDisparu.bf")} — Retrouvons nos enfants ensemble

#Retrouvailles #BonneNouvelle #BurkinaFaso #MissingChildFound #Victoire
`.trim();

  try {
    // Pour les retrouvailles, on peut poster un simple texte
    // ou utiliser une image générique de célébration
    // Pour l'instant, on log juste (à implémenter plus tard)
    logger.info("TikTok resolution post would be created", { docId, caption });

    // TODO: Implémenter le post de résolution
    // Nécessite soit une image générique, soit du texte seul (si TikTok le supporte)

    return null;
  } catch (error) {
    logger.error("TikTok resolution post error", { error, docId });
    return null;
  }
}

/**
 * Récupère les statistiques d'un post TikTok
 * Note: L'API TikTok ne fournit pas d'endpoints publics pour les stats en temps réel
 * Cette fonction est un placeholder pour une future implémentation
 */
export async function getTikTokPostStats(
  postId: string,
  accessToken: string
): Promise<{ views: number; likes: number; shares: number; comments: number } | null> {
  try {
    // TODO: Implémenter quand TikTok fournira une API pour les stats
    // Pour l'instant, on retourne null
    logger.info("TikTok stats not yet implemented", { postId });
    return null;
  } catch (error) {
    logger.error("TikTok stats fetch error", { error, postId });
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
