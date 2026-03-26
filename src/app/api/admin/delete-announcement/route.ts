import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
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

    // Vérifier que l'annonce existe
    const announcementRef = doc(db, "announcements", announcementId);
    const announcementSnap = await getDoc(announcementRef);

    if (!announcementSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      );
    }

    // Supprimer l'annonce
    await deleteDoc(announcementRef);

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
