import { Timestamp } from "firebase/firestore";

// ─── Badge Types ──────────────────────────────────────────────────────────────

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type BadgeConditionType = 'count' | 'threshold' | 'event' | 'rank';

export type BadgeMetric = 'shares' | 'notifications' | 'views' | 'recruited' | 'score' | 'zones';

export type BadgeEventType = 'accountCreated' | 'firstSighting' | 'retrouvaille' | 'topTen';

export interface BadgeCondition {
  type: BadgeConditionType;
  metric?: BadgeMetric;
  value?: number;
  eventType?: BadgeEventType;
}

export interface Badge {
  id: string; // ex: "nouveau_gardien", "super_partageur"
  name: string; // "Super Partageur"
  description: string; // "A partagé plus de 50 alertes"
  icon: string; // "📢"
  tier: BadgeTier; // Niveaux visuels
  unlockedAt?: Timestamp | Date; // Quand débloqué
  condition: BadgeCondition; // Critères de déblocage
}

// ─── Ambassador Types ─────────────────────────────────────────────────────────

export interface AmbassadorStats {
  notificationsActivated: number;
  alertsShared: number;
  ambassadorsRecruited: number;
  viewsGenerated: number;
}

export interface BriefingStats {
  totalViews: number;           // Nombre total de fois où briefing a été vu
  currentStreak: number;        // Jours consécutifs de visite
  longestStreak: number;        // Record de streak
  lastCompletedChallenge?: string; // ID du dernier challenge complété
  challengesCompleted: number;  // Total challenges réussis
}

export interface Ambassador {
  id: string;
  refCode: string;              // "AMB-XXXX" - vérifié unique via transaction
  firstName: string;
  lastName: string;
  phone: string;                // Format E.164 normalisé: +226XXXXXXXX
  zones: string[];              // Max 5 quartiers
  dateOfBirth: Timestamp;
  catAnswer: "yes" | "no" | "maybe";
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;     // Si rejected, raison optionnelle
  createdAt: Timestamp;
  approvedAt: Timestamp | null;
  approvedBy?: string;          // ID admin qui a approuvé (audit)
  rejectedAt?: Timestamp;
  accessToken?: string;         // Généré seulement à l'approbation (pas à la création)
  accessTokenExpiresAt?: Timestamp; // Expiration du token (7 jours après génération)
  referredBy?: string;          // refCode de l'ambassadeur qui a parrainé
  stats: AmbassadorStats;
  badges?: Badge[];             // Badges débloqués (avec date)
  globalRank?: number;          // Classement global (calculé périodiquement)
  lastBriefingDate?: Timestamp; // Dernière fois modal vue
  briefingStats?: BriefingStats; // Stats du briefing quotidien
}

export type AmbassadorStatus = Ambassador["status"];
export type CatAnswer = Ambassador["catAnswer"];

// ─── Input Types ──────────────────────────────────────────────────────────────

export interface SubmitApplicationInput {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  city: string;
  zoneId: string;
  dateOfBirth: {
    day: number;
    month: number;
    year: number;
  };
  catAnswer: CatAnswer;
  honeypot?: string; // Must be empty
}

export interface AddZoneInput {
  ambassadorId: string;
  zoneId: string;
}

// ─── Audit Log Types ──────────────────────────────────────────────────────────

export type AuditAction = "approved" | "rejected" | "zone_added" | "token_regenerated";

export interface AmbassadorAuditLog {
  id: string;
  ambassadorId: string;
  action: AuditAction;
  performedBy: string;          // "system" ou ID admin
  timestamp: Timestamp;
  details?: Record<string, unknown>;
}

// ─── Rate Limit Types ─────────────────────────────────────────────────────────

export interface RateLimitEntry {
  ipHash: string;
  count: number;
  windowStart: Timestamp;
}

// ─── Activity Feed Types ──────────────────────────────────────────────────────

export type ActivityType =
  | 'share'           // Ambassadeur a partagé une alerte
  | 'badge'           // Ambassadeur a débloqué un badge
  | 'recruit'         // Ambassadeur a recruté quelqu'un
  | 'streak'          // Ambassadeur a atteint un milestone de streak
  | 'sighting'        // Quelqu'un a signalé une observation
  | 'retrouvaille'    // Enfant retrouvé
  | 'zone_added'      // Ambassadeur a ajouté une zone
  | 'rank_up';        // Ambassadeur a progressé dans le classement

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  ambassadorId: string;
  ambassadorName: string;         // Prénom uniquement pour privacy
  timestamp: Timestamp | Date;
  metadata?: {
    badgeId?: string;             // Si type === 'badge'
    badgeName?: string;
    badgeTier?: BadgeTier;
    recruitedCount?: number;      // Si type === 'recruit'
    streakDays?: number;          // Si type === 'streak'
    oldRank?: number;             // Si type === 'rank_up'
    newRank?: number;
    zoneId?: string;              // Si type === 'zone_added'
    zoneName?: string;
    announcementCode?: string;    // Si type === 'share' | 'sighting' | 'retrouvaille'
  };
}

// ─── Mission Control Types ────────────────────────────────────────────────────

export interface MissionMetrics {
  // Performance metrics
  totalImpactScore: number;         // Score global d'impact
  impactVelocity: number;           // Points/jour moyenne dernière semaine
  peakHour: number;                 // Heure de pic d'activité (0-23)
  consistency: number;              // % de jours actifs sur 30 jours

  // Engagement breakdown
  shareRate: number;                // Partages/annonce moyenne
  viewsPerShare: number;            // Vues générées par partage
  conversionRate: number;           // % partages qui génèrent vues
  viralityScore: number;            // Coefficient de viralité (0-100)

  // Network metrics
  directRecruits: number;           // Recrutements directs
  networkSize: number;              // Taille réseau (recruits + leurs recruits)
  networkImpact: number;            // Impact total réseau
  influenceScore: number;           // Score d'influence (0-100)

  // Zone coverage
  zoneReach: number;                // Population totale zones couvertes
  zoneActivity: number;             // Score activité moyenne zones
  zoneRank: number;                 // Rang dans chaque zone (moyenne)

  // Historical data (7 days)
  dailyScores: number[];            // Scores quotidiens [J-6, J-5, ..., J]
  dailyShares: number[];            // Partages quotidiens
  dailyViews: number[];             // Vues quotidiennes
}

export interface MissionGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  metric: 'shares' | 'views' | 'recruits' | 'score';
  target: number;
  current: number;
  deadline: Date;
  reward?: string;                  // Badge ou bonus points
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface SubmitApplicationResult {
  success: boolean;
  refCode?: string;
  error?: "duplicate_pending" | "duplicate_approved" | "duplicate_rejected" | "rate_limited" | "invalid_zone" | "too_young" | "honeypot_triggered" | "unknown";
  existingAmbassadorId?: string;
}

export interface ApproveAmbassadorResult {
  success: boolean;
  accessToken?: string;
  dashboardUrl?: string;
  error?: string;
}
