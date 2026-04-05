import { token, TokenPath } from '@gateflow/tokens';

/**
 * Utility to resolve a GateFlow semantic token path into its CSS variable.
 * thin wrapper around token() from @gateflow/tokens.
 */
export function getTokenVar(path: TokenPath): string {
  return token(path);
}

/**
 * Alias for getTokenVar (resolves a token into its CSS variable string).
 * Note: Browser/Runtime only; no SSR-safe default resolution here yet.
 */
export const resolveToken = getTokenVar;
