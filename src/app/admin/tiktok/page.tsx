"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

type TikTokConfig = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  connectedAt?: number;
  openId?: string;
};

export default function TikTokAdminPage() {
  const [config, setConfig] = useState<TikTokConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    loadTikTokConfig();
  }, []);

  const loadTikTokConfig = async () => {
    try {
      const configDoc = await getDoc(doc(db, "app_config", "tiktok"));
      if (configDoc.exists()) {
        setConfig(configDoc.data() as TikTokConfig);
      }
    } catch (error) {
      console.error("Error loading TikTok config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    setConnecting(true);

    // TikTok OAuth URL
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
    const redirectUri = `${window.location.origin}/api/auth/tiktok/callback`;
    const scope = "user.info.basic,video.publish";
    const state = Math.random().toString(36).substring(7);

    // Store state in sessionStorage for verification
    sessionStorage.setItem("tiktok_oauth_state", state);

    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    window.location.href = authUrl;
  };

  const isTokenValid = () => {
    if (!config?.expiresAt) return false;
    return config.expiresAt > Date.now();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-red-600">
            ← Retour à l'accueil
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Configuration TikTok</h1>
            <p className="text-red-100">
              Connectez le compte TikTok officiel de EnfantDisparu.bf pour publier automatiquement les alertes
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status */}
            <div className="flex items-start gap-4 p-4 rounded-xl border-2 border-gray-200">
              {config && isTokenValid() ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-green-900 mb-1">
                      ✅ Compte TikTok connecté
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Les alertes seront automatiquement publiées sur TikTok
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        <strong>Connecté le :</strong>{" "}
                        {config.connectedAt
                          ? new Date(config.connectedAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Expire le :</strong>{" "}
                        {config.expiresAt
                          ? new Date(config.expiresAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-900 mb-1">
                      ⚠️ Compte TikTok non connecté
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connectez votre compte TikTok pour activer la publication automatique des alertes
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 mb-2">📋 Comment ça marche ?</h4>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Cliquez sur "Connecter TikTok" ci-dessous</li>
                <li>Autorisez EnfantDisparu.bf à publier sur votre compte TikTok</li>
                <li>Une fois connecté, toutes les nouvelles alertes seront automatiquement publiées</li>
                <li>Le token est valide pendant 24 heures (renouvelable automatiquement)</li>
              </ol>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : config && isTokenValid() ? (
                  "🔄 Reconnecter TikTok"
                ) : (
                  "🚀 Connecter TikTok"
                )}
              </button>
            </div>

            {/* Warning */}
            <div className="text-xs text-gray-500 text-center">
              ⚠️ Seuls les administrateurs autorisés doivent accéder à cette page
            </div>
          </div>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && config && (
          <div className="mt-6 bg-gray-100 rounded-xl p-4">
            <h4 className="font-mono text-xs font-bold text-gray-700 mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(
                {
                  hasAccessToken: !!config.accessToken,
                  hasRefreshToken: !!config.refreshToken,
                  expiresAt: config.expiresAt,
                  isValid: isTokenValid(),
                  // Ne jamais afficher les tokens complets côté client
                  tokenPreview: config.accessToken ? `${config.accessToken.substring(0, 10)}...` : null,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
