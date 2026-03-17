"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, MapPin } from "lucide-react";
import { subscribeToZoneAnnouncements } from "@/lib/firestore";
import { getZoneById, ZONES_BY_CITY } from "@/lib/zones";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import type { Announcement } from "@/types/announcement";

export default function ZonePage({
  params,
}: {
  params: Promise<{ zoneId: string }>;
}) {
  const { zoneId } = use(params);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const zone = getZoneById(zoneId);

  useEffect(() => {
    const unsub = subscribeToZoneAnnouncements(zoneId, (anns) => {
      setAnnouncements(anns);
      setLoading(false);
    });
    return () => unsub();
  }, [zoneId]);

  if (!zone) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-4xl mb-3">📍</p>
        <p className="font-bold text-gray-700">Zone introuvable</p>
        <p className="text-sm text-gray-400 mt-1">ID : {zoneId}</p>
        <Link href="/" className="mt-4 inline-block text-red-600 font-medium text-sm">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <Link href="/" className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-gray-900">{zone.name}</h1>
            <p className="text-gray-500 text-sm">{zone.city}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-3">
          <Bell className="w-5 h-5 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              Recevoir les alertes de cette zone
            </p>
            <p className="text-xs text-gray-500">
              Soyez notifié dès qu&apos;un enfant disparaît dans ce secteur
            </p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            S&apos;abonner
          </button>
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="space-y-3">
        <h2 className="font-bold text-gray-700 px-1">
          🚨 Alertes actives ({announcements.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-3xl mb-2">✅</p>
            <p className="font-bold text-gray-700">Aucune alerte active</p>
            <p className="text-sm text-gray-400 mt-1">
              Bonne nouvelle ! Pas d&apos;enfant disparu signalé dans cette zone.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </div>

      {/* Autres zones de la même ville */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-700 mb-3">
          Autres zones à {zone.city}
        </h2>
        <div className="flex flex-wrap gap-2">
          {ZONES_BY_CITY[zone.city]
            ?.filter((z) => z.id !== zoneId)
            .map((z) => (
              <Link
                key={z.id}
                href={`/zones/${z.id}`}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {z.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
