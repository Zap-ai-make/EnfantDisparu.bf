'use client';

import { GlobalStats } from '@/types/announcement';

/**
 * Live Stats Utilities
 *
 * Calcule et formate les statistiques globales de la plateforme en temps réel.
 *
 * Features:
 * - Génération de stats fictives réalistes (pour démo)
 * - Calculs de métriques agrégées
 * - Formatage de nombres avec séparateurs
 * - Calculs de velocity (24h)
 * - Success rate et avg resolution time
 */

// ─── Mock Data Generation ─────────────────────────────────────────────────────

/**
 * Generate realistic mock global stats.
 * In production, this would aggregate data from Firestore collections.
 */
export function generateMockGlobalStats(): GlobalStats {
  // Base realistic numbers for Burkina Faso context
  const totalAnnouncements = 487;
  const resolvedAnnouncements = 312;
  const activeAnnouncements = totalAnnouncements - resolvedAnnouncements;

  // Calculate derived metrics
  const resolutionRate = (resolvedAnnouncements / totalAnnouncements) * 100;
  const avgResolutionTime = 18.5; // hours

  // Engagement metrics (scaled realistically)
  const totalAmbassadors = 156;
  const totalShares = totalAnnouncements * 47; // ~47 shares per announcement
  const totalViews = totalAnnouncements * 3420; // ~3.4k views per announcement
  const totalPushSent = totalAnnouncements * 892; // ~892 notifications per announcement
  const totalSightings = Math.floor(totalAnnouncements * 0.38); // 38% have sightings

  // Last 24h activity (10-15% of total per month, divided by 30)
  const last24hAnnouncements = Math.floor(Math.random() * 3) + 2; // 2-4 per day
  const last24hShares = Math.floor(totalShares * 0.004 + Math.random() * 50); // ~0.4% daily
  const last24hViews = Math.floor(totalViews * 0.005 + Math.random() * 1000); // ~0.5% daily

  return {
    totalAnnouncements,
    activeAnnouncements,
    resolvedAnnouncements,
    totalAmbassadors,
    totalShares,
    totalViews,
    totalPushSent,
    totalSightings,
    resolutionRate,
    avgResolutionTime,
    last24hAnnouncements,
    last24hShares,
    last24hViews,
    lastUpdated: new Date(),
  };
}

/**
 * Simulate incremental stat updates for live effect.
 * Adds small random increments to create sense of real-time activity.
 */
export function incrementStatsLive(stats: GlobalStats): GlobalStats {
  return {
    ...stats,
    // Increment shares and views slightly
    totalShares: stats.totalShares + Math.floor(Math.random() * 3),
    totalViews: stats.totalViews + Math.floor(Math.random() * 20) + 5,
    last24hShares: stats.last24hShares + (Math.random() < 0.3 ? 1 : 0),
    last24hViews: stats.last24hViews + Math.floor(Math.random() * 10) + 2,
    lastUpdated: new Date(),
  };
}

// ─── Real Firestore Queries (Production) ──────────────────────────────────────

/**
 * TODO: Production implementation
 *
 * Fetch global stats from Firestore aggregations.
 * Should be implemented as a Cloud Function that runs periodically (every 5 min)
 * and stores results in a `globalStats` singleton document for fast reads.
 *
 * @example
 * ```typescript
 * export async function fetchGlobalStats(): Promise<GlobalStats> {
 *   const statsDoc = await db.collection('system').doc('globalStats').get();
 *   return statsDoc.data() as GlobalStats;
 * }
 * ```
 */

// ─── Formatting Utilities ─────────────────────────────────────────────────────

/**
 * Format a number with thousand separators (French locale).
 * @example 1234567 → "1 234 567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.floor(num));
}

/**
 * Format a number with compact notation for large values.
 * @example 1234 → "1.2K", 1234567 → "1.2M"
 */
export function formatNumberCompact(num: number): string {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(Math.floor(num));
}

/**
 * Format a percentage with 1 decimal.
 * @example 64.123 → "64.1%"
 */
export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

/**
 * Format hours as human-readable duration.
 * @example 18.5 → "18h30"
 */
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);

  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

/**
 * Get color class based on metric health.
 */
