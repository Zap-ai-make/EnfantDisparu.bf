import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

/**
 * API route serveur pour vérifier le statut de connexion TikTok
 * Protège les tokens en ne les exposant jamais côté client
 *
 * GET /api/admin/tiktok-status
 * Returns: { isConnected: boolean, connectedAt?: number, expiresAt?: number }
 */
export async function GET() {
  try {
    const configDoc = await adminDb.collection('app_config').doc('tiktok').get();

    if (!configDoc.exists) {
      return NextResponse.json({
        isConnected: false,
      });
    }

    const config = configDoc.data();
    if (!config) {
      return NextResponse.json({
        isConnected: false,
      });
    }

    const isTokenValid = config.expiresAt && config.expiresAt > Date.now();

    return NextResponse.json({
      isConnected: !!config.accessToken && isTokenValid,
      connectedAt: config.connectedAt || null,
      expiresAt: config.expiresAt || null,
      // NE JAMAIS exposer accessToken ou refreshToken
    });
  } catch (error) {
    console.error('Error checking TikTok status:', error);
    return NextResponse.json(
      { error: 'Failed to check TikTok status' },
      { status: 500 }
    );
  }
}
