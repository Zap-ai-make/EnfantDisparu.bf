import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { db, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET } from "../config";

/**
 * Échange un code OAuth TikTok contre un access token
 *
 * Cette fonction est appelée par le callback OAuth après que l'admin
 * ait autorisé l'application sur TikTok.
 *
 * POST /exchangeTikTokCode
 * {
 *   "code": "authorization_code_from_tiktok",
 *   "redirectUri": "https://enfentdisparu.bf/api/auth/tiktok/callback"
 * }
 *
 * Stocke le token dans Firestore: app_config/tiktok
 */
export const exchangeTikTokCode = onRequest(
  {
    region: "europe-west1",
    secrets: [TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET],
    cors: true,
  },
  async (req, res) => {
    // Vérifier la méthode HTTP
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { code, redirectUri } = req.body;

    // Validation
    if (!code || !redirectUri) {
      res.status(400).json({
        error: "Missing required parameters",
        required: ["code", "redirectUri"],
      });
      return;
    }

    const clientKey = TIKTOK_CLIENT_KEY.value();
    const clientSecret = TIKTOK_CLIENT_SECRET.value();

    if (!clientKey || !clientSecret) {
      logger.error("TikTok credentials not configured");
      res.status(500).json({ error: "TikTok credentials not configured" });
      return;
    }

    try {
      logger.info("Exchanging TikTok authorization code for access token");

      // Étape 1: Échanger le code contre un access token
      const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";

      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
        body: new URLSearchParams({
          client_key: clientKey,
          client_secret: clientSecret,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        logger.error("TikTok token exchange failed", {
          status: tokenResponse.status,
          error: errorText,
        });
        res.status(500).json({
          error: "Failed to exchange code for token",
          details: errorText,
        });
        return;
      }

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        logger.error("TikTok token exchange error", { error: tokenData.error });
        res.status(500).json({
          error: "Token exchange error",
          details: tokenData.error,
        });
        return;
      }

      const {
        access_token,
        refresh_token,
        expires_in,
        open_id,
        scope,
        token_type,
      } = tokenData.data;

      logger.info("TikTok token obtained successfully", {
        openId: open_id,
        expiresIn: expires_in,
        scope,
      });

      // Étape 2: Stocker le token dans Firestore
      const expiresAt = Date.now() + expires_in * 1000;

      await db
        .collection("app_config")
        .doc("tiktok")
        .set({
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt,
          connectedAt: Date.now(),
          openId: open_id,
          scope,
          tokenType: token_type,
          updatedAt: new Date(),
        });

      logger.info("TikTok token stored in Firestore", {
        expiresAt: new Date(expiresAt).toISOString(),
      });

      res.status(200).json({
        success: true,
        message: "TikTok account connected successfully",
        expiresAt: new Date(expiresAt).toISOString(),
      });
    } catch (error) {
      logger.error("Error exchanging TikTok code", { error });
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
