import { logger } from "firebase-functions";
import { AnnouncementDoc } from "../types";
import {
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_API_TOKEN,
  WHATSAPP_TEMPLATES,
  BASE_URL,
} from "../config";
import { fetchWithRetry } from "../utils/http";

const WHATSAPP_API_BASE = "https://graph.facebook.com/v19.0";
const WHATSAPP_TIMEOUT_MS = 15000; // 15 secondes

interface WhatsAppMessageResponse {
  messaging_product: string;
  contacts: Array<{ wa_id: string }>;
  messages: Array<{ id: string }>;
}

/**
 * Envoie un message WhatsApp template
 */
async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  components: Array<{
    type: string;
    parameters: Array<{ type: string; text?: string; image?: { link: string } }>;
  }>
): Promise<string | null> {
  const phoneNumberId = WHATSAPP_PHONE_NUMBER_ID.value();
  const apiToken = WHATSAPP_API_TOKEN.value();

  if (!phoneNumberId || !apiToken) {
    logger.warn("WhatsApp credentials not configured, skipping message");
    return null;
  }

  // Normaliser le numéro (retirer le + et espaces)
  const normalizedTo = to.replace(/[\s+\-]/g, "");

  try {
    const response = await fetchWithRetry(`${WHATSAPP_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalizedTo,
        type: "template",
        template: {
          name: templateName,
          language: { code: "fr" },
          components,
        },
      }),
      timeoutMs: WHATSAPP_TIMEOUT_MS,
      maxRetries: 2,
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error("WhatsApp message failed", { error, status: response.status, to });
      return null;
    }

    const data = (await response.json()) as WhatsAppMessageResponse;
    logger.info("WhatsApp message sent", { messageId: data.messages[0]?.id, to });
    return data.messages[0]?.id ?? null;
  } catch (error) {
    logger.error("WhatsApp send error", { error, to });
    return null;
  }
}

/**
 * Envoie la notification de nouvelle alerte au parent
 */
export async function sendNewAnnouncementToParent(
  announcement: AnnouncementDoc,
  docId: string
): Promise<string | null> {
  const managementUrl = `${BASE_URL.value()}/gestion/${announcement.secretToken}`;
  const publicUrl = `${BASE_URL.value()}/annonce/${announcement.shortCode}`;

  return sendWhatsAppTemplate(announcement.parentPhone, WHATSAPP_TEMPLATES.NEW_ANNOUNCEMENT, [
    {
      type: "header",
      parameters: announcement.alertCardURL
        ? [{ type: "image", image: { link: announcement.alertCardURL } }]
        : [],
    },
    {
      type: "body",
      parameters: [
        { type: "text", text: announcement.childName },
        { type: "text", text: announcement.shortCode },
        { type: "text", text: publicUrl },
        { type: "text", text: managementUrl },
      ],
    },
  ]);
}

/**
 * Envoie un rappel au parent
 */
export async function sendReminderToParent(
  announcement: AnnouncementDoc,
  reminderType: "24h" | "72h" | "7j" | "30j"
): Promise<string | null> {
  const managementUrl = `${BASE_URL.value()}/gestion/${announcement.secretToken}`;

  const templateMap = {
    "24h": WHATSAPP_TEMPLATES.REMINDER_24H,
    "72h": WHATSAPP_TEMPLATES.REMINDER_72H,
    "7j": WHATSAPP_TEMPLATES.REMINDER_7J,
    "30j": WHATSAPP_TEMPLATES.REMINDER_30J,
  };

  const messageMap = {
    "24h": "24 heures se sont écoulées depuis votre signalement.",
    "72h": "3 jours de recherche. L'alerte reste active.",
    "7j": "7 jours de recherche intensive. Gardez espoir!",
    "30j": "30 jours. L'annonce sera archivée dans 48h si aucune action.",
  };

  return sendWhatsAppTemplate(announcement.parentPhone, templateMap[reminderType], [
    {
      type: "body",
      parameters: [
        { type: "text", text: announcement.childName },
        { type: "text", text: messageMap[reminderType] },
        { type: "text", text: managementUrl },
      ],
    },
  ]);
}

/**
 * Envoie la notification de résolution au parent
 */
export async function sendResolutionToParent(announcement: AnnouncementDoc): Promise<string | null> {
  return sendWhatsAppTemplate(announcement.parentPhone, WHATSAPP_TEMPLATES.RESOLUTION, [
    {
      type: "body",
      parameters: [
        { type: "text", text: announcement.childName },
        { type: "text", text: "Merci d'avoir utilisé EnfentDisparu.bf!" },
      ],
    },
  ]);
}

/**
 * Notifie un abonné "M'alerter si retrouvé" que l'enfant a été retrouvé
 */
export async function sendAlertSubscriberResolution(
  phone: string,
  childName: string
): Promise<string | null> {
  return sendWhatsAppTemplate(phone, WHATSAPP_TEMPLATES.ALERT_SUBSCRIBER_RESOLUTION, [
    {
      type: "body",
      parameters: [{ type: "text", text: childName }],
    },
  ]);
}

/**
 * Notifie les abonnés d'alerte d'un nouveau signalement
 */
export async function notifySightingToParent(
  announcement: AnnouncementDoc,
  sightingPlace: string,
  sightingDescription: string
): Promise<string | null> {
  const managementUrl = `${BASE_URL.value()}/gestion/${announcement.secretToken}`;

  return sendWhatsAppTemplate(announcement.parentPhone, WHATSAPP_TEMPLATES.SIGHTING_NOTIFICATION, [
    {
      type: "body",
      parameters: [
        { type: "text", text: announcement.childName },
        { type: "text", text: sightingPlace },
        { type: "text", text: sightingDescription.substring(0, 100) },
        { type: "text", text: managementUrl },
      ],
    },
  ]);
}

/**
 * Envoie une notification de cross-match (correspondance potentielle)
 * Utilisé quand un enfant "trouvé" correspond potentiellement à un "disparu" et vice versa
 */
export async function sendCrossMatchNotification(
  recipientAnnouncement: AnnouncementDoc,
  newAnnouncement: AnnouncementDoc,
  newDocId: string
): Promise<boolean> {
  const baseUrl = BASE_URL.value() || "https://enfentdisparu.bf";
  const newAnnouncementUrl = `${baseUrl}/annonce/${newAnnouncement.shortCode}`;

  // Pour l'instant, on envoie un message texte simple
  // Plus tard, on pourra créer un template WhatsApp dédié
  const phoneNumberId = WHATSAPP_PHONE_NUMBER_ID.value();
  const apiToken = WHATSAPP_API_TOKEN.value();

  if (!phoneNumberId || !apiToken) {
    logger.warn("WhatsApp credentials not configured, skipping cross-match notification");
    return false;
  }

  const normalizedTo = recipientAnnouncement.parentPhone.replace(/[\s+\-]/g, "");

  // Construire le message selon le type
  let message: string;

  if (newAnnouncement.type === "found") {
    // Le destinataire a signalé un enfant disparu, on lui dit qu'un enfant a été trouvé
    message = `🔔 *CORRESPONDANCE POSSIBLE*

Un enfant vient d'être trouvé à *${newAnnouncement.zoneName}* !

📍 Lieu: ${newAnnouncement.lastSeenPlace}
👤 ${newAnnouncement.childAge} ans, ${newAnnouncement.childGender === "M" ? "Garçon" : "Fille"}

⚠️ *Vérifiez si cela pourrait être ${recipientAnnouncement.childName} :*
🔗 ${newAnnouncementUrl}

_Si ce n'est pas votre enfant, ignorez ce message. Nous continuons les recherches._

— EnfentDisparu.bf`;
  } else {
    // Le destinataire a trouvé un enfant, on lui dit qu'un parent cherche son enfant
    message = `🔔 *CORRESPONDANCE POSSIBLE*

Un parent recherche son enfant à *${newAnnouncement.zoneName}* !

👤 *${newAnnouncement.childName}*, ${newAnnouncement.childAge} ans
📍 Disparu à: ${newAnnouncement.lastSeenPlace}

⚠️ *Comparez avec l'enfant que vous avez trouvé :*
🔗 ${newAnnouncementUrl}

_Si cela correspond, contactez immédiatement le parent via l'annonce._

— EnfentDisparu.bf`;
  }

  try {
    const response = await fetchWithRetry(`${WHATSAPP_API_BASE}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalizedTo,
        type: "text",
        text: { body: message },
      }),
      timeoutMs: WHATSAPP_TIMEOUT_MS,
      maxRetries: 2,
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error("Cross-match WhatsApp notification failed", {
        error,
        status: response.status,
        to: normalizedTo,
      });
      return false;
    }

    logger.info("Cross-match notification sent", {
      to: normalizedTo,
      newAnnouncementType: newAnnouncement.type,
      recipientShortCode: recipientAnnouncement.shortCode,
    });

    return true;
  } catch (error) {
    logger.error("Cross-match notification error", { error });
    return false;
  }
}
