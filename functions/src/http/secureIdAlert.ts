import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { Timestamp } from "firebase-admin/firestore";
import { randomBytes } from "crypto";
import { db, COLLECTIONS } from "../config";
import { AnnouncementDoc, AnnouncementStats } from "../types";

// Domaines autorisés pour CORS
const ALLOWED_ORIGINS = [
  "https://enfentdisparu.bf",
  "https://www.enfentdisparu.bf",
  "https://secureid.enfentdisparu.bf",
  // Localhost pour le développement
  "http://localhost:3000",
  "http://localhost:3001",
];

interface SecureIdAlertRequest {
  // Identifiants SecureID
  profileId: string;
  braceletId?: string;

  // Infos enfant (pré-remplies depuis le profil)
  childName: string;
  childAge: number;
  childGender: "M" | "F";
  childPhotoURL?: string;

  // GPS depuis le bracelet
  latitude: number;
  longitude: number;

  // Contact parent
  parentPhone: string;

  // Description optionnelle
  description?: string;
}

/**
 * Endpoint HTTP pour créer une alerte depuis l'app SecureID
 *
 * Utilisé quand:
 * - Le bracelet envoie une position GPS d'urgence
 * - Le parent déclenche une alerte depuis l'app SecureID
 *
 * Le endpoint crée une annonce qui déclenche ensuite onAnnouncementCreate
 */
export const secureIdAlert = onRequest(
  {
    region: "europe-west1",
    cors: ALLOWED_ORIGINS,
  },
  async (req, res) => {
    // Vérifier la méthode
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // Vérifier l'authentification (header API key basique)
    const apiKey = req.headers["x-api-key"];
    const expectedKey = process.env.SECUREID_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      logger.warn("Unauthorized SecureID alert attempt");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const body = req.body as SecureIdAlertRequest;

      // Validation basique
      if (
        !body.profileId ||
        !body.childName ||
        !body.parentPhone ||
        typeof body.latitude !== "number" ||
        typeof body.longitude !== "number"
      ) {
        res.status(400).json({
          error: "Missing required fields: profileId, childName, parentPhone, latitude, longitude",
        });
        return;
      }

      // Déterminer la zone depuis les coordonnées GPS
      const zone = await findZoneFromCoordinates(body.latitude, body.longitude);

      // Générer les codes
      const shortCode = await generateUniqueShortCode();
      const secretToken = generateSecretToken();

      // Masquer le numéro de téléphone
      const parentPhoneDisplay = maskPhoneNumber(body.parentPhone);

      // Créer le document d'annonce
      const now = Timestamp.now();
      const initialStats: AnnouncementStats = {
        facebookPostId: null,
        facebookReach: 0,
        facebookLikes: 0,
        facebookShares: 0,
        facebookClicks: 0,
        whatsappChannelReach: 0,
        whatsappSent: 0,
        whatsappDelivered: 0,
        whatsappRead: 0,
        pushSent: 0,
        pushClicked: 0,
        pageViews: 0,
        alertSubscribers: 0,
      };

      const announcementData: Omit<AnnouncementDoc, "alertCardURL"> & { alertCardURL: null } = {
        shortCode,
        secretToken,
        createdAt: now,
        updatedAt: now,
        status: "active",
        type: "missing", // SecureID = toujours un enfant disparu

        childName: body.childName,
        childAge: body.childAge || 0,
        childGender: body.childGender || "M",
        childPhotoURL: body.childPhotoURL || "",
        description: body.description || "Alerte déclenchée depuis SecureID",
        distinctiveSign: "",

        zoneId: zone.id,
        zoneName: zone.name,
        lastSeenPlace: `Coordonnées GPS: ${body.latitude.toFixed(4)}, ${body.longitude.toFixed(4)}`,
        lastSeenAt: now,

        parentPhone: body.parentPhone,
        parentPhoneDisplay,

        isSecureID: true,
        linkedProfileId: body.profileId,
        linkedBraceletId: body.braceletId || null,
        lastGpsLat: body.latitude,
        lastGpsLng: body.longitude,

        stats: initialStats,
        remindersSent: 0,
        nextReminderAt: null, // Sera défini par onAnnouncementCreate

        resolvedAt: null,
        alertCardURL: null,
      };

      // Créer le document (déclenche onAnnouncementCreate)
      const docRef = await db.collection(COLLECTIONS.ANNOUNCEMENTS).add(announcementData);

      logger.info("SecureID alert created", {
        docId: docRef.id,
        shortCode,
        profileId: body.profileId,
        zone: zone.id,
      });

      res.status(201).json({
        success: true,
        announcementId: docRef.id,
        shortCode,
        secretToken,
        managementUrl: `https://enfentdisparu.bf/gestion/${secretToken}`,
        publicUrl: `https://enfentdisparu.bf/annonce/${shortCode}`,
      });
    } catch (error) {
      logger.error("SecureID alert error", { error });
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * Trouve la zone la plus proche des coordonnées GPS
 */
async function findZoneFromCoordinates(
  lat: number,
  lng: number
): Promise<{ id: string; name: string }> {
  // Pour l'instant, retourner une zone par défaut basée sur la région
  // TODO: Implémenter la géolocalisation précise avec les limites des zones

  // Coordonnées approximatives des villes principales
  const cities = [
    { id: "ouaga-centre", name: "Ouagadougou - Centre", lat: 12.3714, lng: -1.5197 },
    { id: "bobo-centre", name: "Bobo-Dioulasso - Centre", lat: 11.1771, lng: -4.2979 },
    { id: "koudougou", name: "Koudougou", lat: 12.2539, lng: -2.3626 },
    { id: "banfora", name: "Banfora", lat: 10.6333, lng: -4.7667 },
    { id: "ouahigouya", name: "Ouahigouya", lat: 13.5833, lng: -2.4167 },
  ];

  // Trouver la ville la plus proche
  let closest = cities[0];
  let minDistance = Infinity;

  for (const city of cities) {
    const distance = Math.sqrt(
      Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = city;
    }
  }

  return { id: closest.id, name: closest.name };
}

/**
 * Génère un shortCode unique cryptographiquement sécurisé (EPB-XXXXXXXX)
 */
async function generateUniqueShortCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sans I, O, 0, 1 pour éviter confusion
  let attempts = 0;

  while (attempts < 10) {
    // Utiliser crypto pour générer 8 caractères aléatoires
    const bytes = randomBytes(8);
    let code = "EPB-";
    for (let i = 0; i < 8; i++) {
      code += chars[bytes[i] % chars.length];
    }

    // Vérifier l'unicité
    const existing = await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .where("shortCode", "==", code)
      .limit(1)
      .get();

    if (existing.empty) {
      return code;
    }

    attempts++;
  }

  // Fallback avec bytes aléatoires
  const fallbackBytes = randomBytes(4);
  return `EPB-${fallbackBytes.toString("hex").toUpperCase()}`;
}

/**
 * Génère un token secret cryptographiquement sécurisé pour la gestion
 */
function generateSecretToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Masque un numéro de téléphone (+226 70 XX XX XX)
 */
function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("+226") && cleaned.length >= 12) {
    return `+226 ${cleaned.slice(4, 6)} XX XX ${cleaned.slice(-2)}`;
  }
  return phone.slice(0, 4) + " XX XX " + phone.slice(-2);
}
