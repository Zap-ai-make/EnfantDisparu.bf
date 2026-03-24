import {
  onDocumentCreated,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db, COLLECTIONS, REMINDER_SCHEDULE, FACEBOOK_PAGE_TOKEN, FACEBOOK_PAGE_ID, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, INSTAGRAM_USER_ID } from "../config";
import { AnnouncementDoc } from "../types";
import { generateAlertCard } from "../services/alertCard";
import { postAnnouncementToFacebook } from "../services/facebook";
import { generateAlertReel } from "../services/reelGenerator";
import { publishFacebookReel, createReelCaption } from "../services/facebookReels";
import { publishInstagramReel, createInstagramCaption } from "../services/instagramReels";
import { publishInstagramPost, createInstagramPostCaption } from "../services/instagramPosts";
import { storage } from "../config";
import { tmpdir } from "os";
import { join } from "path";
import { unlinkSync } from "fs";
import { createWriteStream } from "fs";
// TikTok import pour future utilisation automatique
// import { postAnnouncementToTikTok } from "../services/tiktok";
// Temporairement désactivé - secrets non configurés
// import { sendNewAnnouncementToParent } from "../services/whatsapp";
// import { sendZonePushNotification } from "../services/onesignal";
// import { findAndNotifyPotentialMatches } from "../services/crossMatching";
// import { notifyZoneVigies } from "../services/vigieNotification";

/**
 * Trigger déclenché à chaque création d'annonce
 *
 * Actions:
 * 1. Générer l'image d'alerte (alertCard) ✅
 * 1b. Générer la vidéo Reel avec voix-off ✅
 * 2. Poster sur Facebook (post classique avec image) ✅
 * 2b. Poster sur Instagram (post classique avec image) ✅
 * 3. Poster sur Facebook Reels (vidéo) ✅
 * 4. Poster sur Instagram Reels (vidéo) ✅
 * 5. Incrémenter le compteur de zone ✅
 * 6. Programmer le premier rappel ✅
 *
 * Actions désactivées (secrets manquants):
 * - TikTok (nécessite OAuth user token)
 * - Envoyer WhatsApp au parent
 * - Push notifications OneSignal
 * - Cross-matching
 * - Notifications vigies
 */
