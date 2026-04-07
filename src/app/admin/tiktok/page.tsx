"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type TikTokStatus = {
  isConnected: boolean;
  connectedAt?: number | null;
  expiresAt?: number | null;
};

export default function TikTokAdminPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [status, setStatus] = useState<TikTokStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadTikTokStatus();
    }
  }, [isAuthenticated]);

  const loadTikTokStatus = async () => {
    try {
      // Appel API serveur-side (sécurisé, ne expose pas les tokens)
      const response = await fetch('/api/admin/tiktok-status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error("Error loading TikTok status:", error);
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
    if (!status?.expiresAt) return false;
    return status.expiresAt > Date.now();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const success = await login(password);

    if (!success) {
      setError("Mot de passe incorrect");
      setPassword("");
    }

    setIsSubmitting(false);
  };

  // Écran de chargement auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  // Formulaire de login si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white text-center">
              <Lock className="w-12 h-12 mx-auto mb-3" />
              <h1 className="text-2xl font-bold">Accès Admin</h1>
              <p className="text-red-100 mt-2">Configuration TikTok</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe administrateur
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Entrez le mot de passe"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {status?.isConnected && isTokenValid() ? (
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
                        {status.connectedAt
                          ? new Date(status.connectedAt).toLocaleDateString("fr-FR", {
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
                        {status.expiresAt
                          ? new Date(status.expiresAt).toLocaleDateString("fr-FR", {
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
                ) : status && isTokenValid() ? (
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
        {process.env.NODE_ENV === "development" && status && (
          <div className="mt-6 bg-gray-100 rounded-xl p-4">
            <h4 className="font-mono text-xs font-bold text-gray-700 mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(
                {
                  isConnected: status.isConnected,
                  expiresAt: status.expiresAt,
                  isValid: isTokenValid(),
                  // Les tokens ne sont plus accessibles côté client (sécurité)
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
