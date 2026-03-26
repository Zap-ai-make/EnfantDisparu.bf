/**
 * Service pour publier des posts Instagram (images)
 * Utilise l'Instagram Graph API via Facebook Login
 */

import { logger } from "firebase-functions";

const GRAPH_API_BASE = "https://graph.facebook.com/v19.0";

export interface InstagramPostOptions {
  imageUrl: string;
  igUserId: string;
  accessToken: string;
  caption: string;
}

export interface InstagramPostResponse {
  success: boolean;
  mediaId?: string;
  error?: string;
}

/**
 * Publie une image sur Instagram
 * Processus en 2 étapes:
 * 1. Créer un container média avec l'image
 * 2. Publier le container
 */
export async function publishInstagramPost(
  options: InstagramPostOptions
): Promise<InstagramPostResponse> {
  const { imageUrl, igUserId, accessToken, caption } = options;

  try {
    logger.info("Starting Instagram post upload", { igUserId });

    // Étape 1: Créer le container média
    const containerId = await createMediaContainer(
      igUserId,
      accessToken,
      imageUrl,
      caption
    );

    logger.info("Instagram media container created", { containerId });

    // Attendre que le container soit prêt (Instagram processing)
    await waitForContainerReady(accessToken, containerId);

    // Étape 2: Publier le média
    const mediaId = await publishMedia(igUserId, accessToken, containerId);

    logger.info("Instagram post published successfully", { mediaId });

    return {
      success: true,
      mediaId,
    };
  } catch (error: any) {
    logger.error("Instagram post upload failed", {
      error: error.message,
      details: error.response?.data,
    });

    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Crée un container média pour une image
 */
async function createMediaContainer(
  igUserId: string,
  accessToken: string,
  imageUrl: string,
  caption: string
): Promise<string> {
  const url = `${GRAPH_API_BASE}/${igUserId}/media`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to create media container: ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data.id;
}

/**
 * Attendre que le container soit prêt pour publication
 * Instagram doit d'abord télécharger et traiter l'image
 */
async function waitForContainerReady(
  accessToken: string,
  containerId: string,
  maxAttempts = 10 // Max ~50 secondes (5 sec * 10)
): Promise<void> {
  logger.info("Waiting for container to be ready", { containerId });

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(
      `${GRAPH_API_BASE}/${containerId}?fields=status_code,status&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to check container status: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    logger.info("Container status check", {
      attempt: attempt + 1,
      status: data.status,
      statusCode: data.status_code,
    });

    if (data.status_code === "FINISHED") {
      logger.info("Container ready for publishing", { containerId });
      return;
    }

    if (data.status_code === "ERROR") {
      throw new Error(`Container processing error: ${data.status}`);
    }

    if (data.status_code === "EXPIRED") {
      throw new Error("Container expired before publishing");
    }

    // Attendre 5 secondes avant le prochain check
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  throw new Error(
    `Container not ready after ${maxAttempts} attempts (timeout)`
  );
}

/**
 * Publie un container média
 */
async function publishMedia(
  igUserId: string,
  accessToken: string,
  containerId: string
): Promise<string> {
  const url = `${GRAPH_API_BASE}/${igUserId}/media_publish`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to publish media: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.id;
}

/**
 * Crée une caption pour un post Instagram
 */
export function createInstagramPostCaption(data: {
  childName: string;
  childAge: number;
  lastSeenPlace: string;
  announcementType: "missing" | "found";
}): string {
  const { childName, childAge, lastSeenPlace, announcementType } = data;

  if (announcementType === "found") {
    return `🟢 ENFANT TROUVÉ - CHERCHE SA FAMILLE 🟢

👤 ${childName}, ${childAge} ans
📍 Trouvé à: ${lastSeenPlace}

Si vous reconnaissez cet enfant, signalez sur enfantdisparu.bf

Aidons cet enfant à retrouver sa famille ! 🙏

#EnfantTrouvé #EnfantPerdu #BurkinaFaso #RechercheParents #AidezNous #Partage #${childName.replace(/\s+/g, "")}`;
  }

  return `🚨 ALERTE ENFANT DISPARU 🚨

👤 ${childName}, ${childAge} ans
📍 Dernière localisation: ${lastSeenPlace}

Si vous avez des informations, signalez sur enfantdisparu.bf

Chaque partage peut aider à retrouver cet enfant. 🙏

#EnfantDisparu #AlerteEnfant #BurkinaFaso #Disparition #AidezNous #Partage #${childName.replace(/\s+/g, "")}`;
}
