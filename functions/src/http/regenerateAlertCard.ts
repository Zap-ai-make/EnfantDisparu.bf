import { onRequest } from "firebase-functions/v2/https";
import { db, COLLECTIONS } from "../config";
import { generateAlertCard } from "../services/alertCard";
import { AnnouncementDoc } from "../types";
import { logger } from "firebase-functions";

// Domaines autorisés pour CORS
const ALLOWED_ORIGINS = [
  "https://enfantdisparu.bf",
  "https://www.enfantdisparu.bf",
  // Localhost pour le développement
  "http://localhost:3000",
  "http://localhost:3001",
];

/**
 * Endpoint HTTP pour régénérer la carte d'alerte d'une annonce existante
 * Usage: GET /regenerateAlertCard?shortCode=EPB-1429
 */
export const regenerateAlertCard = onRequest(
  {
    region: "europe-west1",
    cors: ALLOWED_ORIGINS,
  },
  async (req, res) => {
    try {
      const shortCode = req.query.shortCode as string;

      if (!shortCode) {
        res.status(400).json({ error: "shortCode parameter required" });
        return;
      }

      logger.info("Regenerating alert card", { shortCode });

      // Chercher l'annonce par shortCode
      const snapshot = await db
        .collection(COLLECTIONS.ANNOUNCEMENTS)
        .where("shortCode", "==", shortCode)
        .limit(1)
        .get();

      if (snapshot.empty) {
        res.status(404).json({ error: "Announcement not found", shortCode });
        return;
      }

      const doc = snapshot.docs[0];
      const announcement = doc.data() as AnnouncementDoc;

      // Générer la carte d'alerte
      const alertCardURL = await generateAlertCard(announcement, doc.id);

      if (alertCardURL) {
        logger.info("Alert card regenerated successfully", {
          shortCode,
          alertCardURL,
        });
        res.json({
          success: true,
          shortCode,
          alertCardURL,
        });
      } else {
        res.status(500).json({
          error: "Failed to generate alert card",
          shortCode,
        });
      }
    } catch (error) {
      logger.error("Error regenerating alert card", { error });
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
