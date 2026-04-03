"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shield, Users, Bell, Share2, Eye, Copy, Check, QrCode, MapPin, Plus, Trophy, Medal, Award, BarChart3 } from "lucide-react";
import { addZoneToAmbassador, getAmbassadorRank, getAmbassadorLeaderboard } from "@/lib/firestore";
import { SHARE_MESSAGES, getShareUrl } from "@/lib/ambassador-utils";
import { ZONES_BY_CITY, CITIES_BY_COUNTRY } from "@/lib/zones";
import { cn } from "@/lib/utils";
import { AmbassadorQRCode } from "@/components/AmbassadorQRCode";
import { BadgeGrid, BadgeProgress } from "@/components/BadgeDisplay";
import { AVAILABLE_BADGES, getBadgeProgress, sortBadgesByTier } from "@/lib/badge-utils";
import { MorningBriefingModal } from "@/components/MorningBriefingModal";
import { ActivityFeed } from "@/components/ActivityFeed";
import { MissionControlDashboard } from "@/components/MissionControlDashboard";
import { isSameDay } from "date-fns";
import type { Ambassador } from "@/types/ambassador";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("t");

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showAddZone, setShowAddZone] = useState(false);
  const [addingZone, setAddingZone] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [rankInfo, setRankInfo] = useState<{ rank: number; total: number; score: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ ambassador: Ambassador; rank: number; totalScore: number }[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [showMissionControl, setShowMissionControl] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Lien invalide. Veuillez utiliser le lien de connexion ambassadeur.");
      setLoading(false);
      return;
    }

    // Utiliser l'API pour vérifier le token (côté serveur)
    fetch("/api/ambassador/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.ambassador) {
          // Convertir les dates ISO en objets Date pour la compatibilité
          const ambassador = {
            ...result.ambassador,
            createdAt: result.ambassador.createdAt ? new Date(result.ambassador.createdAt) : null,
            approvedAt: result.ambassador.approvedAt ? new Date(result.ambassador.approvedAt) : null,
            lastBriefingDate: result.ambassador.lastBriefingDate ? new Date(result.ambassador.lastBriefingDate) : null,
          };
          setAmbassador(ambassador);
        } else if (result.error === "token_expired") {
          setError("Votre lien a expiré. Contactez un administrateur pour en obtenir un nouveau.");
        } else if (result.error === "invalid_token") {
          setError("Lien invalide.");
        } else {
          setError("Erreur lors du chargement. Veuillez réessayer.");
        }
      })
      .catch(() => {
        setError("Erreur lors du chargement. Veuillez réessayer.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // Charger le rang et le classement quand l'ambassadeur est chargé
  useEffect(() => {
    if (!ambassador) return;

    // Charger le rang
    getAmbassadorRank(ambassador.id).then(setRankInfo);

    // Charger le leaderboard (top 10)
    getAmbassadorLeaderboard(10).then(setLeaderboard);
  }, [ambassador]);

  // Vérifier si modal briefing doit être affiché
  useEffect(() => {
    if (!ambassador) return;

    // Vérifier si modal déjà vue aujourd'hui
    if (ambassador.lastBriefingDate) {
      // lastBriefingDate est déjà converti en Date par l'API
      const lastViewed = ambassador.lastBriefingDate instanceof Date
        ? ambassador.lastBriefingDate
        : new Date(ambassador.lastBriefingDate as unknown as string);
      const today = new Date();

      if (!isSameDay(lastViewed, today)) {
        // Pas encore vue aujourd'hui → afficher
        setShowBriefing(true);
      }
    } else {
      // Jamais vue → afficher
      setShowBriefing(true);
    }
  }, [ambassador]);

  const copyShareLink = async () => {
    if (!ambassador) return;
    const url = getShareUrl(ambassador.refCode);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = (type: "invitation" | "ambassador") => {
    if (!ambassador) return;
    const message = type === "invitation"
      ? SHARE_MESSAGES.whatsappInvitation(ambassador.refCode)
      : SHARE_MESSAGES.whatsappAmbassador(ambassador.refCode);
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Helper function to refresh ambassador data via API
  const refreshAmbassadorData = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/ambassador/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = await res.json();
      if (result.success && result.ambassador) {
        const updated = {
          ...result.ambassador,
          createdAt: result.ambassador.createdAt ? new Date(result.ambassador.createdAt) : null,
          approvedAt: result.ambassador.approvedAt ? new Date(result.ambassador.approvedAt) : null,
          lastBriefingDate: result.ambassador.lastBriefingDate ? new Date(result.ambassador.lastBriefingDate) : null,
        };
        setAmbassador(updated);
      }
    } catch (err) {
      console.error("Error refreshing ambassador data:", err);
    }
  };

  const handleAddZone = async () => {
    if (!ambassador || !selectedZone || addingZone) return;
    setAddingZone(true);
    try {
      const result = await addZoneToAmbassador(ambassador.id, selectedZone);
      if (result.success) {
        // Refresh ambassador data via API
        await refreshAmbassadorData();
        setShowAddZone(false);
        setSelectedCity("");
        setSelectedZone("");
      } else {
        setError(result.error || "Erreur lors de l'ajout de la zone");
      }
    } catch {
      setError("Erreur lors de l'ajout de la zone");
    } finally {
      setAddingZone(false);
    }
  };

  const handleCloseBriefing = async () => {
    setShowBriefing(false);

    // Update Firestore
    if (ambassador) {
      try {
        const response = await fetch('/api/ambassador/update-briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ambassadorId: ambassador.id,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Briefing updated:', data);

          // Refresh ambassador data to get updated streak
          await refreshAmbassadorData();
        }
      } catch (error) {
        console.error('Error updating briefing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !ambassador) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-700">{error || "Ambassadeur non trouvé"}</p>
        </div>
        <button
          onClick={() => router.push("/devenir-ambassadeur")}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          Devenir Ambassadeur
        </button>
      </div>
    );
  }

  const zones = ambassador.zones
    .map((zoneId) => {
      for (const city of Object.keys(ZONES_BY_CITY)) {
        const zone = ZONES_BY_CITY[city]?.find((z) => z.id === zoneId);
        if (zone) return { ...zone, city };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <>
      {/* Morning Briefing Modal */}
      {showBriefing && ambassador && (
        <MorningBriefingModal
          ambassador={ambassador}
          onClose={handleCloseBriefing}
        />
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-amber-100 text-sm">Ambassadeur</p>
            <h1 className="text-lg font-bold">{ambassador.firstName} {ambassador.lastName}</h1>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-mono">{ambassador.refCode}</span>
          <button
            onClick={copyShareLink}
            className="text-white/80 hover:text-white p-1"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Rang et Score */}
      {rankInfo && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {rankInfo.rank === 1 ? (
                  <Trophy className="w-6 h-6 text-yellow-300" />
                ) : rankInfo.rank === 2 ? (
                  <Medal className="w-6 h-6 text-gray-300" />
                ) : rankInfo.rank === 3 ? (
                  <Award className="w-6 h-6 text-amber-400" />
                ) : (
                  <span className="text-xl font-bold">#{rankInfo.rank}</span>
                )}
              </div>
              <div>
                <p className="text-purple-100 text-sm">Votre classement</p>
                <p className="text-2xl font-bold">
                  {rankInfo.rank === 1 ? "1er" : rankInfo.rank === 2 ? "2ème" : rankInfo.rank === 3 ? "3ème" : `${rankInfo.rank}ème`}
                  <span className="text-lg font-normal text-purple-200"> / {rankInfo.total}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-xs">Score total</p>
              <p className="text-2xl font-bold">{Math.round(rankInfo.score)}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="w-full mt-3 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            {showLeaderboard ? "Masquer le classement" : "Voir le classement complet"}
          </button>
        </div>
      )}

      {/* Badges Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🏅 Mes Badges
            {ambassador.badges && ambassador.badges.length > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({ambassador.badges.length})
              </span>
            )}
          </h2>
        </div>

        {/* Badges débloqués */}
        {ambassador.badges && ambassador.badges.length > 0 ? (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <BadgeGrid badges={sortBadgesByTier(ambassador.badges)} size="md" />
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-xl">
            <p className="text-3xl mb-2">🎯</p>
            <p className="text-sm text-gray-600 font-medium">
              Aucun badge débloqué pour le moment
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Continuez vos actions pour en gagner !
            </p>
          </div>
        )}

        {/* Progression vers prochains badges */}
        {(() => {
          const badgeProgress = getBadgeProgress(ambassador);
          const nextBadges = Object.entries(badgeProgress)
            .sort((a, b) => b[1].percentage - a[1].percentage)
            .slice(0, 3); // Top 3 badges les plus proches

          if (nextBadges.length === 0) return null;

          return (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
                🎯 Prochains badges à débloquer
              </h3>
              <div className="space-y-3">
                {nextBadges.map(([badgeId, progress]) => {
                  const badge = AVAILABLE_BADGES[badgeId];
                  return (
                    <BadgeProgress
                      key={badgeId}
                      badge={badge}
                      current={progress.current}
                      target={progress.target}
                      percentage={progress.percentage}
                    />
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Leaderboard */}
      {showLeaderboard && leaderboard.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top 10 Ambassadeurs
          </h2>
          <div className="space-y-2">
            {leaderboard.map((item) => (
              <div
                key={item.ambassador.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  item.ambassador.id === ambassador.id
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-gray-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                  item.rank === 1 ? "bg-yellow-400 text-yellow-900" :
                  item.rank === 2 ? "bg-gray-300 text-gray-700" :
                  item.rank === 3 ? "bg-amber-400 text-amber-900" :
                  "bg-gray-200 text-gray-600"
                )}>
                  {item.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    item.ambassador.id === ambassador.id ? "text-amber-700" : "text-gray-900"
                  )}>
                    {item.ambassador.firstName} {item.ambassador.lastName.charAt(0)}.
                    {item.ambassador.id === ambassador.id && " (vous)"}
                  </p>
                  <p className="text-xs text-gray-500">{item.ambassador.refCode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{Math.round(item.totalScore)}</p>
                  <p className="text-[10px] text-gray-400">points</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Score = Notifs×1 + Partages×2 + Recrutés×5 + Vues×0.1
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{ambassador.stats.notificationsActivated}</p>
          <p className="text-xs text-gray-500">Notifications activées</p>
          <p className="text-[10px] text-blue-500 mt-1">+1 pt/notif</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Share2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{ambassador.stats.alertsShared}</p>
          <p className="text-xs text-gray-500">Alertes partagées</p>
          <p className="text-[10px] text-green-500 mt-1">+2 pts/partage</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{ambassador.stats.ambassadorsRecruited}</p>
          <p className="text-xs text-gray-500">Ambassadeurs recrutés</p>
          <p className="text-[10px] text-purple-500 mt-1">+5 pts/recruté</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Eye className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{ambassador.stats.viewsGenerated}</p>
          <p className="text-xs text-gray-500">Vues générées</p>
          <p className="text-[10px] text-amber-500 mt-1">+0.1 pt/vue</p>
        </div>
      </div>

      {/* Zones */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            Mes zones ({zones.length}/5)
          </h2>
          {zones.length < 5 && (
            <button
              onClick={() => setShowAddZone(!showAddZone)}
              className="text-amber-500 hover:text-amber-600 p-1"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          {zones.map((zone) => zone && (
            <div key={zone.id} className="bg-gray-50 rounded-xl px-3 py-2 text-sm">
              <span className="font-medium text-gray-900">{zone.name}</span>
              <span className="text-gray-400 ml-1">• {zone.city}</span>
            </div>
          ))}
        </div>

        {/* Add zone form */}
        {showAddZone && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <select
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setSelectedZone(""); }}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option value="">Sélectionner une ville</option>
              {(CITIES_BY_COUNTRY["BFA"] ?? []).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {selectedCity && (
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
              >
                <option value="">Sélectionner un quartier</option>
                {(ZONES_BY_CITY[selectedCity] ?? [])
                  .filter((z) => !ambassador.zones.includes(z.id))
                  .map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
              </select>
            )}
            {selectedZone && (
              <button
                onClick={handleAddZone}
                disabled={addingZone}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-2 rounded-xl text-sm font-medium"
              >
                {addingZone ? "Ajout..." : "Ajouter cette zone"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mission Control Toggle */}
      <button
        onClick={() => setShowMissionControl(!showMissionControl)}
        className={cn(
          "w-full flex items-center justify-between gap-3 py-4 px-5 rounded-2xl text-sm font-semibold transition-all border-2",
          showMissionControl
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-600 text-white shadow-lg"
            : "bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:shadow-md"
        )}
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5" />
          <span>{showMissionControl ? "Masquer Mission Control" : "📊 Mission Control"}</span>
        </div>
        <span className="text-xs opacity-80">Analytics avancés</span>
      </button>

      {/* Mission Control Dashboard */}
      {showMissionControl && (
        <MissionControlDashboard
          ambassador={ambassador}
          leaderboard={leaderboard}
        />
      )}

      {/* Activity Feed */}
      <ActivityFeed
        maxItems={15}
        showFilters={true}
        showVelocity={true}
        refreshInterval={30000}
      />

      {/* Share Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h2 className="font-bold text-gray-900 mb-3">Partager</h2>
        <div className="space-y-2">
          <button
            onClick={() => shareWhatsApp("invitation")}
            className="w-full flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            <span className="text-lg">📱</span>
            Inviter à activer les notifications
          </button>
          <button
            onClick={() => shareWhatsApp("ambassador")}
            className="w-full flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            <span className="text-lg">🤝</span>
            Recruter un ambassadeur
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className={cn(
              "w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-colors border",
              showQR
                ? "bg-gray-100 border-gray-200 text-gray-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            <QrCode className="w-5 h-5" />
            {showQR ? "Masquer le QR Code" : "Afficher mon QR Code"}
          </button>
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <AmbassadorQRCode refCode={ambassador.refCode} size={200} />
          </div>
        )}
      </div>
      </div>
    </>
  );
}

export default function AmbassadeurDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
