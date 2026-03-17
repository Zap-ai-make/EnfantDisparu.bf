import { Timestamp } from "firebase-admin/firestore";

export type AnnouncementStatus = "active" | "resolved" | "archived";
export type AnnouncementType = "missing" | "found"; // missing = enfant disparu, found = enfant trouvé
export type ChildGender = "M" | "F";

export interface AnnouncementStats {
  facebookPostId: string | null;
  facebookReach: number;
  facebookLikes: number;
  facebookShares: number;
  facebookClicks: number;
  whatsappChannelReach: number;
  whatsappSent: number;
  whatsappDelivered: number;
  whatsappRead: number;
  pushSent: number;
  pushClicked: number;
  pageViews: number;
  alertSubscribers: number;
  // TikTok
  tiktokVideoId?: string | null;
  tiktokViews?: number;
  tiktokLikes?: number;
  tiktokShares?: number;
  tiktokComments?: number;
}

export interface AnnouncementDoc {
  shortCode: string;
  secretToken: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: AnnouncementStatus;
  type: AnnouncementType; // "missing" = enfant disparu, "found" = enfant trouvé

  // Enfant
  childName: string;
  childAge: number;
  childGender: ChildGender;
  childPhotoURL: string;
  description: string;
  distinctiveSign: string;

  // Localisation
  zoneId: string;
  zoneName: string;
  lastSeenPlace: string;
  lastSeenAt: Timestamp;

  // Contact
  parentPhone: string;
  parentPhoneDisplay: string;

  // SecureID
  isSecureID: boolean;
  linkedProfileId: string | null;
  linkedBraceletId: string | null;
  lastGpsLat: number | null;
  lastGpsLng: number | null;

  // Stats
  stats: AnnouncementStats;

  // Suivi automatique
  remindersSent: number;
  nextReminderAt: Timestamp | null;

  // Clôture
  resolvedAt: Timestamp | null;

  // Image d'alerte générée
  alertCardURL: string | null;
}

export interface ZoneDoc {
  name: string;
  city: string;
  country: string;
  activeAnnouncements: number;
}

export interface SightingDoc {
  announcementId: string;
  createdAt: Timestamp;
  place: string;
  description: string;
  reporterPhone?: string;
  anonymous: boolean;
  status: "pending" | "reviewed" | "confirmed" | "dismissed";
}

export interface PushSubscriberDoc {
  playerId: string;
  zoneId: string;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
}

// Configuration from Firebase Remote Config / Secret Manager
export interface AppConfig {
  facebookPageId: string;
  facebookPageToken: string;
  whatsappPhoneNumberId: string;
  whatsappApiToken: string;
  onesignalAppId: string;
  onesignalApiKey: string;
  baseUrl: string;
}
