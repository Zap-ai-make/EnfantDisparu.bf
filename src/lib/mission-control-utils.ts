'use client';

import { Ambassador, MissionMetrics, MissionGoal } from '@/types/ambassador';
import { calculateAmbassadorScore } from '@/lib/firestore';
import type { DailyStatsSnapshot } from '@/lib/firestore-helpers';

/**
 * Mission Control Utilities
 *
 * Calculs avancés pour le tableau de bord technique des ambassadeurs.
 * Focus sur métriques de performance, analytics, et insights stratégiques.
 *
 * Features:
 * - Calcul de scores d'impact avancés
 * - Métriques de réseau et influence
 * - Génération de graphiques (données pour viz)
 * - Goals tracking et progression
 */

// ─── Advanced Metrics Calculation ─────────────────────────────────────────────

/**
 * Calculate comprehensive mission metrics for an ambassador.
 * If dailyStatsData is provided, uses real historical data; otherwise generates mock data.
 */
export function calculateMissionMetrics(
  ambassador: Ambassador,
  dailyStatsData?: DailyStatsSnapshot[]
): MissionMetrics {
  const { stats } = ambassador;

  // Total impact score (from firestore)
  const totalImpactScore = calculateAmbassadorScore(ambassador.stats);

  // Use real data if available, otherwise generate mock data
  let dailyScores: number[];
  let dailyShares: number[];
  let dailyViews: number[];
  let peakHour: number;

  if (dailyStatsData && dailyStatsData.length > 0) {
    // Use real historical data from Firestore
    dailyScores = dailyStatsData.map((d) => d.score);
    dailyShares = dailyStatsData.map((d) => d.shares);
    dailyViews = dailyStatsData.map((d) => d.views);
    peakHour = dailyStatsData[dailyStatsData.length - 1]?.peakHour || 0;
  } else {
    // Generate mock historical data (7 days)
    dailyScores = generateMockDailyData(totalImpactScore, 7);
    dailyShares = generateMockDailyData(stats.alertsShared, 7, 0.1);
    dailyViews = generateMockDailyData(stats.viewsGenerated, 7, 0.15);
    peakHour = Math.floor(Math.random() * 13) + 8; // Mock: random between 8-20h
  }

  // Impact velocity (points per day average over last 7 days)
  const impactVelocity = dailyScores.length > 0
    ? dailyScores.reduce((sum, s) => sum + s, 0) / dailyScores.length
    : 0;

  // Consistency (% of days active in last 30 days)
  // If we have real data, calculate based on actual activity
  const consistency = dailyStatsData && dailyStatsData.length > 0
    ? Math.min(100, (dailyStatsData.filter((d) => d.actionsCount > 0).length / dailyStatsData.length) * 100)
    : Math.min(100, 40 + Math.random() * 40); // Fallback to mock: 40-80%

  // Engagement breakdown
  const shareRate = stats.alertsShared > 0
    ? stats.alertsShared / Math.max(1, stats.notificationsActivated)
    : 0;

  const viewsPerShare = stats.alertsShared > 0
    ? stats.viewsGenerated / stats.alertsShared
    : 0;

  const conversionRate = stats.alertsShared > 0
    ? Math.min(100, (stats.viewsGenerated / (stats.alertsShared * 10)) * 100)
    : 0;

  const viralityScore = Math.min(100, viewsPerShare * 2); // Simple heuristic

  // Network metrics
  const directRecruits = stats.ambassadorsRecruited;
  const networkSize = directRecruits + Math.floor(directRecruits * 1.5); // Estimate
  const networkImpact = networkSize * 50; // Avg 50 points per network member
  const influenceScore = Math.min(100, (networkImpact / 100));

  // Zone coverage
  const zoneReach = ambassador.zones.length * 15000; // Estimate 15k pop per zone
  const zoneActivity = Math.min(100, stats.alertsShared * 5); // Activity score
  const zoneRank = Math.max(1, Math.ceil(ambassador.globalRank || 50 / ambassador.zones.length));

  return {
    totalImpactScore,
    impactVelocity,
    peakHour,
    consistency,
    shareRate,
    viewsPerShare,
    conversionRate,
    viralityScore,
    directRecruits,
    networkSize,
    networkImpact,
    influenceScore,
    zoneReach,
    zoneActivity,
    zoneRank,
    dailyScores,
    dailyShares,
    dailyViews,
  };
}

/**
 * Generate mock daily data with realistic variation.
 */
function generateMockDailyData(
  totalValue: number,
  days: number,
  dailyFraction: number = 0.14 // 1/7 for 7 days
): number[] {
  const data: number[] = [];
  const avgDaily = totalValue * dailyFraction;

  for (let i = 0; i < days; i++) {
    // Add random variation (-30% to +50%)
    const variation = 0.7 + Math.random() * 0.8;
    const value = Math.floor(avgDaily * variation);
    data.push(Math.max(0, value));
  }

  return data;
}

// ─── Goals Management ──────────────────────────────────────────────────────────

