import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

const db = getAdminDb();

// Rate limit: 60 requests per minute (prevent stat inflation abuse)
const RATE_LIMIT = { windowMs: 60 * 1000, max: 60 };

type StatKey = "notificationsActivated" | "alertsShared" | "ambassadorsRecruited" | "viewsGenerated";

const VALID_STAT_KEYS: StatKey[] = [
  "notificationsActivated",
  "alertsShared",
  "ambassadorsRecruited",
  "viewsGenerated",
];

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientId = getClientIdentifier(request, "ambassador-stats");
    const rateLimitResult = rateLimit(clientId, RATE_LIMIT);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "too_many_requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const { refCode, statKey, amount = 1 } = body;

    if (!refCode || !statKey) {
      return NextResponse.json(
        { success: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    // Validate refCode format
    if (!/^AMB-[A-Z0-9]{4}$/.test(refCode)) {
      return NextResponse.json(
        { success: false, error: "invalid_refcode" },
        { status: 400 }
      );
    }

    // Validate statKey
    if (!VALID_STAT_KEYS.includes(statKey)) {
      return NextResponse.json(
        { success: false, error: "invalid_stat_key" },
        { status: 400 }
      );
    }

    // Find ambassador by refCode
    const snapshot = await db
      .collection("ambassadors")
      .where("refCode", "==", refCode)
      .where("status", "==", "approved")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: "ambassador_not_found" },
        { status: 404 }
      );
    }

    const ambassadorDoc = snapshot.docs[0];

    // Increment the stat
    await ambassadorDoc.ref.update({
      [`stats.${statKey}`]: FieldValue.increment(amount),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Increment ambassador stat error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
