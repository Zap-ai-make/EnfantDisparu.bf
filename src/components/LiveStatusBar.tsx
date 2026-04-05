'use client';

import { useEffect, useState } from 'react';
import { Users, UserCheck, AlertCircle } from 'lucide-react';

interface SimpleStats {
  totalAmbassadors: number;
  totalMembers: number;
}

interface LiveStatusBarProps {
  className?: string;
}

// Social media channels (without icons)
const SOCIAL_CHANNELS = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn'];

/**
 * Live Status Bar Component
 *
 * Affiche les statistiques globales : ambassadeurs et membres.
 * Barre sticky avec défilement infini des canaux de diffusion.
 */
export function LiveStatusBar({ className = '' }: LiveStatusBarProps) {
  const [stats, setStats] = useState<SimpleStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/global');
        if (response.ok) {
          const data = await response.json();
          setStats(data as SimpleStats);
          setError(null);
        } else {
          console.warn('Failed to fetch global stats, using fallback');
          setStats({ totalAmbassadors: 10, totalMembers: 400 });
        }
      } catch (err) {
        console.error('Error fetching global stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStats({ totalAmbassadors: 10, totalMembers: 400 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !stats) {
    return (
      <div className={`sticky top-0 z-40 bg-gradient-to-r from-orange-500 to-red-500 ${className}`}>
        <div className="py-2">
          <div className="animate-pulse flex items-center justify-center gap-6">
            <div className="h-4 bg-white/30 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className={`sticky top-0 z-40 bg-red-600 ${className}`}>
        <div className="py-2">
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Impossible de charger les statistiques</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sticky top-0 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white overflow-hidden ${className}`}>
      <div className="py-2">
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            <MarqueeContent stats={stats} />
          </div>
          <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
            <MarqueeContent stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeContent({ stats }: { stats: SimpleStats }) {
  return (
    <>
      <div className="flex items-center gap-1.5 mx-4 text-xs">
        <UserCheck className="w-3.5 h-3.5" />
        <span className="font-bold tabular-nums">{stats.totalAmbassadors}</span>
        <span className="opacity-80">ambassadeurs</span>
      </div>
      <span className="text-white/40">•</span>
      <div className="flex items-center gap-1.5 mx-4 text-xs">
        <Users className="w-3.5 h-3.5" />
        <span className="font-bold tabular-nums">{stats.totalMembers}</span>
        <span className="opacity-80">membres</span>
      </div>
      <span className="text-white/40">•</span>
      {SOCIAL_CHANNELS.map((channel, idx) => (
        <span key={idx} className="mx-4 text-xs opacity-90">{channel}</span>
      ))}
      <span className="text-white/40 mx-2">•</span>
    </>
  );
}
