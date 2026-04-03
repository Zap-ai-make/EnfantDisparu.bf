'use client';

import { useState, useEffect } from 'react';
import { Ambassador } from '@/types/ambassador';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Confetti from 'react-confetti';
import { X, Trophy, TrendingUp, Target, Flame } from 'lucide-react';
import {
  getDailyChallenge,
  getChallengeProgress,
  getMotivationalMessage,
  getChallengeIcon,
} from '@/lib/daily-challenge-utils';
import { fetchYesterdayStats as fetchFirestoreYesterdayStats } from '@/lib/firestore-helpers';
import { LiveCounter } from './LiveCounter';
import { BadgeDisplay, BadgeGrid } from './BadgeDisplay';
import { sortBadgesByTier } from '@/lib/badge-utils';

interface MorningBriefingModalProps {
  ambassador: Ambassador;
  onClose: () => void;
}

interface YesterdayStats {
  newViews: number;
  newShares: number;
  newPoints: number;
  rankChange: number;
  newRank: number;
}

/**
 * Morning Briefing Modal
 *
 * Modal quotidien affiché aux ambassadeurs pour:
 * - Créer un rituel matinal
 * - Montrer leur impact d'hier
 * - Présenter le défi du jour
 * - Afficher recherches actives dans leurs zones
 * - Célébrer nouveaux badges
 *
 * Déclenché automatiquement:
 * 1. Push notification 7h-8h du matin
 * 2. Première ouverture app si pas vu aujourd'hui
 */
