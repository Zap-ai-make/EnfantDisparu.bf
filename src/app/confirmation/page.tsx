"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { buildWhatsAppLink } from "@/lib/utils";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { LiveCounter } from "@/components/LiveCounter";
import { DiffusionCheckList } from "@/components/DiffusionCheckList";
import { DiffusionTimeline, DiffusionSummary } from "@/components/DiffusionTimeline";

function ConfirmationContent() {
  const params = useSearchParams();
  const shortCode = params.get("code") ?? "";
  const secretToken = params.get("token") ?? "";
  const docId = params.get("id") ?? "";

  const [alertCardURL, setAlertCardURL] = useState<string | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [announcementData, setAnnouncementData] = useState<any>(null);

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
          setAnnouncementData(data);
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

  const shareText = `🚨 ENFANT DISPARU — URGENT\n\nRetrouvez toutes les informations ici :\n🔗 ${announcementUrl}\n\n⚡ Partagez — chaque partage peut sauver une vie.`;

  return (
    <div className="space-y-6">
      {/* Succès */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-5xl mb-3">✅</p>
        <h1 className="text-2xl font-extrabold text-green-800 mb-2">
          Annonce publiée !
        </h1>
        <p className="text-green-700 text-sm">
          Votre annonce est en ligne et est diffusée sur Facebook, WhatsApp et auprès
          des membres de votre secteur.
        </p>
      </div>

      {/* Compteurs animés de mobilisation */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            🔥 La mobilisation s&apos;étend en ce moment même
          </h2>
          <p className="text-sm text-gray-600">
            Voici l&apos;impact de votre alerte en temps réel
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LiveCounter
            value={announcementData?.stats?.pushSent || 0}
            label="Notifications envoyées"
            icon="🔔"
            color="orange"
            size="sm"
          />
          <LiveCounter
            value={announcementData?.stats?.facebookReach || 0}
            label="Portée Facebook"
            icon="📘"
            color="blue"
            size="sm"
          />
          <LiveCounter
            value={announcementData?.stats?.whatsappChannelReach || 0}
            label="Abonnés WhatsApp"
            icon="💬"
            color="green"
            size="sm"
          />
          <LiveCounter
            value={announcementData?.stats?.pageViews || 0}
            label="Vues de l&apos;annonce"
            icon="👁️"
            color="red"
            size="sm"
          />
        </div>

        <div className="mt-4 p-4 bg-white/70 backdrop-blur rounded-xl">
          <DiffusionCheckList />
        </div>

        <div className="text-center mt-4 p-3 bg-white rounded-xl border border-orange-200">
          <p className="text-sm font-semibold text-orange-800">
            🚀 Votre alerte touche des milliers de personnes
          </p>
          <p className="text-xs text-orange-600 mt-1">
            Chaque partage supplémentaire multiplie les chances de retrouvailles
          </p>
        </div>
      </div>

      {/* Diffusion Timeline */}
      {announcementData?.stats?.diffusionTimeline && announcementData.stats.diffusionTimeline.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <DiffusionSummary timeline={announcementData.stats.diffusionTimeline} />
          <DiffusionTimeline timeline={announcementData.stats.diffusionTimeline} />
        </div>
      )}

      {/* Code de référence */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="font-bold text-gray-900">Votre code de référence</h2>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-extrabold text-red-600 tracking-wider">{shortCode}</p>
          <p className="text-xs text-gray-400 mt-1">Notez ce code — il identifie votre annonce</p>
        </div>

        <p className="text-sm text-gray-600">
          📱 Vous recevrez dans quelques secondes un message WhatsApp avec le lien
          pour gérer votre annonce (modifier, marquer comme retrouvé).
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <p className="text-sm text-blue-900 font-medium">
            💡 Astuce : Retrouvez vos annonces à tout moment
          </p>
          <p className="text-xs text-blue-700">
            Rendez-vous dans la section{" "}
            <Link href="/retrouver-mon-annonce" className="font-semibold underline hover:text-blue-900">
              &quot;Retrouver mon annonce&quot;
            </Link>
            {" "}avec votre numéro WhatsApp pour accéder à toutes vos annonces actives.
          </p>
        </div>

        {/* Lien de gestion affiché si WhatsApp non reçu */}
        <details className="text-xs text-gray-400">
          <summary className="cursor-pointer hover:text-gray-600">
            Pas reçu le lien WhatsApp ?
          </summary>
          <p className="mt-2 bg-gray-50 rounded-lg p-3 break-all select-all">
            {gestionUrl}
          </p>
          <p className="mt-1">Copiez ce lien et conservez-le en lieu sûr.</p>
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
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold w-full transition-colors"
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
              className="text-red-600 font-medium text-sm hover:underline mt-2 inline-block"
            >
              Voir l&apos;annonce →
            </Link>
          </div>
        )}
      </div>

      {/* Actions de partage */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="font-bold text-gray-900">⚡ Partagez maintenant</h2>
        <p className="text-sm text-gray-500">
          Plus vous partagez, plus l&apos;annonce atteint de personnes. Chaque partage compte.
        </p>

        <a
          href={buildWhatsAppLink("", shareText).replace("wa.me/", "api.whatsapp.com/send?text=")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold w-full transition-colors"
        >
          💬 Partager sur WhatsApp
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(announcementUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold w-full transition-colors"
        >
          📘 Partager sur Facebook
        </a>

        <Link
          href={`/annonce/${shortCode}`}
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium w-full hover:bg-gray-50 transition-colors"
        >
          👁 Voir l&apos;annonce
        </Link>
      </div>

    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-400">Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
