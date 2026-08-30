/**
 * @gateflow/tokens - Foundations: Typography (Tier 1 Primitives)
 * Fluid clamp type scale and bilingual font stacks.
 */

export const primitiveTypography = {
  fontFamilies: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: 'Outfit, Plus Jakarta Sans, Inter, sans-serif',
    arabicHeading: 'Cairo, "Segoe UI", sans-serif',
    arabicBody: 'Tajawal, "IBM Plex Arabic", sans-serif',
    mono: 'JetBrains Mono, "SF Mono", Menlo, monospace',
  },
  fontSize: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem)',     // 12-13px
    sm: 'clamp(0.875rem, 0.825rem + 0.25vw, 0.9375rem)',  // 14-15px
    base: 'clamp(1rem, 0.95rem + 0.25vw, 1.0625rem)',     // 16-17px
    lg: 'clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)',     // 18-20px
    xl: 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',        // 20-24px
    '2xl': 'clamp(1.5rem, 1.35rem + 0.75vw, 2rem)',       // 24-32px
    '3xl': 'clamp(2rem, 1.75rem + 1.25vw, 2.75rem)',      // 32-44px
    '4xl': 'clamp(2.5rem, 2.2rem + 1.5vw, 3.5rem)',       // 40-56px
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625', // Mandatory for Arabic diacritics
    loose: '2',
  },
} as const;
