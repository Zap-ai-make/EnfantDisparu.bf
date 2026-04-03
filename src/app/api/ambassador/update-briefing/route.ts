import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

// Force dynamic rendering to avoid build-time initialization
export const dynamic = 'force-dynamic';

/**
 * API Route: Update Ambassador Briefing Stats
 *
 * Called when ambassador views morning briefing modal.
 * Updates:
 * - lastBriefingDate
 * - briefingStats.totalViews (increment)
 * - briefingStats.currentStreak (calculate)
 * - briefingStats.longestStreak (update if new record)
 *
 * POST /api/ambassador/update-briefing
 * Body: { ambassadorId: string, timestamp: string (ISO) }
 */
export async function POST(req: NextRequest) {
  try {
    const { ambassadorId, timestamp } = await req.json();

    if (!ambassadorId || !timestamp) {
      return NextResponse.json(
        { error: 'Missing ambassadorId or timestamp' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const ambassadorRef = db.collection('ambassadors').doc(ambassadorId);
    const doc = await ambassadorRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Ambassador not found' },
        { status: 404 }
      );
    }

    const ambassador = doc.data()!;
    const today = new Date(timestamp);
    const lastBriefing = ambassador.lastBriefingDate?.toDate();

    // Calculate streak
    let currentStreak = 1;
    if (lastBriefing) {
      const diffMs = today.getTime() - lastBriefing.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day - don't update (prevent multiple briefings same day)
        return NextResponse.json({
          success: true,
          message: 'Briefing already viewed today',
          currentStreak: ambassador.briefingStats?.currentStreak || 1,
          longestStreak: ambassador.briefingStats?.longestStreak || 1,
        });
      } else if (diffDays === 1) {
        // Consecutive day - increment streak
        currentStreak = (ambassador.briefingStats?.currentStreak || 0) + 1;
      } else {
        // Gap - reset streak
        currentStreak = 1;
      }
    }

    const longestStreak = Math.max(
      ambassador.briefingStats?.longestStreak || 0,
      currentStreak
    );

    // Update document
    await ambassadorRef.update({
      lastBriefingDate: today,
      'briefingStats.totalViews': (ambassador.briefingStats?.totalViews || 0) + 1,
      'briefingStats.currentStreak': currentStreak,
      'briefingStats.longestStreak': longestStreak,
    });

    return NextResponse.json({
      success: true,
      currentStreak,
      longestStreak,
      isNewRecord: currentStreak === longestStreak && currentStreak > 1,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating briefing stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
