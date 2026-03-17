import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { defineString, defineSecret } from "firebase-functions/params";

// Initialize Firebase Admin
initializeApp();

export const db = getFirestore();
export const storage = getStorage();

// Configuration parameters (Firebase Remote Config)
export const FACEBOOK_PAGE_ID = defineString("FACEBOOK_PAGE_ID", {
  description: "Facebook Page ID for posting announcements",
  default: "",
});

export const ONESIGNAL_APP_ID = defineString("ONESIGNAL_APP_ID", {
  description: "OneSignal App ID for push notifications",
  default: "",
});

export const BASE_URL = defineString("BASE_URL", {
  description: "Base URL for the website",
  default: "https://enfantdisparu.bf",
});

// Secrets (Firebase Secret Manager)
export const FACEBOOK_PAGE_TOKEN = defineSecret("FACEBOOK_PAGE_TOKEN");
export const WHATSAPP_PHONE_NUMBER_ID = defineSecret("WHATSAPP_PHONE_NUMBER_ID");
export const WHATSAPP_API_TOKEN = defineSecret("WHATSAPP_API_TOKEN");
export const ONESIGNAL_API_KEY = defineSecret("ONESIGNAL_API_KEY");

// Constants
export const COLLECTIONS = {
  ANNOUNCEMENTS: "announcements",
  ZONES: "zones",
  SIGHTINGS: "sightings",
  PUSH_SUBSCRIBERS: "push_subscribers",
  GLOBAL_STATS: "global_stats",
  VIGIES: "vigies",
} as const;

// Reminder schedule (in hours)
export const REMINDER_SCHEDULE = {
  FIRST: 24, // 24h après création
  SECOND: 72, // 72h (3 jours)
  THIRD: 168, // 7 jours
  FINAL: 720, // 30 jours - avertissement archivage
} as const;

// WhatsApp message templates
export const WHATSAPP_TEMPLATES = {
  NEW_ANNOUNCEMENT: "enfant_disparu_nouvelle_alerte",
  REMINDER_24H: "enfant_disparu_rappel_24h",
  REMINDER_72H: "enfant_disparu_rappel_72h",
  REMINDER_7J: "enfant_disparu_rappel_7j",
  REMINDER_30J: "enfant_disparu_archivage",
  RESOLUTION: "enfant_disparu_retrouve",
  SIGHTING_NOTIFICATION: "enfant_disparu_signalement",
  ALERT_SUBSCRIBER_RESOLUTION: "enfant_disparu_abonne_retrouve",
} as const;
