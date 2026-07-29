export type QrDisplaySource = 'live' | 'cache';

/**
 * Prefer live code when online; prefer cache when offline.
 * Falls back across sources so offline viewing still works.
 */
export function resolveDisplayedQrCode(options: {
  liveCode: string | null | undefined;
  cachedCode: string | null | undefined;
  isOnline: boolean;
}): { code: string | null; source: QrDisplaySource | null } {
  const live =
    typeof options.liveCode === 'string' && options.liveCode.trim().length > 0
      ? options.liveCode.trim()
      : null;
  const cached =
    typeof options.cachedCode === 'string' &&
    options.cachedCode.trim().length > 0
      ? options.cachedCode.trim()
      : null;

  if (options.isOnline) {
    if (live) return { code: live, source: 'live' };
    if (cached) return { code: cached, source: 'cache' };
    return { code: null, source: null };
  }

  if (cached) return { code: cached, source: 'cache' };
  if (live) return { code: live, source: 'live' };
  return { code: null, source: null };
}