export const onAnnouncementCreate = onDocumentCreated(
  {
    document: `${COLLECTIONS.ANNOUNCEMENTS}/{docId}`,
    region: "europe-west1",
    memory: "1GiB",
    timeoutSeconds: 540, // 9 minutes (génération vidéo + uploads multiples)
    secrets: [FACEBOOK_PAGE_TOKEN, FACEBOOK_PAGE_ID, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, INSTAGRAM_USER_ID],
  },
  async (event: FirestoreEvent<QueryDocumentSnapshot | undefined>) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No data in onAnnouncementCreate event");
      return;
    }

    const docId = event.params.docId;
    const announcement = snapshot.data() as AnnouncementDoc;

    logger.info("Processing new announcement", {
      docId,
      shortCode: announcement.shortCode,
      zone: announcement.zoneId,
    });

    // 1. Générer l'image d'alerte
    let alertCardURL: string | null = null;
    try {
      alertCardURL = await generateAlertCard(announcement, docId);
      logger.info("Alert card generated", { docId, alertCardURL });
    } catch (error) {
      logger.error("Alert card generation failed", { error, docId });
    }

    // 1b. Générer la vidéo Reel (avec voix-off)
    let reelVideoURL: string | null = null;
    if (alertCardURL) {
      try {
        reelVideoURL = await generateAlertReel({
          announcement,
          alertCardURL,
          docId,
        });
        logger.info("Alert reel generated", { docId, reelVideoURL });
      } catch (error) {
        logger.error("Alert reel generation failed", { error, docId });
      }
    }

    // 2. Poster sur Facebook (avec l'image d'alerte)
    let facebookPostId: string | null = null;
    try {
      // On passe l'annonce mise à jour avec l'URL de l'alertCard
      const announcementWithCard = { ...announcement, alertCardURL };
      facebookPostId = await postAnnouncementToFacebook(announcementWithCard, docId);
      if (facebookPostId) {
        logger.info("Facebook post created", { docId, facebookPostId });
      }
    } catch (error) {
      logger.error("Facebook post failed", { error, docId });
    }

    // 2b. Poster sur Instagram (post classique avec l'image)
    let instagramPostId: string | null = null;
    if (alertCardURL && INSTAGRAM_USER_ID.value() && FACEBOOK_PAGE_TOKEN.value()) {
      try {
        const igUserId = INSTAGRAM_USER_ID.value();
        const accessToken = FACEBOOK_PAGE_TOKEN.value();

        const caption = createInstagramPostCaption({
          childName: announcement.childName,
          childAge: announcement.childAge,
          lastSeenPlace: announcement.lastSeenPlace,
        });

        const result = await publishInstagramPost({
          imageUrl: alertCardURL,
          igUserId,
          accessToken,
          caption,
        });

        if (result.success && result.mediaId) {
          instagramPostId = result.mediaId;
          logger.info("Instagram post created", { docId, instagramPostId });
        } else {
          logger.warn("Instagram post failed", { docId, error: result.error });
        }
      } catch (error) {
        logger.error("Instagram post failed", { error, docId });
      }
    }

    // 3. Poster sur TikTok (avec l'image d'alerte)
    // Note: Pour l'instant, on ne poste pas automatiquement car on n'a pas d'access token
    // L'access token sera obtenu via OAuth et stocké dans un document utilisateur
    // Pour la démo, on utilisera un endpoint HTTP manuel
    let tiktokVideoId: string | null = null;
    // Temporairement désactivé - nécessite OAuth user access token
    // try {
    //   const announcementWithCard = { ...announcement, alertCardURL };
    //   tiktokVideoId = await postAnnouncementToTikTok(announcementWithCard, docId, userAccessToken);
    //   if (tiktokVideoId) {
    //     logger.info("TikTok post created", { docId, tiktokVideoId });
    //   }
    // } catch (error) {
    //   logger.error("TikTok post failed", { error, docId });
    // }

    // 3b. Poster sur Facebook Reels (avec la vidéo)
    let facebookReelId: string | null = null;
    if (reelVideoURL && FACEBOOK_PAGE_ID.value() && FACEBOOK_PAGE_TOKEN.value()) {
      try {
        const pageId = FACEBOOK_PAGE_ID.value();
        const pageAccessToken = FACEBOOK_PAGE_TOKEN.value();

        if (pageId && pageAccessToken) {
          // Télécharger la vidéo depuis Cloud Storage
          const localVideoPath = await downloadVideoFromStorage(reelVideoURL, docId);

          // Créer la caption
          const caption = createReelCaption({
            childName: announcement.childName,
            childAge: announcement.childAge,
            lastSeenPlace: announcement.lastSeenPlace,
          });

          // Uploader vers Facebook Reels
          const result = await publishFacebookReel({
            videoPath: localVideoPath,
            pageId,
            pageAccessToken,
            caption,
          });

          if (result.success && result.videoId) {
            facebookReelId = result.videoId;
            logger.info("Facebook Reel posted", { docId, facebookReelId });
          } else {
            logger.warn("Facebook Reel posting failed", {
              docId,
              error: result.error,
            });
          }

          // Nettoyer le fichier temporaire
          try {
            unlinkSync(localVideoPath);
            logger.info("Temporary video file deleted", { localVideoPath });
          } catch (cleanupError) {
            logger.warn("Failed to delete temporary video file", { cleanupError });
          }
        }
      } catch (error) {
        logger.error("Facebook Reel upload failed", { error, docId });
      }
    }

    // 3c. Poster sur Instagram Reels (avec la vidéo)
    let instagramReelId: string | null = null;
    if (reelVideoURL && INSTAGRAM_USER_ID.value()) {
      try {
        const igUserId = INSTAGRAM_USER_ID.value();
        const accessToken = FACEBOOK_PAGE_TOKEN.value();

        if (igUserId && accessToken) {
          const caption = createInstagramCaption({
            childName: announcement.childName,
            childAge: announcement.childAge,
            lastSeenPlace: announcement.lastSeenPlace,
          });

          const result = await publishInstagramReel({
            videoUrl: reelVideoURL,
            igUserId,
            accessToken,
            caption,
          });

          if (result.success && result.mediaId) {
            instagramReelId = result.mediaId;
            logger.info("Instagram Reel posted", { docId, instagramReelId });
          } else {
            logger.warn("Instagram Reel posting failed", {
              docId,
              error: result.error,
            });
          }
        }
      } catch (error) {
        logger.error("Instagram Reel upload failed", { error, docId });
      }
    }

    // 4. Incrémenter le compteur de zone
    try {
      await incrementZoneCounter(announcement.zoneId);
    } catch (error) {
      logger.error("Zone counter increment failed", { error, docId });
    }

    // 4. Programmer le premier rappel (24h)
    const nextReminderAt = Timestamp.fromDate(
      new Date(Date.now() + REMINDER_SCHEDULE.FIRST * 60 * 60 * 1000)
    );

    // Mise à jour du document avec toutes les infos
    await db
      .collection(COLLECTIONS.ANNOUNCEMENTS)
      .doc(docId)
      .update({
        alertCardURL,
        reelVideoURL,
        "stats.facebookPostId": facebookPostId,
        "stats.instagramPostId": instagramPostId,
        "stats.facebookReelId": facebookReelId,
        "stats.instagramReelId": instagramReelId,
        "stats.tiktokVideoId": tiktokVideoId,
        nextReminderAt,
        updatedAt: FieldValue.serverTimestamp(),
      });

    // Log récapitulatif
    logger.info("Announcement processing complete", {
      docId,
      shortCode: announcement.shortCode,
      type: announcement.type || "missing",
      alertCard: !!alertCardURL,
      reelVideo: !!reelVideoURL,
      facebookPost: !!facebookPostId,
      instagramPost: !!instagramPostId,
      facebookReel: !!facebookReelId,
      instagramReel: !!instagramReelId,
      tiktokPost: !!tiktokVideoId,
    });
  }
);

