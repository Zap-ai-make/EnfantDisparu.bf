/**
 * Cloud Functions pour EnfantDisparu.bf
 *
 * Functions actives:
 * - onAnnouncementCreate: Génère l'affiche d'alerte + post Facebook
 * - onAnnouncementUpdate: Gère résolution (enfant retrouvé) + post Facebook
 * - regenerateAlertCard: Régénère une carte d'alerte
 * - healthCheck: Vérifie l'état des services
 * - postToTikTok: Publie sur TikTok
 *
 * Functions désactivées:
 * - onSightingCreate
 * - scheduledReminders
 * - scheduledArchival
 * - syncFacebookStats
 * - secureIdAlert
 */

// Configuration (initialise Firebase Admin)
import "./config";

// Triggers Firestore
export { onAnnouncementCreate } from "./triggers/onAnnouncementCreate";
export { onAnnouncementUpdate } from "./triggers/onAnnouncementUpdate";

// Endpoints HTTP
export { regenerateAlertCard } from "./http/regenerateAlertCard";
export { healthCheck } from "./http/healthCheck";
export { postToTikTok } from "./http/postToTikTok";

// Programme Ambassadeur
export { oneSignalWebhook } from "./http/oneSignalWebhook";
export { submitAmbassadorApplication } from "./http/submitAmbassadorApplication";

// Temporairement désactivé
// export { onSightingCreate } from "./triggers/onSightingCreate";
// export { scheduledReminders, scheduledArchival } from "./scheduled/reminders";
// export { syncFacebookStats } from "./scheduled/facebookSync";
// export { secureIdAlert } from "./http/secureIdAlert";
