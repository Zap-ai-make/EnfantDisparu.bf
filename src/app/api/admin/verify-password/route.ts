import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

// Le mot de passe est maintenant côté serveur uniquement
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Rate limit: 5 attempts per minute
const RATE_LIMIT = { windowMs: 60 * 1000, max: 5 };

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare with itself to prevent timing leak on length
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

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

    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD not configured");
      return NextResponse.json(
        { success: false, error: "server_error" },
        { status: 500 }
      );
    }

    if (typeof password !== "string" || !safeCompare(password, ADMIN_PASSWORD)) {
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
