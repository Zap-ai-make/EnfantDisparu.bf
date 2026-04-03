import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { db } from '../config';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

/**
 * Activity Feed Event Triggers
 *
 * Cloud Functions that listen to Firestore changes and create activity feed events.
 */

interface ActivityEvent {
  id: string;
  type: 'share' | 'badge' | 'recruit' | 'streak' | 'zone_added' | 'rank_up' | 'sighting' | 'retrouvaille';
  ambassadorId: string;
  ambassadorName: string;
  timestamp: FieldValue;
  ttl: Timestamp;
  metadata?: Record<string, any>;
}

/**
 * Helper: Create activity feed event
 */
async function createActivityEvent(event: Omit<ActivityEvent, 'id' | 'timestamp' | 'ttl'>) {
  const now = new Date();
  const eventId = `evt_${now.getTime()}_${Math.random().toString(36).substr(2, 9)}`;

  const ttl = Timestamp.fromDate(
    new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  );

  const fullEvent: ActivityEvent = {
    ...event,
    id: eventId,
    timestamp: FieldValue.serverTimestamp(),
    ttl,
  };

  await db.collection('activityFeed').doc(eventId).set(fullEvent);

  logger.info(`Activity event created: ${event.type} by ${event.ambassadorName}`);
}

// ─── Badge Unlock Event ────────────────────────────────────────────────────────

export const onBadgeUnlock = onDocumentUpdated(
  'ambassadors/{ambassadorId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    const beforeBadges = before.badges || [];
    const afterBadges = after.badges || [];

    if (afterBadges.length <= beforeBadges.length) {
      return;
    }

    const beforeBadgeIds = new Set(beforeBadges.map((b: any) => b.id));
    const newBadges = afterBadges.filter((b: any) => !beforeBadgeIds.has(b.id));

    for (const badge of newBadges) {
      await createActivityEvent({
        type: 'badge',
        ambassadorId: event.params.ambassadorId,
        ambassadorName: after.firstName,
        metadata: {
          badgeId: badge.id,
          badgeName: badge.name,
          badgeTier: badge.tier,
        },
      });
    }
  }
);

// ─── Recruitment Event ─────────────────────────────────────────────────────────

export const onAmbassadorRecruit = onDocumentUpdated(
  'ambassadors/{ambassadorId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    if (before.status !== 'approved' && after.status === 'approved' && after.referredBy) {
      const recruiterSnapshot = await db.collection('ambassadors')
        .where('refCode', '==', after.referredBy)
        .limit(1)
        .get();

      if (!recruiterSnapshot.empty) {
        const recruiter = recruiterSnapshot.docs[0].data();

        const recruitsSnapshot = await db.collection('ambassadors')
          .where('referredBy', '==', after.referredBy)
          .where('status', '==', 'approved')
          .get();

        await createActivityEvent({
          type: 'recruit',
          ambassadorId: recruiterSnapshot.docs[0].id,
          ambassadorName: recruiter.firstName,
          metadata: {
            recruitedCount: recruitsSnapshot.size,
          },
        });
      }
    }
  }
);

// ─── Streak Milestone Event ────────────────────────────────────────────────────

export const onStreakMilestone = onDocumentUpdated(
  'ambassadors/{ambassadorId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    const beforeStreak = before.briefingStats?.currentStreak || 0;
    const afterStreak = after.briefingStats?.currentStreak || 0;

    const milestones = [7, 14, 30, 60, 100];

    const crossedMilestone = milestones.find(
      (m) => beforeStreak < m && afterStreak >= m
    );

    if (crossedMilestone) {
      await createActivityEvent({
        type: 'streak',
        ambassadorId: event.params.ambassadorId,
        ambassadorName: after.firstName,
        metadata: {
          streakDays: crossedMilestone,
        },
      });
    }
  }
);

// ─── Zone Added Event ──────────────────────────────────────────────────────────

export const onZoneAdded = onDocumentUpdated(
  'ambassadors/{ambassadorId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    const beforeZones = before.zones || [];
    const afterZones = after.zones || [];

    if (afterZones.length > beforeZones.length) {
      const newZones = afterZones.filter((z: string) => !beforeZones.includes(z));

      for (const zoneId of newZones) {
        const zoneName = zoneId.split('_').pop() || zoneId;

        await createActivityEvent({
          type: 'zone_added',
          ambassadorId: event.params.ambassadorId,
          ambassadorName: after.firstName,
          metadata: {
            zoneId,
            zoneName,
          },
        });
      }
    }
  }
);

// ─── Retrouvaille Event ────────────────────────────────────────────────────────

export const onRetrouvaille = onDocumentUpdated(
  'announcements/{announcementId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    if (before.status !== 'resolved' && after.status === 'resolved') {
      const now = new Date();
      const eventId = `evt_${now.getTime()}_retrouvaille_${event.params.announcementId}`;
      const ttl = Timestamp.fromDate(
        new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      );

      await db.collection('activityFeed').doc(eventId).set({
        id: eventId,
        type: 'retrouvaille',
        ambassadorId: 'system',
        ambassadorName: 'EnfantPerdu.bf',
        timestamp: FieldValue.serverTimestamp(),
        ttl,
        metadata: {
          announcementCode: after.shortCode,
        },
      });

      logger.info(`Retrouvaille event created for ${after.shortCode}`);
    }
  }
);

// ─── Manual Event Creation ─────────────────────────────────────────────────────

export const createManualActivityEvent = onCall(
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be authenticated');
    }

    const { type, ambassadorId, metadata } = request.data;

    if (!type || !ambassadorId) {
      throw new HttpsError(
        'invalid-argument',
        'Missing required fields: type, ambassadorId'
      );
    }

    const ambassadorDoc = await db.collection('ambassadors').doc(ambassadorId).get();

    if (!ambassadorDoc.exists) {
      throw new HttpsError('not-found', 'Ambassador not found');
    }

    const ambassador = ambassadorDoc.data()!;

    await createActivityEvent({
      type,
      ambassadorId,
      ambassadorName: ambassador.firstName,
      metadata,
    });

    return {
      success: true,
      message: 'Activity event created',
    };
  }
);
