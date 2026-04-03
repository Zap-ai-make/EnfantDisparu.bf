/**
 * Firestore Helper Functions
 *
 * Utility functions for fetching data from Firestore.
 */

import { collection, query, orderBy, limit, getDocs, Timestamp, where } from 'firebase/firestore';
import { db } from './firebase-client';

/**
 * Fetch last N days of daily stats for an ambassador
 */
export async function fetchAmbassadorDailyStats(
  ambassadorId: string,
  days: number = 7
): Promise<DailyStatsSnapshot[]> {
  try {
    const dailyStatsRef = collection(db, 'ambassadors', ambassadorId, 'dailyStats');
    const q = query(dailyStatsRef, orderBy('date', 'desc'), limit(days));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        date: data.date instanceof Timestamp ? data.date.toDate() : new Date(),
        score: data.score || 0,
        shares: data.shares || 0,
        views: data.views || 0,
        recruits: data.recruits || 0,
        notifications: data.notifications || 0,
        minutesActive: data.minutesActive || 0,
        actionsCount: data.actionsCount || 0,
        peakHour: data.peakHour || 0,
      };
    }).reverse(); // Reverse to get chronological order (oldest first)
  } catch (error) {
    console.error('Error fetching ambassador daily stats:', error);
    return [];
  }
}

/**
 * Fetch yesterday's stats for an ambassador
 */
export async function fetchYesterdayStats(
  ambassadorId: string
): Promise<DailyStatsSnapshot | null> {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateKey = formatDate(yesterday);

    const dailyStatsRef = collection(db, 'ambassadors', ambassadorId, 'dailyStats');
    const q = query(dailyStatsRef, where('__name__', '==', dateKey), limit(1));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs[0].data();
    return {
      date: data.date instanceof Timestamp ? data.date.toDate() : new Date(),
      score: data.score || 0,
      shares: data.shares || 0,
      views: data.views || 0,
      recruits: data.recruits || 0,
      notifications: data.notifications || 0,
      minutesActive: data.minutesActive || 0,
      actionsCount: data.actionsCount || 0,
      peakHour: data.peakHour || 0,
    };
  } catch (error) {
    console.error('Error fetching yesterday stats:', error);
    return null;
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DailyStatsSnapshot {
  date: Date;
  score: number;
  shares: number;
  views: number;
  recruits: number;
  notifications: number;
  minutesActive: number;
  actionsCount: number;
  peakHour: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
