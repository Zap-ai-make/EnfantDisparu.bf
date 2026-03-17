import { logger } from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db, COLLECTIONS, BASE_URL, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_API_TOKEN } from "../config";
import { AnnouncementDoc } from "../types";
import { fetchWithTimeout } from "../utils/http";

const WHATSAPP_API_BASE = "https://graph.facebook.com/v19.0";
const WHATSAPP_TIMEOUT_MS = 10000; // 10 secondes (plus court pour envois en masse)

interface Vigie {
  id: string;
  name: string;
  phone: string;
  zoneId: string;
  status: string;
}

/**
 * Notifie les vigies d'une zone qu'une nouvelle alerte a été créée
 */
export async function notifyZoneVigies(
  announcement: AnnouncementDoc,
  docId: string
): Promise<{ notified: number; total: number }> {
  // Récupérer les vigies de la zone
  const vigiesSnapshot = await db
    .collection(COLLECTIONS.VIGIES)
    .where("zoneId", "==", announcement.zoneId)
    .where("status", "==", "active")
    .get();

  if (vigiesSnapshot.empty) {
    logger.info("No vigies found for zone", { zoneId: announcement.zoneId });
    return { notified: 0, total: 0 };
  }

  const vigies = vigiesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Vigie[];

  // Aussi récupérer les vigies des zones voisines (même ville)
  // On extrait le préfixe de la zone pour trouver les zones similaires
  const zoneParts = announcement.zoneId.split("-");
  const zonePrefix = zoneParts.slice(0, 2).join("-"); // ex: "bfa-ouaga"

  // Limiter la requête pour éviter de charger tous les vigies en mémoire
  const nearbyVigiesSnapshot = await db
    .collection(COLLECTIONS.VIGIES)
    .where("status", "==", "active")
    .limit(200) // Max 200 vigies pour filtrage
    .get();

  // Filtrer les vigies des zones voisines (même ville)
  const nearbyVigies = nearbyVigiesSnapshot.docs
    .filter((doc) => {
      const v = doc.data();
      // Même préfixe de zone, mais pas la même zone exacte
      return (
        v.zoneId !== announcement.zoneId &&
        v.zoneId.startsWith(zonePrefix)
      );
    })
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vigie[];

  // Combiner (sans doublons) et limiter
  const allVigies = [
    ...vigies,
    ...nearbyVigies.filter((nv) => !vigies.some((v) => v.phone === nv.phone)),
  ].slice(0, 50); // Max 50 vigies par alerte

  logger.info("Notifying vigies", {
    zoneVigies: vigies.length,
    nearbyVigies: nearbyVigies.length,
    total: allVigies.length,
  });

  // Envoyer les notifications WhatsApp
  const phoneNumberId = WHATSAPP_PHONE_NUMBER_ID.value();
  const apiToken = WHATSAPP_API_TOKEN.value();

  if (!phoneNumberId || !apiToken) {
    logger.warn("WhatsApp credentials not configured, skipping vigie notifications");
    return { notified: 0, total: allVigies.length };
  }

  const baseUrl = BASE_URL.value() || "https://enfantdisparu.bf";
  const announcementUrl = `${baseUrl}/annonce/${announcement.shortCode}`;

  // Construire le message selon le type d'annonce
  const isFound = announcement.type === "found";
  const emoji = isFound ? "🙋" : "🚨";
  const title = isFound ? "ENFANT TROUVÉ" : "ENFANT DISPARU";
  const actionText = isFound
    ? "Si vous connaissez ses parents, contactez-les immédiatement."
    : "Surveillez votre quartier et partagez cette alerte !";

  const message = `${emoji} *ALERTE VIGIE — ${title}*

👤 *${announcement.childName}*, ${announcement.childAge} ans (${announcement.childGender === "M" ? "Garçon" : "Fille"})
📍 ${announcement.lastSeenPlace}
🗺️ Zone: ${announcement.zoneName}

${announcement.description ? `📝 ${announcement.description.substring(0, 150)}${announcement.description.length > 150 ? "..." : ""}` : ""}

${actionText}

👉 *Voir l'alerte complète :*
🔗 ${announcementUrl}

_Vous recevez ce message car vous êtes vigie dans cette zone._
— EnfantDisparu.bf`;

  let notified = 0;

  // Envoyer en parallèle (par lots de 10 pour éviter le rate limiting)
  const batchSize = 10;
  const successfulVigieIds: string[] = [];

  for (let i = 0; i < allVigies.length; i += batchSize) {
    const vigieBatch = allVigies.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      vigieBatch.map((vigie) => sendWhatsAppToVigie(vigie.phone, message, phoneNumberId, apiToken))
    );

    // Compter les succès et collecter les IDs
    results.forEach((result, idx) => {
      if (result.status === "fulfilled" && result.value) {
        notified++;
        successfulVigieIds.push(vigieBatch[idx].id);
      }
    });
  }

  // Batch update pour tous les vigies notifiés avec succès (évite N+1)
  if (successfulVigieIds.length > 0) {
    const writeBatch = db.batch();
    successfulVigieIds.forEach((vigieId) => {
      const vigieRef = db.collection(COLLECTIONS.VIGIES).doc(vigieId);
      writeBatch.update(vigieRef, {
        alertsReceived: FieldValue.increment(1),
      });
    });
    await writeBatch.commit();
  }

  logger.info("Vigie notifications complete", {
    notified,
    total: allVigies.length,
    docId,
  });

  return { notified, total: allVigies.length };
}

/**
 * Envoie un message WhatsApp à une vigie
 */
async function sendWhatsAppToVigie(
  phone: string,
  message: string,
  phoneNumberId: string,
  apiToken: string
): Promise<boolean> {
  const normalizedTo = phone.replace(/[\s+\-]/g, "");

  try {
    const response = await fetchWithTimeout(`${WHATSAPP_API_BASE}/${phoneNumberId}/messages`, {
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
    });

    if (!response.ok) {
      const error = await response.text();
      logger.warn("Vigie WhatsApp notification failed", {
        error,
        status: response.status,
        to: normalizedTo,
      });
      return false;
    }

    return true;
  } catch (error) {
    logger.error("Vigie WhatsApp send error", { error, to: normalizedTo });
    return false;
  }
}
