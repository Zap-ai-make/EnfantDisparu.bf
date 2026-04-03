import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';
import { db } from '../config';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { calculateAmbassadorScore } from './utils/badgeCalculations';

/**
 * Aggregate Daily Stats
 *
 * Cloud Function scheduled to run every day at 00:05 AM.
 * Creates daily snapshot of each ambassador's stats for historical tracking.
 */

interface DailyStatsSnapshot {
  date: Timestamp;
  score: number;
  shares: number;
  views: number;
  recruits: number;
  notifications: number;
  minutesActive: number;
  actionsCount: number;
  peakHour: number;
  createdAt: FieldValue;
}

export const aggregateDailyStats = onSchedule(
  {
    schedule: 'every day 00:05',
    timeZone: 'Africa/Ouagadougou',
  },
  async (event) => {
    try {
      logger.info('Starting daily stats aggregation...');

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const dateKey = formatDate(yesterday);
      logger.info(`Aggregating for date: ${dateKey}`);

      const ambassadorsSnapshot = await db
        .collection('ambassadors')
        .where('status', '==', 'approved')
        .get();

      logger.info(`Found ${ambassadorsSnapshot.size} ambassadors to process`);

      const batchSize = 500;
      let batch = db.batch();
      let batchCount = 0;
      let totalProcessed = 0;

      for (const doc of ambassadorsSnapshot.docs) {
        const ambassador = doc.data();

        const score = calculateAmbassadorScore(ambassador);
        const shares = ambassador.stats?.alertsShared || 0;
        const views = ambassador.stats?.viewsGenerated || 0;
        const recruits = ambassador.stats?.ambassadorsRecruited || 0;
        const notifications = ambassador.stats?.notificationsActivated || 0;

        const minutesActive = 0;
        const actionsCount = shares + recruits;
        const peakHour = ambassador.peakActivityHour || 0;

        const dailyStats: DailyStatsSnapshot = {
          date: Timestamp.fromDate(yesterday),
          score,
          shares,
          views,
          recruits,
          notifications,
          minutesActive,
          actionsCount,
          peakHour,
          createdAt: FieldValue.serverTimestamp(),
        };

        const dailyStatsRef = db
          .collection('ambassadors')
          .doc(doc.id)
          .collection('dailyStats')
          .doc(dateKey);

        batch.set(dailyStatsRef, dailyStats);
        batchCount++;

        if (batchCount >= batchSize) {
          await batch.commit();
          totalProcessed += batchCount;
          logger.info(`Committed batch: ${totalProcessed} ambassadors processed`);

          batch = db.batch();
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
        totalProcessed += batchCount;
      }

      logger.info(`Daily stats aggregation complete: ${totalProcessed} ambassadors processed`);
    } catch (error) {
      logger.error('Error aggregating daily stats', error);
      throw error;
    }
  }
);

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ─── Peak Hour Calculation ─────────────────────────────────────────────────────

export const calculatePeakHours = onSchedule(
  {
    schedule: 'every sunday 01:00',
    timeZone: 'Africa/Ouagadougou',
  },
  async (event) => {
    try {
      logger.info('Calculating peak hours for all ambassadors...');

      const ambassadorsSnapshot = await db
        .collection('ambassadors')
        .where('status', '==', 'approved')
        .get();

      const updates: Promise<any>[] = [];

      for (const doc of ambassadorsSnapshot.docs) {
        const ambassadorId = doc.id;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activitySnapshot = await db
          .collection('activityFeed')
          .where('ambassadorId', '==', ambassadorId)
          .where('timestamp', '>=', Timestamp.fromDate(thirtyDaysAgo))
          .get();

        const hourCounts: number[] = new Array(24).fill(0);

        activitySnapshot.forEach((activityDoc) => {
          const data = activityDoc.data();
          if (data.timestamp) {
            const hour = data.timestamp.toDate().getHours();
            hourCounts[hour]++;
          }
        });

        let peakHour = 0;
        let maxCount = 0;
        hourCounts.forEach((count, hour) => {
          if (count > maxCount) {
            maxCount = count;
            peakHour = hour;
          }
        });

        if (maxCount > 0) {
          updates.push(
            db.collection('ambassadors').doc(ambassadorId).update({
              peakActivityHour: peakHour,
            })
          );
        }
      }

      await Promise.all(updates);

      logger.info(`Peak hours calculated for ${updates.length} ambassadors`);
    } catch (error) {
      logger.error('Error calculating peak hours', error);
      throw error;
    }
  }
);
