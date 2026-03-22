import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const db = getAdminDb();

// Admin password authentication (server-side only)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("x-admin-password");
  return !!ADMIN_PASSWORD && authHeader === ADMIN_PASSWORD;
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
    const { ambassadorId, rejectedBy, reason } = body;

    if (!ambassadorId || !rejectedBy) {
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

    // Update ambassador
    const updateData: {
      status: string;
      rejectedAt: FirebaseFirestore.FieldValue;
      rejectedBy: string;
      rejectionReason?: string;
    } = {
      status: "rejected",
      rejectedAt: FieldValue.serverTimestamp(),
      rejectedBy,
    };

    if (reason) {
      updateData.rejectionReason = reason;
    }

    await ambassadorRef.update(updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reject ambassador error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
