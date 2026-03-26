import { logger } from "firebase-functions";

interface InstagramReelsOptions {
  videoUrl: string; // URL publique de la vidéo (Cloud Storage)
  igUserId: string; // Instagram Business Account ID
  accessToken: string;
  caption: string;
  coverUrl?: string; // URL de la vignette (optionnel)
}

interface InstagramReelsResponse {
  success: boolean;
  mediaId?: string;
  error?: string;
}

/**
 * Publie une vidéo Reel sur Instagram
 * API en 2 étapes: Create Container → Publish
 * Docs: https://developers.facebook.com/docs/instagram-api/guides/reels-publishing
 *
 * IMPORTANT: Nécessite un Instagram Business Account lié à une page Facebook
 */
export async function publishInstagramReel(
  options: InstagramReelsOptions
): Promise<InstagramReelsResponse> {
  const { videoUrl, igUserId, accessToken, caption, coverUrl } = options;

  try {
    logger.info("Starting Instagram Reel upload", { igUserId });

    // Étape 1: Créer le container
    const containerId = await createMediaContainer(
      igUserId,
      accessToken,
      videoUrl,
      caption,
      coverUrl
    );

    // Attendre que le container soit prêt (Instagram processing)
    await waitForContainerReady(igUserId, accessToken, containerId);

    // Étape 2: Publier le container
    const mediaId = await publishContainer(igUserId, accessToken, containerId);

    logger.info("Instagram Reel published successfully", {
      igUserId,
      mediaId,
    });

    return {
      success: true,
      mediaId,
    };
  } catch (error) {
    logger.error("Instagram Reel upload failed", {
      error,
      igUserId,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Étape 1: Créer un media container
 * Retourne un container_id
 */
async function createMediaContainer(
  igUserId: string,
  accessToken: string,
  videoUrl: string,
  caption: string,
  coverUrl?: string
): Promise<string> {
  const body: Record<string, string | boolean> = {
    media_type: "REELS",
    video_url: videoUrl,
    caption,
    share_to_feed: true, // Partager aussi dans le feed principal
  };

  if (coverUrl) {
    body.cover_url = coverUrl;
  }

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${igUserId}/media?access_token=${accessToken}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to create media container: ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();

  if (!data.id) {
    throw new Error("Missing container id in response");
  }

  logger.info("Media container created", {
    containerId: data.id,
  });

  return data.id;
}

/**
 * Attendre que le container soit prêt pour publication
 * Instagram doit d'abord télécharger et traiter la vidéo
 */
async function waitForContainerReady(
  igUserId: string,
  accessToken: string,
  containerId: string,
  maxAttempts = 30 // Max 5 minutes (10 sec * 30)
): Promise<void> {
  logger.info("Waiting for container to be ready", { containerId });

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${containerId}?fields=status_code,status&access_token=${accessToken}`
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

    // Status codes:
    // - EXPIRED: Le container a expiré
    // - ERROR: Erreur de traitement
    // - FINISHED: Prêt pour publication
    // - IN_PROGRESS: Traitement en cours
    // - PUBLISHED: Déjà publié

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

    // Attendre 10 secondes avant le prochain check
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  throw new Error(
    `Container not ready after ${maxAttempts} attempts (timeout)`
  );
}

/**
 * Étape 2: Publier le container
 * Finalise la publication sur Instagram
 */
async function publishContainer(
  igUserId: string,
  accessToken: string,
  containerId: string
): Promise<string> {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: accessToken,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to publish container: ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();

  if (!data.id) {
    throw new Error("Missing media id in publish response");
  }

  logger.info("Container published", {
    containerId,
    mediaId: data.id,
  });

  return data.id;
}

/**
 * Crée le texte de caption pour Instagram
 * (max 2200 caractères, hashtags inclus)
 */
export function createInstagramCaption(announcement: {
  childName: string;
  childAge: number;
  lastSeenPlace: string;
  announcementType: "missing" | "found";
}): string {
  if (announcement.announcementType === "found") {
    return `🟢 ENFANT TROUVÉ - CHERCHE SA FAMILLE

${announcement.childName}, ${announcement.childAge} ans
Trouvé à: ${announcement.lastSeenPlace}

⚠️ SI VOUS RECONNAISSEZ CET ENFANT, SIGNALEZ SUR enfantdisparu.bf

Aidons cet enfant à retrouver sa famille! 🙏

#EnfantTrouvé #EnfantPerdu #BurkinaFaso #RechercheParents #Ouagadougou #BF`;
  }

  return `🚨 ALERTE ENFANT DISPARU

${announcement.childName}, ${announcement.childAge} ans
Vu(e) pour la dernière fois: ${announcement.lastSeenPlace}

⚠️ SI VOUS L'AVEZ VU(E), SIGNALEZ SUR enfantdisparu.bf

Partagez pour aider! 🙏

#EnfantDisparu #BurkinaFaso #AlerteEnlevement #RetrouvonsLe #Ouagadougou #BF`;
}
