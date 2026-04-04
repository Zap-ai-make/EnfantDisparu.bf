"use client";

import type { AnnouncementStats } from "@/types/announcement";
import { formatK } from "@/lib/utils";
import CountUp from "react-countup";

interface StatsBarProps {
  stats: AnnouncementStats;
  compact?: boolean;
}

export function StatsBar({ stats, compact = false }: StatsBarProps) {
  const tiktokViews = stats.tiktokViews ?? 0;
  const totalReach = stats.facebookReach + stats.whatsappChannelReach + stats.pushSent + tiktokViews;
  const hasDiffusion = totalReach > 0;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {stats.facebookReach > 0 && (
          <span className="flex items-center gap-1">
            <span className="text-blue-500">📘</span>
            {formatK(stats.facebookReach)} vues
          </span>
        )}
        {stats.whatsappChannelReach > 0 && (
          <span className="flex items-center gap-1">
            <span>💬</span>
            {formatK(stats.whatsappChannelReach)} communauté
          </span>
        )}
        {stats.pushSent > 0 && (
          <span className="flex items-center gap-1">
            <span>🔔</span>
            {stats.pushSent} secteur
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        Portée de l&apos;annonce
      </h3>

      {/* Total reach avec animation */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
        <span className="text-3xl">📡</span>
        <div className="flex-1">
          <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 tabular-nums">
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
          </p>
          <p className="text-xs text-gray-600 font-medium">personnes atteintes au total</p>
        </div>
        {!hasDiffusion && (
          <p className="text-xs text-orange-600 italic flex items-center gap-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Diffusion en cours…
          </p>
        )}
      </div>

      {/* Facebook */}
      {stats.facebookReach > 0 && (
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📘</span>
            <p className="font-bold text-blue-800">Facebook</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <StatItem
              value={stats.facebookReach}
              label="Portée"
              colorClass="text-blue-700"
            />
            <StatItem
              value={stats.facebookShares}
              label="Partages"
              colorClass="text-blue-700"
            />
            <StatItem
              value={stats.facebookLikes}
              label="Likes ❤️"
              colorClass="text-blue-700"
            />
          </div>
        </div>
      )}

      {/* Instagram */}
      {(stats.instagramReach ?? 0) > 0 && (
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📸</span>
            <p className="font-bold text-pink-800">Instagram</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <StatItem
              value={stats.instagramReach ?? 0}
              label="Portée"
              colorClass="text-pink-700"
            />
            <StatItem
              value={stats.instagramShares ?? 0}
              label="Partages"
              colorClass="text-pink-700"
            />
            <StatItem
              value={stats.instagramLikes ?? 0}
              label="Likes ❤️"
              colorClass="text-pink-700"
            />
          </div>
        </div>
      )}

      {/* Twitter/X */}
      {(stats.twitterImpressions ?? 0) > 0 && (
        <div className="rounded-xl bg-gray-900 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl text-white">𝕏</span>
            <p className="font-bold text-white">X (Twitter)</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-extrabold leading-none text-white">
                {(stats.twitterImpressions ?? 0) > 0 ? formatK(stats.twitterImpressions ?? 0) : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Vues</p>
            </div>
            <div>
              <p className="text-lg font-extrabold leading-none text-white">
                {(stats.twitterRetweets ?? 0) > 0 ? formatK(stats.twitterRetweets ?? 0) : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Retweets</p>
            </div>
            <div>
              <p className="text-lg font-extrabold leading-none text-white">
                {(stats.twitterLikes ?? 0) > 0 ? formatK(stats.twitterLikes ?? 0) : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Likes ❤️</p>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp communauté */}
      <div className="rounded-xl bg-green-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <div>
            <p className="font-bold text-green-800">WhatsApp</p>
            <p className="text-xs text-green-600">Chaîne communauté</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-green-700">
            {stats.whatsappChannelReach > 0 ? formatK(stats.whatsappChannelReach) : "—"}
          </p>
          <p className="text-xs text-green-600">abonnés</p>
        </div>
      </div>

      {/* OneSignal — secteur */}
      <div className="rounded-xl bg-orange-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔔</span>
          <div>
            <p className="font-bold text-orange-800">Notifications</p>
            <p className="text-xs text-orange-600">personnes notifiées</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-orange-700">
            {stats.pushSent > 0 ? stats.pushSent : "—"}
          </p>
          {stats.pushClicked > 0 && (
            <p className="text-xs text-orange-500 mt-0.5">
              {stats.pushClicked} clics
            </p>
          )}
        </div>
      </div>

      {/* TikTok */}
      <div className="rounded-xl bg-gray-900 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎵</span>
          <p className="font-bold text-white">TikTok</p>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-lg font-extrabold leading-none text-white">
              {(stats.tiktokViews ?? 0) > 0 ? formatK(stats.tiktokViews ?? 0) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Vues</p>
          </div>
          <div>
            <p className="text-lg font-extrabold leading-none text-white">
              {(stats.tiktokLikes ?? 0) > 0 ? formatK(stats.tiktokLikes ?? 0) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">❤️</p>
          </div>
          <div>
            <p className="text-lg font-extrabold leading-none text-white">
              {(stats.tiktokShares ?? 0) > 0 ? formatK(stats.tiktokShares ?? 0) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Partages</p>
          </div>
          <div>
            <p className="text-lg font-extrabold leading-none text-white">
              {(stats.tiktokComments ?? 0) > 0 ? formatK(stats.tiktokComments ?? 0) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Comm.</p>
          </div>
        </div>
      </div>

      {/* Vues de la page */}
      {stats.pageViews > 0 && (
        <div className="rounded-xl bg-gray-50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <span>👁</span>
            <p className="text-sm font-medium">Vues de l&apos;annonce</p>
          </div>
          <p className="font-bold text-gray-800">{formatK(stats.pageViews)}</p>
        </div>
      )}

      {/* Abonnés alerte */}
      {stats.alertSubscribers > 0 && (
        <div className="rounded-xl bg-red-50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <span>🔴</span>
            <p className="text-sm font-medium">Abonnés alerte</p>
          </div>
          <p className="font-bold text-red-700">{stats.alertSubscribers}</p>
        </div>
      )}
    </div>
  );
}

function StatItem({
  value,
  label,
  colorClass,
}: {
  value: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div>
      <p className={`text-lg font-extrabold leading-none tabular-nums ${colorClass}`}>
        {value > 0 ? (
          value > 1000 ? (
            formatK(value)
          ) : (
            <CountUp start={0} end={value} duration={1.5} separator=" " />
          )
        ) : (
          "—"
        )}
      </p>
      <p className="text-xs text-blue-500 mt-0.5 opacity-70">{label}</p>
    </div>
  );
}

