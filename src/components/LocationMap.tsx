"use client";

import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";

interface LocationMapProps {
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

export function LocationMap({
  latitude,
  longitude,
  childName,
  lastSeenPlace,
  isSecureID = false,
  isLive = false,
  className = "",
}: LocationMapProps) {
  const [imageError, setImageError] = useState(false);

  // OpenStreetMap static image URL
  const zoom = 15;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;

  return (
    <div className={`relative rounded-xl overflow-hidden bg-gray-100 ${className}`}>
      {/* Badge GPS en direct */}
      {isLive && isSecureID && (
        <div className="absolute top-3 right-3 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          GPS en direct
        </div>
      )}

      {/* Carte OpenStreetMap embed */}
      {!imageError ? (
        <iframe
          src={mapUrl}
          style={{ height: "100%", minHeight: "200px", width: "100%", border: 0 }}
          loading="lazy"
          title={`Carte: ${lastSeenPlace}`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-4">
          <MapPin className="w-8 h-8 text-red-500" />
          <p className="text-sm text-gray-600 text-center">{lastSeenPlace}</p>
        </div>
      )}

      {/* Lien vers la carte complète */}
      <a
        href={fullMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-gray-600 shadow hover:bg-white transition-colors flex items-center gap-1.5"
      >
        {isLive ? (
          <>
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            Position actuelle
          </>
        ) : (
          <>
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Dernière position
          </>
        )}
        <ExternalLink className="w-3 h-3 ml-1" />
      </a>
    </div>
  );
}
