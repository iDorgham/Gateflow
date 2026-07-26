import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkEnvironmentNames,
  checkRedisConnectivity,
} from './check-local-readiness.mjs';

test('environment result reports names without secret values', () => {
  const secret = 'do-not-print-this-secret';
  const result = checkEnvironmentNames({
    DATABASE_URL: secret,
    ENCRYPTION_MASTER_KEY: secret,
    NEXTAUTH_SECRET: secret,
    NEXTAUTH_URL: 'http://localhost:3001',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3001',
    QR_SIGNING_SECRET: secret,
    UPSTASH_REDIS_REST_TOKEN: secret,
    UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
  });

  assert.equal(result.missing.length, 0);
  assert.doesNotMatch(JSON.stringify(result), new RegExp(secret));
});

test('Redis readiness uses PING and returns status only', async () => {
  const secret = 'do-not-print-this-token';
  const result = await checkRedisConnectivity(
    {
      UPSTASH_REDIS_REST_TOKEN: secret,
      UPSTASH_REDIS_REST_URL: 'https://example.upstash.io/',
    },
    async (url, init) => {
      assert.equal(url, 'https://example.upstash.io/ping');
      assert.equal(init.headers.Authorization, `Bearer ${secret}`);
      return {
        ok: true,
        json: async () => ({ result: 'PONG' }),
      };
    }
  );

  assert.deepEqual(result, { status: 'passed' });
  assert.doesNotMatch(JSON.stringify(result), new RegExp(secret));
});
