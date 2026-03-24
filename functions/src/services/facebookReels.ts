import { logger } from "firebase-functions";
import { createReadStream } from "fs";
import { stat } from "fs/promises";

interface FacebookReelsOptions {
  videoPath: string;
  pageId: string;
  pageAccessToken: string;
  caption: string;
}

interface FacebookReelsResponse {
  success: boolean;
  videoId?: string;
  error?: string;
}

/**
 * Publie une vidéo Reel sur Facebook
 * API en 3 étapes: Initialize → Upload → Publish
 * Docs: https://developers.facebook.com/docs/video-api/guides/reels-publishing
 */
export async function publishFacebookReel(
  options: FacebookReelsOptions
): Promise<FacebookReelsResponse> {
  const { videoPath, pageId, pageAccessToken, caption } = options;

  try {
    logger.info("Starting Facebook Reel upload", { pageId });

    // Étape 1: Initialize upload
    const uploadSessionId = await initializeUpload(
      pageId,
      pageAccessToken,
      videoPath
    );

    // Étape 2: Upload video binary
    await uploadVideoData(uploadSessionId, videoPath);

    // Étape 3: Publish reel
    const videoId = await publishReel(
      pageId,
      pageAccessToken,
      uploadSessionId,
      caption
    );

    logger.info("Facebook Reel published successfully", {
      pageId,
      videoId,
    });

    return {
      success: true,
      videoId,
    };
  } catch (error) {
    logger.error("Facebook Reel upload failed", {
      error,
      pageId,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Étape 1: Initialize upload session
 * Retourne un upload_session_id
 */
async function initializeUpload(
  pageId: string,
  accessToken: string,
  videoPath: string
): Promise<string> {
  const fileStats = await stat(videoPath);
  const fileSizeBytes = fileStats.size;

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${pageId}/video_reels`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        upload_phase: "start",
        access_token: accessToken,
        file_size: fileSizeBytes,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to initialize upload: ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();

  if (!data.video_id || !data.upload_url) {
    throw new Error("Missing video_id or upload_url in response");
  }

  logger.info("Upload session initialized", {
    videoId: data.video_id,
    uploadUrl: data.upload_url,
  });

  return data.video_id;
}

/**
 * Étape 2: Upload video binary data
 * Upload vers rupload.facebook.com
 */
async function uploadVideoData(
  videoId: string,
  videoPath: string
): Promise<void> {
  const fileStats = await stat(videoPath);
  const fileSizeBytes = fileStats.size;

  const uploadUrl = `https://rupload.facebook.com/video-upload/v21.0/${videoId}`;

  logger.info("Uploading video data", {
    videoId,
    fileSizeBytes,
  });

  // Upload avec stream pour économiser la mémoire
  const fileStream = createReadStream(videoPath);
  const chunks: Buffer[] = [];

  for await (const chunk of fileStream) {
    chunks.push(Buffer.from(chunk));
  }

  const buffer = Buffer.concat(chunks);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `OAuth `, // Token pas nécessaire pour rupload
      offset: "0",
      file_size: String(fileSizeBytes),
      "Content-Type": "application/octet-stream",
    },
    body: buffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload video data: ${errorText}`);
  }

  const data = await response.json();
  logger.info("Video data uploaded", { videoId, response: data });
}

/**
 * Étape 3: Publish the reel
 * Finalise la publication avec caption
 */
async function publishReel(
  pageId: string,
  accessToken: string,
  videoId: string,
  caption: string
): Promise<string> {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${pageId}/video_reels`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        video_id: videoId,
        upload_phase: "finish",
        video_state: "PUBLISHED",
        description: caption,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to publish reel: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Publish reel returned success: false");
  }

  logger.info("Reel published", { videoId, pageId });

  return videoId;
}

/**
 * Crée le texte de caption pour une annonce
 */
export function createReelCaption(announcement: {
  childName: string;
  childAge: number;
  lastSeenPlace: string;
}): string {
  return `🚨 ALERTE ENFANT DISPARU

${announcement.childName}, ${announcement.childAge} ans
Vu(e) pour la dernière fois: ${announcement.lastSeenPlace}

⚠️ SI VOUS L'AVEZ VU(E), SIGNALEZ SUR enfantdisparu.bf

Partagez pour aider! 🙏

#EnfantDisparu #BurkinaFaso #AlerteEnlevement #RetrouvonsLe
Chaque partage compte. Merci de diffuser.`;
}
