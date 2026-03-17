import {
  onDocumentCreated,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db, COLLECTIONS, REMINDER_SCHEDULE } from "../config";
import { AnnouncementDoc } from "../types";
import { generateAlertCard } from "../services/alertCard";
// Temporairement désactivé - secrets non configurés
// import { postAnnouncementToFacebook } from "../services/facebook";
// import { sendNewAnnouncementToParent } from "../services/whatsapp";
// import { sendZonePushNotification } from "../services/onesignal";
// import { findAndNotifyPotentialMatches } from "../services/crossMatching";
// import { notifyZoneVigies } from "../services/vigieNotification";

/**
 * Trigger déclenché à chaque création d'annonce
 *
 * VERSION SIMPLIFIÉE - Sans Facebook/WhatsApp/OneSignal
 *
 * Actions actives:
 * 1. Générer l'image d'alerte (alertCard) ✅
 * 2. Incrémenter le compteur de zone ✅
 * 3. Programmer le premier rappel ✅
 *
 * Actions désactivées (secrets manquants):
 * - Poster sur Facebook
 * - Envoyer WhatsApp au parent
 * - Push notifications OneSignal
 * - Cross-matching
 * - Notifications vigies
 */
export const onAnnouncementCreate = onDocumentCreated(
  {
    document: `${COLLECTIONS.ANNOUNCEMENTS}/{docId}`,
    region: "europe-west1",
    // Pas de secrets pour l'instant
  },
  async (event: FirestoreEvent<QueryDocumentSnapshot | undefined>) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No data in onAnnouncementCreate event");
      return;
    }

    const docId = event.params.docId;
    const announcement = snapshot.data() as AnnouncementDoc;

    logger.info("Processing new announcement (simplified mode)", {
      docId,
      shortCode: announcement.shortCode,
      zone: announcement.zoneId,
    });

    // 1. Générer l'image d'alerte
    let alertCardURL: string | null = null;
    try {
      alertCardURL = await generateAlertCard(announcement, docId);
      logger.info("Alert card generated", { docId, alertCardURL });
    } catch (error) {
      logger.error("Alert card generation failed", { error, docId });
    }

    // 2. Incrémenter le compteur de zone
    try {
      await incrementZoneCounter(announcement.zoneId);
    } catch (error) {
      logger.error("Zone counter increment failed", { error, docId });
    }

    // 3. Programmer le premier rappel (24h)
    const nextReminderAt = Timestamp.fromDate(
      new Date(Date.now() + REMINDER_SCHEDULE.FIRST * 60 * 60 * 1000)
    );

    // Mise à jour du document
    await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .doc(docId)
      .update({
        alertCardURL,
        nextReminderAt,
        updatedAt: FieldValue.serverTimestamp(),
      });

    // Log récapitulatif
    logger.info("Announcement processing complete (simplified)", {
      docId,
      shortCode: announcement.shortCode,
      type: announcement.type || "missing",
      alertCard: !!alertCardURL,
      note: "Facebook/WhatsApp/Push disabled - secrets not configured",
    });
  }
);

/**
 * Incrémente le compteur d'annonces actives d'une zone
 * Note: FieldValue.increment fonctionne même si le champ n'existe pas
 */
async function incrementZoneCounter(zoneId: string): Promise<void> {
  try {
    await db.collection(COLLECTIONS.ZONES).doc(zoneId).update({
      activeAnnouncements: FieldValue.increment(1),
    });
  } catch (error) {
    // Le document zone n'existe pas - ignorer
    logger.warn("Zone document not found for increment", { zoneId });
  }
}
