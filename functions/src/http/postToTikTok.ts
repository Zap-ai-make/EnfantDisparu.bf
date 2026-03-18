import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { db, COLLECTIONS, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET } from "../config";
import { postAnnouncementToTikTok } from "../services/tiktok";
import { AnnouncementDoc } from "../types";

/**
 * Endpoint HTTP pour poster manuellement une annonce sur TikTok
 *
 * Usage:
 * POST /postToTikTok
 * {
 *   "announcementId": "abc123",
 *   "accessToken": "user_access_token_from_oauth"
 * }
 *
 * Cet endpoint est utilisé pour la démo sandbox TikTok
 * où on obtient manuellement l'access token via OAuth
 */
export const postToTikTok = onRequest(
  {
    region: "europe-west1",
    secrets: [TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET],
    cors: true,
  },
  async (req, res) => {
    // Vérifier la méthode HTTP
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { announcementId, accessToken } = req.body;

    // Validation des paramètres
    if (!announcementId || !accessToken) {
      res.status(400).json({
        error: "Missing required parameters",
        required: ["announcementId", "accessToken"],
      });
      return;
    }

    try {
      // Récupérer l'annonce depuis Firestore
      const announcementDoc = await db
        .collection(COLLECTIONS.ANNOUNCEMENTS)
        .doc(announcementId)
        .get();

      if (!announcementDoc.exists) {
        res.status(404).json({ error: "Announcement not found" });
        return;
      }

      const announcement = announcementDoc.data() as AnnouncementDoc;

      // Vérifier que l'alert card existe
      if (!announcement.alertCardURL) {
        res.status(400).json({ error: "Alert card not generated yet" });
        return;
      }

      logger.info("Posting announcement to TikTok manually", {
        announcementId,
        shortCode: announcement.shortCode,
      });

      // Poster sur TikTok
      const tiktokVideoId = await postAnnouncementToTikTok(
        announcement,
        announcementId,
        accessToken
      );

      if (!tiktokVideoId) {
        res.status(500).json({ error: "Failed to post to TikTok" });
        return;
      }

      // Mettre à jour Firestore avec le video ID
      await db
        .collection(COLLECTIONS.ANNOUNCEMENTS)
        .doc(announcementId)
        .update({
          "stats.tiktokVideoId": tiktokVideoId,
          updatedAt: new Date(),
        });

      logger.info("TikTok post created successfully", {
        announcementId,
        tiktokVideoId,
      });

      res.status(200).json({
        success: true,
        tiktokVideoId,
        message: "Successfully posted to TikTok",
      });
    } catch (error) {
      logger.error("Error posting to TikTok", { error, announcementId });
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
