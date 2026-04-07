/**
 * Module principal Firestore - Réexporte toutes les fonctions des sous-modules
 * Pour maintenir la compatibilité avec le code existant
 */

// ─── Utilitaires ─────────────────────────────────────────────────────────────
export { maskPhone, getDefaultStats } from "./utils";

// ─── Annonces ────────────────────────────────────────────────────────────────
export {
  uploadAnnouncementPhoto,
  createAnnouncement,
  createFoundChildAnnouncement,
  getAnnouncementByShortCode,
  getAnnouncementByToken,
  subscribeToActiveAnnouncements,
  subscribeToFilteredAnnouncements,
  subscribeToAnnouncement,
  resolveAnnouncement,
  updateAnnouncement,
  getAnnouncementsByPhone,
  subscribeToAlertUpdates,
  getResolvedAnnouncements,
  subscribeToZoneAnnouncements,
  registerVigie,
  getVigiesByZone,
  getVigieCount,
  type CreateFoundChildInput,
  type Vigie,
  type RegisterVigieInput,
} from "./announcements";

// ─── Ambassadeurs ────────────────────────────────────────────────────────────
export {
  submitAmbassadorApplication,
  getAmbassadorByPhone,
  getAmbassadorByRefCode,
  getAmbassadorByAccessToken,
  approveAmbassador,
  rejectAmbassador,
  addZoneToAmbassador,
  regenerateAccessToken,
  incrementAmbassadorStat,
  getAmbassadorCount,
  getAmbassadorsByStatus,
  getAmbassadorLeaderboard,
  calculateAmbassadorScore,
  getAmbassadorRank,
  getAmbassadorGlobalStats,
  type AmbassadorGlobalStats,
} from "./ambassadors";

// ─── Signalements ────────────────────────────────────────────────────────────
export {
  createSighting,
  subscribeToSightings,
  getSightingsForAnnouncement,
} from "./sightings";

// ─── Statistiques ────────────────────────────────────────────────────────────
export {
  getGlobalStats,
  incrementPageViews,
} from "./stats";

// ─── Zones personnalisées ────────────────────────────────────────────────────
export {
  saveCustomZone,
  getCustomZones,
  getCustomZonesByCountry,
  type CustomZone,
} from "./zones";
