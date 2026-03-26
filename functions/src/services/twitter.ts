/**
 * Service pour publier des posts X (Twitter)
 * Utilise l'API X v2 avec OAuth 1.0a pour les médias
 */

import { logger } from "firebase-functions";
import * as crypto from "crypto";

const TWITTER_API_V2 = "https://api.twitter.com/2";
const TWITTER_UPLOAD_API = "https://upload.twitter.com/1.1";

export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

export interface TwitterPostOptions {
  imageUrl: string;
  credentials: TwitterCredentials;
  text: string;
}

export interface TwitterPostResponse {
  success: boolean;
  tweetId?: string;
  error?: string;
}

/**
 * Publie un tweet avec une image sur X
 * Processus en 2 étapes:
 * 1. Upload du média (API v1.1)
 * 2. Création du tweet avec le média (API v2)
 */
export async function publishTwitterPost(
  options: TwitterPostOptions
): Promise<TwitterPostResponse> {
  const { imageUrl, credentials, text } = options;

  try {
    logger.info("Starting X (Twitter) post upload");

    // Étape 1: Télécharger l'image depuis l'URL
    const imageBuffer = await downloadImage(imageUrl);
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    logger.info("Image downloaded and encoded", {
      size: imageBuffer.byteLength,
    });

    // Étape 2: Upload du média
    const mediaId = await uploadMedia(credentials, base64Image);
    logger.info("Media uploaded to X", { mediaId });

    // Étape 3: Créer le tweet avec le média
    const tweetId = await createTweet(credentials, text, mediaId);
    logger.info("Tweet published successfully", { tweetId });

    return {
      success: true,
      tweetId,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("X (Twitter) post upload failed", {
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Télécharge une image depuis une URL
 */
async function downloadImage(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  return response.arrayBuffer();
}

/**
 * Génère la signature OAuth 1.0a
 */
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  credentials: TwitterCredentials
): string {
  // Trier et encoder les paramètres
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");

  // Créer la signature base string
  const signatureBase = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams),
  ].join("&");

  // Créer la signing key
  const signingKey = `${encodeURIComponent(credentials.apiSecret)}&${encodeURIComponent(credentials.accessSecret)}`;

  // Générer la signature HMAC-SHA1
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  return signature;
}

/**
 * Génère l'en-tête OAuth 1.0a
 */
function generateOAuthHeader(
  method: string,
  url: string,
  additionalParams: Record<string, string>,
  credentials: TwitterCredentials
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: credentials.apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: credentials.accessToken,
    oauth_version: "1.0",
  };

  // Combiner tous les paramètres pour la signature
  const allParams = { ...oauthParams, ...additionalParams };

  // Générer la signature
  const signature = generateOAuthSignature(method, url, allParams, credentials);
  oauthParams["oauth_signature"] = signature;

  // Construire l'en-tête Authorization
  const headerParams = Object.keys(oauthParams)
    .sort()
    .map(
      (key) =>
        `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`
    )
    .join(", ");

  return `OAuth ${headerParams}`;
}

/**
 * Upload un média sur X (API v1.1)
 */
async function uploadMedia(
  credentials: TwitterCredentials,
  base64Image: string
): Promise<string> {
  const url = `${TWITTER_UPLOAD_API}/media/upload.json`;

  const params = {
    media_data: base64Image,
  };

  const authHeader = generateOAuthHeader("POST", url, params, credentials);

  const formData = new URLSearchParams();
  formData.append("media_data", base64Image);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to upload media: ${errorData}`);
  }

  const data = await response.json();
  return data.media_id_string;
}

/**
 * Crée un tweet avec média (API v2)
 */
async function createTweet(
  credentials: TwitterCredentials,
  text: string,
  mediaId: string
): Promise<string> {
  const url = `${TWITTER_API_V2}/tweets`;

  const body = {
    text: text,
    media: {
      media_ids: [mediaId],
    },
  };

  const authHeader = generateOAuthHeader("POST", url, {}, credentials);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to create tweet: ${errorData}`);
  }

  const data = await response.json();
  return data.data.id;
}

/**
 * Crée le texte pour un tweet X
 * Note: Limite de 280 caractères
 */
export function createTwitterText(data: {
  childName: string;
  childAge: number;
  lastSeenPlace: string;
  announcementType: "missing" | "found";
}): string {
  const { childName, childAge, lastSeenPlace, announcementType } = data;

  // Version courte pour respecter la limite de 280 caractères
  let text: string;

  if (announcementType === "found") {
    text = `ENFANT TROUVÉ - CHERCHE FAMILLE

${childName}, ${childAge} ans
Trouvé à: ${lastSeenPlace}

Signalez sur enfantdisparu.bf

#EnfantTrouvé #BurkinaFaso`;
  } else {
    text = `ALERTE ENFANT DISPARU

${childName}, ${childAge} ans
${lastSeenPlace}

Signalez sur enfantdisparu.bf

#EnfantDisparu #BurkinaFaso`;
  }

  // Tronquer si trop long
  if (text.length > 280) {
    text = text.substring(0, 277) + "...";
  }

  return text;
}
