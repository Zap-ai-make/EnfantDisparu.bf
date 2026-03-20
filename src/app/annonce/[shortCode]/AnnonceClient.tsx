"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Eye, Navigation } from "lucide-react";
import { LocationMapWrapper } from "@/components/LocationMapWrapper";
import { ShareButtons } from "@/components/ShareButtons";
import {
  subscribeToAnnouncement,
  incrementPageViews,
  createSighting,
  subscribeToAlertUpdates,
} from "@/lib/firestore";
import toast from "react-hot-toast";
import { StatsBar } from "@/components/StatsBar";
import { Badge } from "@/components/ui/Badge";
import {
  formatDate,
  formatDateShort,
  elapsedTime,
  urgencyLevel,
  urgencyLabel,
  urgencyColor,
  cn,
} from "@/lib/utils";
import type { Announcement } from "@/types/announcement";

interface AnnonceClientProps {
  shortCode: string;
}

export function AnnonceClient({ shortCode }: AnnonceClientProps) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSightingForm, setShowSightingForm] = useState(false);
  const [sightingDesc, setSightingDesc] = useState("");
  const [sightingPlace, setSightingPlace] = useState("");
  const [sightingSubmitting, setSightingSubmitting] = useState(false);

  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertPhone, setAlertPhone] = useState("");
  const [alertSubmitting, setAlertSubmitting] = useState(false);

  // Soumettre un signalement
  const handleSightingSubmit = async () => {
    if (!announcement || !sightingPlace || !sightingDesc) return;
    setSightingSubmitting(true);
    try {
      await createSighting({
        announcementId: announcement.id,
        place: sightingPlace,
        description: sightingDesc,
      });
      toast.success("Signalement envoyé ! Merci pour votre aide.");
      setSightingPlace("");
      setSightingDesc("");
      setShowSightingForm(false);
    } catch {
      toast.error("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setSightingSubmitting(false);
    }
  };

  // S'abonner aux alertes
  const handleAlertSubscribe = async () => {
    if (!announcement || !alertPhone) return;
    setAlertSubmitting(true);
    try {
      await subscribeToAlertUpdates(announcement.id, alertPhone);
      toast.success("Vous serez notifié si l'enfant est retrouvé !");
      setAlertPhone("");
      setShowAlertForm(false);
    } catch {
      toast.error("Erreur lors de l'inscription. Réessayez.");
    } finally {
      setAlertSubmitting(false);
    }
  };

  useEffect(() => {
    const unsub = subscribeToAnnouncement(shortCode, (a) => {
      setAnnouncement(a);
      setLoading(false);
    });
    return () => unsub();
  }, [shortCode]);

  // Incrémenter les vues au chargement
  useEffect(() => {
    if (announcement?.id) {
      incrementPageViews(announcement.id);
    }
  }, [announcement?.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />
        <div className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-bold text-gray-700">Annonce introuvable</p>
        <p className="text-sm text-gray-400 mt-1">Code : {shortCode}</p>
        <Link href="/" className="mt-4 inline-block text-red-600 font-medium text-sm">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const level = urgencyLevel(announcement.createdAt);
  const isResolved = announcement.status === "resolved";
  const lastSeenDateShort = formatDateShort(announcement.lastSeenAt || announcement.createdAt);

  return (
    <div className="space-y-4">
      {/* Carte principale */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Bandeau statut */}
        <div className={cn(
          "px-4 py-2 flex items-center justify-between",
          isResolved ? "bg-green-600 text-white" : urgencyColor(level)
        )}>
          <span className="text-sm font-bold tracking-wide">
            {isResolved ? "✅ ENFANT RETROUVÉ" : `🚨 ${urgencyLabel(level)}`}
          </span>
          <span className="text-xs opacity-80">{announcement.shortCode}</span>
        </div>

        {/* Photo */}
        <div className="relative w-full aspect-[4/3] bg-gray-100">
          {announcement.childPhotoURL ? (
            <Image
              src={announcement.childPhotoURL}
              alt={`Photo de ${announcement.childName}`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-8xl">
              👦
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                {announcement.childName}
              </h1>
              <p className="text-gray-500">
                {announcement.childAge} ans · {announcement.childGender === "M" ? "Garçon" : "Fille"}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-medium">{announcement.lastSeenPlace}</p>
                <p className="text-gray-400 text-xs">{announcement.zoneName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{formatDate(announcement.lastSeenAt)}</span>
            </div>
            {/* Timer de disparition */}
            {!isResolved && announcement.type !== "found" && (
              <div className={cn(
                "flex items-center gap-2 font-semibold",
                level === "critical" ? "text-red-600" : level === "urgent" ? "text-orange-600" : "text-gray-600"
              )}>
                <span className={cn("w-2 h-2 rounded-full", level === "critical" ? "bg-red-500 animate-pulse" : level === "urgent" ? "bg-orange-500" : "bg-gray-400")} />
                <span>Disparu depuis {elapsedTime(announcement.lastSeenAt || announcement.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
            <p className="text-sm text-gray-600">{announcement.description}</p>
            {announcement.distinctiveSign && (
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Signe distinctif :</span> {announcement.distinctiveSign}
              </p>
            )}
          </div>

          {/* Stats vues */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Eye className="w-3 h-3" />
            <span>{announcement.stats.pageViews.toLocaleString()} personnes ont vu cette annonce</span>
          </div>
        </div>
      </div>

      {/* Stats de diffusion */}
      <StatsBar stats={announcement.stats} />

      {/* Carte de localisation — si coordonnées GPS disponibles */}
      {announcement.lastGpsLat && announcement.lastGpsLng && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-red-500" />
              Dernière position connue
            </h2>
          </div>
          <LocationMapWrapper
            latitude={announcement.lastGpsLat}
            longitude={announcement.lastGpsLng}
            childName={announcement.childName}
            lastSeenPlace={announcement.lastSeenPlace}
            showRadius={true}
            radiusMeters={500}
            className="h-[250px]"
          />
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Coordonnées approximatives basées sur le lieu du signalement.
            </p>
          </div>
        </div>
      )}

      {/* Actions — seulement si cas actif */}
      {!isResolved && (
        <>
          {/* Boutons de partage et téléchargement */}
          <ShareButtons
            alertCardURL={announcement.alertCardURL}
            shortCode={announcement.shortCode}
            childName={announcement.childName}
            childAge={announcement.childAge}
            childGender={announcement.childGender}
            zoneName={announcement.zoneName}
            lastSeenAt={lastSeenDateShort}
            type={announcement.type}
          />

          {/* Signaler un témoin */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-3">📍 Vous avez vu cet enfant ?</h2>
            {!showSightingForm ? (
              <button
                onClick={() => setShowSightingForm(true)}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-gray-500 hover:border-red-300 hover:text-red-600 transition-colors text-sm font-medium"
              >
                Signaler un témoin →
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Où l'avez-vous vu ? (lieu précis)"
                  value={sightingPlace}
                  onChange={(e) => setSightingPlace(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <textarea
                  rows={2}
                  placeholder="Décrivez ce que vous avez vu..."
                  value={sightingDesc}
                  onChange={(e) => setSightingDesc(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleSightingSubmit}
                  disabled={!sightingPlace || !sightingDesc || sightingSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  {sightingSubmitting ? "Envoi..." : "Envoyer le signalement"}
                </button>
                <button
                  onClick={() => setShowSightingForm(false)}
                  className="w-full text-gray-400 text-sm py-1"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>

          {/* Alertez-moi si retrouvé */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-3">🔔 M&apos;alerter si retrouvé</h2>
            {!showAlertForm ? (
              <button
                onClick={() => setShowAlertForm(true)}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-gray-500 hover:border-green-300 hover:text-green-600 transition-colors text-sm font-medium"
              >
                Recevoir une notification →
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Entrez votre numéro WhatsApp pour être notifié quand {announcement.childName} sera retrouvé(e).
                </p>
                <input
                  type="tel"
                  placeholder="+226 70 00 00 00"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleAlertSubscribe}
                  disabled={!alertPhone || alertSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  {alertSubmitting ? "Inscription..." : "M'inscrire"}
                </button>
                <button
                  onClick={() => setShowAlertForm(false)}
                  className="w-full text-gray-400 text-sm py-1"
                >
                  Annuler
                </button>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-3">
              {announcement.stats.alertSubscribers} personne(s) attendent des nouvelles
            </p>
          </div>
        </>
      )}

      {/* Si résolu */}
      {isResolved && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
          <p className="text-3xl mb-2">🎉</p>
          <p className="font-bold text-green-800">{announcement.childName} a été retrouvé(e) !</p>
          <p className="text-sm text-green-600 mt-1">
            Merci à toute la communauté qui a partagé et contribué.
          </p>
        </div>
      )}

    </div>
  );
}
