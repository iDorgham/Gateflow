/**
 * @gateflow/tokens - Foundations: Spacing & Grid (Tier 1 Primitives)
 * 4px base spatial scale.
 */

export const primitiveSpacing = {
  0: '0px',
  1: '4px',    // 0.25rem
  2: '8px',    // 0.5rem
  3: '12px',   // 0.75rem
  4: '16px',   // 1rem
  5: '20px',   // 1.25rem
  6: '24px',   // 1.5rem
  8: '32px',   // 2rem
  10: '40px',  // 2.5rem
  12: '48px',  // 3rem
  16: '64px',  // 4rem
  20: '80px',  // 5rem
  24: '96px',  // 6rem
} as const;

export const primitiveRadii = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '10px',
  xl: '14px',
  '2xl': '16px',
  full: '9999px',
} as const;
