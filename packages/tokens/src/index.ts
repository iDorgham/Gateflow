/**
 * @gateflow/tokens - index.ts (v7.1 Master Three-Tier TypeScript API)
 * Foundations (Tier 1) -> Semantic (Tier 2) -> Component (Tier 3)
 */

export * from './foundations/colors';
export * from './foundations/spacing';
export * from './foundations/typography';
export * from './foundations/motion';

export * from './semantic/layers';
export * from './semantic/colors';
export * from './semantic/density';
export * from './semantic/accents';

// Semantic CSS Variable Path Map
export const tokens = {
  layers: {
    layer01: 'var(--ds-layer-01)',
    layer02: 'var(--ds-layer-02)',
    layer03: 'var(--ds-layer-03)',
    layer04: 'var(--ds-layer-04)',
    glowSubtle: 'var(--ds-glow-subtle)',
    glowFocused: 'var(--ds-glow-focused)',
  },
  text: {
    primary: 'var(--ds-text-primary)',
    subtle: 'var(--ds-text-subtle)',
    subtlest: 'var(--ds-text-subtlest)',
    inverse: 'var(--ds-text-inverse)',
    brand: 'var(--ds-text-brand)',
  },
  border: {
    subtle: 'var(--ds-border-subtle)',
    bold: 'var(--ds-border-bold)',
    focused: 'var(--ds-border-focused)',
    danger: 'var(--ds-border-danger)',
  },
  color: {
    primary: 'var(--ds-color-primary)',
    primaryHover: 'var(--ds-color-primary-hover)',
    primarySubtle: 'var(--ds-color-primary-subtle)',
    success: 'var(--ds-color-success)',
    warning: 'var(--ds-color-warning)',
    danger: 'var(--ds-color-danger)',
    info: 'var(--ds-color-info)',
    aiLab: 'var(--ds-color-ai-lab)',
  },
  density: {
    controlHeight: 'var(--ds-control-height)',
    controlPaddingX: 'var(--ds-control-padding-x)',
    controlPaddingY: 'var(--ds-control-padding-y)',
    tableRowHeight: 'var(--ds-table-row-height)',
    touchTargetMin: 'var(--ds-touch-target-min)',
  },
  radius: {
    sm: 'var(--ds-radius-sm)',
    md: 'var(--ds-radius-md)',
    lg: 'var(--ds-radius-lg)',
    xl: 'var(--ds-radius-xl)',
    full: 'var(--ds-radius-full)',
  },
  motion: {
    fast: 'var(--ds-motion-fast)',
    base: 'var(--ds-motion-base)',
    slow: 'var(--ds-motion-slow)',
    easing: 'var(--ds-motion-easing)',
  },
} as const;

export type TokenCategory = keyof typeof tokens;

/**
 * Helper to retrieve a typed CSS variable token.
 * Usage: token('color', 'primary') -> 'var(--ds-color-primary)'
 */
export function token<C extends TokenCategory, K extends keyof typeof tokens[C]>(
  category: C,
  key: K
): string {
  return (tokens[category] as any)[key];
}
