"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MapPin, X, ChevronDown, Search, ChevronUp, Bell, Share2, Users, Zap } from "lucide-react";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { NetworkCoverageMap } from "@/components/NetworkCoverageMap";
import { subscribeToFilteredAnnouncements, getGlobalStats } from "@/lib/firestore";
import { COUNTRIES, CITIES_BY_COUNTRY, ZONES_BY_CITY, getZoneById } from "@/lib/zones";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types/announcement";

// ─── Détection pays via fuseau horaire ───────────────────────────────────────

const TZ_TO_COUNTRY: Record<string, string> = {
  "Africa/Ouagadougou": "BFA",
  "Africa/Abidjan":     "CIV",
  "Africa/Porto-Novo":  "BEN",
  "Africa/Lome":        "TGO",
  "Africa/Bamako":      "MLI",
  "Africa/Niamey":      "NER",
  "Africa/Dakar":       "SEN",
};

function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TZ_TO_COUNTRY[tz] ?? "";
  } catch {
    return "";
  }
}

/** Extrait le code pays depuis un zoneId ("bfa-ouaga-pissy" → "BFA") */
function countryFromZoneId(zoneId: string): string {
  const parts = zoneId.split("-");
  const code = parts[0] === "other" ? parts[1] : parts[0];
  return code?.toUpperCase() ?? "";
}

// ─── Composant Select avec icône flèche ──────────────────────────────────────

