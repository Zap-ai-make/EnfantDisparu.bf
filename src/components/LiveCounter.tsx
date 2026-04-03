'use client';

import CountUp from 'react-countup';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LiveCounterProps {
  value: number;
  label: string;
  icon?: string;
  color?: 'orange' | 'blue' | 'green' | 'red' | 'purple' | 'pink';
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LiveCounter({
  value,
  label,
  icon,
  color = 'orange',
  duration = 2.5,
  decimals = 0,
  suffix = '',
  prefix = '',
  size = 'md',
  className = '',
}: LiveCounterProps) {
  const colorClasses = {
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    red: 'text-red-600 bg-red-50 border-red-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    pink: 'text-pink-600 bg-pink-50 border-pink-100',
  };

  const sizeClasses = {
    sm: {
      container: 'p-4 rounded-xl',
      icon: 'text-2xl mb-1',
      number: 'text-2xl',
      label: 'text-xs',
    },
    md: {
      container: 'p-6 rounded-2xl',
      icon: 'text-3xl mb-2',
      number: 'text-4xl',
      label: 'text-sm',
    },
    lg: {
      container: 'p-8 rounded-3xl',
      icon: 'text-4xl mb-3',
      number: 'text-5xl',
      label: 'text-base',
    },
  };

  const sizes = sizeClasses[size];
  const prefersReducedMotion = useReducedMotion();

  // Easing function "ease-out" pour ralentir à la fin
  const easingFn = (t: number, b: number, c: number, d: number) => {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  };

  // Si reduced motion, afficher instantanément
  const effectiveDuration = prefersReducedMotion ? 0 : duration;

  return (
    <div
      className={`${sizes.container} ${colorClasses[color]} border transition-all hover:shadow-md ${className}`}
    >
      <div className="text-center">
        {icon && <div className={sizes.icon}>{icon}</div>}
        <div className={`${sizes.number} font-bold tabular-nums`}>
          {prefix}
          <CountUp
            start={0}
            end={value}
            duration={effectiveDuration}
            separator=" "
            decimals={decimals}
            useEasing={!prefersReducedMotion}
            easingFn={prefersReducedMotion ? undefined : easingFn}
          />
          {suffix}
        </div>
        <p className={`${sizes.label} mt-2 opacity-80 font-medium`}>{label}</p>
      </div>
    </div>
  );
}

// Variant avec animation plus rapide pour petits nombres
export function LiveCounterQuick({
  value,
  label,
  icon,
  ...props
}: Omit<LiveCounterProps, 'duration'>) {
  return <LiveCounter value={value} label={label} icon={icon} duration={1.5} {...props} />;
}

// Variant avec effet "pulsation" pour valeurs importantes
export function LiveCounterPulse({
  value,
  label,
  icon,
  className = '',
  ...props
}: LiveCounterProps) {
  return (
    <LiveCounter
      value={value}
      label={label}
      icon={icon}
      className={`animate-pulse-slow ${className}`}
      {...props}
    />
  );
}
