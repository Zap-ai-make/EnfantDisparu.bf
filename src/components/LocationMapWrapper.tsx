"use client";

import dynamic from "next/dynamic";

// Chargement dynamique pour éviter les erreurs SSR avec Leaflet
const LocationMap = dynamic(
  () => import("./LocationMap").then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center" style={{ minHeight: "200px" }}>
        <div className="text-gray-400 text-sm flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Chargement de la carte...
        </div>
      </div>
    ),
  }
);

interface LocationMapWrapperProps {
  latitude: number;
  longitude: number;
  childName: string;
  lastSeenPlace: string;
  isSecureID?: boolean;
  isLive?: boolean;
  showRadius?: boolean;
  radiusMeters?: number;
  className?: string;
}

export function LocationMapWrapper(props: LocationMapWrapperProps) {
  // Ne pas afficher si pas de coordonnées valides
  if (!props.latitude || !props.longitude) {
    return null;
  }

  return <LocationMap {...props} />;
}