/**
 * Generate active goals for an ambassador.
 */
export function generateAmbassadorGoals(ambassador: Ambassador): MissionGoal[] {
  const { stats } = ambassador;
  const now = new Date();

  const goals: MissionGoal[] = [];

  // Daily goal: Share 3 alerts
  goals.push({
    id: 'daily_shares',
    type: 'daily',
    metric: 'shares',
    target: 3,
    current: Math.min(3, stats.alertsShared % 4), // Mock current progress
    deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
    reward: '+20 pts bonus',
  });

  // Weekly goal: Reach 500 views
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  goals.push({
    id: 'weekly_views',
    type: 'weekly',
    metric: 'views',
    target: 500,
    current: Math.min(500, Math.floor(stats.viewsGenerated * 0.2)), // Mock
    deadline: weekEnd,
    reward: 'Badge "Influenceur"',
  });

  // Monthly goal: Recruit 2 ambassadors
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  goals.push({
    id: 'monthly_recruits',
    type: 'monthly',
    metric: 'recruits',
    target: 2,
    current: Math.min(2, stats.ambassadorsRecruited % 3), // Mock
    deadline: monthEnd,
    reward: '+100 pts + Badge',
  });

  return goals;
}

/**
 * Calculate goal progress percentage.
 */
export function calculateGoalProgress(goal: MissionGoal): number {
  if (goal.target === 0) return 0;
  return Math.min(100, (goal.current / goal.target) * 100);
}

/**
 * Check if goal is completed.
 */
export function isGoalCompleted(goal: MissionGoal): boolean {
  return goal.current >= goal.target;
}

/**
 * Check if goal is near deadline (< 24h remaining).
 */
export function isGoalUrgent(goal: MissionGoal): boolean {
  const now = new Date();
  const hoursRemaining = (goal.deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursRemaining < 24 && hoursRemaining > 0;
}

// ─── Chart Data Generation ────────────────────────────────────────────────────

/**
 * Prepare data for line chart (7-day trend).
 */
export function prepareLineChartData(
  dailyData: number[],
  labels: string[]
): {
  labels: string[];
  values: number[];
  max: number;
  min: number;
  avg: number;
} {
  const max = Math.max(...dailyData);
  const min = Math.min(...dailyData);
  const avg = dailyData.reduce((sum, v) => sum + v, 0) / dailyData.length;

  return {
    labels,
    values: dailyData,
    max,
    min,
    avg: Math.round(avg),
  };
}

/**
 * Get labels for last 7 days.
 */
export function getLast7DaysLabels(): string[] {
  const labels: string[] = [];
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    labels.push(days[date.getDay()]);
  }

  return labels;
}

/**
 * Prepare data for bar chart (comparison).
 */
export function prepareBarChartData(
  metrics: { label: string; value: number; color: string }[]
): typeof metrics {
  return metrics;
}

// ─── Insights & Recommendations ───────────────────────────────────────────────

/**
 * Generate strategic insights based on metrics.
 */
export function generateInsights(metrics: MissionMetrics): {
  icon: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
}[] {
  const insights: ReturnType<typeof generateInsights> = [];

  // Low consistency
  if (metrics.consistency < 50) {
    insights.push({
      icon: '📅',
      title: 'Améliore ta régularité',
      message: `Tu es actif ${Math.round(metrics.consistency)}% du temps. Vise 70% pour maximiser ton impact.`,
      priority: 'high',
      color: 'text-orange-700',
    });
  }

  // Low virality
  if (metrics.viralityScore < 30) {
    insights.push({
      icon: '🚀',
      title: 'Boost ta viralité',
      message: `Tes partages génèrent ${metrics.viewsPerShare.toFixed(1)} vues en moyenne. Partage sur plus de canaux !`,
      priority: 'medium',
      color: 'text-blue-700',
    });
  }

  // Network opportunity
  if (metrics.directRecruits < 3) {
    insights.push({
      icon: '👥',
      title: 'Recrute des ambassadeurs',
      message: 'Chaque recrue multiplie ton impact par 3. Vise 3 recrutements ce mois-ci !',
      priority: 'high',
      color: 'text-purple-700',
    });
  }

  // Peak performance
  if (metrics.viralityScore > 70) {
    insights.push({
      icon: '🔥',
      title: 'Performance exceptionnelle !',
      message: `Score de viralité: ${Math.round(metrics.viralityScore)}/100. Continue comme ça !`,
      priority: 'low',
      color: 'text-green-700',
    });
  }

  // Zone expansion
  if (metrics.zoneActivity > 80) {
    insights.push({
      icon: '📍',
      title: 'Étends ta couverture',
      message: 'Tes zones actuelles sont très actives. Ajoute une nouvelle zone pour augmenter ton impact !',
      priority: 'medium',
      color: 'text-indigo-700',
    });
  }

  return insights;
}

/**
 * Get performance tier based on impact score.
 */
