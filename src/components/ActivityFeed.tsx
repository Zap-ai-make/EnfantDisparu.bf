'use client';

import { collection, query, orderBy, limit as firestoreLimit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { ActivityEvent, ActivityType } from '@/types/ambassador';
import {
  generateMockActivityFeed,
  getActivityMessage,
  getActivityIcon,
  getActivityColors,
  getRelativeTime,
  filterActivityByType,
  calculateActivityVelocity,
} from '@/lib/activity-feed-utils';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getBadgeTierColors } from '@/lib/badge-utils';

interface ActivityFeedProps {
  maxItems?: number;
  showFilters?: boolean;
  showVelocity?: boolean;
  refreshInterval?: number; // milliseconds
}

/**
 * Activity Feed Component
 *
 * Displays real-time community activity to create FOMO and engagement.
 *
 * Features:
 * - Auto-refresh every X seconds
 * - Type filtering (badges, shares, recruits, etc.)
 * - Velocity metrics (events/hour)
 * - Smooth animations for new items
 * - Reduced motion support
 */
export function ActivityFeed({
  maxItems = 15,
  showFilters = true,
  showVelocity = true,
  refreshInterval = 30000, // Not used with real-time listener
}: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ActivityEvent[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(
      collection(db, 'activityFeed'),
      orderBy('timestamp', 'desc'),
      firestoreLimit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedEvents: ActivityEvent[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id,
            type: data.type as ActivityType,
            ambassadorId: data.ambassadorId,
            ambassadorName: data.ambassadorName,
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
            metadata: data.metadata,
          };
        });

        setEvents(fetchedEvents);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching activity feed:', err);
        setError(err.message);
        setIsLoading(false);
        // Fallback to mock data on error
        setEvents(generateMockActivityFeed(50));
      }
    );

    return () => unsubscribe();
  }, []);

  // Apply filters
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredEvents(events.slice(0, maxItems));
    } else {
      const filtered = filterActivityByType(events, selectedTypes);
      setFilteredEvents(filtered.slice(0, maxItems));
    }
  }, [events, selectedTypes, maxItems]);

  function toggleTypeFilter(type: ActivityType) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  const velocity = calculateActivityVelocity(events);

  if (isLoading && events.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">📡</span>
          Activité communautaire
        </h2>
        {showVelocity && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></span>
            {velocity.lastHour > 0 ? (
              <span>{velocity.lastHour} événement{velocity.lastHour > 1 ? 's' : ''} cette heure</span>
            ) : (
              <span>{velocity.last24Hours} événements/h</span>
            )}
          </div>
        )}
      </div>

      {/* Type Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {(['share', 'badge', 'recruit', 'streak', 'retrouvaille'] as ActivityType[]).map((type) => {
            const isActive = selectedTypes.includes(type);
            const icon = getActivityIcon(type);
            const colors = getActivityColors(type);

            return (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium
                  transition-all
                  ${isActive
                    ? `${colors.bg} ${colors.border} border ${colors.text}`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <span className="mr-1">{icon}</span>
                {type === 'share' && 'Partages'}
                {type === 'badge' && 'Badges'}
                {type === 'recruit' && 'Recrutements'}
                {type === 'streak' && 'Streaks'}
                {type === 'retrouvaille' && 'Retrouvailles'}
              </button>
            );
          })}
          {selectedTypes.length > 0 && (
            <button
              onClick={() => setSelectedTypes([])}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600"
            >
              ✕ Tout
            </button>
          )}
        </div>
      )}

      {/* Events List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">🌙</p>
            <p className="text-sm">Aucune activité récente</p>
            <p className="text-xs mt-1">Revenez plus tard !</p>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <ActivityItem
              key={event.id}
              event={event}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))
        )}
      </div>

      {/* Footer hint */}
      {filteredEvents.length > 0 && (
        <div className="pt-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            La communauté est active 24/7 — vos actions inspirent les autres !
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Activity Item Component ──────────────────────────────────────────────────

interface ActivityItemProps {
  event: ActivityEvent;
  index: number;
  prefersReducedMotion: boolean;
}

function ActivityItem({ event, index, prefersReducedMotion }: ActivityItemProps) {
  const icon = getActivityIcon(event.type);
  const message = getActivityMessage(event);
  const timeAgo = getRelativeTime(event.timestamp);
  const colors = getActivityColors(event.type);

  // Stagger animation
  const animationDelay = prefersReducedMotion ? '' : `animation-delay-${Math.min(index, 5) * 100}`;

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-xl border
        ${colors.bg} ${colors.border}
        transition-all hover:shadow-sm
        ${prefersReducedMotion ? '' : 'animate-scale-in'}
        ${animationDelay}
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex-shrink-0 w-10 h-10 rounded-full
          flex items-center justify-center
          text-xl
          ${colors.icon}
          bg-white/70
        `}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <p className={`text-sm font-semibold ${colors.text}`}>
            {event.ambassadorName}
          </p>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {timeAgo}
          </span>
        </div>

        <p className="text-sm text-gray-700">{message}</p>

        {/* Special badge display */}
        {event.type === 'badge' && event.metadata?.badgeTier && (
          <div className="mt-2">
            <BadgeTierPill tier={event.metadata.badgeTier} />
          </div>
        )}

        {/* Retrouvaille celebration */}
        {event.type === 'retrouvaille' && (
          <div className="mt-2 text-xs font-semibold text-green-700 flex items-center gap-1">
            <span>🎊</span>
            <span>Grande victoire pour la communauté !</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Badge Tier Pill Component ────────────────────────────────────────────────

function BadgeTierPill({ tier }: { tier: 'bronze' | 'silver' | 'gold' | 'platinum' }) {
  const tierColors = getBadgeTierColors(tier);
  const tierNames = {
    bronze: 'Bronze',
    silver: 'Argent',
    gold: 'Or',
    platinum: 'Platine',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5 rounded-md text-xs font-semibold
        ${tierColors.bg} ${tierColors.text} ${tierColors.border}
        border
      `}
    >
      {tierNames[tier]}
    </span>
  );
}

// ─── Compact Activity Feed ────────────────────────────────────────────────────

interface ActivityFeedCompactProps {
  maxItems?: number;
}

/**
 * Compact version of activity feed for sidebars or cards.
 * Shows only icons and names without filters.
 */
export function ActivityFeedCompact({ maxItems = 5 }: ActivityFeedCompactProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(
      collection(db, 'activityFeed'),
      orderBy('timestamp', 'desc'),
      firestoreLimit(maxItems)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedEvents: ActivityEvent[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id,
            type: data.type as ActivityType,
            ambassadorId: data.ambassadorId,
            ambassadorName: data.ambassadorName,
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
            metadata: data.metadata,
          };
        });

        setEvents(fetchedEvents);
      },
      (err) => {
        console.error('Error fetching activity feed:', err);
        setEvents(generateMockActivityFeed(maxItems));
      }
    );

    return () => unsubscribe();
  }, [maxItems]);

  if (events.length === 0) {
    return (
      <div className="text-xs text-gray-400 text-center py-2">
        Aucune activité
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const icon = getActivityIcon(event.type);
        const message = getActivityMessage(event);

        return (
          <div key={event.id} className="flex items-start gap-2 text-xs">
            <span className="text-lg flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-900">{event.ambassadorName}</span>
              {' '}
              <span className="text-gray-600">{message}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
