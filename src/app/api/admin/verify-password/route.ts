import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { verifyAdminPassword, isAdminPasswordConfigured } from "@/lib/auth";

// Rate limit: 5 attempts per minute
const RATE_LIMIT = { windowMs: 60 * 1000, max: 5 };

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientId = getClientIdentifier(request, "admin-login");
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

    const { password } = await request.json();

    if (!isAdminPasswordConfigured()) {
      console.error("ADMIN_PASSWORD not configured");
      return NextResponse.json(
        { success: false, error: "server_error" },
        { status: 500 }
      );
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: "invalid_password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid_request" },
      { status: 400 }
    );
  }
}
