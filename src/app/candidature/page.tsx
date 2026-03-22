"use client";

import { useState } from "react";
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { getAmbassadorByRefCode } from "@/lib/firestore";
import type { Ambassador } from "@/types/ambassador";

export default function CandidaturePage() {
  const [refCode, setRefCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!refCode.trim()) return;

    setLoading(true);
    setError("");
    setAmbassador(null);

    try {
      const result = await getAmbassadorByRefCode(refCode.trim().toUpperCase());

      if (!result) {
        setError("Aucune candidature trouvée avec ce code.");
      } else {
        setAmbassador(result);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la recherche. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: Ambassador["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-8 h-8 text-amber-500" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-700",
          title: "En cours de validation",
          description: "Votre candidature est en cours d'examen par notre équipe. Vous recevrez un message WhatsApp dès qu'elle sera traitée (24-48h).",
        };
      case "approved":
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          title: "Candidature approuvée !",
          description: "Félicitations ! Vous êtes maintenant ambassadeur. Vous devriez avoir reçu un lien d'accès à votre tableau de bord par WhatsApp.",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          title: "Candidature non retenue",
          description: "Malheureusement, votre candidature n'a pas été retenue cette fois-ci.",
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Suivi de Candidature</h1>
            <p className="text-gray-300 text-sm">Vérifiez l'état de votre candidature ambassadeur</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Code de référence
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Entrez le code reçu lors de votre inscription (ex: AMB-AB12)
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="AMB-XXXX"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gray-900"
            maxLength={8}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !refCode.trim()}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? "..." : "Rechercher"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Result */}
      {ambassador && (
        <div className="space-y-4">
          {/* Status */}
          <div
            className={`rounded-2xl border p-6 ${getStatusInfo(ambassador.status).bgColor} ${getStatusInfo(ambassador.status).borderColor}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getStatusInfo(ambassador.status).icon}
              </div>
              <div className="flex-1">
                <h2
                  className={`text-lg font-bold mb-2 ${getStatusInfo(ambassador.status).textColor}`}
                >
                  {getStatusInfo(ambassador.status).title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {getStatusInfo(ambassador.status).description}
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3">Informations</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Code :</span>
                <span className="font-mono font-semibold text-gray-900">
                  {ambassador.refCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nom :</span>
                <span className="font-medium text-gray-900">
                  {ambassador.firstName} {ambassador.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date de candidature :</span>
                <span className="text-gray-900">
                  {ambassador.createdAt &&
                    new Date(
                      typeof ambassador.createdAt === "object" &&
                        "toDate" in ambassador.createdAt
                        ? ambassador.createdAt.toDate()
                        : ambassador.createdAt
                    ).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              {ambassador.status === "pending" && (
                <>
                  <strong>Que faire en attendant ?</strong> Activez les notifications push pour
                  recevoir les alertes d'enfants disparus dès maintenant. Vous n'avez pas besoin
                  d'attendre l'approbation pour aider !
                </>
              )}
              {ambassador.status === "approved" && (
                <>
                  <strong>Vous n'avez pas reçu le lien ?</strong> Vérifiez vos messages WhatsApp
                  ou contactez-nous. Le lien commence par : https://enfentdisparu.bf/ambassadeur
                </>
              )}
              {ambassador.status === "rejected" && (
                <>
                  <strong>Pourquoi ?</strong>{" "}
                  {(ambassador as any).rejectionReason ||
                    "Vous pouvez nous contacter pour plus d'informations."}{" "}
                  Vous pouvez toujours aider en activant les notifications push !
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!ambassador && !error && (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-bold text-gray-700 text-sm mb-1">
            Comment trouver mon code ?
          </p>
          <p className="text-xs text-gray-500">
            Votre code de référence vous a été fourni sur la page de confirmation après votre
            inscription. Il commence par AMB- suivi de 4 caractères.
          </p>
        </div>
      )}
    </div>
  );
}
