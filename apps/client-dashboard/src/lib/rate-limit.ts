/**
 * In-memory sliding-window rate limiter.
 *
 * Suitable for single-instance deployments. For multi-instance (horizontal
 * scale) replace the in-process Map with a Redis INCR + EXPIRE approach.
 *
 * Window: 60 s, default ceiling: 100 requests per key.
 */

export const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
export const RATE_LIMIT_MAX = 100;           // requests per window per key

// key → sorted array of request timestamps (ms) within the current window
const _store = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Milliseconds until a slot frees up (0 when allowed). */
  retryAfterMs: number;
}

/**
 * Check and record a request for `key`.
 *
 * @param key      Unique per-subject identifier (e.g. `userId`, IP address).
 * @param max      Override the default ceiling.
 * @param windowMs Override the default window.
 */
export function checkRateLimit(
  key: string,
  max = RATE_LIMIT_MAX,
  windowMs = RATE_LIMIT_WINDOW_MS,
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Prune timestamps that have fallen outside the current window.
  const timestamps = (_store.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= max) {
    // Earliest timestamp in the window tells us when the oldest slot frees up.
    const retryAfterMs = Math.max(0, timestamps[0] + windowMs - now);
    return { allowed: false, limit: max, remaining: 0, retryAfterMs };
  }

  timestamps.push(now);
  _store.set(key, timestamps);

  return {
    allowed: true,
    limit: max,
    remaining: max - timestamps.length,
    retryAfterMs: 0,
  };
}

/**
 * Reset all rate-limit state.
 * ONLY call this in test suites — never in production code.
 */
export function _resetRateLimitStore(): void {
  _store.clear();
}
