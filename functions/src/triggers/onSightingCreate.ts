import {
  onDocumentCreated,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { db, COLLECTIONS } from "../config";
import { AnnouncementDoc, SightingDoc } from "../types";
import { notifySightingToParent } from "../services/whatsapp";

/**
 * Trigger déclenché à chaque nouveau signalement témoin
 *
 * Actions:
 * 1. Récupérer l'annonce associée
 * 2. Notifier le parent par WhatsApp
 */
export const onSightingCreate = onDocumentCreated(
  {
    document: "sightings/{docId}",
    region: "europe-west1",
    secrets: ["WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_API_TOKEN"],
  },
  async (event: FirestoreEvent<QueryDocumentSnapshot | undefined>) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No data in onSightingCreate event");
      return;
    }

    const sighting = snapshot.data() as SightingDoc;

    logger.info("New sighting created", {
      docId: event.params.docId,
      announcementId: sighting.announcementId,
    });

    // Récupérer l'annonce associée
    const announcementSnap = await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .doc(sighting.announcementId)
      .get();

    if (!announcementSnap.exists) {
      logger.warn("Announcement not found for sighting", {
        announcementId: sighting.announcementId,
      });
      return;
    }

    const announcement = announcementSnap.data() as AnnouncementDoc;

    // Ne notifier que pour les annonces actives
    if (announcement.status !== "active") {
      logger.info("Skipping sighting notification: announcement not active", {
        status: announcement.status,
      });
      return;
    }

    // Envoyer WhatsApp au parent
    await notifySightingToParent(
      announcement,
      sighting.place,
      sighting.description
    );

    logger.info("Parent notified of sighting", {
      shortCode: announcement.shortCode,
      place: sighting.place,
    });
  }
);
