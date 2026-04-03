"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Phone, Key } from "lucide-react";

export default function AmbassadorLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ambassador/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (result.success && result.accessToken) {
        // Redirection immédiate vers le dashboard
        router.push(`/ambassadeur?t=${result.accessToken}`);
      } else {
        // Gestion des erreurs
        if (result.error === "not_found") {
          setError("Aucun compte ambassadeur trouvé avec ce numéro. Vérifiez votre numéro ou postulez d'abord.");
        } else if (result.error === "not_approved") {
          setError("Votre candidature est en cours de traitement. Vous recevrez un lien d'accès une fois approuvé.");
        } else {
          setError("Erreur lors de la demande d'accès. Réessayez plus tard.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur de connexion. Vérifiez votre connexion internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connexion Ambassadeur
          </h1>
          <p className="text-gray-600">
            Accédez à votre tableau de bord ambassadeur
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+226 XX XX XX XX"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Utilisez le numéro enregistré lors de votre candidature
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                  !
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !phone}
              className={`
                w-full py-3 rounded-xl font-semibold text-white
                transition-all duration-200
                flex items-center justify-center gap-2
                ${loading || !phone
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Help Links */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <a
              href="/programme-ambassadeur"
              className="block text-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              Pas encore ambassadeur ? <span className="font-semibold">Postulez ici</span>
            </a>
            <a
              href="https://wa.me/22670000000"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              Besoin d'aide ? <span className="font-semibold">Contactez-nous</span>
            </a>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-900 mb-1">
                Connexion sécurisée
              </p>
              <p className="text-xs text-orange-700">
                Entrez le numéro de téléphone enregistré lors de votre candidature pour accéder à votre tableau de bord.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
