"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin } from "lucide-react";
import { COUNTRIES, CITIES_BY_COUNTRY, ZONES_BY_CITY } from "@/lib/zones";
import { saveCustomZone } from "@/lib/firestore";
import { cn } from "@/lib/utils";

interface ZonePickerProps {
  /** Appelé dès que la sélection est complète */
  onChange: (zoneId: string, zoneName: string) => void;
  /** Message d'erreur venant du formulaire parent */
  error?: string;
}

const SELECT_CLASS = (err?: boolean) =>
  cn(
    "w-full border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 transition-colors appearance-none",
    err
      ? "border-red-300 focus:ring-red-500"
      : "border-gray-200 focus:ring-red-500 focus:border-red-400"
  );

const INPUT_CLASS = cn(
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-400 transition-colors"
);

export function ZonePicker({ onChange, error }: ZonePickerProps) {
  const [countryCode, setCountryCode] = useState("");
  const [city, setCity] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [customNeighborhood, setCustomNeighborhood] = useState("");

  const cities = countryCode ? (CITIES_BY_COUNTRY[countryCode] ?? []) : [];
  const zones = city ? (ZONES_BY_CITY[city] ?? []) : [];
  const country = COUNTRIES.find((c) => c.code === countryCode);

  // Notifier le parent quand la sélection est complète
  const notify = useCallback(
    (id: string, name: string) => onChange(id, name),
    [onChange]
  );

  // Sélection standard (liste)
  const handleZoneSelect = (selectedId: string) => {
    if (selectedId === "__other__") {
      setIsCustom(true);
      setZoneId("");
      setCustomCity(city);
      setCustomNeighborhood("");
      // On efface la valeur en cours
      notify("", "");
    } else {
      setIsCustom(false);
      setZoneId(selectedId);
      const zone = zones.find((z) => z.id === selectedId);
      if (zone) {
        notify(zone.id, `${zone.name} — ${zone.city}, ${zone.countryName}`);
      }
    }
  };

  // Sélection ville personnalisée
  const handleCustomCity = (value: string) => {
    setCustomCity(value);
    if (value && customNeighborhood && countryCode) {
      const zoneName = `${customNeighborhood} — ${value}, ${country?.name ?? countryCode}`;
      notify(`other-${countryCode.toLowerCase()}`, zoneName);

      // Sauvegarder la zone personnalisée pour future utilisation
      saveCustomZone(
        countryCode,
        country?.name ?? countryCode,
        value,
        customNeighborhood
      ).catch((error) => {
        console.error("Error saving custom zone:", error);
      });
    } else {
      notify("", "");
    }
  };

  const handleCustomNeighborhood = (value: string) => {
    setCustomNeighborhood(value);
    if (customCity && value && countryCode) {
      const zoneName = `${value} — ${customCity}, ${country?.name ?? countryCode}`;
      notify(`other-${countryCode.toLowerCase()}`, zoneName);

      // Sauvegarder la zone personnalisée pour future utilisation
      saveCustomZone(
        countryCode,
        country?.name ?? countryCode,
        customCity,
        value
      ).catch((error) => {
        console.error("Error saving custom zone:", error);
      });
    } else {
      notify("", "");
    }
  };

  // Réinitialiser ville + quartier quand le pays change
  useEffect(() => {
    setCity("");
    setZoneId("");
    setIsCustom(false);
    setCustomCity("");
    setCustomNeighborhood("");
    notify("", "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  // Réinitialiser quartier quand la ville change
  useEffect(() => {
    setZoneId("");
    setIsCustom(false);
    setCustomNeighborhood("");
    notify("", "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <div className="space-y-3">
      {/* Étape 1 — Pays */}
      <div className="relative">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className={SELECT_CLASS(!!error && !countryCode)}
        >
          <option value="">🌍 Sélectionner un pays</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Étape 2 — Ville */}
      {countryCode && (
        <div className="relative">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={SELECT_CLASS(!!error && !!countryCode && !city)}
          >
            <option value="">🏙 Sélectionner une ville</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="__other_city__">
              ✏️ Autre ville (non listée)
            </option>
          </select>
        </div>
      )}

      {/* Ville personnalisée + Quartier personnalisé */}
      {city === "__other_city__" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Entrez la localisation manuellement
          </p>
          <input
            type="text"
            placeholder="Nom de la ville *"
            value={customCity}
            onChange={(e) => handleCustomCity(e.target.value)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="Nom du quartier / secteur *"
            value={customNeighborhood}
            onChange={(e) => handleCustomNeighborhood(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      )}

      {/* Étape 3 — Quartier (si ville standard) */}
      {city && city !== "__other_city__" && (
        <div className="relative">
          <select
            value={zoneId}
            onChange={(e) => handleZoneSelect(e.target.value)}
            className={SELECT_CLASS(!!error && !!city && !zoneId && !isCustom)}
          >
            <option value="">📍 Sélectionner un quartier</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
            <option value="__other__">✏️ Autre quartier (non listé)</option>
          </select>
        </div>
      )}

      {/* Quartier personnalisé (si ville standard mais quartier non listé) */}
      {isCustom && city !== "__other_city__" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Précisez le quartier manuellement
          </p>
          <input
            type="text"
            placeholder={`Ville (ex: ${city})`}
            value={customCity}
            onChange={(e) => handleCustomCity(e.target.value)}
            className={INPUT_CLASS}
          />
          <input
            type="text"
            placeholder="Nom du quartier / secteur *"
            value={customNeighborhood}
            onChange={(e) => handleCustomNeighborhood(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