export function getMetricColor(value: number, threshold: { good: number; ok: number }): string {
  if (value >= threshold.good) return 'text-green-600';
  if (value >= threshold.ok) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get resolution rate color (green if high, red if low).
 */
export function getResolutionRateColor(rate: number): string {
  if (rate >= 70) return 'text-green-600';
  if (rate >= 50) return 'text-orange-600';
  return 'text-red-600';
}

// ─── Stat Insights ────────────────────────────────────────────────────────────

/**
 * Generate insight message based on stats.
 */
export function getStatsInsight(stats: GlobalStats): {
  icon: string;
  message: string;
  color: string;
} {
  // High resolution rate
  if (stats.resolutionRate >= 70) {
    return {
      icon: '🎉',
      message: `${formatPercentage(stats.resolutionRate)} des enfants retrouvés !`,
      color: 'text-green-700',
    };
  }

  // High activity
  if (stats.last24hShares > 100) {
    return {
      icon: '🔥',
      message: `${formatNumber(stats.last24hShares)} partages aujourd'hui`,
      color: 'text-orange-700',
    };
  }

  // Many ambassadors
  if (stats.totalAmbassadors > 100) {
    return {
      icon: '👥',
      message: `${formatNumber(stats.totalAmbassadors)} ambassadeurs mobilisés`,
      color: 'text-blue-700',
    };
  }

  // Fast resolution
  if (stats.avgResolutionTime < 12) {
    return {
      icon: '⚡',
      message: `Résolution en ${formatDuration(stats.avgResolutionTime)} en moyenne`,
      color: 'text-purple-700',
    };
  }

  // Default: total reach
  return {
    icon: '📊',
    message: `${formatNumberCompact(stats.totalViews)} vues générées`,
    color: 'text-gray-700',
  };
}

/**
 * Calculate trend indicator (up/down arrow) based on 24h activity.
 */
export function getTrendIndicator(current24h: number, previousAvg: number): {
  icon: string;
  text: string;
  color: string;
} {
  const diff = current24h - previousAvg;
  const percentChange = (diff / previousAvg) * 100;

  if (percentChange > 10) {
    return {
      icon: '📈',
      text: `+${Math.round(percentChange)}%`,
      color: 'text-green-600',
    };
  }

  if (percentChange < -10) {
    return {
      icon: '📉',
      text: `${Math.round(percentChange)}%`,
      color: 'text-red-600',
    };
  }

  return {
    icon: '➡️',
    text: 'stable',
    color: 'text-gray-600',
  };
}

// ─── Velocity Calculations ────────────────────────────────────────────────────

/**
 * Calculate events per hour based on 24h data.
 */
export function calculateVelocity(last24hCount: number): {
  perHour: number;
  perMinute: number;
} {
  const perHour = last24hCount / 24;
  const perMinute = perHour / 60;

  return {
    perHour: Math.round(perHour * 10) / 10, // 1 decimal
    perMinute: Math.round(perMinute * 10) / 10,
  };
}

/**
 * Get velocity message for display.
 */
export function getVelocityMessage(last24hCount: number, metricName: string): string {
  const velocity = calculateVelocity(last24hCount);

  if (velocity.perHour >= 5) {
    return `${velocity.perHour.toFixed(1)}/h`;
  }

  if (velocity.perMinute >= 0.5) {
    return `${velocity.perMinute.toFixed(1)}/min`;
  }

  return `${last24hCount} dernières 24h`;
}

// ─── Impact Metrics ───────────────────────────────────────────────────────────

/**
 * Calculate total platform reach (sum of all channels).
 */
export function calculateTotalReach(stats: GlobalStats): number {
  return stats.totalViews + stats.totalPushSent;
}

/**
 * Calculate average shares per announcement.
 */
export function calculateAvgSharesPerAnnouncement(stats: GlobalStats): number {
  if (stats.totalAnnouncements === 0) return 0;
  return Math.round((stats.totalShares / stats.totalAnnouncements) * 10) / 10;
}

/**
 * Calculate average views per announcement.
 */
export function calculateAvgViewsPerAnnouncement(stats: GlobalStats): number {
  if (stats.totalAnnouncements === 0) return 0;
  return Math.round(stats.totalViews / stats.totalAnnouncements);
}

/**
 * Calculate sighting rate (% of announcements with at least 1 sighting).
 */
export function calculateSightingRate(stats: GlobalStats): number {
  if (stats.totalAnnouncements === 0) return 0;
  return (stats.totalSightings / stats.totalAnnouncements) * 100;
}

// ─── Comparison Helpers ───────────────────────────────────────────────────────

/**
 * Compare current stats with previous period.
 */
export interface StatsComparison {
  metric: string;
  current: number;
  previous: number;
  change: number;
  percentChange: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Generate comparison for key metrics.
 */
export function compareStats(
  current: GlobalStats,
  previous: GlobalStats
): StatsComparison[] {
  const comparisons: StatsComparison[] = [];

  const metrics: Array<{
    key: keyof GlobalStats;
    label: string;
  }> = [
    { key: 'totalAnnouncements', label: 'Annonces' },
    { key: 'resolvedAnnouncements', label: 'Résolues' },
    { key: 'totalShares', label: 'Partages' },
    { key: 'totalViews', label: 'Vues' },
  ];

  metrics.forEach(({ key, label }) => {
    const currentVal = current[key] as number;
    const previousVal = previous[key] as number;
    const change = currentVal - previousVal;
    const percentChange = previousVal > 0 ? (change / previousVal) * 100 : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (percentChange > 2) trend = 'up';
    if (percentChange < -2) trend = 'down';

    comparisons.push({
      metric: label,
      current: currentVal,
      previous: previousVal,
      change,
      percentChange,
      trend,
    });
  });

  return comparisons;
}
