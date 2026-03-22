/**
 * Cloud Functions pour EnfantDisparu.bf
 *
 * VERSION SIMPLIFIÉE - Sans secrets externes
 *
 * Functions actives:
 * - onAnnouncementCreate: Génère l'affiche d'alerte
 * - regenerateAlertCard: Régénère une carte d'alerte
 * - healthCheck: Vérifie l'état des services
 *
 * Functions désactivées (secrets non configurés):
 * - onAnnouncementUpdate
 * - onSightingCreate
 * - scheduledReminders
 * - scheduledArchival
 * - syncFacebookStats
 * - secureIdAlert
 */

// Configuration (initialise Firebase Admin)
import "./config";

// Trigger Firestore (version simplifiée - sans secrets)
export { onAnnouncementCreate } from "./triggers/onAnnouncementCreate";

// Endpoints HTTP
export { regenerateAlertCard } from "./http/regenerateAlertCard";
export { healthCheck } from "./http/healthCheck";
export { postToTikTok } from "./http/postToTikTok";

// Programme Ambassadeur
export { oneSignalWebhook } from "./http/oneSignalWebhook";
export { submitAmbassadorApplication } from "./http/submitAmbassadorApplication";

// Temporairement désactivé - secrets non configurés
// export { onAnnouncementUpdate } from "./triggers/onAnnouncementUpdate";
// export { onSightingCreate } from "./triggers/onSightingCreate";
// export { scheduledReminders, scheduledArchival } from "./scheduled/reminders";
// export { syncFacebookStats } from "./scheduled/facebookSync";
// export { secureIdAlert } from "./http/secureIdAlert";
