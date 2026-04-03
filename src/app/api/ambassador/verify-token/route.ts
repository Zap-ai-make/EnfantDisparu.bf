import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

// Force dynamic rendering to avoid build-time initialization
export const dynamic = 'force-dynamic';

/**
 * API Route: Verify Ambassador Token
 *
 * Vérifie un access token et retourne les données de l'ambassadeur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "missing_token" },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    // Chercher l'ambassadeur par access token
    const ambassadorSnapshot = await db
      .collection("ambassadors")
      .where("accessToken", "==", token)
      .limit(1)
      .get();

    if (ambassadorSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: "invalid_token" },
        { status: 404 }
      );
    }

    const ambassadorDoc = ambassadorSnapshot.docs[0];
    const ambassadorData = ambassadorDoc.data();

    // Vérifier expiration du token
    if (ambassadorData.accessTokenExpiresAt) {
      const expiresAt = ambassadorData.accessTokenExpiresAt.toDate();
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { success: false, error: "token_expired" },
          { status: 403 }
        );
      }
    }

    // Retourner les données de l'ambassadeur
    const ambassador = {
      id: ambassadorDoc.id,
      ...ambassadorData,
      // Convertir Firestore Timestamps en ISO strings pour JSON
      createdAt: ambassadorData.createdAt?.toDate().toISOString(),
      approvedAt: ambassadorData.approvedAt?.toDate().toISOString(),
      accessTokenExpiresAt: ambassadorData.accessTokenExpiresAt?.toDate().toISOString(),
      lastBriefingDate: ambassadorData.lastBriefingDate?.toDate().toISOString(),
    };

    return NextResponse.json({
      success: true,
      ambassador,
    });
  } catch (error) {
    console.error("Verify token error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
