/**
 * Redis-backed rate limiter with fallback to in-memory.
 *
 * Supports multi-instance deployments via shared Redis.
 * Falls back to in-memory if Redis is unavailable (dev mode).
 *
 * Window: configurable, default 60s, default ceiling: 100 requests per key.
 */

import { Redis } from '@upstash/redis';

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX = 100;

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterMs: number;
}

// In-memory fallback store
const _memoryStore = new Map<string, number[]>();

let _redis: Redis | null = null;
let _useRedis = false;
let _initialized = false;

// Auto-initialize Redis on first use
function _ensureInitialized(): void {
  if (_initialized) return;
  _initialized = true;
  initRedisRateLimiter();
}

// Initialize Redis connection (call once at startup)
export function initRedisRateLimiter(): void {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    _redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
    _useRedis = true;
    console.log('[rate-limit] Using Upstash Redis for rate limiting');
  } else {
    console.warn(
      '[rate-limit] No Redis config — using in-memory fallback (not scalable)'
    );
  }
}

// Check if Redis is configured
export function isUsingRedis(): boolean {
  return _useRedis;
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
  windowMs = RATE_LIMIT_WINDOW_MS
): RateLimitResult {
  _ensureInitialized();

  if (_useRedis && _redis) {
    return checkRateLimitRedis(key, max, windowMs);
  }
  return checkRateLimitMemory(key, max, windowMs);
}

/**
 * Redis-backed rate limiting using Upstash sliding window.
 */
function checkRateLimitRedis(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const redisKey = `ratelimit:${key}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  try {
    // Use Redis pipeline for atomic operations
    const pipeline = _redis!.pipeline();

    // Remove old entries outside the window
    pipeline.zremrangebyscore(redisKey, 0, windowStart);

    // Count current requests in window
    pipeline.zcard(redisKey);

    // Add current request
    pipeline.zadd(redisKey, { score: now, member: `${now}:${Math.random()}` });

    // Set expiry on the key
    pipeline.expire(redisKey, Math.ceil(windowMs / 1000));

    const results = pipeline.exec();
    const currentCount = results?.[1] as number;

    if (currentCount >= max) {
      // Rate limited
      return {
        allowed: false,
        limit: max,
        remaining: 0,
        retryAfterMs: windowMs,
      };
    }

    return {
      allowed: true,
      limit: max,
      remaining: max - currentCount - 1,
      retryAfterMs: 0,
    };
  } catch (error) {
    console.error('[rate-limit] Redis error, falling back to memory:', error);
    return checkRateLimitMemory(key, max, windowMs);
  }
}

/**
 * In-memory sliding window rate limiter (fallback).
 */
function checkRateLimitMemory(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (_memoryStore.get(key) ?? []).filter(
    (t) => t > windowStart
  );

  if (timestamps.length >= max) {
    const retryAfterMs = Math.max(0, timestamps[0] + windowMs - now);
    return { allowed: false, limit: max, remaining: 0, retryAfterMs };
  }

  timestamps.push(now);
  _memoryStore.set(key, timestamps);

  return {
    allowed: true,
    limit: max,
    remaining: max - timestamps.length,
    retryAfterMs: 0,
  };
}

/**
 * Reset all rate-limit state (for testing).
 */
export function _resetRateLimitStore(): void {
  _memoryStore.clear();
}

/**
 * Get current rate limit status without incrementing (for display).
 */
export async function getRateLimitStatus(
  key: string,
  max = RATE_LIMIT_MAX,
  windowMs = RATE_LIMIT_WINDOW_MS
): Promise<RateLimitResult> {
  if (_useRedis && _redis) {
    const redisKey = `ratelimit:${key}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    try {
      const currentCount = await _redis.zcard(redisKey);
      return {
        allowed: currentCount < max,
        limit: max,
        remaining: Math.max(0, max - currentCount),
        retryAfterMs: currentCount >= max ? windowMs : 0,
      };
    } catch {
      return checkRateLimitMemory(key, max, windowMs);
    }
  }
  return checkRateLimitMemory(key, max, windowMs);
}
