import {
  onDocumentCreated,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db, COLLECTIONS, REMINDER_SCHEDULE, FACEBOOK_PAGE_TOKEN, FACEBOOK_PAGE_ID, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET } from "../config";
import { AnnouncementDoc } from "../types";
import { generateAlertCard } from "../services/alertCard";
import { postAnnouncementToFacebook } from "../services/facebook";
// TikTok import pour future utilisation automatique
// import { postAnnouncementToTikTok } from "../services/tiktok";
// Temporairement désactivé - secrets non configurés
// import { sendNewAnnouncementToParent } from "../services/whatsapp";
// import { sendZonePushNotification } from "../services/onesignal";
// import { findAndNotifyPotentialMatches } from "../services/crossMatching";
// import { notifyZoneVigies } from "../services/vigieNotification";

/**
 * Trigger déclenché à chaque création d'annonce
 *
 * Actions:
 * 1. Générer l'image d'alerte (alertCard) ✅
 * 2. Poster sur Facebook ✅
 * 3. Incrémenter le compteur de zone ✅
 * 4. Programmer le premier rappel ✅
 *
 * Actions désactivées (secrets manquants):
 * - Envoyer WhatsApp au parent
 * - Push notifications OneSignal
 * - Cross-matching
 * - Notifications vigies
 */
export const onAnnouncementCreate = onDocumentCreated(
  {
    document: `${COLLECTIONS.ANNOUNCEMENTS}/{docId}`,
    region: "europe-west1",
    secrets: [FACEBOOK_PAGE_TOKEN, FACEBOOK_PAGE_ID, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET],
  },
  async (event: FirestoreEvent<QueryDocumentSnapshot | undefined>) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No data in onAnnouncementCreate event");
      return;
    }

    const docId = event.params.docId;
    const announcement = snapshot.data() as AnnouncementDoc;

    logger.info("Processing new announcement", {
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

    // 2. Poster sur Facebook (avec l'image d'alerte)
    let facebookPostId: string | null = null;
    try {
      // On passe l'annonce mise à jour avec l'URL de l'alertCard
      const announcementWithCard = { ...announcement, alertCardURL };
      facebookPostId = await postAnnouncementToFacebook(announcementWithCard, docId);
      if (facebookPostId) {
        logger.info("Facebook post created", { docId, facebookPostId });
      }
    } catch (error) {
      logger.error("Facebook post failed", { error, docId });
    }

    // 3. Poster sur TikTok (avec l'image d'alerte)
    // Note: Pour l'instant, on ne poste pas automatiquement car on n'a pas d'access token
    // L'access token sera obtenu via OAuth et stocké dans un document utilisateur
    // Pour la démo, on utilisera un endpoint HTTP manuel
    let tiktokVideoId: string | null = null;
    // Temporairement désactivé - nécessite OAuth user access token
    // try {
    //   const announcementWithCard = { ...announcement, alertCardURL };
    //   tiktokVideoId = await postAnnouncementToTikTok(announcementWithCard, docId, userAccessToken);
    //   if (tiktokVideoId) {
    //     logger.info("TikTok post created", { docId, tiktokVideoId });
    //   }
    // } catch (error) {
    //   logger.error("TikTok post failed", { error, docId });
    // }

    // 3. Incrémenter le compteur de zone
    try {
      await incrementZoneCounter(announcement.zoneId);
    } catch (error) {
      logger.error("Zone counter increment failed", { error, docId });
    }

    // 4. Programmer le premier rappel (24h)
    const nextReminderAt = Timestamp.fromDate(
      new Date(Date.now() + REMINDER_SCHEDULE.FIRST * 60 * 60 * 1000)
    );

    // Mise à jour du document avec toutes les infos
    await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .doc(docId)
      .update({
        alertCardURL,
        "stats.facebookPostId": facebookPostId,
        "stats.tiktokVideoId": tiktokVideoId,
        nextReminderAt,
        updatedAt: FieldValue.serverTimestamp(),
      });

    // Log récapitulatif
    logger.info("Announcement processing complete", {
      docId,
      shortCode: announcement.shortCode,
      type: announcement.type || "missing",
      alertCard: !!alertCardURL,
      facebookPost: !!facebookPostId,
      tiktokPost: !!tiktokVideoId,
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
