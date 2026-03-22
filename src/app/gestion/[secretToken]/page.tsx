"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getAnnouncementByToken,
  resolveAnnouncement,
  subscribeToSightings,
} from "@/lib/firestore";
import { StatsBar } from "@/components/StatsBar";
import { timeAgo, formatDate, urgencyLevel, urgencyColor, urgencyLabel, cn } from "@/lib/utils";
import type { Announcement, Sighting } from "@/types/announcement";

export default function GestionPage({
  params,
}: {
  params: Promise<{ secretToken: string }>;
}) {
  const { secretToken } = use(params);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    getAnnouncementByToken(secretToken).then((a) => {
      setAnnouncement(a);
      setLoading(false);
    });
  }, [secretToken]);

  // Écouter les signalements en temps réel
  useEffect(() => {
    if (!announcement?.id) return;
    const unsub = subscribeToSightings(announcement.id, setSightings);
    return () => unsub();
  }, [announcement?.id]);

  const handleResolve = async () => {
    if (!announcement) return;
    setResolving(true);
    try {
      await resolveAnnouncement(announcement.id);
      toast.success("Marqué comme retrouvé ! Merci et félicitations 🎉");
      setAnnouncement({ ...announcement, status: "resolved" });
    } catch {
      toast.error("Erreur. Veuillez réessayer.");
    } finally {
      setResolving(false);
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />
        <div className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="font-bold text-gray-700">Lien invalide ou expiré</p>
        <p className="text-sm text-gray-400 mt-2">
          Si vous avez perdu votre lien de gestion, vous pouvez le retrouver.
        </p>
        <Link
          href="/retrouver-mon-annonce"
          className="mt-4 inline-block bg-red-600 text-white px-5 py-2 rounded-xl font-medium text-sm"
        >
          Retrouver mon annonce
        </Link>
      </div>
    );
  }

  const level = urgencyLevel(announcement.createdAt);
  const isResolved = announcement.status === "resolved";
  const announcementUrl = `https://enfentdisparu.bf/annonce/${announcement.shortCode}`;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className={cn(
          "px-4 py-2 flex items-center justify-between text-sm font-bold",
          isResolved ? "bg-green-600 text-white" : urgencyColor(level)
        )}>
          <span>{isResolved ? "✅ RETROUVÉ" : `🚨 ${urgencyLabel(level)}`}</span>
          <span className="opacity-80 font-normal">{announcement.shortCode}</span>
        </div>

        <div className="p-5 flex gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            {announcement.childPhotoURL && (
              <Image src={announcement.childPhotoURL} alt={announcement.childName} fill className="object-cover" />
            )}
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-gray-900">{announcement.childName}</h1>
            <p className="text-gray-500 text-sm">{announcement.childAge} ans · {announcement.childGender === "M" ? "Garçon" : "Fille"}</p>
            <p className="text-gray-400 text-xs mt-1">Publiée {timeAgo(announcement.createdAt)}</p>
            <p className="text-gray-400 text-xs">Dernière vue : {formatDate(announcement.lastSeenAt)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={announcement.stats} />

      {/* Lien public */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-gray-900">🔗 Lien de l&apos;annonce</h2>
        <div className="flex gap-2">
          <input
            readOnly
            value={announcementUrl}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 select-all"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(announcementUrl);
              toast.success("Lien copié !");
            }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
          >
            Copier
          </button>
        </div>
        <Link
          href={`/annonce/${announcement.shortCode}`}
          className="block text-center text-sm text-red-600 font-medium"
        >
          Voir l&apos;annonce publique →
        </Link>
      </div>

      {/* Signalements reçus */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-3">
          👁 Signalements témoins
          {sightings.length > 0 && (
            <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
              {sightings.length}
            </span>
          )}
        </h2>
        {sightings.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Aucun signalement reçu pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {sightings.map((sighting) => (
              <div
                key={sighting.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    📍 {sighting.place}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    sighting.status === "pending" && "bg-yellow-100 text-yellow-700",
                    sighting.status === "confirmed" && "bg-green-100 text-green-700",
                    sighting.status === "reviewed" && "bg-blue-100 text-blue-700",
                    sighting.status === "dismissed" && "bg-gray-100 text-gray-500"
                  )}>
                    {sighting.status === "pending" && "Nouveau"}
                    {sighting.status === "confirmed" && "Confirmé"}
                    {sighting.status === "reviewed" && "Vu"}
                    {sighting.status === "dismissed" && "Écarté"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{sighting.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {sighting.createdAt.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isResolved ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-gray-900">Actions</h2>

          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors"
            >
              ✅ Mon enfant a été retrouvé
            </button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
              <p className="font-bold text-green-800 text-center">
                🎉 Confirmer la bonne nouvelle ?
              </p>
              <p className="text-sm text-green-700 text-center">
                L&apos;annonce sera clôturée et la communauté sera notifiée.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfirming(false)}
                  className="border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleResolve}
                  disabled={resolving}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:bg-green-400"
                >
                  {resolving ? "..." : "✅ Confirmer"}
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            Vous pouvez aussi{" "}
            <Link href={`/annonce/${announcement.shortCode}`} className="underline">
              voir votre annonce
            </Link>{" "}
            et la partager à nouveau.
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <p className="text-4xl mb-2">🎉</p>
          <p className="font-bold text-green-800 text-xl">{announcement.childName} est retrouvé(e) !</p>
          <p className="text-sm text-green-600 mt-2">
            La communauté a été notifiée. Merci à tous.
          </p>
        </div>
      )}
    </div>
  );
}
