'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DiffusionChannel {
  name: string;
  icon: string;
  done: boolean;
  delay: number;
}

interface DiffusionCheckListProps {
  /**
   * Si fourni, utilise les statuts réels de diffusion
   * Sinon, simule une animation progressive pour l'effet visuel
   */
  actualStatus?: {
    facebook?: boolean;
    instagram?: boolean;
    whatsapp?: boolean;
    twitter?: boolean;
    linkedin?: boolean;
    push?: boolean;
    tiktok?: boolean;
  };
  /**
   * Durée totale de l'animation (ms)
   */
  animationDuration?: number;
  /**
   * Callback quand tous les canaux sont "done"
   */
  onComplete?: () => void;
}

const DEFAULT_CHANNELS: Omit<DiffusionChannel, 'done'>[] = [
  { name: 'Facebook', icon: '📘', delay: 500 },
  { name: 'Instagram', icon: '📸', delay: 1000 },
  { name: 'WhatsApp', icon: '💬', delay: 1500 },
  { name: 'X (Twitter)', icon: '🐦', delay: 2000 },
  { name: 'LinkedIn', icon: '💼', delay: 2500 },
  { name: 'Notifications', icon: '🔔', delay: 3000 },
];

export function DiffusionCheckList({
  actualStatus,
  animationDuration = 3500,
  onComplete,
}: DiffusionCheckListProps) {
  const [channels, setChannels] = useState<DiffusionChannel[]>(
    DEFAULT_CHANNELS.map((ch) => ({ ...ch, done: false }))
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Si statuts réels fournis, les utiliser directement
    if (actualStatus) {
      const statusMap: Record<string, boolean> = {
        Facebook: actualStatus.facebook ?? false,
        Instagram: actualStatus.instagram ?? false,
        WhatsApp: actualStatus.whatsapp ?? false,
        'X (Twitter)': actualStatus.twitter ?? false,
        LinkedIn: actualStatus.linkedin ?? false,
        'Notifications': actualStatus.push ?? false,
      };

      setChannels((prev) =>
        prev.map((ch) => ({
          ...ch,
          done: statusMap[ch.name] ?? false,
        }))
      );
      setIsAnimating(false);
      return;
    }

    // Sinon, animation progressive
    const timers: NodeJS.Timeout[] = [];

    // Si reduced motion, activer tous les canaux instantanément
    if (prefersReducedMotion) {
      setChannels((prev) => prev.map((ch) => ({ ...ch, done: true })));
      setIsAnimating(false);
      onComplete?.();
      return;
    }

    channels.forEach((channel, idx) => {
      const timer = setTimeout(() => {
        setChannels((prev) =>
          prev.map((ch, i) => (i === idx ? { ...ch, done: true } : ch))
        );

        // Si dernier canal, appeler onComplete
        if (idx === channels.length - 1) {
          setIsAnimating(false);
          onComplete?.();
        }
      }, channel.delay);

      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [actualStatus, onComplete, prefersReducedMotion]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-gray-900">📡 Diffusion en cours...</p>
        {isAnimating && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span>En direct</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {channels.map((ch, i) => (
          <DiffusionChannelItem key={i} channel={ch} />
        ))}
      </div>

      {!isAnimating && channels.every((ch) => ch.done) && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm font-semibold text-green-800">
            Diffusion terminée avec succès !
          </p>
          <p className="text-xs text-green-600 mt-1">
            Votre alerte a été partagée sur tous les canaux
          </p>
        </div>
      )}
    </div>
  );
}

function DiffusionChannelItem({ channel }: { channel: DiffusionChannel }) {
  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg
        transition-all duration-300
        ${
          channel.done
            ? 'bg-green-50 border border-green-200 scale-100'
            : 'bg-gray-50 border border-gray-200 scale-95 opacity-60'
        }
      `}
    >
      {/* Icon animé */}
      <div
        className={`
          text-2xl transition-all duration-300
          ${channel.done ? 'scale-110 rotate-12' : 'scale-100 grayscale'}
        `}
      >
        {channel.done ? '✅' : '⏳'}
      </div>

      {/* Emoji du canal */}
      <div
        className={`
          text-xl transition-opacity duration-300
          ${channel.done ? 'opacity-100' : 'opacity-40'}
        `}
      >
        {channel.icon}
      </div>

      {/* Nom du canal */}
      <span
        className={`
          flex-1 font-medium transition-all duration-300
          ${channel.done ? 'text-green-700' : 'text-gray-500'}
        `}
      >
        {channel.name}
      </span>

      {/* Animation de chargement si pas encore done */}
      {!channel.done && (
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      )}

      {/* Checkmark animé si done */}
      {channel.done && (
        <div className="text-green-600 font-bold animate-scale-in">✓</div>
      )}
    </div>
  );
}

// Variant compact pour affichage dans cards
export function DiffusionCheckListCompact({
  actualStatus,
}: {
  actualStatus?: DiffusionCheckListProps['actualStatus'];
}) {
  const channels = [
    { key: 'facebook', icon: '📘', label: 'FB' },
    { key: 'instagram', icon: '📸', label: 'IG' },
    { key: 'whatsapp', icon: '💬', label: 'WA' },
    { key: 'twitter', icon: '🐦', label: 'X' },
    { key: 'linkedin', icon: '💼', label: 'LI' },
    { key: 'push', icon: '🔔', label: 'Notif' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {channels.map((ch) => {
        const isDone = actualStatus?.[ch.key as keyof typeof actualStatus] ?? false;

        return (
          <div
            key={ch.key}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-xs
              transition-all
              ${
                isDone
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }
            `}
            title={`${ch.label}: ${isDone ? 'Diffusé' : 'En attente'}`}
          >
            <span className="text-sm">{isDone ? '✓' : ch.icon}</span>
            <span className="font-medium">{ch.label}</span>
          </div>
        );
      })}
    </div>
  );
}
