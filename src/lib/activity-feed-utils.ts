'use client';

import { ActivityEvent, ActivityType, Ambassador } from '@/types/ambassador';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Activity Feed Utilities
 *
 * Génère et formate les événements d'activité pour créer un sentiment
 * de communauté active et de FOMO (Fear Of Missing Out).
 *
 * Features:
 * - Génération d'événements fictifs réalistes (pour démo)
 * - Formatage de timestamps relatifs
 * - Messages dynamiques par type d'activité
 * - Filtrage par type d'événement
 */

// ─── Activity Event Generation ────────────────────────────────────────────────

const SAMPLE_FIRST_NAMES = [
  'Amadou', 'Fatou', 'Ibrahim', 'Aïssata', 'Moussa', 'Mariam',
  'Ousmane', 'Salimata', 'Seydou', 'Fatoumata', 'Boubacar', 'Aminata',
  'Abdoulaye', 'Ramatou', 'Souleymane', 'Awa', 'Issouf', 'Maimouna'
];

const ZONES = [
  { id: 'ouaga-centre', name: 'Centre-ville' },
  { id: 'ouaga-koulouba', name: 'Koulouba' },
  { id: 'ouaga-cissin', name: 'Cissin' },
  { id: 'ouaga-gounghin', name: 'Gounghin' },
  { id: 'ouaga-tampouy', name: 'Tampouy' },
  { id: 'ouaga-zogona', name: 'Zogona' },
];

const BADGE_SAMPLES = [
  { id: 'nouveau_gardien', name: 'Nouveau Gardien', tier: 'bronze' as const },
  { id: 'super_partageur', name: 'Super Partageur', tier: 'gold' as const },
  { id: 'recruteur_star', name: 'Recruteur Star', tier: 'silver' as const },
  { id: 'champion_zones', name: 'Champion des Zones', tier: 'platinum' as const },
];

/**
 * Generate mock activity events for demonstration.
 * In production, this would query Firestore's `activityFeed` collection.
 */
export function generateMockActivityFeed(count: number = 20): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const minutesAgo = Math.floor(Math.random() * 180); // 0-3 hours ago
    const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000);
    const name = SAMPLE_FIRST_NAMES[Math.floor(Math.random() * SAMPLE_FIRST_NAMES.length)];

    // Weighted random type (more shares, less retrouvailles)
    const rand = Math.random();
    let type: ActivityType;

    if (rand < 0.40) type = 'share';
    else if (rand < 0.60) type = 'badge';
    else if (rand < 0.75) type = 'recruit';
    else if (rand < 0.85) type = 'streak';
    else if (rand < 0.90) type = 'zone_added';
    else if (rand < 0.95) type = 'rank_up';
    else if (rand < 0.98) type = 'sighting';
    else type = 'retrouvaille';

    const event: ActivityEvent = {
      id: `activity_${timestamp.getTime()}_${i}`,
      type,
      ambassadorId: `amb_${i}`,
      ambassadorName: name,
      timestamp,
      metadata: {},
    };

    // Add type-specific metadata
    switch (type) {
      case 'badge':
        const badge = BADGE_SAMPLES[Math.floor(Math.random() * BADGE_SAMPLES.length)];
        event.metadata = {
          badgeId: badge.id,
          badgeName: badge.name,
          badgeTier: badge.tier,
        };
        break;

      case 'recruit':
        event.metadata = {
          recruitedCount: Math.floor(Math.random() * 3) + 1,
        };
        break;

      case 'streak':
        const streakDays = [7, 14, 30, 60, 100][Math.floor(Math.random() * 5)];
        event.metadata = {
          streakDays,
        };
        break;

      case 'rank_up':
        const oldRank = Math.floor(Math.random() * 50) + 20;
        event.metadata = {
          oldRank,
          newRank: oldRank - Math.floor(Math.random() * 5) - 1,
        };
        break;

      case 'zone_added':
        const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
        event.metadata = {
          zoneId: zone.id,
          zoneName: zone.name,
        };
        break;

      case 'share':
      case 'sighting':
      case 'retrouvaille':
        event.metadata = {
          announcementCode: `EP${Math.floor(Math.random() * 9000) + 1000}`,
        };
        break;
    }

    events.push(event);
  }

  // Sort by most recent first
  return events.sort((a, b) => {
    const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp.toMillis();
    const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp.toMillis();
    return timeB - timeA;
  });
}

// ─── Activity Event Formatting ───────────────────────────────────────────────

/**
 * Get human-readable message for an activity event.
 */
