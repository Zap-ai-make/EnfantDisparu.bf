import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

const db = admin.firestore();

interface OneSignalWebhookPayload {
  event: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * Vérifie la signature HMAC-SHA256 du webhook OneSignal
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Incrémente la stat notificationsActivated pour un ambassadeur
 */
async function incrementAmbassadorStat(refCode: string): Promise<boolean> {
  const ambassadorsRef = db.collection("ambassadors");
  const query = ambassadorsRef.where("refCode", "==", refCode).limit(1);
  const snapshot = await query.get();

  if (snapshot.empty) {
    console.log(`Ambassador not found for refCode: ${refCode}`);
    return false;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();

  if (data.status !== "approved") {
    console.log(`Ambassador ${refCode} is not approved`);
    return false;
  }

  await doc.ref.update({
    "stats.notificationsActivated": admin.firestore.FieldValue.increment(1),
  });

  console.log(`Incremented notificationsActivated for ambassador ${refCode}`);
  return true;
}

/**
 * Webhook pour recevoir les events OneSignal
 *
 * Events supportés:
 * - notification.subscription.created: Un nouvel utilisateur s'est abonné aux notifications
 */
export const oneSignalWebhook = functions.https.onRequest(async (req, res) => {
  // Vérifier la méthode
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Récupérer le secret
  const secret = process.env.ONESIGNAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("ONESIGNAL_WEBHOOK_SECRET not configured");
    res.status(500).send("Server configuration error");
    return;
  }

  // Vérifier la signature
  const signature = req.headers["x-onesignal-signature"] as string;
  if (!signature) {
    console.warn("Missing OneSignal signature header");
    res.status(401).send("Unauthorized - Missing signature");
    return;
  }

  const rawBody = JSON.stringify(req.body);
  try {
    if (!verifySignature(rawBody, signature, secret)) {
      console.warn("Invalid OneSignal signature");
      res.status(401).send("Unauthorized - Invalid signature");
      return;
    }
  } catch (error) {
    console.error("Signature verification error:", error);
    res.status(401).send("Unauthorized - Signature verification failed");
    return;
  }

  // Parser le payload
  const payload: OneSignalWebhookPayload = req.body;

  console.log(`Received OneSignal webhook event: ${payload.event}`);

  // Traiter l'event
  try {
    if (payload.event === "notification.subscription.created") {
      // Vérifier si un tag ambassador_ref est présent
      const tags = payload.data?.tags || {};
      const ambassadorRef = tags.ambassador_ref;

      if (ambassadorRef && typeof ambassadorRef === "string") {
        // Valider le format AMB-XXXX
        if (/^AMB-[A-Z0-9]{4}$/.test(ambassadorRef)) {
          await incrementAmbassadorStat(ambassadorRef);
        } else {
          console.log(`Invalid ambassador_ref format: ${ambassadorRef}`);
        }
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});
