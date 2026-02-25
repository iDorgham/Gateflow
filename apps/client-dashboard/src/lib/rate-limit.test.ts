/**
 * Unit tests for the in-memory sliding-window rate limiter.
 *
 * Redis env vars are absent so the module always uses the in-memory fallback,
 * which is the implementation we can unit-test deterministically.
 */

// Ensure no Redis credentials are present before any module is loaded.
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

import { checkRateLimit, _resetRateLimitStore } from './rate-limit';

beforeEach(() => {
  _resetRateLimitStore();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('checkRateLimit() — in-memory sliding window', () => {
  it('allows a request when under the limit', async () => {
    const result = await checkRateLimit('test:key', 5, 60_000);

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(5);
    expect(result.remaining).toBe(4);
    expect(result.retryAfterMs).toBe(0);
  });

  it('decrements remaining with each successive request', async () => {
    await checkRateLimit('test:key', 5, 60_000);
    await checkRateLimit('test:key', 5, 60_000);
    const result = await checkRateLimit('test:key', 5, 60_000);

    expect(result.remaining).toBe(2);
    expect(result.allowed).toBe(true);
  });

  it('denies the request when the limit is exactly reached', async () => {
    for (let i = 0; i < 3; i++) {
      await checkRateLimit('test:key', 3, 60_000);
    }
    const result = await checkRateLimit('test:key', 3, 60_000);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it('retryAfterMs equals the time until the oldest request leaves the window', async () => {
    const windowMs = 60_000;
    await checkRateLimit('test:key', 1, windowMs); // first request fills the limit

    jest.advanceTimersByTime(10_000); // fast-forward 10 s

    const result = await checkRateLimit('test:key', 1, windowMs);

    expect(result.allowed).toBe(false);
    // oldest request was at T+0, window = 60s → retryAfterMs = 60s - 10s = 50s
    expect(result.retryAfterMs).toBe(50_000);
  });

  it('allows requests again after the full window has elapsed', async () => {
    const windowMs = 60_000;
    for (let i = 0; i < 3; i++) {
      await checkRateLimit('test:key', 3, windowMs);
    }
    expect((await checkRateLimit('test:key', 3, windowMs)).allowed).toBe(false);

    jest.advanceTimersByTime(windowMs + 1); // all timestamps now outside window

    const result = await checkRateLimit('test:key', 3, windowMs);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('tracks independent counters per key', async () => {
    for (let i = 0; i < 3; i++) {
      await checkRateLimit('key:A', 3, 60_000);
    }

    const a = await checkRateLimit('key:A', 3, 60_000);
    const b = await checkRateLimit('key:B', 3, 60_000);

    expect(a.allowed).toBe(false);
    expect(b.allowed).toBe(true);
    expect(b.remaining).toBe(2);
  });

  it('uses default max and window when optional params are omitted', async () => {
    const result = await checkRateLimit('test:defaults');

    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(100); // RATE_LIMIT_MAX default
    expect(result.remaining).toBe(99);
  });
});
