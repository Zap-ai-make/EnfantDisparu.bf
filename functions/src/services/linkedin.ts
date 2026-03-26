/**
 * Service pour publier des posts LinkedIn
 * Utilise l'API LinkedIn REST (versioned API)
 */

import { logger } from "firebase-functions";

const LINKEDIN_API_BASE = "https://api.linkedin.com";
const LINKEDIN_API_VERSION = "202401";

export interface LinkedInPostOptions {
  imageUrl: string;
  personUrn: string;
  accessToken: string;
  caption: string;
}

export interface LinkedInPostResponse {
  success: boolean;
  postId?: string;
  error?: string;
}

/**
 * Publie une image sur LinkedIn
 * Processus en 3 étapes:
 * 1. Initialiser l'upload d'image
 * 2. Télécharger l'image binaire
 * 3. Créer le post avec l'image
 */
export async function publishLinkedInPost(
  options: LinkedInPostOptions
): Promise<LinkedInPostResponse> {
  const { imageUrl, personUrn, accessToken, caption } = options;

  try {
    logger.info("Starting LinkedIn post upload", { personUrn });

    // Étape 1: Télécharger l'image depuis l'URL
    const imageBuffer = await downloadImage(imageUrl);
    logger.info("Image downloaded", { size: imageBuffer.byteLength });

    // Étape 2: Initialiser l'upload LinkedIn
    const uploadInfo = await initializeImageUpload(accessToken, personUrn);
    logger.info("LinkedIn image upload initialized", {
      imageUrn: uploadInfo.imageUrn,
    });

    // Étape 3: Upload l'image binaire
    await uploadImageBinary(uploadInfo.uploadUrl, imageBuffer);
    logger.info("Image uploaded to LinkedIn");

    // Étape 4: Créer le post avec l'image
    const postId = await createLinkedInPost(
      accessToken,
      personUrn,
      caption,
      uploadInfo.imageUrn
    );

    logger.info("LinkedIn post published successfully", { postId });

    return {
      success: true,
      postId,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("LinkedIn post upload failed", {
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
 * Initialise l'upload d'image sur LinkedIn
 */
async function initializeImageUpload(
  accessToken: string,
  personUrn: string
): Promise<{ uploadUrl: string; imageUrn: string }> {
  const url = `${LINKEDIN_API_BASE}/rest/images?action=initializeUpload`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: personUrn,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to initialize image upload: ${errorData}`);
  }

  const data = await response.json();
  return {
    uploadUrl: data.value.uploadUrl,
    imageUrn: data.value.image,
  };
}

/**
 * Upload l'image binaire vers LinkedIn
 */
async function uploadImageBinary(
  uploadUrl: string,
  imageBuffer: ArrayBuffer
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
    },
    body: imageBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload image binary: ${errorText}`);
  }
}

/**
 * Crée un post LinkedIn avec une image
 */
async function createLinkedInPost(
  accessToken: string,
  personUrn: string,
  caption: string,
  imageUrn: string
): Promise<string> {
  const url = `${LINKEDIN_API_BASE}/rest/posts`;

  const postData = {
    author: personUrn,
    commentary: caption,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      media: {
        id: imageUrn,
      },
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to create LinkedIn post: ${errorData}`);
  }

  // LinkedIn retourne l'ID du post dans le header x-restli-id
  const postId = response.headers.get("x-restli-id") || "unknown";
  return postId;
}

/**
 * Crée une caption pour un post LinkedIn
 */
export function createLinkedInCaption(data: {
  childName: string;
  childAge: number;
  lastSeenPlace: string;
}): string {
  const { childName, childAge, lastSeenPlace } = data;

  return `ALERTE ENFANT DISPARU

${childName}, ${childAge} ans
Dernière localisation: ${lastSeenPlace}

Si vous avez des informations, signalez sur enfantdisparu.bf

Chaque partage peut aider à retrouver cet enfant.

#EnfantDisparu #AlerteEnfant #BurkinaFaso #Disparition #AidezNous`;
}

/**
 * Récupère les informations du profil LinkedIn (pour obtenir le Person URN)
 */
export async function getLinkedInProfile(
  accessToken: string
): Promise<{ personUrn: string; name: string }> {
  const url = `${LINKEDIN_API_BASE}/v2/userinfo`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to get LinkedIn profile: ${errorData}`);
  }

  const data = await response.json();
  return {
    personUrn: `urn:li:person:${data.sub}`,
    name: data.name,
  };
}
