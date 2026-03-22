import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { timingSafeEqual } from "crypto";

const db = getAdminDb();

// Admin password authentication (server-side only)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("x-admin-password");
  if (!ADMIN_PASSWORD || !authHeader) return false;
  return safeCompare(authHeader, ADMIN_PASSWORD);
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier authentification admin
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ambassadorId, approvedBy } = body;

    if (!ambassadorId || !approvedBy) {
      return NextResponse.json(
        { success: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    const ambassadorRef = db.collection("ambassadors").doc(ambassadorId);
    const doc = await ambassadorRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "not_found" },
        { status: 404 }
      );
    }

    const data = doc.data();
    if (data?.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "not_pending" },
        { status: 400 }
      );
    }

    // Generate access token
    const accessToken = crypto.randomUUID();
    const accessTokenExpiresAt = Timestamp.fromDate(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    );

    // Update ambassador
    await ambassadorRef.update({
      status: "approved",
      approvedAt: FieldValue.serverTimestamp(),
      approvedBy,
      accessToken,
      accessTokenExpiresAt,
    });

    // If ambassador was referred by another ambassador, increment their stats
    if (data?.referredBy) {
      const referrerSnapshot = await db
        .collection("ambassadors")
        .where("refCode", "==", data.referredBy)
        .where("status", "==", "approved")
        .limit(1)
        .get();

      if (!referrerSnapshot.empty) {
        const referrerDoc = referrerSnapshot.docs[0];
        await referrerDoc.ref.update({
          "stats.ambassadorsRecruited": FieldValue.increment(1),
        });
      }
    }

    // Build dashboard URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://enfentdisparu.bf";
    const dashboardUrl = `${baseUrl}/ambassadeur?t=${accessToken}`;

    return NextResponse.json({
      success: true,
      dashboardUrl,
    });
  } catch (error) {
    console.error("Approve ambassador error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
