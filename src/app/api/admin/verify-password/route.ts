import { NextRequest, NextResponse } from "next/server";

// Le mot de passe est maintenant côté serveur uniquement
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD not configured");
      return NextResponse.json(
        { success: false, error: "server_error" },
        { status: 500 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "invalid_password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid_request" },
      { status: 400 }
    );
  }
}