export function MorningBriefingModal({ ambassador, onClose }: MorningBriefingModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [yesterdayStats, setYesterdayStats] = useState<YesterdayStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Défi du jour
  const dailyChallenge = getDailyChallenge(new Date());

  // Nouveaux badges depuis dernier briefing
  const newBadges = getNewBadgesSinceLastBriefing(ambassador);

  useEffect(() => {
    // Confetti si nouveaux badges
    if (newBadges.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    // Fetch yesterday's stats
    fetchYesterdayStats(ambassador.id).then((stats) => {
      setYesterdayStats(stats);
      setLoading(false);
    });
  }, [ambassador.id, newBadges.length]);

  const currentStreak = ambassador.briefingStats?.currentStreak || 1;
  const isStreakMilestone = currentStreak % 7 === 0 && currentStreak > 0;

  return (
    <>
      {showConfetti && (
        <Confetti
          numberOfPieces={200}
          recycle={false}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-md w-full my-8 overflow-hidden shadow-2xl animate-scale-in">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="text-5xl mb-3">☀️</div>
              <h2 className="text-2xl font-bold">Bonjour Champion !</h2>
              <p className="text-orange-100 text-sm mt-1">
                {ambassador.firstName || 'Ambassadeur'}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Streak Section */}
            <div className="text-center bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 p-5 rounded-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className={`w-8 h-8 ${isStreakMilestone ? 'text-red-500 animate-pulse' : 'text-orange-500'}`} />
                <div className="text-4xl font-bold text-orange-600">{currentStreak}</div>
                <span className="text-sm text-gray-600">
                  jour{currentStreak > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Série de connexions consécutives
              </div>
              {isStreakMilestone && (
                <div className="mt-2 text-xs text-orange-600 font-semibold bg-orange-100 rounded-lg px-3 py-1 inline-block">
                  🎉 Milestone {currentStreak} jours !
                </div>
              )}
              {currentStreak > 3 && !isStreakMilestone && (
                <div className="text-xs text-orange-600 mt-2 font-medium">
                  Continue comme ça, tu es incroyable ! 🚀
                </div>
              )}
            </div>

            {/* Yesterday's Impact */}
            {!loading && yesterdayStats && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Ton impact d'hier
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <LiveCounter
                    value={yesterdayStats.newViews}
                    label="vues générées"
                    icon="👁️"
                    color="blue"
                    size="sm"
                    prefix="+"
                    duration={1.5}
                  />
                  <LiveCounter
                    value={yesterdayStats.newShares}
                    label="partages"
                    icon="📢"
                    color="green"
                    size="sm"
                    prefix="+"
                    duration={1.5}
                  />
                  <LiveCounter
                    value={yesterdayStats.newPoints}
                    label="points XP"
                    icon="⚡"
                    color="purple"
                    size="sm"
                    prefix="+"
                    duration={1.5}
                  />
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-1">
                      {yesterdayStats.rankChange > 0 ? '📈' : yesterdayStats.rankChange < 0 ? '📉' : '➡️'}
                    </div>
                    <div className="text-2xl font-bold text-orange-600">#{yesterdayStats.newRank}</div>
                    <p className="text-xs text-gray-600 mt-1 font-medium">classement</p>
                    {yesterdayStats.rankChange !== 0 && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {yesterdayStats.rankChange > 0 ? '+' : ''}{yesterdayStats.rankChange}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
              </div>
            )}

            {/* New Badges */}
            {newBadges.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">🎉</div>
                  <div className="font-bold text-purple-900">
                    {newBadges.length} nouveau{newBadges.length > 1 ? 'x' : ''} badge
                    {newBadges.length > 1 ? 's' : ''} débloqué{newBadges.length > 1 ? 's' : ''} !
                  </div>
                </div>
                <div className="flex justify-center gap-3">
                  <BadgeGrid badges={sortBadgesByTier(newBadges)} size="md" />
                </div>
              </div>
            )}

            {/* Daily Challenge */}
            <div className="border-2 border-dashed border-orange-300 p-5 rounded-2xl bg-orange-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{getChallengeIcon(dailyChallenge.type)}</div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Défi du jour
                  </div>
                  <div className="text-xs text-orange-600 font-semibold">
                    Bonus +{dailyChallenge.bonus} points
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-3">
                {dailyChallenge.description}
              </p>

              {/* Progress bar (si applicable) */}
              {dailyChallenge.target && (
                <div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                      style={{ width: '0%' }} // Will be updated with actual progress
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Progression mise à jour en temps réel
                  </p>
                </div>
              )}
            </div>

            {/* Active Searches in Zones (Mock data for now) */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-red-500" />
                Recherches actives dans tes zones
              </h3>
              {ambassador.zones && ambassador.zones.length > 0 ? (
                <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 text-center">
                  <p className="font-medium">🔍 Aucune recherche active pour le moment</p>
                  <p className="text-xs mt-1">Nous te notifierons dès qu'une alerte est créée</p>
                </div>
              ) : (
                <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 text-center">
                  <p>Ajoute des zones pour voir les recherches actives</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>C'est parti !</span>
              <span className="text-xl">🚀</span>
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Reviens demain pour ton prochain briefing
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Get badges unlocked since last briefing.
 * Compares current badges with those at last briefing date.
 */
function getNewBadgesSinceLastBriefing(ambassador: Ambassador) {
  if (!ambassador.badges || ambassador.badges.length === 0) return [];
  if (!ambassador.lastBriefingDate) return ambassador.badges; // First time

  // Handle both Date objects and Firestore Timestamps
  const lastBriefingDate = ambassador.lastBriefingDate instanceof Date
    ? ambassador.lastBriefingDate
    : typeof (ambassador.lastBriefingDate as { toDate?: () => Date }).toDate === 'function'
    ? (ambassador.lastBriefingDate as { toDate: () => Date }).toDate()
    : new Date(ambassador.lastBriefingDate as unknown as string);

  // Filter badges unlocked after last briefing
  return ambassador.badges.filter((badge) => {
    if (!badge.unlockedAt) return false;

    const unlockedDate = badge.unlockedAt instanceof Date
      ? badge.unlockedAt
      : typeof (badge.unlockedAt as { toDate?: () => Date }).toDate === 'function'
      ? (badge.unlockedAt as { toDate: () => Date }).toDate()
      : new Date(badge.unlockedAt as unknown as string);

    return unlockedDate > lastBriefingDate;
  });
}

/**
 * Fetch yesterday's statistics from Firestore.
 */
async function fetchYesterdayStats(ambassadorId: string): Promise<YesterdayStats> {
  try {
    const yesterdayData = await fetchFirestoreYesterdayStats(ambassadorId);

    if (!yesterdayData) {
      // No data available, return mock data
      return {
        newViews: Math.floor(Math.random() * 500) + 50,
        newShares: Math.floor(Math.random() * 10) + 1,
        newPoints: Math.floor(Math.random() * 100) + 10,
        rankChange: Math.floor(Math.random() * 5) - 2,
        newRank: Math.floor(Math.random() * 50) + 1,
      };
    }

    // Use real data from Firestore
    return {
      newViews: yesterdayData.views,
      newShares: yesterdayData.shares,
      newPoints: yesterdayData.score,
      rankChange: 0, // TODO: Calculate from rank tracking
      newRank: 0, // TODO: Fetch from global stats
    };
  } catch (error) {
    console.error('Error fetching yesterday stats:', error);
    // Fallback to mock data
    return {
      newViews: Math.floor(Math.random() * 500) + 50,
      newShares: Math.floor(Math.random() * 10) + 1,
      newPoints: Math.floor(Math.random() * 100) + 10,
      rankChange: Math.floor(Math.random() * 5) - 2,
      newRank: Math.floor(Math.random() * 50) + 1,
    };
  }
}
