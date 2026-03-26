import {
  onDocumentCreated,
  FirestoreEvent,
  QueryDocumentSnapshot,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db, COLLECTIONS, REMINDER_SCHEDULE, FACEBOOK_PAGE_TOKEN, FACEBOOK_SYSTEM_USER_TOKEN, FACEBOOK_PAGE_ID, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, INSTAGRAM_USER_ID, LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_URN, TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET } from "../config";
import { AnnouncementDoc } from "../types";
import { generateAlertCard } from "../services/alertCard";
import { postAnnouncementToFacebook } from "../services/facebook";
import { generateAlertReel } from "../services/reelGenerator";
import { publishFacebookReel, createReelCaption } from "../services/facebookReels";
import { publishInstagramReel, createInstagramCaption } from "../services/instagramReels";
import { publishInstagramPost, createInstagramPostCaption } from "../services/instagramPosts";
// DÉSACTIVÉ: LinkedIn temporairement désactivé (nécessite Community Management API)
// import { publishLinkedInPost, createLinkedInCaption } from "../services/linkedin";
import { publishTwitterPost, createTwitterText } from "../services/twitter";
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
 * 5. Poster sur X/Twitter (tweet avec image) ✅
 * 6. Incrémenter le compteur de zone ✅
 * 7. Programmer le premier rappel ✅
 *
 * Actions désactivées:
 * - LinkedIn (nécessite Community Management API pour publier sur la page)
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
    timeoutSeconds: 300, // 5 minutes (optimisé avec parallélisation)
    secrets: [FACEBOOK_PAGE_TOKEN, FACEBOOK_SYSTEM_USER_TOKEN, FACEBOOK_PAGE_ID, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, INSTAGRAM_USER_ID, LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_URN, TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET],
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

    // 2. Publier sur toutes les plateformes en PARALLÈLE (optimisation performance)
    logger.info("Starting parallel social media publishing", { docId });

    const socialMediaPublishingPromises = [];

    // 2a. Facebook Post
    if (alertCardURL) {
      socialMediaPublishingPromises.push(
        (async () => {
          try {
            const announcementWithCard = { ...announcement, alertCardURL };
            const postId = await postAnnouncementToFacebook(announcementWithCard, docId);
            if (postId) {
              logger.info("Facebook post created", { docId, facebookPostId: postId });
              return { platform: "facebook_post", success: true, id: postId };
            }
            return { platform: "facebook_post", success: false, id: null };
          } catch (error) {
            logger.error("Facebook post failed", { error, docId });
            return { platform: "facebook_post", success: false, id: null, error };
          }
        })()
      );
    }

    // 2b. Instagram Post
    if (alertCardURL && INSTAGRAM_USER_ID.value() && FACEBOOK_PAGE_TOKEN.value()) {
      socialMediaPublishingPromises.push(
        (async () => {
          try {
            const igUserId = INSTAGRAM_USER_ID.value();
            const accessToken = FACEBOOK_PAGE_TOKEN.value();

            const caption = createInstagramPostCaption({
              childName: announcement.childName,
              childAge: announcement.childAge,
              lastSeenPlace: announcement.lastSeenPlace,
              announcementType: announcement.type,
            });

            const result = await publishInstagramPost({
              imageUrl: alertCardURL!,
              igUserId,
              accessToken,
              caption,
            });

            if (result.success && result.mediaId) {
              logger.info("Instagram post created", { docId, instagramPostId: result.mediaId });
              return { platform: "instagram_post", success: true, id: result.mediaId };
            } else {
              logger.warn("Instagram post failed", { docId, error: result.error });
              return { platform: "instagram_post", success: false, id: null, error: result.error };
            }
          } catch (error) {
            logger.error("Instagram post failed", { error, docId });
            return { platform: "instagram_post", success: false, id: null, error };
          }
        })()
      );
    }

    // 2c. Facebook Reel
    if (reelVideoURL && FACEBOOK_PAGE_ID.value() && FACEBOOK_PAGE_TOKEN.value()) {
      socialMediaPublishingPromises.push(
        (async () => {
          try {
            const pageId = FACEBOOK_PAGE_ID.value();
            const pageAccessToken = FACEBOOK_SYSTEM_USER_TOKEN.value();

            if (pageId && pageAccessToken) {
              const localVideoPath = await downloadVideoFromStorage(reelVideoURL!, docId);

              const caption = createReelCaption({
                childName: announcement.childName,
                childAge: announcement.childAge,
                lastSeenPlace: announcement.lastSeenPlace,
                announcementType: announcement.type,
              });

              const result = await publishFacebookReel({
                videoPath: localVideoPath,
                pageId,
                pageAccessToken,
                caption,
              });

              // Nettoyer le fichier temporaire
              try {
                unlinkSync(localVideoPath);
                logger.info("Temporary video file deleted", { localVideoPath });
              } catch (cleanupError) {
                logger.warn("Failed to delete temporary video file", { cleanupError });
              }

              if (result.success && result.videoId) {
                logger.info("Facebook Reel posted", { docId, facebookReelId: result.videoId });
                return { platform: "facebook_reel", success: true, id: result.videoId };
              } else {
                logger.warn("Facebook Reel posting failed", { docId, error: result.error });
                return { platform: "facebook_reel", success: false, id: null, error: result.error };
              }
            }
            return { platform: "facebook_reel", success: false, id: null };
          } catch (error) {
            logger.error("Facebook Reel upload failed", { error, docId });
            return { platform: "facebook_reel", success: false, id: null, error };
          }
        })()
      );
    }

    // 2d. Instagram Reel
    if (reelVideoURL && INSTAGRAM_USER_ID.value()) {
      socialMediaPublishingPromises.push(
        (async () => {
          try {
            const igUserId = INSTAGRAM_USER_ID.value();
            const accessToken = FACEBOOK_PAGE_TOKEN.value();

            if (igUserId && accessToken) {
              const caption = createInstagramCaption({
                childName: announcement.childName,
                childAge: announcement.childAge,
                lastSeenPlace: announcement.lastSeenPlace,
                announcementType: announcement.type,
              });

              const result = await publishInstagramReel({
                videoUrl: reelVideoURL!,
                igUserId,
                accessToken,
                caption,
              });

              if (result.success && result.mediaId) {
                logger.info("Instagram Reel posted", { docId, instagramReelId: result.mediaId });
                return { platform: "instagram_reel", success: true, id: result.mediaId };
              } else {
                logger.warn("Instagram Reel posting failed", { docId, error: result.error });
                return { platform: "instagram_reel", success: false, id: null, error: result.error };
              }
            }
            return { platform: "instagram_reel", success: false, id: null };
          } catch (error) {
            logger.error("Instagram Reel upload failed", { error, docId });
            return { platform: "instagram_reel", success: false, id: null, error };
          }
        })()
      );
    }

    // 2e. LinkedIn Post
    // DÉSACTIVÉ: Publie actuellement sur le profil personnel au lieu de la page EnfantDisparu.bf
    // TODO: Réactiver quand l'accès au Community Management API sera approuvé par LinkedIn
    // Cela permettra d'utiliser w_organization_social au lieu de w_member_social
    /*
    if (alertCardURL && LINKEDIN_ACCESS_TOKEN.value() && LINKEDIN_PERSON_URN.value()) {
      socialMediaPublishingPromises.push(
        (async () => {
          try {
            const accessToken = LINKEDIN_ACCESS_TOKEN.value();
            const personUrn = LINKEDIN_PERSON_URN.value();

            if (accessToken && personUrn) {
              const caption = createLinkedInCaption({
                childName: announcement.childName,
                childAge: announcement.childAge,
                lastSeenPlace: announcement.lastSeenPlace,
              });

              const result = await publishLinkedInPost({
                imageUrl: alertCardURL!,
                personUrn,
                accessToken,
                caption,
              });

              if (result.success && result.postId) {
                logger.info("LinkedIn post created", { docId, linkedinPostId: result.postId });
                return { platform: "linkedin_post", success: true, id: result.postId };
              } else {
                logger.warn("LinkedIn post failed", { docId, error: result.error });
                return { platform: "linkedin_post", success: false, id: null, error: result.error };
              }
            }
            return { platform: "linkedin_post", success: false, id: null };
          } catch (error) {
            logger.error("LinkedIn post failed", { error, docId });
            return { platform: "linkedin_post", success: false, id: null, error };
          }
        })()
      );
    }
    */

    // 2f. X (Twitter) Post
    if (alertCardURL && TWITTER_API_KEY.value() && TWITTER_ACCESS_TOKEN.value()) {
      socialMediaPublishingPromises.push(
        (async () => {
          try {
            const credentials = {
              apiKey: TWITTER_API_KEY.value(),
              apiSecret: TWITTER_API_SECRET.value(),
              accessToken: TWITTER_ACCESS_TOKEN.value(),
              accessSecret: TWITTER_ACCESS_SECRET.value(),
            };

            if (credentials.apiKey && credentials.accessToken) {
              const text = createTwitterText({
                childName: announcement.childName,
                childAge: announcement.childAge,
                lastSeenPlace: announcement.lastSeenPlace,
                announcementType: announcement.type,
              });

              const result = await publishTwitterPost({
                imageUrl: alertCardURL!,
                credentials,
                text,
              });

              if (result.success && result.tweetId) {
                logger.info("X (Twitter) post created", { docId, twitterPostId: result.tweetId });
                return { platform: "twitter_post", success: true, id: result.tweetId };
              } else {
                logger.warn("X (Twitter) post failed", { docId, error: result.error });
                return { platform: "twitter_post", success: false, id: null, error: result.error };
              }
            }
            return { platform: "twitter_post", success: false, id: null };
          } catch (error) {
            logger.error("X (Twitter) post failed", { error, docId });
            return { platform: "twitter_post", success: false, id: null, error };
          }
        })()
      );
    }

    // Attendre que toutes les publications se terminent (en parallèle)
    const publishingResults = await Promise.allSettled(socialMediaPublishingPromises);

    // Extraire les IDs des résultats
    let facebookPostId: string | null = null;
    let instagramPostId: string | null = null;
    let facebookReelId: string | null = null;
    let instagramReelId: string | null = null;
    let linkedinPostId: string | null = null;
    let twitterPostId: string | null = null;
    let tiktokVideoId: string | null = null; // Pour compatibilité future

    publishingResults.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        switch (result.value.platform) {
          case "facebook_post":
            facebookPostId = result.value.id;
            break;
          case "instagram_post":
            instagramPostId = result.value.id;
            break;
          case "facebook_reel":
            facebookReelId = result.value.id;
            break;
          case "instagram_reel":
            instagramReelId = result.value.id;
            break;
          // DÉSACTIVÉ: LinkedIn temporairement désactivé
          // case "linkedin_post":
          //   linkedinPostId = result.value.id;
          //   break;
          case "twitter_post":
            twitterPostId = result.value.id;
            break;
        }
      }
    });

    logger.info("Social media publishing completed", {
      docId,
      platforms: publishingResults.length,
      successful: publishingResults.filter(r => r.status === "fulfilled" && r.value.success).length,
    });

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
        "stats.linkedinPostId": linkedinPostId,
        "stats.twitterPostId": twitterPostId,
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
      linkedinPost: !!linkedinPostId,
      twitterPost: !!twitterPostId,
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
