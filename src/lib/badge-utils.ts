import { Ambassador, Badge, BadgeCondition } from '@/types/ambassador';

/**
 * Badge System Utilities
 *
 * This file contains all the logic for the gamification badge system.
 * Badges are unlocked automatically based on ambassador stats and actions.
 */

// ─── Badge Definitions ────────────────────────────────────────────────────────

/**
 * All available badges in the system.
 * Each badge has:
 * - id: Unique identifier (kebab-case)
 * - name: Display name (French)
 * - description: What it takes to earn it
 * - icon: Emoji representation
 * - tier: Visual importance level (bronze, silver, gold, platinum)
 * - condition: Automatic unlock criteria
 */
export const AVAILABLE_BADGES: Record<string, Omit<Badge, 'unlockedAt'>> = {
  // ─── Initiation Badges (débloqués automatiquement) ─────────────────────────
  nouveau_gardien: {
    id: 'nouveau_gardien',
    name: 'Nouveau Gardien',
    description: 'Compte ambassadeur créé avec succès',
    icon: '🎖️',
    tier: 'bronze',
    condition: { type: 'event', eventType: 'accountCreated' },
  },
  ancre_zone: {
    id: 'ancre_zone',
    name: 'Ancré dans ma Zone',
    description: 'Première zone suivie activée',
    icon: '📍',
    tier: 'bronze',
    condition: { type: 'count', metric: 'zones', value: 1 },
  },

  // ─── Action Badges (basés sur compteurs) ──────────────────────────────────
  veilleur_actif: {
    id: 'veilleur_actif',
    name: 'Veilleur Actif',
    description: '10+ notifications activées',
    icon: '🔔',
    tier: 'silver',
    condition: { type: 'threshold', metric: 'notifications', value: 10 },
  },
  super_partageur: {
    id: 'super_partageur',
    name: 'Super Partageur',
    description: '50+ partages effectués',
    icon: '📢',
    tier: 'gold',
    condition: { type: 'threshold', metric: 'shares', value: 50 },
  },
  generateur_vues: {
    id: 'generateur_vues',
    name: 'Générateur de Vues',
    description: '1 000+ vues générées',
    icon: '👀',
    tier: 'silver',
    condition: { type: 'threshold', metric: 'views', value: 1000 },
  },
  recruteur: {
    id: 'recruteur',
    name: 'Recruteur',
    description: '5+ ambassadeurs recrutés',
    icon: '🤝',
    tier: 'gold',
    condition: { type: 'threshold', metric: 'recruited', value: 5 },
  },

  // ─── Mastery Badges (seuils élevés) ───────────────────────────────────────
  elite: {
    id: 'elite',
    name: "Ambassadeur d'Elite",
    description: '1 000+ points de score total',
    icon: '🏆',
    tier: 'platinum',
    condition: { type: 'threshold', metric: 'score', value: 1000 },
  },
  force_frappe: {
    id: 'force_frappe',
    name: 'Force de Frappe',
    description: '100+ partages effectués',
    icon: '⚡',
    tier: 'platinum',
    condition: { type: 'threshold', metric: 'shares', value: 100 },
  },
  influenceur: {
    id: 'influenceur',
    name: 'Influenceur Communautaire',
    description: '10 000+ vues générées',
    icon: '🌟',
    tier: 'platinum',
    condition: { type: 'threshold', metric: 'views', value: 10000 },
  },
  legende: {
    id: 'legende',
    name: 'Légende',
    description: 'Top 10 du classement national',
    icon: '👑',
    tier: 'platinum',
    condition: { type: 'rank', value: 10 },
  },

  // ─── Special Badges (événements uniques) ──────────────────────────────────
  premier_temoin: {
    id: 'premier_temoin',
    name: 'Premier Témoin',
    description: 'Premier signalement de témoin validé',
    icon: '🎯',
    tier: 'gold',
    condition: { type: 'event', eventType: 'firstSighting' },
  },
  heros_jour: {
    id: 'heros_jour',
    name: 'Héros du Jour',
    description: 'A contribué à une retrouvaille confirmée',
    icon: '💚',
    tier: 'platinum',
    condition: { type: 'event', eventType: 'retrouvaille' },
  },
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Calculate the total score for an ambassador based on their stats.
 *
 * Formula:
 * - Notifications activated: 1 point each
 * - Alerts shared: 2 points each
 * - Ambassadors recruited: 5 points each
 * - Views generated: 0.1 point each (rounded)
 *
 * @param stats - Ambassador statistics
 * @returns Total score
 */
export function calculateScore(stats: Ambassador['stats']): number {
  return (
    stats.notificationsActivated * 1 +
    stats.alertsShared * 2 +
    stats.ambassadorsRecruited * 5 +
    Math.round(stats.viewsGenerated * 0.1)
  );
}

/**
 * Check if a badge condition is met for a given ambassador.
 *
 * @param condition - Badge unlock condition
 * @param ambassador - Ambassador to check
 * @returns true if condition is met
 */
export function isBadgeConditionMet(
  condition: BadgeCondition,
  ambassador: Ambassador
): boolean {
  switch (condition.type) {
    case 'threshold': {
      // Check if a stat exceeds a threshold
      if (!condition.metric || condition.value === undefined) return false;

      let currentValue = 0;

      if (condition.metric === 'score') {
        currentValue = calculateScore(ambassador.stats);
      } else if (condition.metric === 'notifications') {
        currentValue = ambassador.stats.notificationsActivated || 0;
      } else if (condition.metric === 'shares') {
        currentValue = ambassador.stats.alertsShared || 0;
      } else if (condition.metric === 'views') {
        currentValue = ambassador.stats.viewsGenerated || 0;
      } else if (condition.metric === 'recruited') {
        currentValue = ambassador.stats.ambassadorsRecruited || 0;
      }

      return currentValue >= condition.value;
    }

    case 'count': {
      // Check if count of something meets threshold
      if (!condition.metric || condition.value === undefined) return false;

      if (condition.metric === 'zones') {
        return (ambassador.zones?.length || 0) >= condition.value;
      }

      return false;
    }

    case 'rank': {
      // Check if global rank is within threshold
      if (condition.value === undefined) return false;
      return (ambassador.globalRank || 999) <= condition.value;
    }

    case 'event': {
      // Event-based badges are managed manually by Cloud Functions
      // This function cannot check event badges
      return false;
    }

    default:
      return false;
  }
}

/**
 * Check which new badges an ambassador can unlock.
 *
 * @param ambassador - Ambassador to check
 * @returns Array of badge IDs that should be unlocked
 */
export function checkBadgeUnlocks(ambassador: Ambassador): string[] {
  const newBadges: string[] = [];
  const currentBadgeIds = (ambassador.badges || []).map((b) => b.id);

  Object.values(AVAILABLE_BADGES).forEach((badge) => {
    // Skip if already unlocked
    if (currentBadgeIds.includes(badge.id)) return;

    // Check condition
    if (isBadgeConditionMet(badge.condition, ambassador)) {
      newBadges.push(badge.id);
    }
  });

  return newBadges;
}

/**
 * Calculate progress towards badges not yet unlocked.
 *
 * @param ambassador - Ambassador to check
 * @returns Record of badge progress (current/target/percentage)
 */
export function getBadgeProgress(ambassador: Ambassador): Record<
  string,
  { current: number; target: number; percentage: number }
> {
  const progress: Record<string, any> = {};
  const currentBadgeIds = (ambassador.badges || []).map((b) => b.id);

  Object.values(AVAILABLE_BADGES).forEach((badge) => {
    // Skip already unlocked
    if (currentBadgeIds.includes(badge.id)) return;

    // Only track badges with threshold conditions
    if (badge.condition.type !== 'threshold') return;
    if (!badge.condition.metric || badge.condition.value === undefined) return;

    let current = 0;

    if (badge.condition.metric === 'score') {
      current = calculateScore(ambassador.stats);
    } else if (badge.condition.metric === 'notifications') {
      current = ambassador.stats.notificationsActivated || 0;
    } else if (badge.condition.metric === 'shares') {
      current = ambassador.stats.alertsShared || 0;
    } else if (badge.condition.metric === 'views') {
      current = ambassador.stats.viewsGenerated || 0;
    } else if (badge.condition.metric === 'recruited') {
      current = ambassador.stats.ambassadorsRecruited || 0;
    }

    const target = badge.condition.value;
    const percentage = Math.min(100, Math.round((current / target) * 100));

    progress[badge.id] = {
      current,
      target,
      percentage,
    };
  });

  return progress;
}

/**
 * Get a human-readable label for a badge metric.
 *
 * @param metric - Badge metric type
 * @returns French label
 */
export function getBadgeMetricLabel(metric: string): string {
  const labels: Record<string, string> = {
    notifications: 'notifications',
    shares: 'partages',
    views: 'vues',
    recruited: 'recrutés',
    score: 'points',
    zones: 'zones',
  };

  return labels[metric] || metric;
}

/**
 * Sort badges by tier (platinum first, then gold, silver, bronze).
 *
 * @param badges - Array of badges to sort
 * @returns Sorted array
 */
export function sortBadgesByTier(badges: Badge[]): Badge[] {
  const tierOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

  return [...badges].sort((a, b) => {
    return tierOrder[a.tier] - tierOrder[b.tier];
  });
}

/**
 * Get badge tier color classes for Tailwind.
 *
 * @param tier - Badge tier
 * @returns Tailwind color classes
 */
export function getBadgeTierColors(tier: Badge['tier']): {
  bg: string;
  text: string;
  border: string;
  gradient: string;
} {
  const colors = {
    bronze: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      gradient: 'from-amber-700 to-amber-500',
    },
    silver: {
      bg: 'bg-gray-200',
      text: 'text-gray-800',
      border: 'border-gray-400',
      gradient: 'from-gray-400 to-gray-300',
    },
    gold: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-400',
      gradient: 'from-yellow-500 to-yellow-400',
    },
    platinum: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-400',
      gradient: 'from-purple-500 to-pink-500',
    },
  };

  return colors[tier];
}
