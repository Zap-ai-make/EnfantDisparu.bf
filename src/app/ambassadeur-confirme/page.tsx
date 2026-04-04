"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  return (
    <div className="space-y-4">
      {/* Success header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-extrabold mb-2">Candidature envoyée !</h1>
        <p className="text-green-100 text-sm">
          Merci de vouloir protéger les enfants du Burkina Faso
        </p>
      </div>

      {/* Ref code */}
      {refCode && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-sm text-gray-500 mb-2">Votre code de référence</p>
          <p className="text-2xl font-mono font-bold text-amber-500">{refCode}</p>
          <p className="text-xs text-gray-400 mt-2">
            Conservez ce code pour suivre votre candidature
          </p>
        </div>
      )}

      {/* Next steps */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">Prochaines étapes</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Validation en cours</p>
              <p className="text-sm text-gray-500">
                Notre équipe examine votre candidature (24-48h)
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Lien WhatsApp</p>
              <p className="text-sm text-gray-500">
                Vous recevrez un lien d&apos;accès à votre tableau de bord par WhatsApp
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Info box */}
      <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
        <p className="text-sm text-amber-800">
          <strong>En attendant :</strong> Activez les notifications pour recevoir les alertes
          d&apos;enfants disparus dans votre zone dès maintenant.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {refCode && (
          <Link
            href={`/candidature?ref=${refCode}`}
            className="block w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold text-sm text-center transition-colors"
          >
            Suivre ma candidature
          </Link>
        )}
        <Link
          href="/"
          className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm text-center transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default function AmbassadeurConfirmePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
