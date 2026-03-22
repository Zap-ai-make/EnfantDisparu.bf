"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

function ConfirmationContent() {
  const params = useSearchParams();
  const shortCode = params.get("code") ?? "";
  const secretToken = params.get("token") ?? "";
  const docId = params.get("id") ?? "";

  const [alertCardURL, setAlertCardURL] = useState<string | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(true);

  // Écouter les changements sur le document pour détecter quand alertCardURL est disponible
  useEffect(() => {
    if (!docId) {
      setIsLoadingCard(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "announcements", docId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.alertCardURL) {
            setAlertCardURL(data.alertCardURL);
            setIsLoadingCard(false);
          }
        }
      },
      (error) => {
        console.error("Error listening to announcement:", error);
        setIsLoadingCard(false);
      }
    );

    // Timeout après 30 secondes si la carte n'est pas générée
    const timeout = setTimeout(() => {
      setIsLoadingCard(false);
    }, 30000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [docId]);

  const announcementUrl = `https://enfentdisparu.bf/annonce/${shortCode}`;
  const gestionUrl = `https://enfentdisparu.bf/gestion/${secretToken}`;

  return (
    <div className="space-y-6">
      {/* Succès */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-5xl mb-3">🙏</p>
        <h1 className="text-2xl font-extrabold text-green-800 mb-2">
          Merci pour votre geste !
        </h1>
        <p className="text-green-700 text-sm">
          Votre annonce est publiée. Les parents qui cherchent leur enfant
          pourront vous contacter.
        </p>
      </div>

      {/* Code de référence */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="font-bold text-gray-900">Code de référence</h2>
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-extrabold text-emerald-600 tracking-wider">{shortCode}</p>
          <p className="text-xs text-emerald-500 mt-1">Conservez ce code</p>
        </div>

        <p className="text-sm text-gray-600">
          Si les parents de l&apos;enfant vous contactent, vous pourrez utiliser
          ce code pour confirmer qu&apos;il s&apos;agit bien du même enfant.
        </p>

        <details className="text-xs text-gray-400">
          <summary className="cursor-pointer hover:text-gray-600">
            Lien de gestion
          </summary>
          <p className="mt-2 bg-gray-50 rounded-lg p-3 break-all select-all">
            {gestionUrl}
          </p>
        </details>
      </div>

      {/* Carte d'alerte */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="font-bold text-gray-900">🖼 Affiche d&apos;alerte</h2>
        <p className="text-sm text-gray-500">
          Cette affiche est automatiquement partagée sur les réseaux sociaux.
        </p>

        {isLoadingCard ? (
          <div className="bg-gray-100 rounded-xl p-8 text-center animate-pulse">
            <p className="text-4xl mb-3">⏳</p>
            <p className="text-gray-500 font-medium">Génération de l&apos;affiche en cours...</p>
            <p className="text-xs text-gray-400 mt-1">Cela peut prendre quelques secondes</p>
          </div>
        ) : alertCardURL ? (
          <div className="space-y-3">
            <div className="relative w-full aspect-[1200/630] rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={alertCardURL}
                alt={`Affiche d'alerte ${shortCode}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <a
              href={alertCardURL}
              download={`alerte-${shortCode}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold w-full transition-colors"
            >
              📥 Télécharger l&apos;affiche
            </a>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">
              L&apos;affiche sera disponible sur la page de l&apos;annonce.
            </p>
            <Link
              href={`/annonce/${shortCode}`}
              className="text-emerald-600 font-medium text-sm hover:underline mt-2 inline-block"
            >
              Voir l&apos;annonce →
            </Link>
          </div>
        )}
      </div>

      {/* Conseils */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
        <h2 className="font-bold text-amber-800 flex items-center gap-2">
          <span className="text-xl">💡</span>
          En attendant les parents
        </h2>
        <ul className="text-sm text-amber-700 space-y-2">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Gardez l&apos;enfant en sécurité dans un lieu public ou chez vous</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Donnez-lui à boire et à manger si nécessaire</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Rassurez-le et parlez-lui calmement</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Si personne ne vous contacte sous 24h, contactez la police</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="font-bold text-gray-900">Actions</h2>

        <Link
          href={`/annonce/${shortCode}`}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold w-full transition-colors"
        >
          👁 Voir l&apos;annonce
        </Link>

        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
            `🙋 ENFANT TROUVÉ\n\nJ'ai trouvé un enfant. Si vous le reconnaissez, contactez-moi :\n🔗 ${announcementUrl}\n\nMerci de partager !`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold w-full transition-colors"
        >
          💬 Partager sur WhatsApp
        </a>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium w-full hover:bg-gray-50 transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>

      {/* Numéros utiles */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-800 mb-2">📞 Numéros utiles</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="font-bold text-blue-700">Police</p>
            <p className="text-blue-600">17</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="font-bold text-blue-700">Pompiers</p>
            <p className="text-blue-600">18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationTrouvePage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-400">Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
