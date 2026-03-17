import { logger } from "firebase-functions";
import { AnnouncementDoc } from "../types";
import { ONESIGNAL_APP_ID, ONESIGNAL_API_KEY, BASE_URL } from "../config";
import { fetchWithRetry } from "../utils/http";

const ONESIGNAL_API_BASE = "https://onesignal.com/api/v1";
const ONESIGNAL_TIMEOUT_MS = 15000; // 15 secondes

interface OneSignalNotificationResponse {
  id: string;
  recipients: number;
}

/**
 * Envoie une notification push aux abonnés d'une zone
 */
export async function sendZonePushNotification(
  announcement: AnnouncementDoc,
  docId: string
): Promise<{ notificationId: string; recipients: number } | null> {
  const appId = ONESIGNAL_APP_ID.value();
  const apiKey = ONESIGNAL_API_KEY.value();

  if (!appId || !apiKey) {
    logger.warn("OneSignal credentials not configured, skipping push notification");
    return null;
  }

  const announcementUrl = `${BASE_URL.value()}/annonce/${announcement.shortCode}`;

  try {
    const response = await fetchWithRetry(`${ONESIGNAL_API_BASE}/notifications`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: appId,
        // Cibler par tag de zone
        filters: [{ field: "tag", key: "zone", relation: "=", value: announcement.zoneId }],
        headings: { fr: `🚨 Enfant disparu - ${announcement.zoneName}` },
        contents: {
          fr: `${announcement.childName}, ${announcement.childAge} ans. Dernière fois vu(e): ${announcement.lastSeenPlace}. Aidez-nous!`,
        },
        url: announcementUrl,
        chrome_web_image: announcement.alertCardURL ?? announcement.childPhotoURL,
        big_picture: announcement.alertCardURL ?? announcement.childPhotoURL,
        ios_attachments: announcement.alertCardURL
          ? { image: announcement.alertCardURL }
          : undefined,
        data: {
          announcementId: docId,
          shortCode: announcement.shortCode,
          type: "new_announcement",
        },
        // Android specific
        android_channel_id: "enfant_perdu_alerts",
        priority: 10,
        // iOS specific
        ios_sound: "alert.wav",
        // TTL: 24h
        ttl: 86400,
      }),
      timeoutMs: ONESIGNAL_TIMEOUT_MS,
      maxRetries: 2,
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error("OneSignal notification failed", { error, status: response.status });
      return null;
    }

    const data = (await response.json()) as OneSignalNotificationResponse;
    logger.info("OneSignal notification sent", {
      notificationId: data.id,
      recipients: data.recipients,
      docId,
    });
    return { notificationId: data.id, recipients: data.recipients };
  } catch (error) {
    logger.error("OneSignal send error", { error, docId });
    return null;
  }
}

/**
 * Envoie une notification de résolution aux abonnés de l'alerte
 */
export async function sendResolutionPushNotification(
  announcement: AnnouncementDoc,
  docId: string
): Promise<{ notificationId: string; recipients: number } | null> {
  const appId = ONESIGNAL_APP_ID.value();
  const apiKey = ONESIGNAL_API_KEY.value();

  if (!appId || !apiKey) {
    logger.warn("OneSignal credentials not configured, skipping resolution notification");
    return null;
  }

  try {
    const response = await fetchWithRetry(`${ONESIGNAL_API_BASE}/notifications`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: appId,
        // Cibler ceux qui ont l'annonce en alerte
        filters: [
          { field: "tag", key: `alert_${announcement.shortCode}`, relation: "exists" },
        ],
        headings: { fr: `🎉 Bonne nouvelle!` },
        contents: {
          fr: `${announcement.childName} a été retrouvé(e)! Merci pour votre aide.`,
        },
        data: {
          announcementId: docId,
          shortCode: announcement.shortCode,
          type: "resolution",
        },
      }),
      timeoutMs: ONESIGNAL_TIMEOUT_MS,
      maxRetries: 2,
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error("OneSignal resolution notification failed", { error });
      return null;
    }

    const data = (await response.json()) as OneSignalNotificationResponse;
    logger.info("OneSignal resolution notification sent", {
      notificationId: data.id,
      recipients: data.recipients,
      docId,
    });
    return { notificationId: data.id, recipients: data.recipients };
  } catch (error) {
    logger.error("OneSignal resolution send error", { error, docId });
    return null;
  }
}

/**
 * Annule les notifications actives pour une annonce (si possible)
 */
export async function cancelActiveNotifications(shortCode: string): Promise<void> {
  // OneSignal ne permet pas facilement d'annuler des notifications déjà envoyées
  // Cette fonction est un placeholder pour une implémentation future si nécessaire
  logger.info("Cancel notifications placeholder", { shortCode });
}
