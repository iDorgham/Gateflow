/**
 * Allowlisted design tokens for organization branding CSS overrides.
 * Shared between admin Style Hub (write) and BrandingStyles (render).
 */
export const OVERRIDABLE_BRANDING_TOKENS = [
  '--ds-background-brand-bold',
  '--ds-background-brand-bold-hover',
  '--ds-background-brand-subtle',
  '--ds-text-brand',
  '--ds-border-brand',
  '--ds-background-default',
  '--ds-background-subtle',
  '--ds-surface',
  '--ds-surface-sunken',
  '--ds-border',
  '--ds-text',
  '--ds-text-subtle',
  '--ds-radius-default',
  '--ds-radius-large',
  '--ds-font-family',
  '--ds-font-family-arabic',
] as const;

export type OverridableBrandingToken =
  (typeof OVERRIDABLE_BRANDING_TOKENS)[number];

const ALLOWED_TOKEN_SET = new Set<string>(OVERRIDABLE_BRANDING_TOKENS);

declare const CSS: {
  escape(value: string): string;
};

/** Reject CSS breakout constructs while allowing common color/length/font values. */
const CSS_VALUE_PATTERN = /^[#a-zA-Z0-9(),.%\s/-]+$/;

const CSS_VALUE_DENY =
  /[{};<>@\\]|url\s*\(|expression\s*\(|@import|javascript\s*:/i;

export function isValidBrandingTokenKey(
  key: string
): key is OverridableBrandingToken {
  return ALLOWED_TOKEN_SET.has(key);
}

export function validateBrandingTokenValue(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 128) return false;
  if (CSS_VALUE_DENY.test(trimmed)) return false;
  return CSS_VALUE_PATTERN.test(trimmed);
}

export function filterValidBrandingTokens(
  overrides: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, raw] of Object.entries(overrides)) {
    if (!isValidBrandingTokenKey(key)) continue;
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!validateBrandingTokenValue(value)) continue;
    result[key] = value;
  }
  return result;
}

/**
 * Sanitize org id for use inside a CSS attribute selector.
 * Allowlist only — no CSS.escape (browser-only; unavailable in Node/Jest).
 * Characters outside [a-zA-Z0-9_-] are rejected, so the value is safe as-is.
 */
export function sanitizeOrgIdForCss(orgId: string): string | null {
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(orgId)) return null;
  return orgId;
}

export function generateBrandingCss(
  orgId: string,
  tokenOverrides: Record<string, string>
): string | null {
  const safeOrgId = sanitizeOrgIdForCss(orgId);
  if (!safeOrgId) return null;

  const tokens = filterValidBrandingTokens(tokenOverrides);
  if (Object.keys(tokens).length === 0) return null;

  const styles = Object.entries(tokens)
    .map(([token, value]) => `  ${token}: ${value};`)
    .join('\n');

  return `/* Generated Branding for Org: ${safeOrgId} */
[data-org-id='${safeOrgId}'] {
${styles}
}
`;
}
