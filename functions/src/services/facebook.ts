import { logger } from "firebase-functions";
import { AnnouncementDoc } from "../types";
import { FACEBOOK_PAGE_ID, FACEBOOK_PAGE_TOKEN, BASE_URL } from "../config";
import { fetchWithRetry } from "../utils/http";

const GRAPH_API_VERSION = "v19.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
const FACEBOOK_TIMEOUT_MS = 20000; // 20 secondes (posts avec image peuvent être lents)

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

  // Texte du post
  const message = `
🚨 ALERTE ENFANT DISPARU - ${announcement.zoneName.toUpperCase()}

👦 ${announcement.childName}, ${announcement.childAge} ans (${announcement.childGender === "M" ? "Garçon" : "Fille"})
📍 Vu pour la dernière fois: ${announcement.lastSeenPlace}
🕐 ${formatDate(announcement.lastSeenAt.toDate())}

📝 ${announcement.description}
${announcement.distinctiveSign ? `✨ Signe distinctif: ${announcement.distinctiveSign}` : ""}

👁️ Si vous l'avez vu, signalez immédiatement:
🔗 ${announcementUrl}

📱 Partagez massivement pour aider à retrouver cet enfant!

#EnfantDisparu #${announcement.zoneName.replace(/\s+/g, "")} #BurkinaFaso #Alerte
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

  const message = `
🎉 RETROUVAILLES - ${announcement.childName.toUpperCase()} A ÉTÉ RETROUVÉ(E)!

Excellente nouvelle! L'enfant signalé disparu à ${announcement.zoneName} a été retrouvé sain et sauf.

Merci à tous pour votre mobilisation et vos partages! Ensemble, nous faisons la différence.

💚 EnfantDisparu.bf - Retrouvons nos enfants ensemble

#Retrouvailles #BonneNouvelle #BurkinaFaso
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
