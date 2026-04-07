import { NextRequest, NextResponse } from "next/server";

/**
 * TikTok OAuth Callback
 *
 * Ce endpoint reçoit le code d'autorisation de TikTok après que l'admin
 * ait autorisé l'application. Il échange le code contre un access token
 * et le stocke dans Firestore.
 *
 * Flow:
 * 1. TikTok redirige vers /api/auth/tiktok/callback?code=XXX&state=YYY
 * 2. On échange le code contre un access token via l'API TikTok
 * 3. On stocke le token dans Firestore (collection: app_config, doc: tiktok)
 * 4. On redirige vers /admin/tiktok avec succès
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Gestion des erreurs OAuth
  if (error) {
    console.error("TikTok OAuth error:", error);
    return NextResponse.redirect(
      new URL(`/admin/tiktok?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // Validation des paramètres
  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/admin/tiktok?error=missing_params", request.url)
    );
  }

  try {
    // Appeler notre Cloud Function pour échanger le code contre un token
    const functionUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL ||
      "https://europe-west1-enfant-disparu-bf.cloudfunctions.net";

    const response = await fetch(`${functionUrl}/exchangeTikTokCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        redirectUri: `${request.nextUrl.origin}/api/auth/tiktok/callback`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to exchange TikTok code:", errorData);
      return NextResponse.redirect(
        new URL("/admin/tiktok?error=exchange_failed", request.url)
      );
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.redirect(
        new URL("/admin/tiktok?error=token_invalid", request.url)
      );
    }

    // Succès ! Rediriger vers la page admin
    return NextResponse.redirect(
      new URL("/admin/tiktok?success=true", request.url)
    );
  } catch (error) {
    console.error("TikTok OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/admin/tiktok?error=server_error", request.url)
    );
  }
}
