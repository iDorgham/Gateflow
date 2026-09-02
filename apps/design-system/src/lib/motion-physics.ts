/**
 * Motion-physics helpers for the design system inspector.
 *
 * The core invariant: when `prefers-reduced-motion` is honoured (whether by the
 * real media query or a simulator toggle), every configured animation collapses
 * to a fast, simple 150ms opacity fade and the expressive physics (springs,
 * large distances, blur) is neutralised. This keeps vestibular-sensitive users
 * safe and is the behaviour the inspector must prove.
 */

export type SpringPhysics = {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass: number;
};

export type TweenPhysics = {
  type: 'tween';
  duration: number;
  ease: string | number[];
};

export type MotionConfig = {
  initial: { opacity: number; x: number; filter: string };
  animate: { opacity: number; x: number; filter: string };
  transition: SpringPhysics | TweenPhysics;
  /** Base opacity for a reduced-motion fade (fallback: initial.opacity). */
  animatableOpacity?: number;
  /** Target opacity for a reduced-motion fade (fallback: animate.opacity). */
  targetOpacity?: number;
};

export type ReducedMotion = { enabled: boolean; source: 'media' | 'simulator' };

export const REDUCED_MOTION_FALLBACK_TRANSITION: TweenPhysics = {
  type: 'tween',
  duration: 0.15,
  ease: 'linear',
};

/**
 * Read the live `prefers-reduced-motion` media query.
 * Safe on the server (returns false) and in test/jsdom without matchMedia.
 */
export function systemPrefersReducedMotion(): boolean {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Resolve the effective motion config for a spec, neutralising expressive
 * physics when reduced motion is active.
 *
 * - Reduced motion ON  → static initial (no travel/blur), 150ms linear fade.
 * - Reduced motion OFF → the caller's configured physics, verbatim.
 */
export function resolveMotionForAccessibility(
  config: MotionConfig,
  reduced: ReducedMotion
): MotionConfig {
  if (!reduced.enabled) return config;

  return {
    initial: {
      opacity: config.animatableOpacity ?? config.initial.opacity,
      x: 0,
      filter: 'none',
    },
    animate: {
      opacity: config.targetOpacity ?? config.animate.opacity,
      x: 0,
      filter: 'none',
    },
    transition: REDUCED_MOTION_FALLBACK_TRANSITION,
  };
}

/**
 * Reduce helper state type: a MotionConfig with explicit opacity targets so the
 * reduced-motion resolver can construct a correct fade.
 */
export type ReducedMotionConfig = MotionConfig;
