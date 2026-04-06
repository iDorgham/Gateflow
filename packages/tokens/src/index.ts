/**
 * @gateflow/tokens - index.ts v3
 * TypeScript API for Design Tokens (Premium Redesign).
 */

export const tokens = {
  theme: {
    background: 'var(--ds-background-default)',
    foreground: 'var(--ds-text-primary)',
  },
  surface: {
    default: 'var(--ds-surface-subtle)',
    raised: 'var(--ds-surface-raised)',
    overlay: 'var(--ds-surface-overlay)',
    glass: 'var(--ds-surface-glass)',
  },
  color: {
    primary: 'var(--ds-accent-bold)',
    accent: 'var(--ds-primary-accent)',
    subtle: 'var(--ds-accent-subtle)',
    border: 'var(--ds-border)',
    borderSubtle: 'var(--ds-border-subtle)',
    borderBold: 'var(--ds-border-bold)',
  },
  text: {
    primary: 'var(--ds-text-primary)',
    subtle: 'var(--ds-text-subtle)',
    inverse: 'var(--ds-text-inverse)',
    accent: 'var(--ds-text-accent)',
  },
  status: {
    success: 'var(--gf-color-success)',
    warning: 'var(--gf-color-warning)',
    danger: 'var(--gf-color-danger)',
    info: 'var(--gf-color-info)',
  },
  motion: {
    fast: 'var(--ds-motion-duration-fast)',
    base: 'var(--ds-motion-duration-base)',
    easing: 'var(--ds-motion-easing-entrance)',
  },
} as const;

export type TokenPath =
  | 'theme.background'
  | 'theme.foreground'
  | 'surface.default'
  | 'surface.raised'
  | 'surface.overlay'
  | 'surface.glass'
  | 'color.primary'
  | 'color.accent'
  | 'color.subtle'
  | 'color.border'
  | 'color.borderSubtle'
  | 'color.borderBold'
  | 'text.primary'
  | 'text.subtle'
  | 'text.inverse'
  | 'text.accent'
  | 'status.success'
  | 'status.warning'
  | 'status.danger'
  | 'status.info'
  | 'motion.fast'
  | 'motion.base'
  | 'motion.easing';

/**
 * Returns the CSS variable for a given semantic token path.
 * Usage: token('color.primary') -> 'var(--ds-accent-bold)'
 */
export function token(path: TokenPath): string {
  const parts = path.split('.');
  let current: any = tokens;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null) {
      current = (current as Record<string, any>)[part];
    }
  }
  return current as string;
}
