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

/**
 * Live Status Bar Component
 *
 * Affiche les statistiques globales : ambassadeurs et membres.
 * Les compteurs partent d'une base (10 ambassadeurs, 400 membres)
 * et s'incrémentent avec les vraies inscriptions.
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

    // Refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !stats) {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="animate-pulse flex items-center justify-center gap-6">
            <div className="h-4 bg-white/30 rounded w-32"></div>
            <div className="h-4 bg-white/30 rounded w-28"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className={`bg-red-600 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Impossible de charger les statistiques</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-orange-500 to-red-500 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-6 sm:gap-8 text-xs">
          {/* Ambassadors */}
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span className="font-bold tabular-nums">{stats.totalAmbassadors}</span>
            <span className="opacity-80">ambassadeurs</span>
          </div>

          {/* Members */}
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span className="font-bold tabular-nums">{stats.totalMembers}</span>
            <span className="opacity-80">membres</span>
          </div>
        </div>
      </div>
    </div>
  );
}
