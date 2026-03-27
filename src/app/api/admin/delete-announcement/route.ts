import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAdminPassword, isAdminPasswordConfigured } from "@/lib/auth";

/**
 * API pour supprimer une annonce (admin seulement)
 * Nécessite le mot de passe admin dans le header x-admin-password
 */
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier que le mot de passe admin est configuré
    if (!isAdminPasswordConfigured()) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Vérifier le mot de passe admin depuis le header
    const adminPassword = request.headers.get("x-admin-password");

    if (!adminPassword || !verifyAdminPassword(adminPassword)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Récupérer l'ID de l'annonce
    const { announcementId } = await request.json();

    if (!announcementId) {
      return NextResponse.json(
        { success: false, error: "Missing announcementId" },
        { status: 400 }
      );
    }

    // Utiliser Firebase Admin SDK (bypass les règles de sécurité)
    const adminDb = getAdminDb();
    const announcementRef = adminDb.collection("announcements").doc(announcementId);
    const announcementSnap = await announcementRef.get();

    if (!announcementSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      );
    }

    // Supprimer l'annonce (Admin SDK bypass les règles de sécurité)
    await announcementRef.delete();

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
