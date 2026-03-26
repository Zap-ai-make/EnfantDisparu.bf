import ffmpeg from "fluent-ffmpeg";
import { logger } from "firebase-functions";
import { AnnouncementDoc } from "../types";
import { generateAnnouncementVoiceover } from "./textToSpeech";
import { storage } from "../config";
import { createReadStream, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const REEL_WIDTH = 1080;
const REEL_HEIGHT = 1920;
const REEL_DURATION = 20; // secondes
const FPS = 30;

interface ReelGenerationOptions {
  announcement: AnnouncementDoc;
  alertCardURL: string;
  docId: string;
}

/**
 * Génère un Reel vidéo pour une annonce d'enfant disparu
 * Style documentaire avec effet Ken Burns sur la photo
 */
export async function generateAlertReel(
  options: ReelGenerationOptions
): Promise<string | null> {
  const { announcement, alertCardURL, docId } = options;

  try {
    logger.info("Starting alert reel generation", {
      docId,
      shortCode: announcement.shortCode,
    });

    // Chemins temporaires
    const tmpDir = tmpdir();
    const videoPath = join(tmpDir, `reel-${docId}.mp4`);
    const audioPath = join(tmpDir, `audio-${docId}.mp3`);
    const alertCardPath = join(tmpDir, `card-${docId}.png`);

    // 1. Télécharger l'alert card
    await downloadImage(alertCardURL, alertCardPath);

    // 2. Générer la voix-off
    await generateAnnouncementVoiceover(announcement, audioPath);

    // 3. Créer la vidéo avec ffmpeg
    await createReelVideo({
      imagePath: alertCardPath,
      audioPath,
      outputPath: videoPath,
      duration: REEL_DURATION,
    });

    // 4. Upload vers Cloud Storage
    const publicUrl = await uploadReelToStorage(videoPath, docId);

    // 5. Cleanup fichiers temporaires
    try {
      unlinkSync(videoPath);
      unlinkSync(audioPath);
      unlinkSync(alertCardPath);
    } catch (cleanupError) {
      logger.warn("Failed to cleanup temp files", { cleanupError });
    }

    logger.info("Alert reel generated successfully", {
      docId,
      publicUrl,
    });

    return publicUrl;
  } catch (error) {
    logger.error("Alert reel generation failed", {
      error,
      docId,
    });
    return null;
  }
}

/**
 * Crée la vidéo Reel avec effet Ken Burns (zoom documentaire)
 */
async function createReelVideo(options: {
  imagePath: string;
  audioPath: string;
  outputPath: string;
  duration: number;
}): Promise<void> {
  const { imagePath, audioPath, outputPath, duration } = options;

  return new Promise((resolve, reject) => {
    logger.info("Creating reel video with ffmpeg");

    ffmpeg()
      .input(imagePath)
      .inputOptions([
        "-loop 1", // Loop l'image
        `-t ${duration}`, // Durée
      ])
      .input(audioPath)
      .outputOptions([
        // Video codec
        "-c:v libx264",
        "-preset veryfast", // Plus rapide pour génération (-20% temps)
        "-profile:v high",
        "-level 4.0",
        "-pix_fmt yuv420p",

        // Résolution verticale (Reels format) avec effets documentaire
        // Effets: fade in/out, Ken Burns amélioré, vignette, correction couleur
        `-vf scale=${REEL_WIDTH}:${REEL_HEIGHT}:force_original_aspect_ratio=increase,crop=${REEL_WIDTH}:${REEL_HEIGHT},zoompan=z='if(lte(on,${FPS}*5),zoom+0.003,if(lte(on,${FPS}*12),1.15,1.15-0.003*(on-${FPS}*12)))':d=${duration * FPS}:s=${REEL_WIDTH}x${REEL_HEIGHT}:fps=${FPS},fade=t=in:st=0:d=0.5,fade=t=out:st=${duration - 0.5}:d=0.5,vignette=PI/4,eq=contrast=1.1:brightness=0.02:saturation=1.05`,

        // Audio
        "-c:a aac",
        "-b:a 128k",
        "-shortest", // Arrêter quand l'audio se termine

        // Bitrate optimisé pour Instagram (qualité/taille)
        "-b:v 2500k",
        "-maxrate 3000k",
        "-bufsize 5000k",

        // Framerate
        `-r ${FPS}`,
      ])
      .output(outputPath)
      .on("start", (commandLine) => {
        logger.info("FFmpeg started", { commandLine });
      })
      .on("progress", (progress) => {
        logger.info("FFmpeg progress", {
          percent: progress.percent,
          timemark: progress.timemark,
        });
      })
      .on("end", () => {
        logger.info("FFmpeg completed successfully");
        resolve();
      })
      .on("error", (err) => {
        logger.error("FFmpeg error", { error: err.message });
        reject(err);
      })
      .run();
  });
}

/**
 * Télécharge une image depuis une URL vers un fichier local
 */
async function downloadImage(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fs = await import("fs/promises");
  await fs.writeFile(outputPath, buffer);

  logger.info("Image downloaded", { url, outputPath });
}

/**
 * Upload la vidéo vers Cloud Storage et retourne l'URL publique
 */
async function uploadReelToStorage(
  videoPath: string,
  docId: string
): Promise<string> {
  const bucket = storage.bucket();
  const fileName = `alert-reels/${docId}.mp4`;
  const file = bucket.file(fileName);

  // Upload avec stream
  await new Promise<void>((resolve, reject) => {
    createReadStream(videoPath)
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: "video/mp4",
            cacheControl: "public, max-age=31536000",
            metadata: {
              firebaseStorageDownloadTokens: docId,
            },
          },
        })
      )
      .on("error", reject)
      .on("finish", resolve);
  });

  // Rendre public
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  logger.info("Reel uploaded to storage", { publicUrl });
  return publicUrl;
}

/**
 * Génère un Reel de célébration pour une retrouvaille (enfant retrouvé)
 */
export async function generateResolutionReel(
  options: ReelGenerationOptions
): Promise<string | null> {
  // TODO: Implémenter la version "résolution" avec couleurs vertes
  // Pour l'instant, on retourne null (on utilisera juste l'image)
  logger.info("Resolution reel generation not yet implemented", {
    docId: options.docId,
  });
  return null;
}
