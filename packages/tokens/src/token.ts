export type GateFlowToken =
  | 'color.bg-page'
  | 'color.bg-subtle'
  | 'color.bg-default'
  | 'color.bg-raised'
  | 'color.bg-overlay'
  | 'color.text'
  | 'color.text-subtle'
  | 'color.text-subtlest'
  | 'color.text-brand'
  | 'color.text-inverse'
  | 'color.text-danger'
  | 'color.text-success'
  | 'color.text-warning'
  | 'color.border'
  | 'color.border-subtle'
  | 'color.border-bold'
  | 'color.border-focused'
  | 'color.border-hover'
  | 'color.primary'
  | 'color.primary-foreground'
  | 'color.primary-hover'
  | 'color.primary-subtle'
  | 'color.muted'
  | 'color.muted-foreground'
  | 'color.success'
  | 'color.success-subtle'
  | 'color.success-bold'
  | 'color.warning'
  | 'color.warning-subtle'
  | 'color.warning-bold'
  | 'color.danger'
  | 'color.danger-subtle'
  | 'color.danger-bold'
  | 'color.info'
  | 'color.info-subtle'
  | 'color.info-bold'
  | 'elevation.shadow-xs'
  | 'elevation.shadow-sm'
  | 'elevation.shadow-md'
  | 'elevation.shadow-lg'
  | 'elevation.shadow-xl';

/**
 * Returns the CSS var string for a given GateFlow token.
 * Example: token('color.bg-page') -> 'var(--gf-color-bg-page)'
 */
export function token(key: GateFlowToken, fallback?: string): string {
  const varName = `--gf-${key.replace(/\./g, '-')}`;
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`;
}
