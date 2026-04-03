import { NextRequest, NextResponse } from "next/server";
import type { SubmitApplicationInput, SubmitApplicationResult } from "@/types/ambassador";
import {
  generateRefCodeCandidate,
  normalizePhone,
  validateZoneHierarchy,
  isMinimumAge,
} from "@/lib/ambassador-utils";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

// Force dynamic rendering to avoid build-time initialization
export const dynamic = 'force-dynamic';

// Rate limit: 3 submissions per hour
const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 3 };

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientId = getClientIdentifier(request, "ambassador-submit");
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

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.phone || !body.zoneId) {
      return NextResponse.json(
        { success: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    const input: SubmitApplicationInput = {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      countryCode: body.countryCode || "BFA",
      city: body.city,
      zoneId: body.zoneId,
      dateOfBirth: body.dateOfBirth,
      catAnswer: body.catAnswer,
      honeypot: body.honeypot,
    };

    // Get referredBy from request (if coming from ambassador link)
    const referredBy = body.referredBy;

    // Honeypot check
    if (input.honeypot && input.honeypot.trim() !== "") {
      return NextResponse.json({ success: true, refCode: "AMB-XXXX" });
    }

    // Normalize phone
    const normalizedPhone = normalizePhone(input.phone);

    // Validate zone hierarchy
    const zoneValidation = validateZoneHierarchy(
      input.countryCode,
      input.city,
      input.zoneId
    );
    if (!zoneValidation.valid) {
      return NextResponse.json({ success: false, error: "invalid_zone" });
    }

    // Validate age
    const dob = new Date(
      input.dateOfBirth.year,
      input.dateOfBirth.month - 1,
      input.dateOfBirth.day
    );
    if (!isMinimumAge(dob, 20)) {
      return NextResponse.json({ success: false, error: "too_young" });
    }

    const db = getAdminDb();

    // Check for duplicates
    const existingSnap = await db
      .collection("ambassadors")
      .where("phone", "==", normalizedPhone)
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      const existing = existingSnap.docs[0];
      const data = existing.data();

      if (data.status === "pending") {
        return NextResponse.json({
          success: false,
          error: "duplicate_pending",
          existingAmbassadorId: existing.id,
        });
      }
      if (data.status === "approved") {
        return NextResponse.json({
          success: false,
          error: "duplicate_approved",
          existingAmbassadorId: existing.id,
        });
      }
      if (data.status === "rejected") {
        return NextResponse.json({
          success: false,
          error: "duplicate_rejected",
          existingAmbassadorId: existing.id,
        });
      }
    }

    // Generate unique refCode
    let refCode: string | null = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateRefCodeCandidate();
      const refCodeSnap = await db
        .collection("ambassadors")
        .where("refCode", "==", candidate)
        .limit(1)
        .get();

      if (refCodeSnap.empty) {
        refCode = candidate;
        break;
      }
    }

    if (!refCode) {
      return NextResponse.json({
        success: false,
        error: "internal_error",
      });
    }

    // Build ambassador data
    const ambassadorData: Record<string, unknown> = {
      refCode,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: normalizedPhone,
      zones: [input.zoneId],
      dateOfBirth: Timestamp.fromDate(dob),
      catAnswer: input.catAnswer,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      approvedAt: null,
      stats: {
        notificationsActivated: 0,
        alertsShared: 0,
        ambassadorsRecruited: 0,
        viewsGenerated: 0,
      },
    };

    // Add referredBy if provided and valid
    if (referredBy && /^AMB-[A-Z0-9]{4}$/.test(referredBy)) {
      ambassadorData.referredBy = referredBy;
    }

    // Create ambassador
    await db.collection("ambassadors").add(ambassadorData);

    const result: SubmitApplicationResult = { success: true, refCode };
    return NextResponse.json(result);
  } catch (error) {
    console.error("Submit ambassador application error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
