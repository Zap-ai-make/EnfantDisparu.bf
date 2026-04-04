'use client';

import { useEffect, useState } from 'react';
import { GlobalStats } from '@/types/announcement';
import {
  generateMockGlobalStats,
  formatNumber,
  formatNumberCompact,
  formatPercentage,
  getStatsInsight,
  getResolutionRateColor,
} from '@/lib/live-stats-utils';
import { LiveCounter } from '@/components/LiveCounter';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TrendingUp, Users, Share2, Eye, CheckCircle, Activity, AlertCircle } from 'lucide-react';

interface LiveStatusBarProps {
  variant?: 'full' | 'compact';
  showInsight?: boolean;
  refreshInterval?: number; // milliseconds
  className?: string;
}

/**
 * Live Status Bar Component
 *
 * Displays global platform metrics in real-time with animated counters.
 *
 * Features:
 * - Real-time stats with auto-increment simulation
 * - Animated counters using LiveCounter component
 * - Full and compact variants
 * - Insight banner with dynamic messaging
 * - Color-coded resolution rate
 * - Mobile responsive
 */
export function LiveStatusBar({
  variant = 'full',
  showInsight = true,
  refreshInterval = 10000, // 10 seconds (not used with real-time listener)
  className = '',
}: LiveStatusBarProps) {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Fetch stats from API (avoids Firestore permission issues)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/global');
        if (response.ok) {
          const data = await response.json();
          setStats(data as GlobalStats);
          setError(null);
        } else {
          console.warn('Failed to fetch global stats, using fallback');
          setStats(generateMockGlobalStats());
        }
      } catch (err) {
        console.error('Error fetching global stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStats(generateMockGlobalStats());
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !stats) {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="animate-pulse flex items-center gap-4">
            <div className="h-4 bg-white/30 rounded w-24"></div>
            <div className="h-4 bg-white/30 rounded w-32"></div>
            <div className="h-4 bg-white/30 rounded w-28"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (shows error but still displays data if available)
  if (error && !stats) {
    return (
      <div className={`bg-red-600 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-white text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Impossible de charger les statistiques en temps réel</span>
          </div>
        </div>
      </div>
    );
  }

  const insight = showInsight ? getStatsInsight(stats) : null;

  if (variant === 'compact') {
    return (
      <LiveStatusBarCompact
        stats={stats}
        insight={insight}
        className={className}
      />
    );
  }

  return (
    <div className={`bg-gradient-to-r from-orange-500 to-red-500 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-3">
          {/* Active Announcements */}
          <StatItem
            icon={<Activity className="w-4 h-4" />}
            value={stats.activeAnnouncements}
            label="En cours"
            color="orange"
            pulse
          />

          {/* Resolved Announcements */}
          <StatItem
            icon={<CheckCircle className="w-4 h-4" />}
            value={stats.resolvedAnnouncements}
            label="Retrouvés"
            color="green"
            badge={formatPercentage(stats.resolutionRate)}
          />

          {/* Total Ambassadors */}
          <StatItem
            icon={<Users className="w-4 h-4" />}
            value={stats.totalAmbassadors}
            label="Ambassadeurs"
            color="blue"
          />

          {/* Total Shares */}
          <StatItem
            icon={<Share2 className="w-4 h-4" />}
            value={stats.totalShares}
            label="Partages"
            color="purple"
            showCompact
          />

          {/* Total Views */}
          <StatItem
            icon={<Eye className="w-4 h-4" />}
            value={stats.totalViews}
            label="Vues"
            color="pink"
            showCompact
          />

          {/* Last 24h Activity */}
          <StatItem
            icon={<TrendingUp className="w-4 h-4" />}
            value={stats.last24hShares}
            label="Aujourd'hui"
            color="yellow"
            suffix="partages"
          />
        </div>

        {/* Insight Banner */}
        {insight && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center justify-center gap-2">
            <span className="text-xl">{insight.icon}</span>
            <span className="text-sm font-medium">{insight.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stat Item Component ──────────────────────────────────────────────────────

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: 'orange' | 'green' | 'blue' | 'purple' | 'pink' | 'yellow';
  pulse?: boolean;
  badge?: string;
  showCompact?: boolean;
  suffix?: string;
}

function StatItem({
  icon,
  value,
  label,
  color,
  pulse,
  badge,
  showCompact,
  suffix,
}: StatItemProps) {
  const prefersReducedMotion = useReducedMotion();

  const colorClasses = {
    orange: 'bg-orange-400/20 text-orange-100',
    green: 'bg-green-400/20 text-green-100',
    blue: 'bg-blue-400/20 text-blue-100',
    purple: 'bg-purple-400/20 text-purple-100',
    pink: 'bg-pink-400/20 text-pink-100',
    yellow: 'bg-yellow-400/20 text-yellow-100',
  };

  return (
    <div
      className={`
        ${colorClasses[color]}
        rounded-lg px-3 py-2
        flex flex-col items-center justify-center
        min-w-0
      `}
    >
      {/* Icon */}
      <div className={`mb-1 ${pulse && !prefersReducedMotion ? 'animate-pulse-slow' : ''}`}>
        {icon}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold tabular-nums">
          {showCompact ? formatNumberCompact(value) : formatNumber(value)}
        </span>
        {badge && (
          <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-xs opacity-90 text-center">
        {label}
        {suffix && <span className="block text-[10px] opacity-70">{suffix}</span>}
      </p>
    </div>
  );
}

// ─── Compact Status Bar ───────────────────────────────────────────────────────

interface LiveStatusBarCompactProps {
  stats: GlobalStats;
  insight: ReturnType<typeof getStatsInsight> | null;
  className?: string;
}

/**
 * Compact version of LiveStatusBar for mobile or sidebars.
 * Shows only the most critical metrics in a single row.
 */
function LiveStatusBarCompact({
  stats,
  insight,
  className = '',
}: LiveStatusBarCompactProps) {
  return (
    <div className={`bg-gradient-to-r from-orange-500 to-red-500 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs">
          {/* Active */}
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span className="font-bold tabular-nums">{stats.activeAnnouncements}</span>
            <span className="opacity-80">en cours</span>
          </div>

          {/* Resolved */}
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="font-bold tabular-nums">{stats.resolvedAnnouncements}</span>
            <span className="opacity-80">retrouvés</span>
          </div>

          {/* Ambassadors */}
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span className="font-bold tabular-nums">{stats.totalAmbassadors}</span>
            <span className="opacity-80">ambassadeurs</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-bold tabular-nums">{formatNumberCompact(stats.totalViews)}</span>
            <span className="opacity-80">vues</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Live Status Card ─────────────────────────────────────────────────────────

interface LiveStatusCardProps {
  showTitle?: boolean;
}

/**
 * Card version of LiveStatusBar for embedding in pages.
 * Uses white background instead of gradient.
 */
export function LiveStatusCard({
  showTitle = true,
}: LiveStatusCardProps) {
  const [stats, setStats] = useState<GlobalStats | null>(null);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/global');
        if (response.ok) {
          const data = await response.json();
          setStats(data as GlobalStats);
        } else {
          setStats(generateMockGlobalStats());
        }
      } catch (err) {
        console.error('Error fetching global stats:', err);
        setStats(generateMockGlobalStats());
      }
    };

    fetchStats();

    // Refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const resolutionColor = getResolutionRateColor(stats.resolutionRate);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      {/* Title */}
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Impact global
          </h2>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
            <span>En direct</span>
          </div>
        </div>
      )}

      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center">
          <LiveCounter
            value={stats.activeAnnouncements}
            duration={1.5}
            label=""
            size="sm"
            color="orange"
          />
          <p className="text-xs text-gray-600 mt-1">Recherches actives</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
          <LiveCounter
            value={stats.resolvedAnnouncements}
            duration={1.5}
            label=""
            size="sm"
            color="green"
          />
          <p className="text-xs text-gray-600 mt-1">Enfants retrouvés</p>
          <p className={`text-xs font-semibold ${resolutionColor} mt-1`}>
            {formatPercentage(stats.resolutionRate)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
          <LiveCounter
            value={stats.totalAmbassadors}
            duration={1.5}
            label=""
            size="sm"
            color="blue"
          />
          <p className="text-xs text-gray-600 mt-1">Ambassadeurs actifs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatNumberCompact(stats.totalViews)}
          </div>
          <p className="text-xs text-gray-600 mt-1">Vues générées</p>
        </div>
      </div>

      {/* Insight */}
      {(() => {
        const insight = getStatsInsight(stats);
        return (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 text-center">
            <p className={`text-sm font-medium ${insight.color} flex items-center justify-center gap-2`}>
              <span className="text-lg">{insight.icon}</span>
              {insight.message}
            </p>
          </div>
        );
      })()}
    </div>
  );
}
