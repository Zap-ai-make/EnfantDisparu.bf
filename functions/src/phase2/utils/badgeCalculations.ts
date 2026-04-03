/**
 * Badge Calculations Utility
 *
 * Shared functions for calculating ambassador scores and badge conditions.
 * Used by Cloud Functions to maintain consistency with frontend calculations.
 *
 * Note: This mirrors logic from src/lib/badge-utils.ts but adapted for server-side.
 */

interface AmbassadorStats {
  notificationsActivated: number;
  alertsShared: number;
  ambassadorsRecruited: number;
  viewsGenerated: number;
}

interface Ambassador {
  stats: AmbassadorStats;
  zones?: string[];
  // ... other fields not needed for score calculation
}

/**
 * Calculate total impact score for an ambassador.
 *
 * Scoring system:
 * - Notifications activated: +2 pts each
 * - Alerts shared: +3 pts each
 * - Ambassadors recruited: +5 pts each
 * - Views generated: +0.1 pt each
 *
 * @param ambassador Ambassador document data
 * @returns Total impact score
 */
export function calculateAmbassadorScore(ambassador: Ambassador | any): number {
  const stats = ambassador.stats || {
    notificationsActivated: 0,
    alertsShared: 0,
    ambassadorsRecruited: 0,
    viewsGenerated: 0,
  };

  const score =
    stats.notificationsActivated * 2 +
    stats.alertsShared * 3 +
    stats.ambassadorsRecruited * 5 +
    stats.viewsGenerated * 0.1;

  return Math.round(score * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate which tier an ambassador belongs to based on score.
 *
 * Tiers:
 * - Débutant: 0-49
 * - Intermédiaire: 50-149
 * - Avancé: 150-299
 * - Expert: 300-499
 * - Elite: 500+
 */
export function getPerformanceTier(score: number): string {
  if (score >= 500) return 'elite';
  if (score >= 300) return 'expert';
  if (score >= 150) return 'avancé';
  if (score >= 50) return 'intermédiaire';
  return 'débutant';
}

/**
 * Check if ambassador meets condition for a specific badge.
 *
 * Simplified version - real implementation would check all badge conditions.
 */
export function checkBadgeCondition(
  ambassador: Ambassador | any,
  badgeId: string
): boolean {
  const stats = ambassador.stats || {};

  // Example badge conditions (simplified)
  switch (badgeId) {
    case 'super_partageur':
      return stats.alertsShared >= 50;

    case 'recruteur_star':
      return stats.ambassadorsRecruited >= 5;

    case 'champion_zones':
      return (ambassador.zones?.length || 0) >= 5;

    case 'influenceur':
      return stats.viewsGenerated >= 10000;

    // Add more badges as needed

    default:
      return false;
  }
}
