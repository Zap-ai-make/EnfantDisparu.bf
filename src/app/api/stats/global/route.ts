import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Cache for 60 seconds
export const revalidate = 60;

// Base counts (starting point before real inscriptions)
const BASE_AMBASSADORS = 10;
const BASE_MEMBERS = 400;

/**
 * API Route: Get Global Stats
 *
 * Agrège les statistiques globales depuis Firestore.
 * Utilisé par LiveStatusBar pour afficher des vraies données.
 *
 * Les compteurs ambassadeurs et membres partent d'une base de départ
 * (10 ambassadeurs, 400 membres) et s'incrémentent avec les vraies inscriptions.
 */
export async function GET() {
  try {
    const db = getAdminDb();

    // Parallel queries for performance
    const [
      ambassadorsSnapshot,
      allAmbassadorsSnapshot,
    ] = await Promise.all([
      db.collection("ambassadors").where("status", "==", "approved").get(),
      db.collection("ambassadors").get(), // All ambassadors (includes pending = members)
    ]);

    // Real counts from Firestore
    const realApprovedAmbassadors = ambassadorsSnapshot.size;
    const realTotalAmbassadors = allAmbassadorsSnapshot.size;

    // Total ambassadors = base + real approved ambassadors
    const totalAmbassadors = BASE_AMBASSADORS + realApprovedAmbassadors;

    // Total members = base + all ambassador applications (they are all members/vigilants)
    const totalMembers = BASE_MEMBERS + realTotalAmbassadors;

    // Build response
    const stats = {
      totalAmbassadors,
      totalMembers,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
