/**
 * @gateflow/tokens - Foundations: Motion (Tier 1 Primitives)
 * Standardized easing curves and durations.
 */

export const primitiveMotion = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '250ms',
    slow: '400ms',
    deliberate: '600ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',  // ease-out-expo
    enter: 'cubic-bezier(0, 0, 0.2, 1)',       // decelerate
    exit: 'cubic-bezier(0.4, 0, 1, 1)',        // accelerate
  },
} as const;
