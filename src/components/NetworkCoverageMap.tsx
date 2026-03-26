"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { MapPin, Users, Shield, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

// Coordonnées des villes du Burkina Faso
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Ouagadougou": { lat: 12.3714, lng: -1.5197 },
  "Bobo-Dioulasso": { lat: 11.1771, lng: -4.2979 },
  "Koudougou": { lat: 12.2525, lng: -2.3628 },
  "Banfora": { lat: 10.6333, lng: -4.7667 },
  "Ouahigouya": { lat: 13.5828, lng: -2.4214 },
  "Fada N'Gourma": { lat: 12.0619, lng: 0.3492 },
  "Kaya": { lat: 13.0919, lng: -1.0842 },
  "Dédougou": { lat: 12.4667, lng: -3.4667 },
  "Ziniaré": { lat: 12.5833, lng: -1.3000 },
  "Tenkodogo": { lat: 11.7833, lng: -0.3667 },
  "Gaoua": { lat: 10.3167, lng: -3.1667 },
  "Dori": { lat: 14.0353, lng: -0.0347 },
  "Manga": { lat: 11.6667, lng: -1.0667 },
  "Pô": { lat: 11.1667, lng: -1.1500 },
  "Léo": { lat: 11.1000, lng: -2.1000 },
  "Yako": { lat: 12.9500, lng: -2.2667 },
  "Kongoussi": { lat: 13.3333, lng: -1.5333 },
  "Réo": { lat: 12.3167, lng: -2.4667 },
  "Nouna": { lat: 12.7333, lng: -3.8667 },
  "Djibo": { lat: 14.1000, lng: -1.6333 },
};

// Données fictives réalistes - distribution du réseau
const MOCK_NETWORK_DATA = {
  // Total: 1037 personnes + 44 ambassadeurs
  cities: [
    { city: "Ouagadougou", subscribers: 412, ambassadors: 18 },
    { city: "Bobo-Dioulasso", subscribers: 187, ambassadors: 8 },
    { city: "Koudougou", subscribers: 89, ambassadors: 4 },
    { city: "Banfora", subscribers: 67, ambassadors: 3 },
    { city: "Ouahigouya", subscribers: 58, ambassadors: 2 },
    { city: "Fada N'Gourma", subscribers: 45, ambassadors: 2 },
    { city: "Kaya", subscribers: 42, ambassadors: 2 },
    { city: "Dédougou", subscribers: 34, ambassadors: 1 },
    { city: "Ziniaré", subscribers: 28, ambassadors: 1 },
    { city: "Tenkodogo", subscribers: 25, ambassadors: 1 },
    { city: "Gaoua", subscribers: 18, ambassadors: 1 },
    { city: "Dori", subscribers: 12, ambassadors: 0 },
    { city: "Manga", subscribers: 8, ambassadors: 1 },
    { city: "Pô", subscribers: 6, ambassadors: 0 },
    { city: "Léo", subscribers: 3, ambassadors: 0 },
    { city: "Yako", subscribers: 2, ambassadors: 0 },
    { city: "Kongoussi", subscribers: 1, ambassadors: 0 },
  ],
  totalSubscribers: 1037,
  totalAmbassadors: 44,
};

// Style de la carte (mode clair élégant)
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#cfcfcf" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#c9e5f5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const mapContainerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "0 0 16px 16px",
};

const defaultCenter = { lat: 12.3, lng: -1.8 }; // Centre du Burkina

interface CityData {
  city: string;
  position: { lat: number; lng: number };
  subscribers: number;
  ambassadors: number;
}

