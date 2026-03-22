import { Timestamp } from "firebase/firestore";

// ─── Ambassador Types ─────────────────────────────────────────────────────────

export interface AmbassadorStats {
  notificationsActivated: number;
  alertsShared: number;
  ambassadorsRecruited: number;
  viewsGenerated: number;
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