/**
 * Incrémente le compteur d'annonces actives d'une zone
 * Note: FieldValue.increment fonctionne même si le champ n'existe pas
 */
async function incrementZoneCounter(zoneId: string): Promise<void> {
  try {
    await db.collection(COLLECTIONS.ZONES).doc(zoneId).update({
      activeAnnouncements: FieldValue.increment(1),
    });
  } catch (error) {
    // Le document zone n'existe pas - ignorer
    logger.warn("Zone document not found for increment", { zoneId });
  }
}

/**
 * Télécharge une vidéo depuis Cloud Storage vers un fichier local temporaire
 * Retourne le chemin du fichier local
 */
async function downloadVideoFromStorage(videoUrl: string, docId: string): Promise<string> {
  // Extraire le chemin du fichier depuis l'URL
  // Format: https://storage.googleapis.com/{bucket}/alert-reels/{docId}.mp4
  const bucket = storage.bucket();
  const fileName = `alert-reels/${docId}.mp4`;
  const file = bucket.file(fileName);

  // Créer un fichier temporaire
  const tmpDir = tmpdir();
  const localPath = join(tmpDir, `reel-fb-${docId}.mp4`);

  logger.info("Downloading video from storage", { fileName, localPath });

  // Télécharger le fichier
  await new Promise<void>((resolve, reject) => {
    file
      .createReadStream()
      .pipe(createWriteStream(localPath))
      .on("error", reject)
      .on("finish", resolve);
  });

  logger.info("Video downloaded successfully", { localPath });
  return localPath;
}
