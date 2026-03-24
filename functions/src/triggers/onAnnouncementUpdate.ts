import {
  onDocumentUpdated,
  FirestoreEvent,
  Change,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  db,
  COLLECTIONS,
  FACEBOOK_PAGE_TOKEN,
  FACEBOOK_PAGE_ID,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_API_TOKEN,
  ONESIGNAL_API_KEY,
} from "../config";
import { AnnouncementDoc } from "../types";
import { postResolutionToFacebook } from "../services/facebook";
import { sendResolutionToParent } from "../services/whatsapp";
import {
  sendResolutionPushNotification,
  cancelActiveNotifications,
} from "../services/onesignal";
import { sendAlertSubscriberResolution } from "../services/whatsapp";

/**
 * Trigger déclenché à chaque mise à jour d'annonce
 *
 * Principalement pour gérer le changement de statut vers "resolved"
 *
 * Actions sur résolution:
 * 1. Poster message de retrouvailles sur Facebook
 * 2. Envoyer WhatsApp de confirmation au parent
 * 3. Notifier les abonnés de l'alerte via push
 * 4. Décrémenter le compteur de zone
 * 5. Mettre à jour les stats globales
 */
export const onAnnouncementUpdate = onDocumentUpdated(
  {
    document: `${COLLECTIONS.ANNOUNCEMENTS}/{docId}`,
    region: "europe-west1",
    memory: "512MiB",
    timeoutSeconds: 120, // 2 minutes (génération image + notifications)
    secrets: [
      FACEBOOK_PAGE_TOKEN,
      FACEBOOK_PAGE_ID,
      WHATSAPP_PHONE_NUMBER_ID,
      WHATSAPP_API_TOKEN,
      ONESIGNAL_API_KEY,
    ],
  },
  async (
    event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>
  ) => {
    const change = event.data;
    if (!change) {
      logger.warn("No data in onAnnouncementUpdate event");
      return;
    }

    const docId = event.params.docId;
    const before = change.before.data() as AnnouncementDoc;
    const after = change.after.data() as AnnouncementDoc;

    // Vérifier si le statut a changé vers "resolved"
    if (before.status !== "resolved" && after.status === "resolved") {
      logger.info("Announcement resolved", {
        docId,
        shortCode: after.shortCode,
      });

      await handleResolution(after, docId);
    }

    // Vérifier si le statut a changé vers "archived"
    if (before.status !== "archived" && after.status === "archived") {
      logger.info("Announcement archived", {
        docId,
        shortCode: after.shortCode,
      });

      await handleArchival(before, after, docId);
    }
  }
);

/**
 * Gère la résolution d'une annonce (enfant retrouvé)
 */
async function handleResolution(
  announcement: AnnouncementDoc,
  docId: string
): Promise<void> {
  // Exécuter les notifications en parallèle
  const [facebookResult, whatsappResult, pushResult] = await Promise.allSettled([
    // 1. Poster sur Facebook
    postResolutionToFacebook(announcement, docId),

    // 2. WhatsApp au parent
    sendResolutionToParent(announcement),

    // 3. Push aux abonnés de l'alerte
    sendResolutionPushNotification(announcement, docId),

    // 4. Annuler les notifications actives
    cancelActiveNotifications(announcement.shortCode),
  ]);

  // 5. Décrémenter le compteur de zone
  await decrementZoneCounter(announcement.zoneId);

  // 6. Incrémenter le compteur global de résolutions
  await incrementGlobalResolvedCounter();

  // 7. Notifier les abonnés "M'alerter si retrouvé" par WhatsApp
  await notifyAlertSubscribers(announcement, docId);

  // Mise à jour du document
  await db
    .collection(COLLECTIONS.ANNOUNCEMENTS)
    .doc(docId)
    .update({
      resolvedAt: Timestamp.now(),
      nextReminderAt: null, // Plus de rappels
      updatedAt: FieldValue.serverTimestamp(),
    });

  logger.info("Resolution processing complete", {
    docId,
    shortCode: announcement.shortCode,
    facebook: facebookResult.status === "fulfilled",
    whatsapp: whatsappResult.status === "fulfilled",
    push: pushResult.status === "fulfilled",
  });
}

/**
 * Notifie tous les abonnés "M'alerter si retrouvé" d'une annonce
 * Utilise batch writes pour éviter les N+1 queries
 */
async function notifyAlertSubscribers(
  announcement: AnnouncementDoc,
  docId: string
): Promise<void> {
  const subscribersSnap = await db
    .collection(COLLECTIONS.ANNOUNCEMENTS)
    .doc(docId)
    .collection("alert_subscribers")
    .where("notified", "==", false)
    .get();

  if (subscribersSnap.empty) return;

  // Envoyer les notifications WhatsApp en parallèle
  const notifyResults = await Promise.allSettled(
    subscribersSnap.docs.map(async (subDoc) => {
      const subscriber = subDoc.data();
      if (subscriber.waPhone) {
        await sendAlertSubscriberResolution(subscriber.waPhone, announcement.childName);
        return subDoc.ref; // Retourner la référence pour la mise à jour
      }
      return null;
    })
  );

  // Batch update pour tous les subscribers notifiés avec succès
  const batch = db.batch();
  let successCount = 0;

  notifyResults.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      batch.update(result.value, { notified: true });
      successCount++;
    }
  });

  // Exécuter le batch en une seule opération
  if (successCount > 0) {
    await batch.commit();
  }

  logger.info("Alert subscribers notified", {
    docId,
    total: subscribersSnap.size,
    success: successCount,
  });
}

/**
 * Gère l'archivage d'une annonce (30 jours sans nouvelles)
 */
async function handleArchival(
  before: AnnouncementDoc,
  announcement: AnnouncementDoc,
  docId: string
): Promise<void> {
  // Décrémenter le compteur seulement si l'annonce était active (pas déjà résolue)
  if (before.status === "active") {
    await decrementZoneCounter(announcement.zoneId);
  }

  // Annuler les notifications et rappels
  await cancelActiveNotifications(announcement.shortCode);

  // Mise à jour finale
  await db.collection(COLLECTIONS.ANNOUNCEMENTS).doc(docId).update({
    nextReminderAt: null,
    updatedAt: FieldValue.serverTimestamp(),
  });

  logger.info("Archival processing complete", {
    docId,
    shortCode: announcement.shortCode,
  });
}

/**
 * Décrémente le compteur d'annonces actives d'une zone
 * Note: FieldValue.increment fonctionne même si le champ n'existe pas
 */
async function decrementZoneCounter(zoneId: string): Promise<void> {
  try {
    await db.collection(COLLECTIONS.ZONES).doc(zoneId).update({
      activeAnnouncements: FieldValue.increment(-1),
    });
  } catch (error) {
    // Le document zone n'existe pas - ignorer silencieusement
    logger.warn("Zone document not found for decrement", { zoneId });
  }
}

/**
 * Incrémente le compteur global de résolutions
 */
async function incrementGlobalResolvedCounter(): Promise<void> {
  const statsRef = db.collection(COLLECTIONS.GLOBAL_STATS).doc("counters");
  const statsDoc = await statsRef.get();

  if (statsDoc.exists) {
    await statsRef.update({
      totalResolved: FieldValue.increment(1),
      lastResolvedAt: FieldValue.serverTimestamp(),
    });
  } else {
    await statsRef.set({
      totalResolved: 1,
      totalAnnouncements: 0,
      lastResolvedAt: FieldValue.serverTimestamp(),
    });
  }
}
