/**
 * Daily Challenge System
 *
 * Système de défis quotidiens pour maintenir l'engagement des ambassadeurs.
 * Basé sur le "Variable Reward" du Hook Model (Nir Eyal).
 *
 * Chaque jour de la semaine a un défi différent pour créer de la variété
 * et maintenir l'intérêt. Les défis tournent de façon prévisible mais les
 * récompenses et le contenu varient.
 */

export interface DailyChallenge {
  id: string;
  description: string;
  bonus: number; // Points bonus pour complétion
  type: 'shares' | 'recruit' | 'zones' | 'views' | 'platforms' | 'check' | 'streak';
  target?: number; // Objectif à atteindre (si applicable)
  dayOfWeek: number; // 0 = Dimanche, 1 = Lundi, etc.
}

/**
 * Défis rotatifs par jour de la semaine.
 * Chaque jour a un défi spécifique pour créer une routine prévisible
 * tout en gardant de la variété.
 */
const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'sunday_shares',
    description: 'Partage 3 alertes actives',
    bonus: 50,
    type: 'shares',
    target: 3,
    dayOfWeek: 0, // Dimanche
  },
  {
    id: 'monday_recruit',
    description: 'Recrute 1 nouvel ambassadeur',
    bonus: 100,
    type: 'recruit',
    target: 1,
    dayOfWeek: 1, // Lundi
  },
  {
    id: 'tuesday_zones',
    description: 'Active les notifications pour 2 nouvelles zones',
    bonus: 30,
    type: 'zones',
    target: 2,
    dayOfWeek: 2, // Mardi
  },
  {
    id: 'wednesday_views',
    description: 'Génère 500 vues sur tes partages',
    bonus: 60,
    type: 'views',
    target: 500,
    dayOfWeek: 3, // Mercredi
  },
  {
    id: 'thursday_platforms',
    description: 'Partage sur 3 réseaux sociaux différents',
    bonus: 40,
    type: 'platforms',
    target: 3,
    dayOfWeek: 4, // Jeudi
  },
  {
    id: 'friday_check',
    description: 'Vérifie toutes les recherches actives dans ta zone',
    bonus: 20,
    type: 'check',
    dayOfWeek: 5, // Vendredi
  },
  {
    id: 'saturday_streak',
    description: "Connecte-toi 7 jours d'affilée (aujourd'hui inclus)",
    bonus: 150,
    type: 'streak',
    target: 7,
    dayOfWeek: 6, // Samedi
  },
];

/**
 * Get the daily challenge for a specific date.
 *
 * @param date - Date pour laquelle récupérer le défi
 * @returns Le défi du jour
 */
export function getDailyChallenge(date: Date = new Date()): DailyChallenge {
  const dayOfWeek = date.getDay();
  const challenge = DAILY_CHALLENGES.find((c) => c.dayOfWeek === dayOfWeek);

  if (!challenge) {
    // Fallback si pas trouvé (ne devrait jamais arriver)
    return DAILY_CHALLENGES[0];
  }

  return challenge;
}

/**
 * Check if an ambassador has completed today's challenge.
 *
 * @param challenge - Le défi à vérifier
 * @param ambassador - Ambassadeur à vérifier
 * @param todayStats - Stats d'aujourd'hui (depuis minuit)
 * @returns true si challenge complété
 */
export function isChallengeCompleted(
  challenge: DailyChallenge,
  ambassador: any, // Ambassador type
  todayStats?: {
    sharesCount?: number;
    recruitsCount?: number;
    zonesAdded?: number;
    viewsGenerated?: number;
    platformsUsed?: number;
  }
): boolean {
  if (!todayStats) return false;

  switch (challenge.type) {
    case 'shares':
      return (todayStats.sharesCount || 0) >= (challenge.target || 0);

    case 'recruit':
      return (todayStats.recruitsCount || 0) >= (challenge.target || 0);

    case 'zones':
      return (todayStats.zonesAdded || 0) >= (challenge.target || 0);

    case 'views':
      return (todayStats.viewsGenerated || 0) >= (challenge.target || 0);

    case 'platforms':
      return (todayStats.platformsUsed || 0) >= (challenge.target || 0);

    case 'check':
      // Ce défi est manuel - ambassadeur doit cliquer "Marquer comme fait"
      return ambassador.briefingStats?.lastCompletedChallenge === challenge.id;

    case 'streak':
      return (ambassador.briefingStats?.currentStreak || 0) >= (challenge.target || 0);

    default:
      return false;
  }
}

/**
 * Get progress toward completing today's challenge.
 *
 * @param challenge - Challenge à vérifier
 * @param todayStats - Stats d'aujourd'hui
 * @returns Objet avec current/target/percentage
 */
export function getChallengeProgress(
  challenge: DailyChallenge,
  todayStats?: {
    sharesCount?: number;
    recruitsCount?: number;
    zonesAdded?: number;
    viewsGenerated?: number;
    platformsUsed?: number;
  }
): { current: number; target: number; percentage: number } {
  if (!todayStats || !challenge.target) {
    return { current: 0, target: challenge.target || 1, percentage: 0 };
  }

  let current = 0;

  switch (challenge.type) {
    case 'shares':
      current = todayStats.sharesCount || 0;
      break;
    case 'recruit':
      current = todayStats.recruitsCount || 0;
      break;
    case 'zones':
      current = todayStats.zonesAdded || 0;
      break;
    case 'views':
      current = todayStats.viewsGenerated || 0;
      break;
    case 'platforms':
      current = todayStats.platformsUsed || 0;
      break;
    default:
      current = 0;
  }

  const target = challenge.target;
  const percentage = Math.min(100, Math.round((current / target) * 100));

  return { current, target, percentage };
}

/**
 * Get motivational message based on challenge progress.
 *
 * @param percentage - Pourcentage de progression (0-100)
 * @returns Message motivant
 */
export function getMotivationalMessage(percentage: number): string {
  if (percentage === 0) {
    return "C'est parti ! Tu peux le faire ! 💪";
  } else if (percentage < 25) {
    return 'Bon début ! Continue comme ça ! 🌟';
  } else if (percentage < 50) {
    return 'Tu es sur la bonne voie ! ⚡';
  } else if (percentage < 75) {
    return 'Encore un petit effort ! 🔥';
  } else if (percentage < 100) {
    return "Presque là ! T'es un champion ! 🏆";
  } else {
    return 'Challenge complété ! Incroyable ! 🎉';
  }
}

/**
 * Get the emoji icon for a challenge type.
 *
 * @param type - Type de challenge
 * @returns Emoji correspondant
 */
export function getChallengeIcon(type: DailyChallenge['type']): string {
  const icons = {
    shares: '📢',
    recruit: '🤝',
    zones: '📍',
    views: '👁️',
    platforms: '🌐',
    check: '✅',
    streak: '🔥',
  };

  return icons[type] || '🎯';
}
