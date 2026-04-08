import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';
import { db } from '../config';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

/**
 * Aggregate Global Stats
 *
 * Cloud Function scheduled to run every 5 minutes.
 * Aggregates platform-wide statistics and writes to system/globalStats.
 */

// Base counts (starting point before real inscriptions)
const BASE_AMBASSADORS = 10;

interface GlobalStats {
  totalAnnouncements: number;
  activeAnnouncements: number;
  resolvedAnnouncements: number;
  totalAmbassadors: number;
  totalShares: number;
  totalViews: number;
  totalPushSent: number;
  totalSightings: number;
  resolutionRate: number;
  avgResolutionTime: number;
  last24hAnnouncements: number;
  last24hShares: number;
  last24hViews: number;
  lastUpdated: FieldValue;
  calculatedBy: string;
  version: number;
}

export const aggregateGlobalStats = onSchedule(
  {
    schedule: 'every 5 minutes',
    timeZone: 'Africa/Ouagadougou',
  },
  async (event) => {
    try {
      logger.info('Starting global stats aggregation...');

      // Parallel queries for performance
      const [
        announcementsSnapshot,
        ambassadorsSnapshot,
        sightingsSnapshot,
      ] = await Promise.all([
        db.collection('announcements').get(),
        db.collection('ambassadors').where('status', '==', 'approved').get(),
        db.collection('sightings').get(),
      ]);

      // Calculate 24h threshold
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const oneDayAgoTimestamp = Timestamp.fromDate(oneDayAgo);

      // Process announcements
      let activeCount = 0;
      let resolvedCount = 0;
      let totalShares = 0;
      let totalViews = 0;
      let totalPushSent = 0;
      let last24hAnnouncementsCount = 0;
      let last24hSharesCount = 0;
      let last24hViewsCount = 0;

      const resolutionTimes: number[] = [];

      announcementsSnapshot.forEach((doc) => {
        const data = doc.data();

        // Core counts
        if (data.status === 'active') activeCount++;
        if (data.status === 'resolved') {
          resolvedCount++;

          // Calculate resolution time
          if (data.createdAt && data.resolvedAt) {
            const createdMs = data.createdAt.toMillis();
            const resolvedMs = data.resolvedAt.toMillis();
            const hours = (resolvedMs - createdMs) / (1000 * 60 * 60);
            resolutionTimes.push(hours);
          }
        }

        // Aggregate engagement stats
        const stats = data.stats || {};
        totalShares += (stats.facebookShares || 0) +
                      (stats.whatsappSent || 0) +
                      (stats.twitterRetweets || 0);
        totalViews += (stats.pageViews || 0) +
                     (stats.facebookReach || 0) +
                     (stats.instagramReach || 0);
        totalPushSent += stats.pushSent || 0;

        // Last 24h counts
        if (data.createdAt && data.createdAt >= oneDayAgoTimestamp) {
          last24hAnnouncementsCount++;
        }

        // Approximate last 24h shares/views (simplified)
        last24hSharesCount = Math.floor(totalShares * 0.004);
        last24hViewsCount = Math.floor(totalViews * 0.005);
      });

      // Calculate metrics
      const totalAnnouncements = announcementsSnapshot.size;
      // Add base ambassadors to the real count
      const totalAmbassadors = BASE_AMBASSADORS + ambassadorsSnapshot.size;
      const totalSightings = sightingsSnapshot.size;

      const resolutionRate = totalAnnouncements > 0
        ? (resolvedCount / totalAnnouncements) * 100
        : 0;

      const avgResolutionTime = resolutionTimes.length > 0
        ? resolutionTimes.reduce((sum, t) => sum + t, 0) / resolutionTimes.length
        : 0;

      // Build stats object
      const stats: GlobalStats = {
        totalAnnouncements,
        activeAnnouncements: activeCount,
        resolvedAnnouncements: resolvedCount,
        totalAmbassadors,
        totalShares,
        totalViews,
        totalPushSent,
        totalSightings,
        resolutionRate: Math.round(resolutionRate * 10) / 10,
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        last24hAnnouncements: last24hAnnouncementsCount,
        last24hShares: last24hSharesCount,
        last24hViews: last24hViewsCount,
        lastUpdated: FieldValue.serverTimestamp(),
        calculatedBy: 'cloud-function-v1',
        version: 1,
      };

      // Write to Firestore
      await db.collection('system').doc('globalStats').set(stats);

      logger.info('Global stats aggregated successfully', stats);
    } catch (error) {
      logger.error('Error aggregating global stats', error);
      throw error;
    }
  }
);
