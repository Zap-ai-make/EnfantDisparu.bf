"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, LogOut, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem("admin_dashboard_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.setItem("admin_dashboard_auth", "true");
        setIsAuthenticated(true);
      } else {
        setError("Mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_dashboard_auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Administration
            </h1>
            <p className="text-gray-600">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe administrateur
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord administrateur
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                EnfantDisparu.bf - Gestion de la plateforme
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ambassadors Card */}
          <div
            onClick={() => router.push("/admin/ambassadeurs")}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Gestion des Ambassadeurs
            </h2>

            <p className="text-gray-600 mb-6">
              Approuver ou rejeter les candidatures d'ambassadeurs, consulter
              les statistiques et gérer la communauté.
            </p>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Candidatures en attente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Ambassadeurs approuvés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Candidatures rejetées</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                Accéder à la gestion →
              </div>
            </div>
          </div>

          {/* Announcements Card */}
          <div
            onClick={() => router.push("/admin/annonces")}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <FileText className="w-7 h-7 text-purple-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Gestion des Annonces
            </h2>

            <p className="text-gray-600 mb-6">
              Consulter, filtrer et supprimer les annonces d'enfants disparus
              et trouvés publiées sur la plateforme.
            </p>

            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Annonces actives</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Annonces résolues</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Annonces archivées</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                Accéder à la gestion →
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Accès rapide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Page d'accueil</div>
                <div className="text-sm text-gray-500">Voir le site public</div>
              </div>
            </a>

            <a
              href="/annonces"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📢</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Annonces publiques</div>
                <div className="text-sm text-gray-500">Voir toutes les annonces</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
