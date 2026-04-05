"use client";

import type { AnnouncementStats } from "@/types/announcement";
import { formatK } from "@/lib/utils";
import CountUp from "react-countup";

interface StatsBarProps {
  stats: AnnouncementStats;
  compact?: boolean;
}

export function StatsBar({ stats, compact = false }: StatsBarProps) {
  // Calcul du total reach (seulement les 4 réseaux principaux)
  const facebookReach = stats.facebookReach ?? 0;
  const instagramReach = stats.instagramReach ?? 0;
  const twitterImpressions = stats.twitterImpressions ?? 0;
  const tiktokViews = stats.tiktokViews ?? 0;

  const totalReach = facebookReach + instagramReach + twitterImpressions + tiktokViews;
  const hasDiffusion = totalReach > 0;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {facebookReach > 0 && (
          <span className="flex items-center gap-1">
            <span className="text-blue-500">📘</span>
            {formatK(facebookReach)}
          </span>
        )}
        {instagramReach > 0 && (
          <span className="flex items-center gap-1">
            <span className="text-pink-500">📸</span>
            {formatK(instagramReach)}
          </span>
        )}
        {twitterImpressions > 0 && (
          <span className="flex items-center gap-1">
            <span>𝕏</span>
            {formatK(twitterImpressions)}
          </span>
        )}
        {tiktokViews > 0 && (
          <span className="flex items-center gap-1">
            <span>🎵</span>
            {formatK(tiktokViews)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header avec total */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/80 font-medium uppercase tracking-wide">Portée de l&apos;annonce</p>
            <p className="text-2xl font-extrabold text-white tabular-nums">
              {hasDiffusion ? (
                <CountUp
                  start={0}
                  end={totalReach}
                  duration={2}
                  separator=" "
                  useEasing={true}
                />
              ) : (
                "—"
              )}
              <span className="text-sm font-normal ml-1 opacity-80">personnes</span>
            </p>
          </div>
          {!hasDiffusion && (
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Diffusion en cours…
            </div>
          )}
        </div>
      </div>

      {/* Grille des 4 réseaux */}
      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
        {/* Facebook */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📘</span>
            <span className="font-bold text-gray-800 text-sm">Facebook</span>
          </div>
          <div className="space-y-2">
            <StatRow label="Portée" value={facebookReach} />
            <StatRow label="Partages" value={stats.facebookShares ?? 0} />
            <StatRow label="Likes" value={stats.facebookLikes ?? 0} />
          </div>
        </div>

        {/* Instagram */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📸</span>
            <span className="font-bold text-gray-800 text-sm">Instagram</span>
          </div>
          <div className="space-y-2">
            <StatRow label="Portée" value={instagramReach} />
            <StatRow label="Partages" value={stats.instagramShares ?? 0} />
            <StatRow label="Likes" value={stats.instagramLikes ?? 0} />
          </div>
        </div>

        {/* X (Twitter) */}
        <div className="p-4 bg-gray-900">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg text-white">𝕏</span>
            <span className="font-bold text-white text-sm">X (Twitter)</span>
          </div>
          <div className="space-y-2">
            <StatRow label="Vues" value={twitterImpressions} dark />
            <StatRow label="Retweets" value={stats.twitterRetweets ?? 0} dark />
            <StatRow label="Likes" value={stats.twitterLikes ?? 0} dark />
          </div>
        </div>

        {/* TikTok */}
        <div className="p-4 bg-gray-900">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎵</span>
            <span className="font-bold text-white text-sm">TikTok</span>
          </div>
          <div className="space-y-2">
            <StatRow label="Vues" value={tiktokViews} dark />
            <StatRow label="Partages" value={stats.tiktokShares ?? 0} dark />
            <StatRow label="Likes" value={stats.tiktokLikes ?? 0} dark />
          </div>
        </div>
      </div>

      {/* Footer avec vues de la page */}
      {stats.pageViews > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>👁</span>
            <span>Vues de l&apos;annonce</span>
          </div>
          <span className="font-bold text-gray-800">{formatK(stats.pageViews)}</span>
        </div>
      )}
    </div>
  );
}

function StatRow({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: number;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</span>
      <span className={`text-sm font-bold tabular-nums ${dark ? "text-white" : "text-gray-800"}`}>
        {value > 0 ? formatK(value) : "—"}
      </span>
    </div>
  );
}
