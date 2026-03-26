/**
 * Utilitaire pour le téléchargement d'images
 * Consolide les implémentations dupliquées dans linkedin.ts, twitter.ts, etc.
 */

import { logger } from "firebase-functions";

export interface ImageDownloadOptions {
  format?: "arraybuffer" | "base64" | "buffer";
  timeout?: number;
}

/**
 * Télécharge une image depuis une URL
 * @param url URL de l'image à télécharger
 * @param options Options de téléchargement
 * @returns ArrayBuffer, base64 string, ou Buffer selon le format demandé
 */
export async function downloadImage(
  url: string,
  options: ImageDownloadOptions = {}
): Promise<ArrayBuffer | string | Buffer> {
  const { format = "arraybuffer", timeout = 30000 } = options;

  logger.info("Downloading image", { url: url.substring(0, 100), format });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    clearTimeout(timeoutId);

    switch (format) {
      case "base64":
        return Buffer.from(arrayBuffer).toString("base64");
      case "buffer":
        return Buffer.from(arrayBuffer);
      case "arraybuffer":
      default:
        return arrayBuffer;
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Image download timed out after ${timeout}ms`);
    }

    throw error;
  }
}

/**
 * Télécharge une image et retourne un ArrayBuffer
 * Alias simplifié pour downloadImage
 */
export async function downloadImageAsArrayBuffer(url: string): Promise<ArrayBuffer> {
  return downloadImage(url, { format: "arraybuffer" }) as Promise<ArrayBuffer>;
}

/**
 * Télécharge une image et retourne une chaîne base64
 * Alias simplifié pour downloadImage
 */
export async function downloadImageAsBase64(url: string): Promise<string> {
  return downloadImage(url, { format: "base64" }) as Promise<string>;
}

/**
 * Télécharge une image et retourne un Buffer
 * Alias simplifié pour downloadImage
 */
export async function downloadImageAsBuffer(url: string): Promise<Buffer> {
  return downloadImage(url, { format: "buffer" }) as Promise<Buffer>;
}
