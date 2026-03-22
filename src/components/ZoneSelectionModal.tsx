"use client";

import { useState, useEffect } from "react";
import { X, MapPin, ChevronDown, Check } from "lucide-react";
import { COUNTRIES, CITIES_BY_COUNTRY, ZONES_BY_CITY } from "@/lib/zones";
import { cn } from "@/lib/utils";

const ZONE_SELECTED_KEY = "onesignal_zone_selected";

interface ZoneSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onZoneSelected: (zoneId: string, zoneName: string, city: string, countryCode: string) => void;
}

export function ZoneSelectionModal({ isOpen, onClose, onZoneSelected }: ZoneSelectionModalProps) {
  const [countryCode, setCountryCode] = useState("BFA");
  const [city, setCity] = useState("");
  const [zoneId, setZoneId] = useState("");

  const cities = CITIES_BY_COUNTRY[countryCode] ?? [];
  const zones = city ? (ZONES_BY_CITY[city] ?? []) : [];
  const selectedZone = zones.find((z) => z.id === zoneId);

  const handleSubmit = () => {
    if (!zoneId || !selectedZone) return;

    // Marquer comme sélectionné pour ne plus demander
    localStorage.setItem(ZONE_SELECTED_KEY, zoneId);

    onZoneSelected(zoneId, selectedZone.name, city, countryCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Votre secteur</h2>
              <p className="text-sm text-gray-500">
                Pour recevoir les alertes proches de chez vous
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Pays */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Pays
            </label>
            <div className="relative">
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setCity("");
                  setZoneId("");
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ville
            </label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setZoneId("");
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
              >
                <option value="">Sélectionner une ville</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Quartier */}
          {city && zones.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quartier
              </label>
              <div className="relative">
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-base bg-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
                >
                  <option value="">Sélectionner un quartier</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-800">
            <p>
              Vous recevrez les alertes pour votre quartier et les quartiers voisins.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!zoneId}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
              zoneId
                ? "bg-red-600 hover:bg-red-700 active:scale-[0.98]"
                : "bg-gray-300 cursor-not-allowed"
            )}
          >
            <Check className="w-5 h-5" />
            Confirmer mon secteur
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Vérifie si l'utilisateur a déjà sélectionné sa zone
 */
export function hasSelectedZone(): boolean {
  try {
    return !!localStorage.getItem(ZONE_SELECTED_KEY);
  } catch {
    return false;
  }
}

/**
 * Récupère la zone sélectionnée
 */
export function getSelectedZone(): string | null {
  try {
    return localStorage.getItem(ZONE_SELECTED_KEY);
  } catch {
    return null;
  }
}
