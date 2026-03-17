import { onSchedule, ScheduledEvent } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { db, COLLECTIONS, REMINDER_SCHEDULE } from "../config";
import { AnnouncementDoc } from "../types";
import { sendReminderToParent } from "../services/whatsapp";

// Collection pour stocker les métadonnées des jobs schedulés
const METADATA_COLLECTION = "_scheduled_jobs";

/**
 * Vérifie si le job peut s'exécuter (idempotence)
 * Empêche les doublons si le job s'exécute plusieurs fois dans le même intervalle
 */
async function acquireJobLock(jobName: string, intervalMinutes: number): Promise<boolean> {
  const metaRef = db.collection(METADATA_COLLECTION).doc(jobName);

  try {
    const metaDoc = await metaRef.get();
    const lastRun = metaDoc.exists ? metaDoc.data()?.lastRun?.toMillis() : 0;
    const minInterval = (intervalMinutes - 10) * 60 * 1000; // 10 min de marge

    if (Date.now() - lastRun < minInterval) {
      logger.warn(`Job ${jobName} skipped: already ran ${Math.round((Date.now() - lastRun) / 60000)} minutes ago`);
      return false;
    }

    // Acquérir le lock en mettant à jour le timestamp
    await metaRef.set({
      lastRun: FieldValue.serverTimestamp(),
      status: "running",
    }, { merge: true });

    return true;
  } catch (error) {
    logger.error(`Failed to acquire lock for ${jobName}`, { error });
    return false;
  }
}

/**
 * Libère le lock et enregistre les résultats
 */
async function releaseJobLock(jobName: string, results: { succeeded: number; failed: number }): Promise<void> {
  try {
    await db.collection(METADATA_COLLECTION).doc(jobName).update({
      status: "completed",
      lastCompleted: FieldValue.serverTimestamp(),
      lastResults: results,
    });
  } catch (error) {
    logger.error(`Failed to release lock for ${jobName}`, { error });
  }
}

/**
 * Fonction schedulée qui s'exécute toutes les heures
 * pour envoyer les rappels WhatsApp aux parents
 *
 * Schedule des rappels:
 * - t+24h: Premier rappel "Des nouvelles?"
 * - t+72h: Deuxième rappel "Toujours recherché"
 * - t+7j: Troisième rappel "7 jours de recherche"
 * - t+30j: Avertissement d'archivage
 */
export const scheduledReminders = onSchedule(
  {
    schedule: "every 60 minutes",
    region: "europe-west1",
    timeZone: "Africa/Ouagadougou",
    secrets: ["WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_API_TOKEN"],
    maxInstances: 1, // Empêche les exécutions concurrentes
  },
  async (event: ScheduledEvent) => {
    logger.info("Starting scheduled reminders job", {
      scheduledTime: event.scheduleTime,
    });

    // Vérifier l'idempotence - éviter les doublons
    const canRun = await acquireJobLock("scheduledReminders", 60);
    if (!canRun) {
      return;
    }

    const now = Timestamp.now();

    // Requête: annonces actives avec nextReminderAt <= maintenant
    const snapshot = await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .where("status", "==", "active")
      .where("nextReminderAt", "<=", now)
      .limit(100) // Traiter par lots
      .get();

    if (snapshot.empty) {
      logger.info("No reminders to send");
      return;
    }

    logger.info(`Processing ${snapshot.size} announcements for reminders`);

    const results = await Promise.allSettled(
      snapshot.docs.map((doc) => processReminder(doc.id, doc.data() as AnnouncementDoc))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    // Libérer le lock et enregistrer les résultats
    await releaseJobLock("scheduledReminders", { succeeded, failed });

    logger.info("Scheduled reminders job complete", { succeeded, failed });
  }
);

/**
 * Traite un rappel individuel
 */
async function processReminder(
  docId: string,
  announcement: AnnouncementDoc
): Promise<void> {
  const remindersSent = announcement.remindersSent || 0;
  const createdAt = announcement.createdAt.toDate();
  const hoursElapsed = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);

  // Déterminer le type de rappel en fonction du temps écoulé
  let reminderType: "24h" | "72h" | "7j" | "30j";
  let nextReminderHours: number | null;

  if (hoursElapsed >= REMINDER_SCHEDULE.FINAL) {
    // 30 jours - archiver automatiquement
    reminderType = "30j";
    nextReminderHours = null; // Plus de rappels

    // Archiver l'annonce après 48h supplémentaires
    // Pour l'instant on envoie juste l'avertissement
  } else if (hoursElapsed >= REMINDER_SCHEDULE.THIRD) {
    reminderType = "7j";
    nextReminderHours = REMINDER_SCHEDULE.FINAL;
  } else if (hoursElapsed >= REMINDER_SCHEDULE.SECOND) {
    reminderType = "72h";
    nextReminderHours = REMINDER_SCHEDULE.THIRD;
  } else {
    reminderType = "24h";
    nextReminderHours = REMINDER_SCHEDULE.SECOND;
  }

  logger.info("Sending reminder", {
    docId,
    shortCode: announcement.shortCode,
    reminderType,
    remindersSent: remindersSent + 1,
  });

  // Envoyer le rappel WhatsApp
  await sendReminderToParent(announcement, reminderType);

  // Calculer le prochain rappel
  const nextReminderAt = nextReminderHours
    ? Timestamp.fromDate(
        new Date(createdAt.getTime() + nextReminderHours * 60 * 60 * 1000)
      )
    : null;

  // Mettre à jour le document
  await db
    .collection(COLLECTIONS.ANNOUNCEMENTS)
    .doc(docId)
    .update({
      remindersSent: FieldValue.increment(1),
      nextReminderAt,
      updatedAt: FieldValue.serverTimestamp(),
    });

  // Si c'est le rappel final et qu'il faut archiver
  if (reminderType === "30j") {
    // Programmer l'archivage dans 48h
    // On pourrait créer une autre fonction schedulée pour ça
    // ou simplement vérifier les annonces > 32 jours dans le prochain run
    logger.info("Final reminder sent, archival warning", {
      docId,
      shortCode: announcement.shortCode,
    });
  }
}

/**
 * Fonction secondaire pour archiver les annonces après 32 jours
 * (30j de rappel + 48h de grâce)
 */
export const scheduledArchival = onSchedule(
  {
    schedule: "every 24 hours",
    region: "europe-west1",
    timeZone: "Africa/Ouagadougou",
    maxInstances: 1, // Empêche les exécutions concurrentes
  },
  async (event: ScheduledEvent) => {
    logger.info("Starting scheduled archival job");

    // Vérifier l'idempotence - éviter les doublons
    const canRun = await acquireJobLock("scheduledArchival", 24 * 60); // 24h
    if (!canRun) {
      return;
    }

    // Annonces créées il y a plus de 32 jours et toujours actives
    const cutoffDate = Timestamp.fromDate(
      new Date(Date.now() - 32 * 24 * 60 * 60 * 1000)
    );

    const snapshot = await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .where("status", "==", "active")
      .where("createdAt", "<=", cutoffDate)
      .limit(50)
      .get();

    if (snapshot.empty) {
      logger.info("No announcements to archive");
      await releaseJobLock("scheduledArchival", { succeeded: 0, failed: 0 });
      return;
    }

    logger.info(`Archiving ${snapshot.size} old announcements`);

    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "archived",
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    await releaseJobLock("scheduledArchival", { succeeded: snapshot.size, failed: 0 });

    logger.info("Archival job complete", { archived: snapshot.size });
  }
);
