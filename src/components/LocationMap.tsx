"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  childName: string;
  lastSeenPlace: string;
  isSecureID?: boolean;
  isLive?: boolean; // Si c'est une position GPS en temps réel
  showRadius?: boolean; // Afficher un rayon de recherche
  radiusMeters?: number;
  className?: string;
}

// Fix pour les icônes Leaflet en Next.js
const createIcon = (isLive: boolean) => {
  if (typeof window === "undefined") return undefined;

  return new Icon({
    iconUrl: isLive
      ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%2310b981' stroke='white' stroke-width='2'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E"
      : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23dc2626' stroke='white' stroke-width='2'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export function LocationMap({
  latitude,
  longitude,
  childName,
  lastSeenPlace,
  isSecureID = false,
  isLive = false,
  showRadius = true,
  radiusMeters = 500,
  className = "",
}: LocationMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [icon, setIcon] = useState<Icon | undefined>(undefined);

  const position: LatLngExpression = [latitude, longitude];

  useEffect(() => {
    setIsMounted(true);
    setIcon(createIcon(isLive));
  }, [isLive]);

  // Don't render on server
  if (!isMounted) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`} style={{ minHeight: "200px" }}>
        <div className="text-gray-400 text-sm">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {/* Badge GPS en direct */}
      {isLive && isSecureID && (
        <div className="absolute top-3 right-3 z-[1000] bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          GPS en direct
        </div>
      )}

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", minHeight: "200px", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueur de position */}
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-gray-900">{childName}</p>
              <p className="text-sm text-gray-600">{lastSeenPlace}</p>
              {isLive && (
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  Position GPS en temps réel
                </p>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Cercle de rayon de recherche */}
        {showRadius && (
          <Circle
            center={position}
            radius={radiusMeters}
            pathOptions={{
              color: isLive ? "#10b981" : "#dc2626",
              fillColor: isLive ? "#10b981" : "#dc2626",
              fillOpacity: 0.1,
              weight: 2,
              dashArray: isLive ? undefined : "5, 5",
            }}
          />
        )}
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-gray-600 shadow">
        {isLive ? (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            Position actuelle
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Dernière position connue
          </span>
        )}
      </div>
    </div>
  );
}
