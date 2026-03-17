import { onSchedule, ScheduledEvent } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db, COLLECTIONS } from "../config";
import { AnnouncementDoc } from "../types";
import { getFacebookPostStats } from "../services/facebook";

/**
 * Fonction schedulée qui synchronise les stats Facebook
 * toutes les 2 heures pour les annonces actives
 */
export const syncFacebookStats = onSchedule(
  {
    schedule: "every 2 hours",
    region: "europe-west1",
    timeZone: "Africa/Ouagadougou",
    secrets: ["FACEBOOK_PAGE_TOKEN"],
  },
  async (event: ScheduledEvent) => {
    logger.info("Starting Facebook stats sync job", {
      scheduledTime: event.scheduleTime,
    });

    // Récupérer les annonces actives avec un post Facebook
    const snapshot = await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .where("status", "==", "active")
      .where("stats.facebookPostId", "!=", null)
      .limit(100)
      .get();

    if (snapshot.empty) {
      logger.info("No Facebook posts to sync");
      return;
    }

    logger.info(`Syncing stats for ${snapshot.size} Facebook posts`);

    const results = await Promise.allSettled(
      snapshot.docs.map((doc) => syncSinglePost(doc.id, doc.data() as AnnouncementDoc))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    logger.info("Facebook stats sync complete", { succeeded, failed });
  }
);

/**
 * Synchronise les stats d'un seul post Facebook
 */
async function syncSinglePost(
  docId: string,
  announcement: AnnouncementDoc
): Promise<void> {
  const postId = announcement.stats.facebookPostId;
  if (!postId) return;

  const stats = await getFacebookPostStats(postId);
  if (!stats) return;

  // Mettre à jour uniquement si les stats ont changé
  const currentStats = announcement.stats;
  if (
    stats.reach !== currentStats.facebookReach ||
    stats.shares !== currentStats.facebookShares ||
    stats.clicks !== currentStats.facebookClicks
  ) {
    await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .doc(docId)
      .update({
        "stats.facebookReach": stats.reach,
        "stats.facebookShares": stats.shares,
        "stats.facebookClicks": stats.clicks,
        updatedAt: FieldValue.serverTimestamp(),
      });

    logger.info("Facebook stats updated", {
      docId,
      shortCode: announcement.shortCode,
      reach: stats.reach,
      shares: stats.shares,
      clicks: stats.clicks,
    });
  }
}
