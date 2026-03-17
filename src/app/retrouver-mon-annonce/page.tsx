"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getAnnouncementsByPhone } from "@/lib/firestore";
import type { Announcement } from "@/types/announcement";
import { timeAgo } from "@/lib/utils";

export default function RetrouverAnnoncePage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Announcement[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const announcements = await getAnnouncementsByPhone(phone.trim());
      setResults(announcements);
      if (announcements.length === 0) {
        toast("Aucune annonce active trouvée pour ce numéro.", { icon: "🔍" });
      }
    } catch {
      toast.error("Erreur. Vérifiez votre numéro et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Retrouver mon annonce
        </h1>
        <p className="text-gray-500 text-sm">
          Entrez le numéro WhatsApp utilisé lors de la création de votre annonce.
          Vos annonces actives s&apos;afficheront ici.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Numéro WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+226 70 XX XX XX"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          {loading ? "Recherche..." : "🔍 Trouver mes annonces"}
        </button>
      </form>

      {/* Résultats */}
      {results !== null && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700 text-sm">
            {results.length === 0
              ? "Aucune annonce active trouvée"
              : `${results.length} annonce(s) active(s) trouvée(s)`}
          </h2>

          {results.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div>
                <p className="font-bold text-gray-900">{a.childName}</p>
                <p className="text-sm text-gray-500">{a.zoneName}</p>
                <p className="text-xs text-gray-400">{timeAgo(a.createdAt)}</p>
                <p className="text-xs font-medium text-red-600">{a.shortCode}</p>
              </div>
              <Link
                href={`/gestion/${a.secretToken}`}
                className="ml-auto bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
              >
                Gérer →
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-gray-400">
        <p>Vous n&apos;avez pas encore d&apos;annonce ?</p>
        <Link href="/signaler" className="text-red-600 font-medium">
          Créer une annonce →
        </Link>
      </div>
    </div>
  );
}
