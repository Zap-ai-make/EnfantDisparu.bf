export type AnnouncementStatus = "active" | "resolved" | "archived";
export type AnnouncementType = "missing" | "found"; // missing = enfant disparu, found = enfant trouvé
export type ChildGender = "M" | "F";

// ─── Diffusion Timeline Types ─────────────────────────────────────────────────

export type DiffusionChannel = 'facebook' | 'instagram' | 'whatsapp' | 'twitter' | 'linkedin' | 'push' | 'tiktok';
export type DiffusionStatus = 'pending' | 'success' | 'failed';

export interface DiffusionEvent {
  channel: DiffusionChannel;
  status: DiffusionStatus;
  timestamp: Date;
  details?: string; // Ex: "Post ID: 123456", "Error: Rate limit"
  reach?: number; // Portée initiale si disponible
  postId?: string; // ID du post sur la plateforme
  error?: string; // Message d'erreur si échec
}

export interface AnnouncementStats {
  facebookPostId: string | null;
  facebookReach: number;    // Vues du post Facebook
  facebookLikes: number;    // Likes / réactions Facebook
  facebookShares: number;   // Partages Facebook
  facebookClicks: number;   // Clics vers le site
  // Instagram
  instagramPostId?: string | null;
  instagramReach?: number;   // Vues du post Instagram
  instagramLikes?: number;   // Likes Instagram
  instagramShares?: number;  // Partages Instagram
  instagramComments?: number; // Commentaires Instagram
  // Twitter/X
  twitterPostId?: string | null;
  twitterImpressions?: number; // Vues du tweet
  twitterLikes?: number;      // Likes Twitter
  twitterRetweets?: number;   // Retweets
  twitterReplies?: number;    // Réponses
  // WhatsApp
  whatsappChannelReach: number; // Abonnés de la chaîne WhatsApp qui ont vu l'annonce
  whatsappSent: number;     // Messages WA envoyés (lien gestion au parent)
  whatsappDelivered: number;
  whatsappRead: number;
  // Push notifications
  pushSent: number;         // Notifications OneSignal envoyées aux abonnés du secteur
  pushClicked: number;
  // Page analytics
  pageViews: number;
  alertSubscribers: number; // Personnes abonnées aux alertes de cette annonce
  // TikTok
  tiktokVideoId: string | null;
  tiktokViews: number;
  tiktokLikes: number;
  tiktokShares: number;
  tiktokComments: number;
  // Diffusion timeline
  diffusionTimeline?: DiffusionEvent[]; // Historique de diffusion sur chaque canal
}

export interface Announcement {
  id: string;
  shortCode: string;
  secretToken: string;
  createdAt: Date;
  updatedAt: Date;
  status: AnnouncementStatus;
  type: AnnouncementType; // "missing" = enfant disparu, "found" = enfant trouvé par quelqu'un

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
  lastSeenAt: Date;

  // Contact (jamais affiché publiquement)
  parentPhone: string;
  parentPhoneDisplay: string;

  // Lien SecureID
  isSecureID: boolean;
  linkedProfileId: string | null;
  linkedBraceletId: string | null;
  lastGpsLat: number | null;
  lastGpsLng: number | null;

  // Stats
  stats: AnnouncementStats;

  // Suivi automatique
  remindersSent: number;
  nextReminderAt: Date | null;

  // Clôture
  resolvedAt: Date | null;

  // Image d'alerte générée
  alertCardURL: string | null;
}

export interface Zone {
  id: string;
  name: string;           // Quartier : "Pissy"
  city: string;           // Ville : "Ouagadougou"
  countryCode: string;    // ISO-3 : "BFA"
  countryName: string;    // "Burkina Faso"
  oneSignalTag: string;   // "zone_bfa_ouaga_pissy"
  activeAnnouncements?: number;
}

export interface Sighting {
  id: string;
  announcementId: string;
  createdAt: Date;
  place: string;
  description: string;
  reporterPhone?: string;
  anonymous: boolean;
  status: "pending" | "reviewed" | "confirmed" | "dismissed";
}

// Formulaire de création (données brutes avant traitement)
export interface CreateAnnouncementInput {
  childName: string;
  childAge: number;
  childGender: ChildGender;
  childPhoto: File;
  description: string;
  distinctiveSign: string;
  zoneId: string;
  zoneName?: string; // Optionnel : surcharge le nom auto-calculé (pour zones "autres")
  lastSeenPlace: string;
  lastSeenAt: string; // ISO string du datetime-local input
  parentPhone: string;
}

// ─── Global Platform Stats ────────────────────────────────────────────────────

export interface GlobalStats {
  // Core metrics
  totalAnnouncements: number;       // Total d'annonces créées
  activeAnnouncements: number;      // Annonces en cours (active)
  resolvedAnnouncements: number;    // Annonces résolues (retrouvés)
  totalAmbassadors: number;         // Nombre d'ambassadeurs actifs

  // Engagement metrics
  totalShares: number;              // Total de partages (tous canaux)
  totalViews: number;               // Total de vues (tous canaux)
  totalPushSent: number;            // Total notifications envoyées
  totalSightings: number;           // Total d'observations signalées

  // Success rate
  resolutionRate: number;           // % d'annonces résolues
  avgResolutionTime: number;        // Temps moyen de résolution (heures)

  // Real-time velocity
  last24hAnnouncements: number;     // Nouvelles annonces dernières 24h
  last24hShares: number;            // Partages dernières 24h
  last24hViews: number;             // Vues dernières 24h

  // Timestamp
  lastUpdated: Date;                // Dernière mise à jour des stats
}