export function getPerformanceTier(score: number): {
  name: string;
  color: string;
  icon: string;
  minScore: number;
} {
  if (score >= 500) {
    return {
      name: 'Elite',
      color: 'text-purple-600',
      icon: '👑',
      minScore: 500,
    };
  }

  if (score >= 300) {
    return {
      name: 'Expert',
      color: 'text-blue-600',
      icon: '⭐',
      minScore: 300,
    };
  }

  if (score >= 150) {
    return {
      name: 'Avancé',
      color: 'text-green-600',
      icon: '🎯',
      minScore: 150,
    };
  }

  if (score >= 50) {
    return {
      name: 'Intermédiaire',
      color: 'text-orange-600',
      icon: '🔰',
      minScore: 50,
    };
  }

  return {
    name: 'Débutant',
    color: 'text-gray-600',
    icon: '🌱',
    minScore: 0,
  };
}

/**
 * Calculate next tier threshold.
 */
export function getNextTierProgress(score: number): {
  currentTier: string;
  nextTier: string;
  progress: number;
  pointsNeeded: number;
} {
  const tiers = [
    { name: 'Débutant', threshold: 0 },
    { name: 'Intermédiaire', threshold: 50 },
    { name: 'Avancé', threshold: 150 },
    { name: 'Expert', threshold: 300 },
    { name: 'Elite', threshold: 500 },
  ];

  let currentIndex = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (score >= tiers[i].threshold) {
      currentIndex = i;
      break;
    }
  }

  const current = tiers[currentIndex];
  const next = tiers[currentIndex + 1] || { name: 'Maximum', threshold: 500 };

  const progress = currentIndex === tiers.length - 1
    ? 100
    : ((score - current.threshold) / (next.threshold - current.threshold)) * 100;

  const pointsNeeded = Math.max(0, next.threshold - score);

  return {
    currentTier: current.name,
    nextTier: next.name,
    progress: Math.round(progress),
    pointsNeeded,
  };
}

// ─── Leaderboard Comparison ───────────────────────────────────────────────────

/**
 * Compare ambassador to leaderboard stats.
 */
export function compareToLeaderboard(
  ambassadorScore: number,
  leaderboard: { rank: number; totalScore: number }[]
): {
  aboveMe: number;
  belowMe: number;
  percentile: number;
  gapToNext: number;
  gapToTop: number;
} {
  if (leaderboard.length === 0) {
    return {
      aboveMe: 0,
      belowMe: 0,
      percentile: 100,
      gapToNext: 0,
      gapToTop: 0,
    };
  }

  const myIndex = leaderboard.findIndex((entry) => entry.totalScore <= ambassadorScore);
  const aboveMe = myIndex === -1 ? leaderboard.length : myIndex;
  const belowMe = leaderboard.length - aboveMe;
  const percentile = ((leaderboard.length - aboveMe) / leaderboard.length) * 100;

  const nextScore = aboveMe > 0 ? leaderboard[aboveMe - 1].totalScore : ambassadorScore;
  const topScore = leaderboard[0].totalScore;

  const gapToNext = Math.max(0, nextScore - ambassadorScore);
  const gapToTop = Math.max(0, topScore - ambassadorScore);

  return {
    aboveMe,
    belowMe,
    percentile: Math.round(percentile),
    gapToNext,
    gapToTop,
  };
}

// ─── Time-based Analysis ──────────────────────────────────────────────────────

/**
 * Analyze activity patterns over time.
 */
export function analyzeActivityPatterns(dailyData: number[]): {
  trend: 'up' | 'down' | 'stable';
  trendStrength: number; // 0-100
  bestDay: number; // Index of best day
  worstDay: number; // Index of worst day
  volatility: number; // Coefficient of variation
} {
  if (dailyData.length < 2) {
    return {
      trend: 'stable',
      trendStrength: 0,
      bestDay: 0,
      worstDay: 0,
      volatility: 0,
    };
  }

  // Calculate trend
  const firstHalf = dailyData.slice(0, Math.floor(dailyData.length / 2));
  const secondHalf = dailyData.slice(Math.floor(dailyData.length / 2));

  const avgFirst = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

  const diff = avgSecond - avgFirst;
  const trendStrength = avgFirst > 0 ? Math.abs(diff / avgFirst) * 100 : 0;

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (diff > avgFirst * 0.1) trend = 'up';
  if (diff < -avgFirst * 0.1) trend = 'down';

  // Best and worst days
  const bestDay = dailyData.indexOf(Math.max(...dailyData));
  const worstDay = dailyData.indexOf(Math.min(...dailyData));

  // Volatility (coefficient of variation)
  const mean = dailyData.reduce((sum, v) => sum + v, 0) / dailyData.length;
  const variance = dailyData.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / dailyData.length;
  const stdDev = Math.sqrt(variance);
  const volatility = mean > 0 ? (stdDev / mean) * 100 : 0;

  return {
    trend,
    trendStrength: Math.min(100, Math.round(trendStrength)),
    bestDay,
    worstDay,
    volatility: Math.round(volatility),
  };
}