export function NetworkCoverageMap() {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [cityData, setCityData] = useState<CityData[]>([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    // Charger les données fictives
    const data: CityData[] = MOCK_NETWORK_DATA.cities
      .filter((c) => CITY_COORDINATES[c.city])
      .map((c) => ({
        city: c.city,
        position: CITY_COORDINATES[c.city],
        subscribers: c.subscribers,
        ambassadors: c.ambassadors,
      }));
    setCityData(data);
  }, []);

  const onMapClick = useCallback(() => {
    setSelectedCity(null);
  }, []);

  // Icône pour les abonnés (bleu)
  const getSubscriberIcon = (count: number) => {
    const size = Math.min(45, 20 + Math.sqrt(count) * 2);
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#3B82F6",
      fillOpacity: 0.7,
      strokeColor: "#1D4ED8",
      strokeWeight: 2,
      scale: size / 5,
    };
  };

  // Icône pour les ambassadeurs (or/ambre)
  const getAmbassadorIcon = (count: number) => {
    const size = Math.min(30, 12 + count * 2);
    return {
      path: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z", // Étoile
      fillColor: "#F59E0B",
      fillOpacity: 1,
      strokeColor: "#D97706",
      strokeWeight: 1.5,
      scale: size / 12,
      anchor: new google.maps.Point(12, 12),
    };
  };

  // Fallback sans Google Maps
  if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Réseau de Vigilance</h3>
            <p className="text-blue-100 text-sm">Burkina Faso</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-3xl font-bold">{MOCK_NETWORK_DATA.totalSubscribers.toLocaleString()}</p>
            <p className="text-xs text-blue-100">Personnes vigilantes</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-3xl font-bold">{MOCK_NETWORK_DATA.totalAmbassadors}</p>
            <p className="text-xs text-blue-100">Ambassadeurs</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-sm">🛡️ Un réseau actif 24h/24 prêt à vous aider</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-[400px] bg-gray-100 animate-pulse flex items-center justify-center">
          <MapPin className="w-8 h-8 text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Réseau de Vigilance</h3>
              <p className="text-xs text-gray-500">
                {MOCK_NETWORK_DATA.totalSubscribers.toLocaleString()} personnes · {MOCK_NETWORK_DATA.totalAmbassadors} ambassadeurs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Actif 24/7
          </div>
        </div>
      </div>

      {/* Map - toujours visible */}
      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={6}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: "cooperative",
          }}
          onClick={onMapClick}
        >
          {/* Marqueurs abonnés (cercles bleus) */}
          {cityData.map((data) => (
            <Marker
              key={`sub-${data.city}`}
              position={data.position}
              icon={getSubscriberIcon(data.subscribers)}
              onClick={() => setSelectedCity(data)}
              zIndex={1}
            />
          ))}

          {/* Marqueurs ambassadeurs (étoiles or) - au-dessus */}
          {cityData.filter(d => d.ambassadors > 0).map((data) => (
            <Marker
              key={`amb-${data.city}`}
              position={{
                lat: data.position.lat + 0.03,
                lng: data.position.lng + 0.02,
              }}
              icon={getAmbassadorIcon(data.ambassadors)}
              onClick={() => setSelectedCity(data)}
              zIndex={2}
            />
          ))}

          {selectedCity && (
            <InfoWindow
              position={selectedCity.position}
              onCloseClick={() => setSelectedCity(null)}
              options={{ pixelOffset: new google.maps.Size(0, -10) }}
            >
              <div className="p-1 min-w-[160px]">
                <h4 className="font-bold text-gray-900 text-base">{selectedCity.city}</h4>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-600">{selectedCity.subscribers} personnes</span>
                  </div>
                  {selectedCity.ambassadors > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Crown className="w-3 h-3 text-amber-500" />
                      <span className="text-gray-600">{selectedCity.ambassadors} ambassadeur{selectedCity.ambassadors > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Message d'espoir en overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Vous n'êtes pas seul
                </p>
                <p className="text-xs text-gray-500">
                  {(MOCK_NETWORK_DATA.totalSubscribers + MOCK_NETWORK_DATA.totalAmbassadors).toLocaleString()} personnes prêtes à relayer l'alerte instantanément
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-2.5 shadow-sm text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 opacity-70 border-2 border-blue-700" />
            <span className="text-gray-700">Personnes vigilantes</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-gray-700">Ambassadeurs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
