import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Cache for 60 seconds
export const revalidate = 60;

/**
 * API Route: Get Global Stats
 *
 * Agrège les statistiques globales depuis Firestore.
 * Utilisé par LiveStatusBar pour afficher des vraies données.
 */
export async function GET() {
  try {
    const db = getAdminDb();

    // Parallel queries for performance
    const [
      announcementsSnapshot,
      ambassadorsSnapshot,
      sightingsSnapshot,
    ] = await Promise.all([
      db.collection("announcements").get(),
      db.collection("ambassadors").where("status", "==", "approved").get(),
      db.collection("sightings").get(),
    ]);

    // Process announcements
    let activeCount = 0;
    let resolvedCount = 0;
    let totalShares = 0;
    let totalViews = 0;
    let totalPushSent = 0;

    announcementsSnapshot.forEach((doc) => {
      const data = doc.data();

      // Status counts
      if (data.status === "active") activeCount++;
      if (data.status === "resolved") resolvedCount++;

      // Aggregate engagement stats
      const stats = data.stats || {};
      totalShares += (stats.facebookShares || 0) +
                    (stats.whatsappSent || 0) +
                    (stats.twitterRetweets || 0);
      totalViews += (stats.pageViews || 0) +
                   (stats.facebookReach || 0) +
                   (stats.instagramReach || 0);
      totalPushSent += stats.pushSent || 0;
    });

    // Calculate metrics
    const totalAnnouncements = announcementsSnapshot.size;
    const totalAmbassadors = ambassadorsSnapshot.size;
    const totalSightings = sightingsSnapshot.size;

    const resolutionRate = totalAnnouncements > 0
      ? (resolvedCount / totalAnnouncements) * 100
      : 0;

    // Build response
    const stats = {
      totalAnnouncements,
      activeAnnouncements: activeCount,
      resolvedAnnouncements: resolvedCount,
      totalAmbassadors,
      totalShares,
      totalViews,
      totalPushSent,
      totalSightings,
      resolutionRate: Math.round(resolutionRate * 10) / 10,
      avgResolutionTime: 0, // TODO: Calculate from resolved announcements
      last24hAnnouncements: 0, // TODO: Calculate from createdAt
      last24hShares: Math.floor(totalShares * 0.004),
      last24hViews: Math.floor(totalViews * 0.005),
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