export function getActivityMessage(event: ActivityEvent): string {
  const { type, ambassadorName, metadata } = event;

  switch (type) {
    case 'share':
      return `a partagé l'alerte ${metadata?.announcementCode}`;

    case 'badge':
      return `a débloqué le badge "${metadata?.badgeName}"`;

    case 'recruit':
      const count = metadata?.recruitedCount || 1;
      return count === 1
        ? 'a recruté un nouvel ambassadeur'
        : `a recruté ${count} nouveaux ambassadeurs`;

    case 'streak':
      return `a atteint ${metadata?.streakDays} jours consécutifs !`;

    case 'zone_added':
      return `surveille maintenant ${metadata?.zoneName}`;

    case 'rank_up':
      return `est passé(e) #${metadata?.oldRank} → #${metadata?.newRank}`;

    case 'sighting':
      return `a signalé une observation pour ${metadata?.announcementCode}`;

    case 'retrouvaille':
      return `🎉 Enfant retrouvé grâce à l'alerte ${metadata?.announcementCode}`;

    default:
      return 'a effectué une action';
  }
}

/**
 * Get icon emoji for activity type.
 */
export function getActivityIcon(type: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    share: '📢',
    badge: '🎖️',
    recruit: '👥',
    streak: '🔥',
    zone_added: '📍',
    rank_up: '📈',
    sighting: '👁️',
    retrouvaille: '🎉',
  };
  return icons[type];
}

/**
 * Get color scheme for activity type.
 */
export function getActivityColors(type: ActivityType): {
  bg: string;
  border: string;
  text: string;
  icon: string;
} {
  const colors: Record<ActivityType, { bg: string; border: string; text: string; icon: string }> = {
    share: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600',
    },
    badge: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
    },
    recruit: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      icon: 'text-green-600',
    },
    streak: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      icon: 'text-orange-600',
    },
    zone_added: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      icon: 'text-purple-600',
    },
    rank_up: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-900',
      icon: 'text-pink-600',
    },
    sighting: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-900',
      icon: 'text-indigo-600',
    },
    retrouvaille: {
      bg: 'bg-gradient-to-br from-green-50 to-yellow-50',
      border: 'border-green-300',
      text: 'text-green-900',
      icon: 'text-green-600',
    },
  };
  return colors[type];
}

/**
 * Get relative time string (e.g., "il y a 5 minutes").
 */
export function getRelativeTime(timestamp: Date | any): string {
  try {
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: fr,
    });
  } catch {
    return 'à l\'instant';
  }
}

/**
 * Filter events by type(s).
 */
export function filterActivityByType(
  events: ActivityEvent[],
  types: ActivityType[]
): ActivityEvent[] {
  if (types.length === 0) return events;
  return events.filter((event) => types.includes(event.type));
}

/**
 * Get activity events for a specific ambassador.
 */
export function getAmbassadorActivity(
  events: ActivityEvent[],
  ambassadorId: string
): ActivityEvent[] {
  return events.filter((event) => event.ambassadorId === ambassadorId);
}

/**
 * Group events by time periods (last hour, today, yesterday, etc.).
 */
export function groupActivityByTime(events: ActivityEvent[]): {
  lastHour: ActivityEvent[];
  today: ActivityEvent[];
  yesterday: ActivityEvent[];
  older: ActivityEvent[];
} {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

  const groups = {
    lastHour: [] as ActivityEvent[],
    today: [] as ActivityEvent[],
    yesterday: [] as ActivityEvent[],
    older: [] as ActivityEvent[],
  };

  events.forEach((event) => {
    const eventTime = event.timestamp instanceof Date
      ? event.timestamp
      : event.timestamp.toDate();

    if (eventTime >= oneHourAgo) {
      groups.lastHour.push(event);
    } else if (eventTime >= startOfToday) {
      groups.today.push(event);
    } else if (eventTime >= startOfYesterday) {
      groups.yesterday.push(event);
    } else {
      groups.older.push(event);
    }
  });

  return groups;
}

/**
 * Calculate activity velocity (events per hour).
 */
export function calculateActivityVelocity(events: ActivityEvent[]): {
  lastHour: number;
  last24Hours: number;
} {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const lastHourCount = events.filter((event) => {
    const eventTime = event.timestamp instanceof Date
      ? event.timestamp
      : event.timestamp.toDate();
    return eventTime >= oneHourAgo;
  }).length;

  const last24HoursCount = events.filter((event) => {
    const eventTime = event.timestamp instanceof Date
      ? event.timestamp
      : event.timestamp.toDate();
    return eventTime >= oneDayAgo;
  }).length;

  return {
    lastHour: lastHourCount,
    last24Hours: Math.round(last24HoursCount / 24),
  };
}
