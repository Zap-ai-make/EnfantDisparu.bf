import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { randomBytes } from "crypto";

// Force dynamic rendering to avoid build-time initialization
export const dynamic = 'force-dynamic';

const ACCESS_TOKEN_EXPIRY_DAYS = 7;

// Générer un token d'accès unique
function generateAccessToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * API Route: Request Ambassador Access
 *
 * Permet à un ambassadeur de se connecter via son numéro de téléphone.
 * Régénère automatiquement le token s'il est expiré.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "missing_phone" },
        { status: 400 }
      );
    }

    // Normaliser le numéro de téléphone (retirer espaces, tirets)
    const normalizedPhone = phone.replace(/[\s-]/g, "");

    const db = getAdminDb();
    // Chercher l'ambassadeur par numéro de téléphone
    const ambassadorSnapshot = await db
      .collection("ambassadors")
      .where("phone", "==", normalizedPhone)
      .limit(1)
      .get();

    if (ambassadorSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "not_found" },
        { status: 404 }
      );
    }

    const ambassadorDoc = ambassadorSnapshot.docs[0];
    const ambassador = ambassadorDoc.data();

    // Vérifier que l'ambassadeur est approuvé
    if (ambassador.status !== "approved") {
      return NextResponse.json(
        { success: false, error: "not_approved" },
        { status: 403 }
      );
    }

    let accessToken = ambassador.accessToken;

    // Vérifier si le token existe et n'est pas expiré
    const now = new Date();
    let needsNewToken = !accessToken;

    if (accessToken && ambassador.accessTokenExpiresAt) {
      const expiresAt = ambassador.accessTokenExpiresAt.toDate();
      if (expiresAt < now) {
        needsNewToken = true;
      }
    }

    // Régénérer le token si nécessaire
    if (needsNewToken) {
      accessToken = generateAccessToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + ACCESS_TOKEN_EXPIRY_DAYS);

      await ambassadorDoc.ref.update({
        accessToken,
        accessTokenExpiresAt: expiresAt,
        lastLoginAt: FieldValue.serverTimestamp(),
      });

      console.log(`Token regenerated for ambassador ${ambassadorDoc.id}`);
    } else {
      // Mettre à jour le dernier login
      await ambassadorDoc.ref.update({
        lastLoginAt: FieldValue.serverTimestamp(),
      });
    }

    // Retourner le token pour connexion directe
    return NextResponse.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Request access error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
