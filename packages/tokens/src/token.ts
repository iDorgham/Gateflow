export type GateFlowToken =
  | 'color.background'
  | 'color.foreground'
  | 'color.surface'
  | 'color.surface-raised'
  | 'color.primary'
  | 'color.primary-foreground'
  | 'color.secondary'
  | 'color.secondary-foreground'
  | 'color.border'
  | 'color.muted'
  | 'color.muted-foreground'
  | 'color.accent'
  | 'color.accent-foreground'
  | 'color.success'
  | 'color.success-foreground'
  | 'color.warning'
  | 'color.warning-foreground'
  | 'color.danger'
  | 'color.danger-foreground'
  | 'color.info'
  | 'color.info-foreground'
  | 'color.input'
  | 'color.ring'
  // Elevation / Shadow
  | 'elevation.shadow-sm'
  | 'elevation.shadow-md'
  | 'elevation.shadow-lg';

/**
 * Returns the CSS var string for a given GateFlow token.
 * Example: token('color.background') -> 'var(--gf-color-background)'
 */
export function token(key: GateFlowToken, fallback?: string): string {
  const varName = `--gf-${key.replace(/\./g, '-')}`;
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`;
}
