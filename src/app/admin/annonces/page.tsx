"use client";

import { useEffect, useState } from "react";
import { Shield, Trash2, Eye, Search, RefreshCw, Lock, AlertCircle } from "lucide-react";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn, timeAgo, formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { Announcement } from "@/types/announcement";
import toast from "react-hot-toast";

const AUTH_KEY = "admin_annonces_auth";

type FilterStatus = "all" | "active" | "resolved" | "archived";
type FilterType = "all" | "missing" | "found";

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Actives" },
  { value: "resolved", label: "Retrouvées" },
  { value: "archived", label: "Archivées" },
];

const TYPE_FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Tous types" },
  { value: "missing", label: "Disparus" },
  { value: "found", label: "Trouvés" },
];

export default function AdminAnnoncesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Check if already authenticated (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY);
    const storedPassword = sessionStorage.getItem("admin_password");
    if (auth === "true" && storedPassword) {
      setIsAuthenticated(true);
      setAdminPassword(storedPassword);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setPasswordError(false);

    try {
      const response = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setAdminPassword(password);
        setIsAuthenticated(true);
        sessionStorage.setItem(AUTH_KEY, "true");
        sessionStorage.setItem("admin_password", password);
      } else {
        setPasswordError(true);
      }
    } catch {
      setPasswordError(true);
    } finally {
      setLoginLoading(false);
    }
  };

  // Load announcements
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    let q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(100)
    );

    // Apply filters
    if (filterStatus !== "all") {
      q = query(
        collection(db, "announcements"),
        where("status", "==", filterStatus),
        orderBy("createdAt", "desc"),
        limit(100)
      );
    }

    getDocs(q)
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            lastSeenAt: data.lastSeenAt?.toDate() || new Date(),
            resolvedAt: data.resolvedAt?.toDate() || null,
            nextReminderAt: data.nextReminderAt?.toDate() || null,
          } as Announcement;
        });

        // Apply type filter
        const filtered = filterType === "all"
          ? data
          : data.filter(a => a.type === filterType);

        setAnnouncements(filtered);
      })
      .catch((error) => {
        console.error("Error loading announcements:", error);
        toast.error("Erreur lors du chargement des annonces");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, filterStatus, filterType, refreshKey]);

  const handleDelete = async (announcementId: string) => {
    if (!confirmDelete || confirmDelete !== announcementId) {
      setConfirmDelete(announcementId);
      setTimeout(() => setConfirmDelete(null), 5000); // Reset after 5s
      return;
    }

    setDeleteLoading(announcementId);

    try {
      const response = await fetch("/api/admin/delete-announcement", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify({ announcementId }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Annonce supprimée avec succès");
        setAnnouncements(announcements.filter(a => a.id !== announcementId));
        setConfirmDelete(null);
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-2">
            Admin - Annonces
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Connexion requise pour accéder à cette page
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe admin
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500",
                    passwordError ? "border-red-500" : "border-gray-200"
                  )}
                  placeholder="Entrez le mot de passe"
                  required
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-2">Mot de passe incorrect</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {loginLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter announcements by search query
  const filteredAnnouncements = searchQuery
    ? announcements.filter(
        (a) =>
          a.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.zoneName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : announcements;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-extrabold">Administration - Annonces</h1>
            <p className="text-red-100 text-sm">Gestion des annonces d&apos;enfants disparus et trouvés</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, code ou zone..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  filterStatus === filter.value
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  filterType === filter.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          {loading ? "Chargement..." : `${filteredAnnouncements.length} annonce(s) trouvée(s)`}
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <RefreshCw className="w-8 h-8 text-gray-300 animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Chargement des annonces...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune annonce trouvée</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-5 flex items-start gap-4">
                {/* Photo */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {announcement.childPhotoURL && (
                    <Image
                      src={announcement.childPhotoURL}
                      alt={announcement.childName}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {announcement.childName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            announcement.status === "resolved"
                              ? "bg-green-100 text-green-700"
                              : announcement.status === "archived"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {announcement.status === "resolved"
                            ? "Retrouvé"
                            : announcement.status === "archived"
                            ? "Archivé"
                            : "Actif"}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            announcement.type === "found"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          )}
                        >
                          {announcement.type === "found" ? "Trouvé" : "Disparu"}
                        </span>
                        <span className="text-xs font-mono text-gray-500">
                          {announcement.shortCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-400">Âge:</span> {announcement.childAge} ans
                    </div>
                    <div>
                      <span className="text-gray-400">Genre:</span>{" "}
                      {announcement.childGender === "M" ? "Garçon" : "Fille"}
                    </div>
                    <div>
                      <span className="text-gray-400">Zone:</span> {announcement.zoneName}
                    </div>
                    <div>
                      <span className="text-gray-400">Lieu:</span> {announcement.lastSeenPlace}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Créée:</span> {timeAgo(announcement.createdAt)} ({formatDate(announcement.createdAt)})
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/annonce/${announcement.shortCode}`}
                    target="_blank"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Voir l'annonce"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    disabled={deleteLoading === announcement.id}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      confirmDelete === announcement.id
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "hover:bg-red-50 text-red-600",
                      deleteLoading === announcement.id && "opacity-50 cursor-not-allowed"
                    )}
                    title={confirmDelete === announcement.id ? "Cliquez pour confirmer" : "Supprimer"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
