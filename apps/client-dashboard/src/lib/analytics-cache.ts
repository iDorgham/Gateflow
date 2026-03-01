/**
 * Redis cache for analytics API responses.
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL and TOKEN are set.
 * Graceful fallback: no caching when Redis unavailable (no throw).
 */

import { Redis } from '@upstash/redis';

const TTL_SEC = 600; // 10 min

let _redis: Redis | null = null;
let _initialized = false;

function init(): void {
  if (_initialized) return;
  _initialized = true;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      _redis = new Redis({ url, token });
    } catch {
      _redis = null;
    }
  } else {
    _redis = null;
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  init();
  if (!_redis) return null;
  try {
    const raw = await _redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttlSec = TTL_SEC): Promise<void> {
  init();
  if (!_redis) return;
  try {
    await _redis.set(key, JSON.stringify(value), { ex: ttlSec });
  } catch {
    // no-op
  }
}

export function cacheKey(prefix: string, parts: Record<string, string>): string {
  const sorted = Object.keys(parts)
    .sort()
    .map((k) => `${k}=${parts[k] ?? ''}`)
    .join(':');
  return `${prefix}:${sorted}`;
}
