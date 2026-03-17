import { TargetAndTransition, Transition, useReducedMotion } from 'framer-motion';

/**
 * GateAI Hub Unified Motion Tokens
 * 
 * Performance-tuned spring for SaaS operations feel.
 * Optimized for high-density dashboards.
 */

export const gaSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
};

export const gaLayoutSpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 40,
};

/**
 * Standard variants for GateAI components
 */
export const gaFadeInUp = (shouldReduce: boolean | null): TargetAndTransition => ({
  opacity: 1,
  y: 0,
  transition: shouldReduce ? { duration: 0 } : gaSpring,
});

export const gaInitialFadeUp = (shouldReduce: boolean | null) => ({
  opacity: shouldReduce ? 1 : 0,
  y: shouldReduce ? 0 : 10,
});

export const gaScaleIn = (shouldReduce: boolean | null) => ({
  opacity: 1,
  scale: 1,
  y: 0,
  transition: shouldReduce ? { duration: 0 } : gaSpring,
});

export const gaInitialScale = (shouldReduce: boolean | null) => ({
  opacity: shouldReduce ? 1 : 0,
  scale: shouldReduce ? 1 : 0.95,
  y: shouldReduce ? 0 : 20,
});