function FilterSelect({
  value,
  onChange,
  children,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-3 pr-10 text-base sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer text-gray-700"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

type StatusFilter = "active" | "resolved" | "all";

const STATUS_CHIPS: { value: StatusFilter; label: string; activeClass: string }[] = [
  { value: "active",   label: "🚨 En cours",  activeClass: "bg-red-100 text-red-700 border-red-200" },
  { value: "resolved", label: "✅ Retrouvés", activeClass: "bg-green-100 text-green-700 border-green-200" },
  { value: "all",      label: "Tout",          activeClass: "bg-gray-200 text-gray-800 border-gray-300" },
];

export default function HomePage() {
  const [stats, setStats]       = useState({ totalResolved: 0, totalActive: 0 });
  const [rawList, setRawList]   = useState<Announcement[]>([]);
  const [loading, setLoading]   = useState(true);

  // Filtres
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [countryFilter, setCountryFilter] = useState<string>(() => detectCountry());
  const [cityFilter, setCityFilter]       = useState<string>("");
  const [zoneFilter, setZoneFilter]       = useState<string>("");
  const [searchQuery, setSearchQuery]     = useState<string>("");

  // Stats globales
  useEffect(() => {
    getGlobalStats().then(setStats);
  }, []);

  // Abonnement Firestore — par zoneId si sélectionné, sinon large (filtre côté client)
  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToFilteredAnnouncements(
      (data) => { setRawList(data); setLoading(false); },
      { status: statusFilter, zoneId: zoneFilter || undefined, maxResults: 50 }
    );
    return () => unsub();
  }, [statusFilter, zoneFilter]);

  // Filtre côté client : recherche, pays puis ville (le quartier est géré par Firestore)
  const announcements = rawList.filter((a) => {
    // Filtre de recherche
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesName = a.childName.toLowerCase().includes(q);
      const matchesCode = a.shortCode.toLowerCase().includes(q);
      const matchesPlace = a.lastSeenPlace.toLowerCase().includes(q);
      const matchesZone = a.zoneName.toLowerCase().includes(q);
      const matchesDesc = a.description?.toLowerCase().includes(q);
      if (!matchesName && !matchesCode && !matchesPlace && !matchesZone && !matchesDesc) {
        return false;
      }
    }

    if (zoneFilter) return true; // déjà filtré par Firestore

    if (cityFilter) {
      const zone = getZoneById(a.zoneId);
      if (!zone || zone.city !== cityFilter) return false;
    } else if (countryFilter) {
      if (countryFromZoneId(a.zoneId) !== countryFilter) return false;
    }

    return true;
  });

  const clearLocation = useCallback(() => {
    setCountryFilter("");
    setCityFilter("");
    setZoneFilter("");
  }, []);

  const successRate =
    stats.totalResolved + stats.totalActive > 0
      ? Math.round((stats.totalResolved / (stats.totalResolved + stats.totalActive)) * 100)
      : 0;

  const hasLocationFilter = !!(countryFilter || cityFilter || zoneFilter);

  const [showHowItWorks, setShowHowItWorks] = useState(true);

  return (
    <div className="space-y-4">

      {/* Comment ça marche - Introduction */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full px-4 py-3 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span className="font-bold text-gray-900 text-sm">Comment ça marche ?</span>
          </div>
          {showHowItWorks ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {showHowItWorks && (
          <div className="px-4 pb-4 space-y-4">
            {/* Mission */}
            <div className="bg-white/60 rounded-xl p-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-gray-900">EnfantDisparu.bf</strong> est la plateforme nationale d&apos;alerte pour les enfants disparus au Burkina Faso.
                Notre système diffuse <strong>instantanément</strong> chaque signalement sur <strong>Facebook, Instagram, TikTok, X et LinkedIn</strong> pour toucher
                les personnes qui peuvent vraiment aider : commerçants, mamans au foyer, boutiquiers, jardiniers — tous ceux qui sont dans la rue et les quartiers.
              </p>
            </div>

            {/* Le problème actuel */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-xs font-bold text-red-800 mb-1">⚠️ Le problème actuel</p>
              <p className="text-xs text-red-700">
                Les annonces de disparition restent souvent limitées à 1-2 réseaux sociaux et touchent principalement
                les gens dans les bureaux. Elles n&apos;atteignent pas les personnes dans la rue qui pourraient reconnaître l&apos;enfant.
              </p>
            </div>

            {/* Comment ça fonctionne */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-800">🔄 Notre solution</p>
              <div className="grid gap-2">
                <div className="flex items-start gap-2 bg-white/60 rounded-lg p-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong className="text-gray-800">Diffusion instantanée</strong> — Une annonce ici = publication automatique sur tous les réseaux
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-white/60 rounded-lg p-2">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-3 h-3 text-amber-600" />
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong className="text-gray-800">Alertes ciblées</strong> — Recevez une notification avec photo si un enfant disparaît dans votre quartier
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-white/60 rounded-lg p-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong className="text-gray-800">Réseau de vigilance</strong> — Plus nous sommes nombreux, plus vite on retrouve les enfants
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3 text-center">
              <p className="text-white text-xs font-medium mb-2">
                🤝 Aidez-nous à couvrir tout le Burkina — partagez ce site autour de vous
              </p>
              <div className="flex items-center justify-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-white/80" />
                <span className="text-white/90 text-xs">enfantdisparu.bf</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats globales - responsive */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-green-600 leading-none">{stats.totalResolved}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">✅ Retrouvés</p>
          </div>
          <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-red-600 leading-none">{stats.totalActive}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">🚨 Actifs</p>
          </div>
          <div className="px-2 sm:px-4 py-3 sm:py-4 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 leading-none">{successRate}%</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">⚡ Succès</p>
          </div>
        </div>
      </div>

      {/* Double CTA - compact */}
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/signaler"
          className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl px-3 py-2.5 transition-colors shadow-sm active:scale-[0.98]"
        >
          <span className="text-lg">🚨</span>
          <p className="text-sm font-bold">Mon enfant a disparu</p>
        </Link>
        <Link
          href="/enfant-trouve"
          className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl px-3 py-2.5 transition-colors shadow-sm active:scale-[0.98]"
        >
          <span className="text-lg">🙋</span>
          <p className="text-sm font-bold">J&apos;ai trouvé un enfant</p>
        </Link>
      </div>

      {/* ── Barre de recherche - tactile ──────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          inputMode="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher nom, code, lieu..."
          className="w-full bg-white border border-gray-200 rounded-2xl pl-11 sm:pl-12 pr-12 py-3.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors"
            aria-label="Effacer la recherche"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* ── Filtres ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 space-y-3">

        {/* Chips statut - larger touch targets */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
          {STATUS_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setStatusFilter(chip.value)}
              className={cn(
                "px-3 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap flex-shrink-0 active:scale-95",
                statusFilter === chip.value
                  ? chip.activeClass
                  : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100 active:bg-gray-200"
              )}
            >
              {chip.label}
              {chip.value === "active" && stats.totalActive > 0 && (
                <span className="ml-1.5 bg-red-200 text-red-700 rounded-full px-1.5 text-[10px]">{stats.totalActive}</span>
              )}
              {chip.value === "resolved" && stats.totalResolved > 0 && (
                <span className="ml-1.5 bg-green-200 text-green-700 rounded-full px-1.5 text-[10px]">{stats.totalResolved}</span>
              )}
            </button>
          ))}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Filtre localisation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Localisation
              {countryFilter && !hasLocationFilter && (
                <span className="text-gray-400 font-normal">
                  {" "}· auto-détecté
                </span>
              )}
            </span>
            {hasLocationFilter && (
              <button
                onClick={clearLocation}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
                Tout effacer
              </button>
            )}
          </div>

          {/* Pays */}
          <FilterSelect
            value={countryFilter}
            onChange={(v) => { setCountryFilter(v); setCityFilter(""); setZoneFilter(""); }}
            placeholder="🌍 Tous les pays"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </FilterSelect>

          {/* Ville — visible si pays sélectionné */}
          {countryFilter && (
            <FilterSelect
              value={cityFilter}
              onChange={(v) => { setCityFilter(v); setZoneFilter(""); }}
              placeholder="🏙 Toutes les villes"
            >
              {(CITIES_BY_COUNTRY[countryFilter] ?? []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </FilterSelect>
          )}

          {/* Quartier — visible si ville sélectionnée */}
          {cityFilter && (
            <FilterSelect
              value={zoneFilter}
              onChange={setZoneFilter}
              placeholder="📍 Tous les quartiers"
            >
              {(ZONES_BY_CITY[cityFilter] ?? []).map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </FilterSelect>
          )}
        </div>
      </div>

      {/* ── Liste des annonces ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">
          {loading ? "Chargement…" : (
            <>
              {announcements.length} alerte{announcements.length !== 1 ? "s" : ""}
              {searchQuery.trim() ? ` · "${searchQuery.trim()}"` : ""}
              {statusFilter === "active"   ? " · en cours" : ""}
              {statusFilter === "resolved" ? " · retrouvés" : ""}
              {cityFilter ? ` · ${cityFilter}` : countryFilter ? ` · ${COUNTRIES.find(c => c.code === countryFilter)?.name ?? ""}` : ""}
            </>
          )}
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-4xl mb-3">
              {statusFilter === "resolved" ? "📋" : "✅"}
            </p>
            <p className="font-bold text-gray-700">
              {statusFilter === "resolved"
                ? "Aucun enfant retrouvé enregistré"
                : "Aucune alerte active"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {hasLocationFilter ? "Essayez d'élargir votre recherche." : "Bonne nouvelle !"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Devenir Ambassadeur */}
      <Link
        href="/devenir-ambassadeur"
        className="block bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🛡</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Devenez Ambassadeur</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Recevez les alertes et aidez à mobiliser votre communauté.
            </p>
          </div>
          <span className="text-gray-300 text-lg flex-shrink-0">›</span>
        </div>
      </Link>

      {/* Carte du réseau de vigilance */}
      <NetworkCoverageMap />

    </div>
  );
}
