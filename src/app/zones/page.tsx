"use client";

import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import { COUNTRIES, ZONES_BY_COUNTRY } from "@/lib/zones";

export default function ZonesPage() {
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
            <h1 className="font-extrabold text-xl text-gray-900">Toutes les zones</h1>
            <p className="text-gray-500 text-sm">
              7 pays · {Object.values(ZONES_BY_COUNTRY).reduce(
                (acc, c) => acc + Object.values(c.cities).flat().length, 0
              )} quartiers couverts
            </p>
          </div>
        </div>
      </div>

      {/* Zones par pays → ville */}
      {COUNTRIES.map(({ code }) => {
        const country = ZONES_BY_COUNTRY[code];
        if (!country) return null;
        return (
          <div key={code} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* En-tête pays */}
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <span className="text-xl">{country.flag}</span>
              <h2 className="font-bold text-gray-900">{country.name}</h2>
              <span className="ml-auto text-xs text-gray-400">
                {Object.keys(country.cities).length} ville(s)
              </span>
            </div>

            {/* Villes + quartiers */}
            <div className="divide-y divide-gray-50">
              {Object.entries(country.cities).map(([cityName, zones]) => (
                <div key={cityName} className="p-4">
                  <h3 className="font-semibold text-gray-700 text-sm mb-2 flex items-center gap-1.5">
                    <span className="text-base">🏙</span>
                    {cityName}
                    <span className="text-gray-400 font-normal">({zones.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {zones.map((zone) => (
                      <Link
                        key={zone.id}
                        href={`/zones/${zone.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors group"
                      >
                        <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700 group-hover:text-red-600 font-medium truncate">
                          {zone.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
