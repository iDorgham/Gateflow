/**
 * Branding CSS Generator
 * 
 * Takes a set of token overrides and generates a CSS block
 * that can be injected into the DOM or served via API.
 */
export function generateBrandingCss(orgId: string, tokenOverrides: Record<string, string>) {
  const styles = Object.entries(tokenOverrides)
    .map(([token, value]) => `  ${token}: ${value};`)
    .join('\n');

  return `
/* Generated Branding for Org: ${orgId} */
[data-org-id='${orgId}'], :root {
${styles}
}
`;
}

/**
 * Whitelist of tokens that can be overridden via the Style Hub.
 * Prevents arbitrary CSS injection and maintains design system integrity.
 */
export const OVERRIDABLE_TOKENS = [
  // Brand Colors
  '--ds-background-brand-bold',
  '--ds-background-brand-bold-hover',
  '--ds-background-brand-subtle',
  '--ds-text-brand',
  '--ds-border-brand',
  
  // Neutral Colors
  '--ds-background-default',
  '--ds-background-subtle',
  '--ds-surface',
  '--ds-surface-sunken',
  '--ds-border',
  '--ds-text',
  '--ds-text-subtle',
  
  // Shapes
  '--ds-radius-default',
  '--ds-radius-large',
  
  // Typography (Cairo, Almarai, etc. for RTL)
  '--ds-font-family',
  '--ds-font-family-arabic',
] as const;

export type OverridableToken = typeof OVERRIDABLE_TOKENS[number];
