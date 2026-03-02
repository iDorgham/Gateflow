'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Lightweight CSS-only particle grid for login background.
 * Professional, subtle, real estate aesthetic — very low opacity, slow drift.
 * Respects prefers-reduced-motion: static dots at lower opacity when reduced.
 */

// Precomputed positions (percent) and delays for consistent, organic layout
const PARTICLES: Array<{ top: number; left: number; size: number; delay: number; duration: number }> = [
  { top: 8, left: 52, size: 1.5, delay: 0, duration: 18 },
  { top: 14, left: 78, size: 1, delay: 2, duration: 20 },
  { top: 22, left: 45, size: 2, delay: 1, duration: 16 },
  { top: 18, left: 92, size: 1, delay: 3, duration: 22 },
  { top: 32, left: 65, size: 1.5, delay: 0.5, duration: 19 },
  { top: 28, left: 38, size: 1, delay: 2.5, duration: 21 },
  { top: 42, left: 82, size: 2, delay: 1.5, duration: 17 },
  { top: 48, left: 55, size: 1, delay: 0, duration: 23 },
  { top: 56, left: 72, size: 1.5, delay: 2, duration: 18 },
  { top: 62, left: 42, size: 1, delay: 1, duration: 20 },
  { top: 68, left: 88, size: 2, delay: 3, duration: 16 },
  { top: 74, left: 58, size: 1.5, delay: 0.5, duration: 21 },
  { top: 82, left: 35, size: 1, delay: 2.5, duration: 19 },
  { top: 12, left: 62, size: 1, delay: 1.5, duration: 22 },
  { top: 36, left: 48, size: 1.5, delay: 0, duration: 17 },
  { top: 44, left: 75, size: 1, delay: 3, duration: 20 },
  { top: 52, left: 28, size: 2, delay: 1, duration: 18 },
  { top: 64, left: 95, size: 1, delay: 2, duration: 19 },
  { top: 78, left: 68, size: 1.5, delay: 0.5, duration: 21 },
  { top: 88, left: 52, size: 1, delay: 1.5, duration: 16 },
  { top: 6, left: 35, size: 1.5, delay: 2, duration: 23 },
  { top: 38, left: 92, size: 1, delay: 0, duration: 17 },
  { top: 58, left: 42, size: 1.5, delay: 2.5, duration: 20 },
  { top: 72, left: 78, size: 1, delay: 1, duration: 18 },
  { top: 86, left: 62, size: 2, delay: 3, duration: 19 },
  { top: 24, left: 88, size: 1, delay: 0.5, duration: 21 },
  { top: 46, left: 32, size: 1.5, delay: 2, duration: 17 },
  { top: 92, left: 38, size: 1, delay: 1.5, duration: 20 },
];

export function LoginParticles({ className }: { className?: string }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden
    >
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className={cn(
            'absolute rounded-full',
            prefersReducedMotion
              ? 'bg-foreground/[0.02] dark:bg-foreground/[0.015]'
              : 'bg-foreground/[0.04] dark:bg-foreground/[0.03]'
          )}
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: prefersReducedMotion
              ? undefined
              : `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
