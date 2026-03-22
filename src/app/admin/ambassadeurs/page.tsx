"use client";

import { useEffect, useState } from "react";
import { Shield, Check, X, Clock, RefreshCw, ExternalLink, Calendar, Cat, Phone, User, Lock } from "lucide-react";
import { getAmbassadorsByStatus } from "@/lib/firestore";
import { ZONES_BY_CITY } from "@/lib/zones";
import { cn } from "@/lib/utils";
import type { Ambassador } from "@/types/ambassador";

const ADMIN_PASSWORD = "zaparo";
const AUTH_KEY = "admin_ambassadeurs_auth";

type TabStatus = "pending" | "approved" | "rejected";

const TABS: { value: TabStatus; label: string; icon: React.ReactNode }[] = [
  { value: "pending", label: "En attente", icon: <Clock className="w-4 h-4" /> },
  { value: "approved", label: "Approuvés", icon: <Check className="w-4 h-4" /> },
  { value: "rejected", label: "Rejetés", icon: <X className="w-4 h-4" /> },
];

export default function AdminAmbassadeursPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabStatus>("pending");
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check if already authenticated (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY);
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, "true");
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAmbassadorsByStatus(activeTab)
      .then(setAmbassadors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab, refreshKey]);

  const handleApprove = async (ambassadorId: string) => {
    if (actionLoading) return;
    setActionLoading(ambassadorId);

    try {
      const response = await fetch("/api/ambassador/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ambassadorId, approvedBy: "admin" }),
      });

      const result = await response.json();

      if (result.success) {
        // Open WhatsApp with dashboard link
        const ambassador = ambassadors.find((a) => a.id === ambassadorId);
        if (ambassador && result.dashboardUrl) {
          const message = `Bonjour ${ambassador.firstName},\n\nVotre candidature ambassadeur EnfantDisparu.bf a été approuvée !\n\nAccédez à votre tableau de bord :\n${result.dashboardUrl}\n\nMerci de votre engagement.`;
          window.open(`https://wa.me/${ambassador.phone.replace("+", "")}?text=${encodeURIComponent(message)}`, "_blank");
        }
        setRefreshKey((k) => k + 1);
      }
    } catch (error) {
      console.error("Approve error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (ambassadorId: string) => {
    if (actionLoading) return;
    const reason = window.prompt("Raison du rejet (optionnel) :");

    setActionLoading(ambassadorId);
    try {
      const response = await fetch("/api/ambassador/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ambassadorId, rejectedBy: "admin", reason: reason || undefined }),
      });

      const result = await response.json();

      if (result.success) {
        setRefreshKey((k) => k + 1);
      }
    } catch (error) {
      console.error("Reject error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getZoneName = (zoneId: string): string => {
    for (const city of Object.keys(ZONES_BY_CITY)) {
      const zone = ZONES_BY_CITY[city]?.find((z) => z.id === zoneId);
      if (zone) return `${zone.name}, ${city}`;
    }
    return zoneId;
  };

  const formatDate = (timestamp: { toDate: () => Date } | null): string => {
    if (!timestamp) return "-";
    return timestamp.toDate().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBirthDate = (timestamp: { toDate: () => Date } | null): string => {
    if (!timestamp) return "-";
    const date = timestamp.toDate();
    const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return `${date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })} (${age} ans)`;
  };

  const getCatAnswerLabel = (answer: string | undefined): { text: string; color: string } => {
    switch (answer) {
      case "yes": return { text: "Oui, j'ai un chat", color: "text-green-600 bg-green-50" };
      case "no": return { text: "Non, pas de chat", color: "text-red-600 bg-red-50" };
      case "maybe": return { text: "Peut-être bientôt", color: "text-amber-600 bg-amber-50" };
      default: return { text: "-", color: "text-gray-500 bg-gray-50" };
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Administration</h1>
            <p className="text-sm text-gray-500 mt-1">Entrez le mot de passe pour accéder</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Mot de passe"
                className={cn(
                  "w-full px-4 py-3 border rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-900",
                  passwordError ? "border-red-300 bg-red-50" : "border-gray-200"
                )}
                autoFocus
              />
              {passwordError && (
                <p className="text-red-500 text-sm text-center mt-2">Mot de passe incorrect</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Accéder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Gestion des Ambassadeurs</h1>
              <p className="text-sm text-gray-300">Administration</p>
            </div>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "bg-gray-900 text-white"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            {tab.icon}
            {tab.label}
            {!loading && ambassadors.length > 0 && activeTab === tab.value && (
              <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                {ambassadors.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : ambassadors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-2xl mb-2">
            {activeTab === "pending" ? "📭" : activeTab === "approved" ? "👥" : "🚫"}
          </p>
          <p className="text-gray-500">
            {activeTab === "pending"
              ? "Aucune candidature en attente"
              : activeTab === "approved"
              ? "Aucun ambassadeur approuvé"
              : "Aucune candidature rejetée"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ambassadors.map((ambassador) => (
            <div
              key={ambassador.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Nom et code */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">
                      {ambassador.firstName} {ambassador.lastName}
                    </h3>
                    <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                      {ambassador.refCode}
                    </span>
                  </div>

                  {/* Informations détaillées */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{ambassador.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatBirthDate(ambassador.dateOfBirth as { toDate: () => Date } | null)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Cat className="w-3.5 h-3.5 text-gray-400" />
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", getCatAnswerLabel(ambassador.catAnswer).color)}>
                        {getCatAnswerLabel(ambassador.catAnswer).text}
                      </span>
                    </div>
                    {ambassador.referredBy && (
                      <div className="flex items-center gap-1.5 col-span-2 text-gray-600">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Parrainé par: <span className="font-mono text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">{ambassador.referredBy}</span></span>
                      </div>
                    )}
                  </div>

                  {/* Zones */}
                  <div className="flex flex-wrap gap-1.5">
                    {ambassador.zones.map((zoneId) => (
                      <span
                        key={zoneId}
                        className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                      >
                        {getZoneName(zoneId)}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Candidature soumise le {formatDate(ambassador.createdAt as { toDate: () => Date } | null)}
                  </p>
                </div>

                {/* Actions */}
                {activeTab === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(ambassador.id)}
                      disabled={actionLoading === ambassador.id}
                      className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-colors disabled:opacity-50"
                      title="Approuver"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(ambassador.id)}
                      disabled={actionLoading === ambassador.id}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors disabled:opacity-50"
                      title="Rejeter"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {activeTab === "approved" && ambassador.accessToken && (
                  <a
                    href={`/ambassadeur?t=${ambassador.accessToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                    title="Voir le dashboard"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Stats for approved */}
              {activeTab === "approved" && (
                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{ambassador.stats.notificationsActivated}</p>
                    <p className="text-[10px] text-gray-400">Notifs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{ambassador.stats.alertsShared}</p>
                    <p className="text-[10px] text-gray-400">Partages</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{ambassador.stats.ambassadorsRecruited}</p>
                    <p className="text-[10px] text-gray-400">Recrutés</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-600">{ambassador.stats.viewsGenerated}</p>
                    <p className="text-[10px] text-gray-400">Vues</p>
                  </div>
                </div>
              )}

              {/* Rejection reason */}
              {activeTab === "rejected" && ambassador.rejectionReason && (
                <p className="mt-2 pt-2 border-t border-gray-100 text-sm text-red-600">
                  Raison : {ambassador.rejectionReason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
