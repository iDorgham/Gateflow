import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  resolveResidentApiBase,
  resolveResidentRewriteDestination,
} from './api-upstream.ts';
import { resolveDisplayedQrCode } from './qr-display.ts';

describe('resolveResidentApiBase', () => {
  it('uses RESIDENT_API_UPSTREAM over NEXT_PUBLIC_API_URL', () => {
    assert.equal(
      resolveResidentApiBase({
        RESIDENT_API_UPSTREAM: 'https://app.example/api/',
        NEXT_PUBLIC_API_URL: 'http://localhost:3001/api',
        NODE_ENV: 'production',
      }),
      'https://app.example/api'
    );
  });

  it('falls back to NEXT_PUBLIC_API_URL', () => {
    assert.equal(
      resolveResidentApiBase({
        NEXT_PUBLIC_API_URL: 'https://cdn.example/api',
        NODE_ENV: 'production',
      }),
      'https://cdn.example/api'
    );
  });

  it('fails closed in production without upstream', () => {
    assert.throws(
      () =>
        resolveResidentApiBase({
          NODE_ENV: 'production',
        }),
      /RESIDENT_API_UPSTREAM|NEXT_PUBLIC_API_URL/
    );
  });

  it('defaults to localhost in non-production', () => {
    assert.equal(
      resolveResidentApiBase({ NODE_ENV: 'development' }),
      'http://localhost:3001/api'
    );
  });
});

describe('resolveResidentRewriteDestination', () => {
  it('appends /resident/:path*', () => {
    assert.equal(
      resolveResidentRewriteDestination({
        NEXT_PUBLIC_API_URL: 'https://app.example/api',
      }),
      'https://app.example/api/resident/:path*'
    );
  });
});

describe('resolveDisplayedQrCode', () => {
  it('prefers live when online', () => {
    assert.deepEqual(
      resolveDisplayedQrCode({
        liveCode: 'live-code',
        cachedCode: 'cached-code',
        isOnline: true,
      }),
      { code: 'live-code', source: 'live' }
    );
  });

  it('prefers cache when offline', () => {
    assert.deepEqual(
      resolveDisplayedQrCode({
        liveCode: 'live-code',
        cachedCode: 'cached-code',
        isOnline: false,
      }),
      { code: 'cached-code', source: 'cache' }
    );
  });

  it('falls back to live when offline and cache empty', () => {
    assert.deepEqual(
      resolveDisplayedQrCode({
        liveCode: 'live-code',
        cachedCode: null,
        isOnline: false,
      }),
      { code: 'live-code', source: 'live' }
    );
  });
});
