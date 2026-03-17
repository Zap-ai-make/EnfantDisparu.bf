/**
 * Service de cross-matching entre annonces "disparu" et "trouvé"
 *
 * Stratégie de notification croisée :
 * - Quand un enfant "trouvé" est signalé → notifier tous les parents d'enfants "disparus" dans la même zone
 * - Quand un enfant "disparu" est signalé → notifier tous les "finders" d'enfants "trouvés" dans la même zone
 *
 * Cela crée un effet de réseau et augmente les chances de réunion.
 */

import { logger } from "firebase-functions";
import { db, COLLECTIONS, BASE_URL } from "../config";
import { AnnouncementDoc, AnnouncementType } from "../types";
import { sendCrossMatchNotification } from "./whatsapp";

interface MatchCandidate {
  docId: string;
  announcement: AnnouncementDoc;
  similarityScore: number;
}

/**
 * Recherche et notifie les correspondances potentielles pour une nouvelle annonce
 */
export async function findAndNotifyPotentialMatches(
  newAnnouncement: AnnouncementDoc,
  newDocId: string
): Promise<{ notificationsSent: number; candidates: number }> {
  const oppositeType: AnnouncementType = newAnnouncement.type === "missing" ? "found" : "missing";

  logger.info("Cross-matching: searching for candidates", {
    newType: newAnnouncement.type,
    searchingFor: oppositeType,
    zone: newAnnouncement.zoneId,
  });

  // Chercher les annonces actives du type opposé dans la même zone ET zones adjacentes
  const candidates = await findCandidates(newAnnouncement, oppositeType);

  if (candidates.length === 0) {
    logger.info("Cross-matching: no candidates found");
    return { notificationsSent: 0, candidates: 0 };
  }

  logger.info(`Cross-matching: found ${candidates.length} potential matches`);

  // Envoyer les notifications
  let notificationsSent = 0;

  for (const candidate of candidates) {
    try {
      const success = await sendCrossMatchNotification(
        candidate.announcement,
        newAnnouncement,
        newDocId
      );

      if (success) {
        notificationsSent++;

        // Marquer cette annonce comme ayant reçu une notification de match
        await db
          .collection(COLLECTIONS.ANNOUNCEMENTS)
          .doc(candidate.docId)
          .update({
            lastCrossMatchNotification: new Date(),
            crossMatchCount: (candidate.announcement as unknown as { crossMatchCount?: number }).crossMatchCount
              ? ((candidate.announcement as unknown as { crossMatchCount: number }).crossMatchCount + 1)
              : 1,
          });
      }
    } catch (error) {
      logger.error("Cross-matching: notification failed", {
        candidateId: candidate.docId,
        error,
      });
    }
  }

  logger.info(`Cross-matching: ${notificationsSent}/${candidates.length} notifications sent`);

  return { notificationsSent, candidates: candidates.length };
}

/**
 * Recherche les annonces candidates pour un match
 */
async function findCandidates(
  newAnnouncement: AnnouncementDoc,
  targetType: AnnouncementType
): Promise<MatchCandidate[]> {
  const candidates: MatchCandidate[] = [];

  // 1. Chercher dans la même zone (priorité haute)
  const sameZoneQuery = await db
    .collection(COLLECTIONS.ANNOUNCEMENTS)
    .where("status", "==", "active")
    .where("type", "==", targetType)
    .where("zoneId", "==", newAnnouncement.zoneId)
    .limit(20)
    .get();

  for (const doc of sameZoneQuery.docs) {
    const announcement = doc.data() as AnnouncementDoc;
    const score = calculateSimilarityScore(newAnnouncement, announcement);

    candidates.push({
      docId: doc.id,
      announcement,
      similarityScore: score,
    });
  }

  // 2. Chercher dans la même ville (si on a peu de résultats)
  if (candidates.length < 5) {
    // Extraire la ville du zoneId (format: "bfa-ouaga-pissy" → rechercher "bfa-ouaga-*")
    const zoneParts = newAnnouncement.zoneId.split("-");
    if (zoneParts.length >= 2) {
      const cityPrefix = `${zoneParts[0]}-${zoneParts[1]}`;

      const sameCityQuery = await db
        .collection(COLLECTIONS.ANNOUNCEMENTS)
        .where("status", "==", "active")
        .where("type", "==", targetType)
        .limit(30)
        .get();

      for (const doc of sameCityQuery.docs) {
        const announcement = doc.data() as AnnouncementDoc;

        // Vérifier si même ville et pas déjà dans les candidats
        if (
          announcement.zoneId.startsWith(cityPrefix) &&
          announcement.zoneId !== newAnnouncement.zoneId &&
          !candidates.find((c) => c.docId === doc.id)
        ) {
          const score = calculateSimilarityScore(newAnnouncement, announcement);

          candidates.push({
            docId: doc.id,
            announcement,
            similarityScore: score * 0.8, // Score réduit car zone différente
          });
        }
      }
    }
  }

  // Trier par score de similarité (plus élevé en premier)
  candidates.sort((a, b) => b.similarityScore - a.similarityScore);

  // Limiter à 10 notifications max par nouvelle annonce
  return candidates.slice(0, 10);
}

