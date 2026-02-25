/**
 * Redis-backed rate limiter using @upstash/ratelimit (sliding window).
 *
 * Falls back to an in-memory sliding window when Redis is not configured
 * (development / local environments). In production, UPSTASH_REDIS_REST_URL
 * and UPSTASH_REDIS_REST_TOKEN must be set.
 *
 * Public API (async):
 *   await checkRateLimit(key, max?, windowMs?) → RateLimitResult
 *
 * Multi-instance safe: all replicas share the same Redis counters.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─── Constants ────────────────────────────────────────────────────────────────

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX = 100;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Milliseconds until the client may retry (0 when allowed). */
  retryAfterMs: number;
}

// ─── Module-level singletons ──────────────────────────────────────────────────

let _redis: Redis | null = null;
let _initialized = false;

/** Cache Ratelimit instances keyed by "max:windowSec" to avoid re-creating per request. */
const _limiterCache = new Map<string, Ratelimit>();

/** In-memory sliding-window store: key → array of timestamps (fallback only). */
const _memoryStore = new Map<string, number[]>();

// ─── Initialization ───────────────────────────────────────────────────────────

function ensureInitialized(): void {
  if (_initialized) return;
  _initialized = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    _redis = new Redis({ url, token });
    if (process.env.NODE_ENV !== 'test') {
      console.log('[rate-limit] Upstash Redis connected — multi-instance rate limiting active');
    }
  } else {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        '[rate-limit] UPSTASH_REDIS_REST_URL / TOKEN not set — ' +
          'falling back to in-memory rate limiting (not scalable across instances)',
      );
    }
  }
}

/** Returns (or creates and caches) a Ratelimit instance for the given config. */
function getLimiter(max: number, windowMs: number): Ratelimit {
  const windowSec = Math.ceil(windowMs / 1000);
  const key = `${max}:${windowSec}`;

  let limiter = _limiterCache.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: _redis!,
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
      prefix: '@gateflow/rl',
    });
    _limiterCache.set(key, limiter);
  }
  return limiter;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Record and check a request for `key`.
 * Returns whether the request is allowed and metadata for rate-limit headers.
 *
 * @param key      Unique per-subject identifier (e.g. `login:${ip}`, `validate:${userId}`).
 * @param max      Maximum requests per window (default: 100).
 * @param windowMs Window duration in milliseconds (default: 60 000).
 */
export async function checkRateLimit(
  key: string,
  max = RATE_LIMIT_MAX,
  windowMs = RATE_LIMIT_WINDOW_MS,
): Promise<RateLimitResult> {
  ensureInitialized();

  if (_redis !== null) {
    try {
      const { success, limit, remaining, reset } = await getLimiter(max, windowMs).limit(key);
      return {
        allowed: success,
        limit,
        remaining,
        // `reset` is a Unix timestamp in milliseconds (Upstash Ratelimit v2)
        retryAfterMs: success ? 0 : Math.max(0, reset - Date.now()),
      };
    } catch (err) {
      console.error('[rate-limit] Redis error — falling back to in-memory:', err);
      // Graceful degradation: use in-memory on Redis failure
    }
  }

  return memoryRateLimit(key, max, windowMs);
}

/** Check without incrementing (read-only status). */
export async function getRateLimitStatus(
  key: string,
  max = RATE_LIMIT_MAX,
  windowMs = RATE_LIMIT_WINDOW_MS,
): Promise<RateLimitResult> {
  ensureInitialized();

  if (_redis !== null) {
    try {
      // The @upstash/ratelimit library doesn't expose a read-only check,
      // so we use the raw Redis ZCARD on the key it would create.
      const redisKey = `@gateflow/rl:${key}`;
      const count = (await _redis.zcard(redisKey)) as number;
      return {
        allowed: count < max,
        limit: max,
        remaining: Math.max(0, max - count),
        retryAfterMs: count >= max ? windowMs : 0,
      };
    } catch {
      /* fall through */
    }
  }

  const timestamps = (_memoryStore.get(key) ?? []).filter((t) => t > Date.now() - windowMs);
  return {
    allowed: timestamps.length < max,
    limit: max,
    remaining: Math.max(0, max - timestamps.length),
    retryAfterMs: timestamps.length >= max ? Math.max(0, timestamps[0] + windowMs - Date.now()) : 0,
  };
}

/** @returns true when Redis is configured and reachable. */
export function isUsingRedis(): boolean {
  ensureInitialized();
  return _redis !== null;
}

/**
 * Legacy no-op kept for backward compatibility.
 * Initialization is now lazy and automatic.
 */
export function initRedisRateLimiter(): void {
  ensureInitialized();
}

// ─── In-memory sliding window (fallback / dev / test) ────────────────────────

function memoryRateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (_memoryStore.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= max) {
    const retryAfterMs = Math.max(0, timestamps[0] + windowMs - now);
    return { allowed: false, limit: max, remaining: 0, retryAfterMs };
  }

  timestamps.push(now);
  _memoryStore.set(key, timestamps);
  return { allowed: true, limit: max, remaining: max - timestamps.length, retryAfterMs: 0 };
}

/** Reset all in-memory state. Used in tests only. */
export function _resetRateLimitStore(): void {
  _memoryStore.clear();
  _limiterCache.clear();
  _redis = null;
  _initialized = false;
}
