'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user has enabled "Reduce Motion" in their system preferences.
 *
 * This is critical for WCAG AA accessibility compliance. Users with:
 * - Vestibular disorders
 * - Motion sensitivity
 * - Certain neurological conditions
 * - Epilepsy
 * - Migraines
 *
 * can experience serious discomfort, nausea, or even seizures from animations.
 *
 * @returns {boolean} true if user prefers reduced motion, false otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * return (
 *   <CountUp
 *     end={1000}
 *     duration={prefersReducedMotion ? 0 : 2.5}
 *   />
 * );
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listener for changes (user can toggle in system preferences)
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(listener);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Alternative hook that returns animation duration based on user preference.
 *
 * @param normalDuration - Duration in seconds for normal animation
 * @param reducedDuration - Duration in seconds for reduced motion (default: 0)
 * @returns Duration to use based on user preference
 *
 * @example
 * ```tsx
 * const duration = useAnimationDuration(2.5, 0);
 *
 * return <CountUp end={1000} duration={duration} />;
 * ```
 */
export function useAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
}
