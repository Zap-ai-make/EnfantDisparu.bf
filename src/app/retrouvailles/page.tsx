"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getGlobalStats } from "@/lib/firestore";
import { timeAgo } from "@/lib/utils";
import type { Announcement } from "@/types/announcement";

export default function RetrouvaillesPage() {
  const [resolved, setResolved] = useState<Announcement[]>([]);
  const [stats, setStats] = useState({ totalResolved: 0, totalActive: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDocs(
        query(
          collection(db, "announcements"),
          where("status", "==", "resolved"),
          orderBy("resolvedAt", "desc"),
          limit(20)
        )
      ),
      getGlobalStats(),
    ]).then(([snap, s]) => {
      setResolved(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement)));
      setStats(s);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">🎉 Retrouvailles</h1>
        <p className="text-gray-500 text-sm">
          Ces enfants ont été retrouvés grâce à la communauté.
        </p>
      </div>

      {/* Compteur */}
      <div className="bg-green-600 rounded-2xl p-6 text-white text-center">
        <p className="text-5xl font-extrabold mb-1">{stats.totalResolved}</p>
        <p className="font-semibold opacity-90">enfants retrouvés</p>
        <p className="text-sm opacity-70 mt-1">
          grâce à EnfantDisparu.bf et à la communauté burkinabé
        </p>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : resolved.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          <p className="text-3xl mb-2">🙏</p>
          <p>Les premières retrouvailles s&apos;afficheront ici.</p>
          <p className="text-sm mt-1">Partagez les annonces pour que cela arrive vite !</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {resolved.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden"
            >
              <div className="relative aspect-square bg-gray-100">
                {a.childPhotoURL ? (
                  <Image src={a.childPhotoURL} alt={a.childName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">👦</div>
                )}
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                  ✅
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-900 text-sm truncate">{a.childName}</p>
                <p className="text-xs text-gray-500">{a.childAge} ans</p>
                {a.resolvedAt && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Retrouvé {timeAgo(a.resolvedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
