'use client';

import { Badge } from '@/types/ambassador';
import { getBadgeTierColors } from '@/lib/badge-utils';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

/**
 * Display a single badge with tier-appropriate styling.
 *
 * Supports three sizes:
 * - sm: 12x12 (for inline display)
 * - md: 16x16 (default, for grids)
 * - lg: 20x20 (for featured display)
 */
export function BadgeDisplay({ badge, size = 'md', showTooltip = true }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl',
  };

  const tierColors = getBadgeTierColors(badge.tier);

  return (
    <div className="relative group">
      {/* Badge circle */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          bg-gradient-to-br ${tierColors.gradient}
          flex items-center justify-center
          shadow-lg
          transition-transform hover:scale-110
          cursor-pointer
        `}
      >
        <span>{badge.icon}</span>
      </div>

      {/* Tooltip on hover */}
      {showTooltip && (
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            hidden group-hover:block
            bg-gray-900 text-white text-xs rounded-lg px-3 py-2
            whitespace-nowrap
            z-10
            pointer-events-none
          "
        >
          <div className="font-semibold">{badge.name}</div>
          <div className="text-gray-300 mt-0.5">{badge.description}</div>
          {badge.unlockedAt && (
            <div className="text-gray-400 text-[10px] mt-1">
              Débloqué le{' '}
              {badge.unlockedAt instanceof Date
                ? badge.unlockedAt.toLocaleDateString('fr-FR')
                : new Date(badge.unlockedAt.toDate()).toLocaleDateString('fr-FR')}
            </div>
          )}
          {/* Triangle pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Badge Grid Component ─────────────────────────────────────────────────────

interface BadgeGridProps {
  badges: Badge[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Display multiple badges in a grid layout.
 * Optionally limit display count and show "+X more" indicator.
 */
export function BadgeGrid({ badges, maxDisplay, size = 'md' }: BadgeGridProps) {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  const remainingCount = badges.length - displayBadges.length;

  if (badges.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        <p className="text-3xl mb-2">🎯</p>
        <p className="text-sm">Aucun badge débloqué pour le moment</p>
        <p className="text-xs text-gray-500 mt-1">Continuez vos actions pour en gagner !</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {displayBadges.map((badge) => (
        <BadgeDisplay key={badge.id} badge={badge} size={size} />
      ))}
      {remainingCount > 0 && (
        <div className="text-sm text-gray-500 font-medium">+{remainingCount}</div>
      )}
    </div>
  );
}

// ─── Badge Progress Bar Component ─────────────────────────────────────────────

interface BadgeProgressProps {
  badge: Omit<Badge, 'unlockedAt'>;
  current: number;
  target: number;
  percentage: number;
}

/**
 * Display progress toward unlocking a badge.
 * Shows badge icon (grayed out), name, and progress bar.
 */
export function BadgeProgress({ badge, current, target, percentage }: BadgeProgressProps) {
  const tierColors = getBadgeTierColors(badge.tier);

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      {/* Badge icon (grayed out) */}
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl opacity-40">
        {badge.icon}
      </div>

      {/* Progress info */}
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-900">{badge.name}</span>
          <span className="text-gray-500 tabular-nums">
            {current.toLocaleString()} / {target.toLocaleString()}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${tierColors.gradient} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
      </div>
    </div>
  );
}

// ─── Badge Notification Component ─────────────────────────────────────────────

interface BadgeNotificationProps {
  badge: Badge;
  onClose?: () => void;
}

/**
 * Celebratory notification when a badge is unlocked.
 * Can be used in a toast or modal.
 */
export function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  const tierColors = getBadgeTierColors(badge.tier);

  return (
    <div
      className={`
        ${tierColors.bg} ${tierColors.border}
        border-2 rounded-2xl p-6
        shadow-2xl
        animate-scale-in
      `}
    >
      <div className="text-center">
        {/* Celebration icon */}
        <div className="text-5xl mb-3">🎉</div>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <BadgeDisplay badge={badge} size="lg" showTooltip={false} />
        </div>

        {/* Text */}
        <h3 className={`text-xl font-bold ${tierColors.text} mb-2`}>Nouveau badge débloqué !</h3>
        <p className="text-lg font-semibold text-gray-900 mb-1">{badge.name}</p>
        <p className="text-sm text-gray-600">{badge.description}</p>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className={`
              mt-4 px-6 py-2 rounded-xl font-semibold
              ${tierColors.text} ${tierColors.bg}
              hover:opacity-80 transition-opacity
            `}
          >
            Génial ! 🚀
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Badge Tier Label Component ───────────────────────────────────────────────

interface BadgeTierLabelProps {
  tier: Badge['tier'];
}

/**
 * Display a tier label with appropriate styling.
 */
export function BadgeTierLabel({ tier }: BadgeTierLabelProps) {
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
        px-2 py-1 rounded-lg text-xs font-semibold
        ${tierColors.bg} ${tierColors.text} ${tierColors.border}
        border
      `}
    >
      {tierNames[tier]}
    </span>
  );
}
