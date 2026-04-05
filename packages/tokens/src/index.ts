/**
 * @gateflow/tokens - index.ts
 * TypeScript API for design tokens.
 */

export const tokens = {
  theme: {
    background: 'var(--gf-color-theme-background)',
    foreground: 'var(--gf-color-theme-foreground)',
  },
  surface: {
    default: 'var(--gf-color-surface)',
    raised: 'var(--gf-color-surface-raised)',
    overlay: 'var(--gf-color-surface-overlay)',
  },
  color: {
    primary: 'var(--gf-color-primary)',
    primaryForeground: 'var(--gf-color-primary-foreground)',
    muted: 'var(--gf-color-muted)',
    mutedForeground: 'var(--gf-color-muted-foreground)',
    border: 'var(--gf-color-border)',
    borderHover: 'var(--gf-color-border-hover)',
  },
  status: {
    success: 'var(--gf-color-success)',
    warning: 'var(--gf-color-warning)',
    danger: 'var(--gf-color-danger)',
    info: 'var(--gf-color-info)',
  },
} as const;

export type TokenPath =
  | 'theme.background'
  | 'theme.foreground'
  | 'surface.default'
  | 'surface.raised'
  | 'surface.overlay'
  | 'color.primary'
  | 'color.primaryForeground'
  | 'color.muted'
  | 'color.mutedForeground'
  | 'color.border'
  | 'color.borderHover'
  | 'status.success'
  | 'status.warning'
  | 'status.danger'
  | 'status.info';

/**
 * Returns the CSS variable for a given semantic token path.
 * Usage: token('color.primary') -> 'var(--gf-color-primary)'
 */
export function token(path: TokenPath): string {
  const parts = path.split('.');
  let current: Record<string, any> | string = tokens;
  for (const part of parts) {
    if (typeof current === 'object' && current !== null) {
      current = (current as Record<string, any>)[part];
    }
  }
  return current as string;
}
