/**
 * Unit tests for api-key-auth.ts
 *
 * Coverage:
 *  — Missing / malformed header → 401
 *  — Key not found → 401
 *  — Key lookup uses SHA-256 hash of raw key
 *  — Expired key → 401
 *  — Wrong scope → 403
 *  — Valid key (no scope, with scope) → success with orgId + keyId
 *  — lastUsedAt update fires as fire-and-forget
 */

import { createHash } from 'crypto';
import type { ApiScope } from '@gate-access/db';
import { NextRequest } from 'next/server';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockApiFindUnique = jest.fn();
const mockApiUpdate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    apiKey: {
      findUnique: (...args: unknown[]) => mockApiFindUnique(...args),
      update: (...args: unknown[]) => mockApiUpdate(...args),
    },
  },
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import { validateApiKey } from './api-key-auth';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/test', { method: 'GET', headers });
}

const RAW_KEY = 'gf_test_api_key_0123456789abcdef';
const KEY_HASH = createHash('sha256').update(RAW_KEY).digest('hex');
const ORG_ID = 'org_test_123';
const KEY_ID = 'key_id_abc';

const validKey = {
  id: KEY_ID,
  organizationId: ORG_ID,
  scopes: ['QR_READ', 'SCAN_WRITE'] as ApiScope[],
  expiresAt: null,
};

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockApiUpdate.mockResolvedValue(undefined);
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('validateApiKey()', () => {
  // ── Header checks ───────────────────────────────────────────────────────────

  it('returns 401 when Authorization header is absent', async () => {
    const result = await validateApiKey(makeRequest());

    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(401);
  });

  it('returns 401 when Authorization header is not Bearer scheme', async () => {
    const result = await validateApiKey(makeRequest({ authorization: 'Basic dGVzdA==' }));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(401);
  });

  it('returns 401 when the key value after Bearer is empty', async () => {
    const result = await validateApiKey(makeRequest({ authorization: 'Bearer ' }));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(401);
  });

  // ── DB lookup ───────────────────────────────────────────────────────────────

  it('looks up the key using the SHA-256 hash of the raw value', async () => {
    mockApiFindUnique.mockResolvedValue(validKey);

    await validateApiKey(makeRequest({ authorization: `Bearer ${RAW_KEY}` }));

    expect(mockApiFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { keyHash: KEY_HASH } }),
    );
  });

  it('returns 401 when key hash is not found in the database', async () => {
    mockApiFindUnique.mockResolvedValue(null);

    const result = await validateApiKey(makeRequest({ authorization: `Bearer ${RAW_KEY}` }));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(401);
  });

  // ── Expiry ──────────────────────────────────────────────────────────────────

  it('returns 401 when the key has expired', async () => {
    mockApiFindUnique.mockResolvedValue({
      ...validKey,
      expiresAt: new Date(Date.now() - 1_000),
    });

    const result = await validateApiKey(makeRequest({ authorization: `Bearer ${RAW_KEY}` }));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.status).toBe(401);
      expect(result.message).toMatch(/expired/i);
    }
  });

  it('accepts a key whose expiresAt is exactly null (no expiry)', async () => {
    mockApiFindUnique.mockResolvedValue({ ...validKey, expiresAt: null });

    const result = await validateApiKey(makeRequest({ authorization: `Bearer ${RAW_KEY}` }));

    expect(result.success).toBe(true);
  });

  // ── Scope ───────────────────────────────────────────────────────────────────

  it('returns 403 when the key does not have the required scope', async () => {
    mockApiFindUnique.mockResolvedValue({ ...validKey, scopes: ['QR_READ'] });

    const result = await validateApiKey(
      makeRequest({ authorization: `Bearer ${RAW_KEY}` }),
      'SCAN_WRITE' as ApiScope,
    );

    expect(result.success).toBe(false);
    if (!result.success) expect(result.status).toBe(403);
  });

  it('succeeds when no scope is required', async () => {
    mockApiFindUnique.mockResolvedValue(validKey);

    const result = await validateApiKey(makeRequest({ authorization: `Bearer ${RAW_KEY}` }));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.orgId).toBe(ORG_ID);
      expect(result.keyId).toBe(KEY_ID);
    }
  });

  it('succeeds when the key has the required scope', async () => {
    mockApiFindUnique.mockResolvedValue(validKey);

    const result = await validateApiKey(
      makeRequest({ authorization: `Bearer ${RAW_KEY}` }),
      'QR_READ' as ApiScope,
    );

    expect(result.success).toBe(true);
  });

  // ── Fire-and-forget lastUsedAt ───────────────────────────────────────────────

  it('triggers a non-blocking lastUsedAt update on success', async () => {
    mockApiFindUnique.mockResolvedValue(validKey);

    await validateApiKey(makeRequest({ authorization: `Bearer ${RAW_KEY}` }));

    // Flush microtask queue so the fire-and-forget update promise settles.
    await new Promise<void>((resolve) => setImmediate(resolve));

    expect(mockApiUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: KEY_ID },
        data: { lastUsedAt: expect.any(Date) },
      }),
    );
  });
});