/**
 * Calcule un score de similarité entre deux annonces
 * Score de 0 à 100
 */
function calculateSimilarityScore(
  announcement1: AnnouncementDoc,
  announcement2: AnnouncementDoc
): number {
  let score = 0;

  // Âge similaire (+30 points si exactement égal, moins si différent)
  const ageDiff = Math.abs(announcement1.childAge - announcement2.childAge);
  if (ageDiff === 0) {
    score += 30;
  } else if (ageDiff === 1) {
    score += 20;
  } else if (ageDiff <= 3) {
    score += 10;
  }

  // Même genre (+25 points)
  if (announcement1.childGender === announcement2.childGender) {
    score += 25;
  }

  // Même zone exacte (+20 points)
  if (announcement1.zoneId === announcement2.zoneId) {
    score += 20;
  }

  // Proximité temporelle (+15 points si créé dans les dernières 24h)
  const timeDiffHours = Math.abs(
    announcement1.createdAt.toMillis() - announcement2.createdAt.toMillis()
  ) / (1000 * 60 * 60);

  if (timeDiffHours <= 6) {
    score += 15;
  } else if (timeDiffHours <= 24) {
    score += 10;
  } else if (timeDiffHours <= 72) {
    score += 5;
  }

  // Bonus si description contient des mots similaires (+10 points max)
  const descriptionScore = compareDescriptions(
    announcement1.description,
    announcement2.description
  );
  score += descriptionScore;

  return Math.min(100, score);
}

/**
 * Compare deux descriptions et retourne un score de 0 à 10
 */
function compareDescriptions(desc1: string, desc2: string): number {
  const words1 = desc1.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const words2 = desc2.toLowerCase().split(/\s+/).filter((w) => w.length > 3);

  let matches = 0;
  for (const word of words1) {
    if (words2.includes(word)) {
      matches++;
    }
  }

  // Score proportionnel au nombre de mots en commun
  const matchRatio = words1.length > 0 ? matches / words1.length : 0;
  return Math.round(matchRatio * 10);
}

/**
 * Génère le message de notification pour un cross-match
 */
export function generateCrossMatchMessage(
  recipientAnnouncement: AnnouncementDoc,
  newAnnouncement: AnnouncementDoc,
  newDocId: string
): string {
  const baseUrl = BASE_URL.value() || "https://enfantdisparu.bf";
  const newAnnouncementUrl = `${baseUrl}/annonce/${newAnnouncement.shortCode}`;

  if (newAnnouncement.type === "found") {
    // Message pour un parent qui a signalé un enfant disparu
    return `🔔 *ALERTE CORRESPONDANCE POSSIBLE*

Un enfant vient d'être trouvé à ${newAnnouncement.zoneName} !

📍 Lieu: ${newAnnouncement.lastSeenPlace}
👤 ${newAnnouncement.childAge} ans, ${newAnnouncement.childGender === "M" ? "Garçon" : "Fille"}

⚠️ Vérifiez si cela pourrait être votre enfant :
🔗 ${newAnnouncementUrl}

Si ce n'est pas votre enfant, vous pouvez ignorer ce message. Nous continuons les recherches pour ${recipientAnnouncement.childName}.

— EnfantDisparu.bf`;
  } else {
    // Message pour quelqu'un qui a trouvé un enfant
    return `🔔 *ALERTE CORRESPONDANCE POSSIBLE*

Un parent vient de signaler la disparition d'un enfant à ${newAnnouncement.zoneName} !

👤 *${newAnnouncement.childName}*, ${newAnnouncement.childAge} ans
📍 Disparu à: ${newAnnouncement.lastSeenPlace}

⚠️ Comparez avec l'enfant que vous avez trouvé :
🔗 ${newAnnouncementUrl}

Si cela correspond, contactez immédiatement le parent via l'annonce.

— EnfantDisparu.bf`;
  }
}
