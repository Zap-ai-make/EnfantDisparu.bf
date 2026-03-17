"use client";

import Link from "next/link";
import { Shield, Bell, Users, ArrowRight } from "lucide-react";

export default function VigieConfirmeePage() {
  return (
    <div className="space-y-4">
      {/* Success header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">Bienvenue dans le réseau !</h1>
        <p className="text-emerald-100">
          Vous êtes maintenant une vigie officielle d&apos;EnfantDisparu.bf
        </p>
      </div>

      {/* Next steps */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Prochaines étapes</h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Vous allez recevoir un message WhatsApp</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Un message de bienvenue avec les instructions vous sera envoyé dans les prochaines minutes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🔔</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Activez les notifications WhatsApp</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Assurez-vous que les notifications sont activées pour ne pas manquer les alertes urgentes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Parlez-en autour de vous</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Plus il y a de vigies dans un quartier, plus vite on retrouve les enfants.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 space-y-3">
        <h2 className="font-bold text-blue-900">Comment ça marche ?</h2>
        <div className="space-y-2 text-sm text-blue-700">
          <p>
            <span className="font-semibold">1.</span> Quand un enfant disparaît dans votre zone, vous recevez une alerte WhatsApp immédiate avec sa photo et description.
          </p>
          <p>
            <span className="font-semibold">2.</span> Vous surveillez votre quartier et partagez l&apos;alerte dans vos groupes locaux.
          </p>
          <p>
            <span className="font-semibold">3.</span> Si vous voyez l&apos;enfant, vous signalez immédiatement via l&apos;application.
          </p>
          <p>
            <span className="font-semibold">4.</span> Vous êtes notifié quand l&apos;enfant est retrouvé.
          </p>
        </div>
      </div>

      {/* Stats card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-emerald-600">89%</p>
            <p className="text-xs text-gray-500">taux de retrouvailles</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-blue-600">4h</p>
            <p className="text-xs text-gray-500">temps moyen</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-orange-600">127</p>
            <p className="text-xs text-gray-500">vigies actives</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="block bg-gray-900 hover:bg-gray-800 text-white rounded-2xl p-5 transition-colors text-center"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold">Voir les alertes en cours</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>

      {/* Share */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 text-center">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Invitez d&apos;autres personnes à devenir vigies
        </p>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Je viens de m'inscrire comme vigie sur EnfantDisparu.bf pour aider à protéger les enfants de notre quartier ! Rejoins-moi : https://enfantdisparu.bf/devenir-vigie")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          💬 Partager sur WhatsApp
        </a>
      </div>
    </div>
  );
}
