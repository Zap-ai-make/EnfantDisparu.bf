'use client';

import { DiffusionEvent } from '@/types/announcement';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DiffusionTimelineProps {
  timeline?: DiffusionEvent[];
}

const CHANNEL_INFO = {
  facebook: { name: 'Facebook', icon: '📘', color: 'blue' },
  instagram: { name: 'Instagram', icon: '📸', color: 'pink' },
  whatsapp: { name: 'WhatsApp', icon: '💬', color: 'green' },
  twitter: { name: 'X (Twitter)', icon: '🐦', color: 'gray' },
  linkedin: { name: 'LinkedIn', icon: '💼', color: 'blue' },
  push: { name: 'Notifications Push', icon: '🔔', color: 'orange' },
  tiktok: { name: 'TikTok', icon: '🎵', color: 'black' },
} as const;

/**
 * Display the diffusion timeline showing when and how the announcement
 * was distributed across different social media channels.
 *
 * Features:
 * - Shows timestamp for each channel
 * - Success/failure status with color coding
 * - Reach metrics when available
 * - Error details for failed distributions
 * - Sorted by most recent first
 */
export function DiffusionTimeline({ timeline }: DiffusionTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-xl">
        <p className="text-2xl mb-2">⏳</p>
        <p className="text-sm font-medium">Diffusion en cours...</p>
        <p className="text-xs mt-1">
          La timeline de diffusion sera disponible dans quelques instants
        </p>
      </div>
    );
  }

  // Sort by timestamp (most recent first)
  const sorted = [...timeline].sort((a, b) => {
    const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
    return timeB - timeA;
  });

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-gray-600 flex items-center gap-2">
        📡 Historique de diffusion
      </h3>

      <div className="space-y-2">
        {sorted.map((event, idx) => (
          <DiffusionEventItem key={idx} event={event} />
        ))}
      </div>

      {sorted.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-700 font-medium">
            ℹ️ Toutes les diffusions sont effectuées automatiquement dès la publication
          </p>
        </div>
      )}
    </div>
  );
}

function DiffusionEventItem({ event }: { event: DiffusionEvent }) {
  const info = CHANNEL_INFO[event.channel];
  const isSuccess = event.status === 'success';
  const isPending = event.status === 'pending';

  const statusColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    failed: 'bg-red-50 border-red-200 text-red-800',
    pending: 'bg-gray-50 border-gray-200 text-gray-600',
  };

  const statusIcons = {
    success: '✅',
    failed: '❌',
    pending: '⏳',
  };

  // Format timestamp safely
  let timeAgo = 'à l\'instant';
  try {
    const timestamp = event.timestamp instanceof Date ? event.timestamp : new Date(event.timestamp);
    timeAgo = formatDistanceToNow(timestamp, {
      addSuffix: true,
      locale: fr,
    });
  } catch {
    // Keep default
  }

  return (
    <div
      className={`
        flex items-start gap-3 p-3 rounded-lg border transition-all
        ${statusColors[event.status]}
        ${isSuccess ? 'hover:shadow-sm' : ''}
      `}
    >
      {/* Status & Channel Icon */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`text-2xl ${!isSuccess && 'opacity-40'}`}>
          {statusIcons[event.status]}
        </div>
        <div className={`text-2xl ${!isSuccess && 'grayscale opacity-40'}`}>
          {info.icon}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className={`font-semibold text-sm ${!isSuccess && 'opacity-60'}`}>
            {info.name}
          </span>
          <span className="text-xs opacity-70 whitespace-nowrap">{timeAgo}</span>
        </div>

        {/* Success message */}
        {isSuccess && (
          <div className="text-xs space-y-1">
            <p className="text-green-700 font-medium">✓ Publié avec succès</p>
            {event.reach !== undefined && event.reach > 0 && (
              <p className="text-gray-600">
                👥 {event.reach.toLocaleString('fr-FR')} personnes atteintes
              </p>
            )}
            {event.postId && (
              <p className="text-gray-500 font-mono text-[10px] truncate">
                ID: {event.postId}
              </p>
            )}
            {event.details && (
              <p className="text-gray-600">{event.details}</p>
            )}
          </div>
        )}

        {/* Failed message */}
        {event.status === 'failed' && (
          <div className="text-xs space-y-1">
            <p className="text-red-700 font-medium">✗ Échec de publication</p>
            {event.error && (
              <p className="text-red-600">Erreur: {event.error}</p>
            )}
            {event.details && (
              <p className="text-gray-600">{event.details}</p>
            )}
          </div>
        )}

        {/* Pending message */}
        {isPending && (
          <div className="text-xs">
            <p className="text-gray-600">⏳ Publication en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Compact Timeline for Cards ───────────────────────────────────────────────

interface DiffusionTimelineCompactProps {
  timeline?: DiffusionEvent[];
}

/**
 * Compact version of the diffusion timeline, suitable for display in cards.
 * Shows only channel icons with success/failure indicators.
 */
export function DiffusionTimelineCompact({ timeline }: DiffusionTimelineCompactProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <span>⏳</span>
        <span>Diffusion en cours...</span>
      </div>
    );
  }

  // Group by channel (latest status per channel)
  const channelStatus: Record<string, DiffusionEvent> = {};
  timeline.forEach((event) => {
    if (!channelStatus[event.channel] ||
        new Date(event.timestamp) > new Date(channelStatus[event.channel].timestamp)) {
      channelStatus[event.channel] = event;
    }
  });

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Object.entries(channelStatus).map(([channel, event]) => {
        const info = CHANNEL_INFO[channel as keyof typeof CHANNEL_INFO];
        const isSuccess = event.status === 'success';

        return (
          <div
            key={channel}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-xs
              transition-all
              ${
                isSuccess
                  ? 'bg-green-100 text-green-700'
                  : event.status === 'failed'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-500'
              }
            `}
            title={`${info.name}: ${
              isSuccess ? 'Diffusé' : event.status === 'failed' ? 'Échec' : 'En cours'
            }`}
          >
            <span className="text-sm">{isSuccess ? '✓' : event.status === 'failed' ? '✗' : '⏳'}</span>
            <span>{info.icon}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Summary Stats Component ──────────────────────────────────────────────────

interface DiffusionSummaryProps {
  timeline?: DiffusionEvent[];
}

/**
 * Display summary statistics of the diffusion timeline.
 * Shows total channels, success count, and total reach.
 */
export function DiffusionSummary({ timeline }: DiffusionSummaryProps) {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const successCount = timeline.filter((e) => e.status === 'success').length;
  const failedCount = timeline.filter((e) => e.status === 'failed').length;
  const totalReach = timeline.reduce((sum, e) => sum + (e.reach || 0), 0);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-blue-50 rounded-xl p-3 text-center">
        <p className="text-2xl font-bold text-blue-600">{timeline.length}</p>
        <p className="text-xs text-blue-700">Canaux</p>
      </div>
      <div className="bg-green-50 rounded-xl p-3 text-center">
        <p className="text-2xl font-bold text-green-600">{successCount}</p>
        <p className="text-xs text-green-700">Réussis</p>
      </div>
      {totalReach > 0 && (
        <div className="bg-orange-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {totalReach.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-orange-700">Portée</p>
        </div>
      )}
      {failedCount > 0 && totalReach === 0 && (
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{failedCount}</p>
          <p className="text-xs text-red-700">Échecs</p>
        </div>
      )}
    </div>
  );
}
