/**
 * Unit tests for POST /api/qr/bulk-create
 *
 * Coverage:
 *  — 401 when session claims are missing
 *  — 400 for invalid / empty body
 *  — 500 when QR signing secret is not configured
 *  — Success: all valid items created
 *  — Gate resolution by name
 *  — Error: unknown gate name
 *  — Error: past expiry date
 *  — Error: RECURRING without maxUses
 *  — Partial success (mix of valid and invalid items)
 */

// Set env vars before any module import.
process.env.QR_SIGNING_SECRET = 'test-qr-signing-secret-that-is-at-least-32-chars!!';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGetSessionClaims = jest.fn();
const mockQRCodeCreateMany = jest.fn();
const mockGateFindMany = jest.fn();
const mockTransaction = jest.fn();

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: {
      findMany: (...args: unknown[]) => mockGateFindMany(...args),
    },
    qRCode: {
      createMany: (...args: unknown[]) => mockQRCodeCreateMany(...args),
    },
    $transaction: (fn: (tx: unknown) => Promise<unknown>) => mockTransaction(fn),
  },
  QRCodeType: {
    SINGLE: 'SINGLE',
    RECURRING: 'RECURRING',
    PERMANENT: 'PERMANENT',
  },
}));

// Use the real @gate-access/types so signQRPayload exercises real HMAC logic.
jest.mock('@gate-access/types', () => jest.requireActual('@gate-access/types'));

// ─── Imports ──────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/qr/bulk-create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const ORG_ID = 'org_test_456';
const SESSION_CLAIMS = { orgId: ORG_ID, sub: 'user_1', email: 'test@test.com', role: 'TENANT_ADMIN' };

// ─── Lazy route import (after mocks) ──────────────────────────────────────────

let POST: (req: NextRequest) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('./route');
  POST = mod.POST;
});

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSessionClaims.mockResolvedValue(SESSION_CLAIMS);
  mockGateFindMany.mockResolvedValue([]);
  mockQRCodeCreateMany.mockResolvedValue({ count: 1 });
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/qr/bulk-create', () => {
  // ── Authentication ──────────────────────────────────────────────────────────

  it('returns 401 when session claims are missing', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await POST(makeRequest({ items: [{ name: 'Test' }] }));
    expect(res.status).toBe(401);
  });

  it('returns 401 when session claims have no orgId', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'user_1' });
    const res = await POST(makeRequest({ items: [{ name: 'Test' }] }));
    expect(res.status).toBe(401);
  });

  // ── Validation ──────────────────────────────────────────────────────────────

  it('returns 400 for an invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/qr/bulk-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json{',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when items array is empty', async () => {
    const res = await POST(makeRequest({ items: [] }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when items exceeds 500 entries', async () => {
    const items = Array.from({ length: 501 }, (_, i) => ({ name: `User ${i}` }));
    const res = await POST(makeRequest({ items }));
    expect(res.status).toBe(400);
  });

  // ── Server config ────────────────────────────────────────────────────────────

  it('returns 500 when QR_SIGNING_SECRET is not configured', async () => {
    const saved = process.env.QR_SIGNING_SECRET;
    delete process.env.QR_SIGNING_SECRET;

    const res = await POST(makeRequest({ items: [{ name: 'Alice' }] }));
    expect(res.status).toBe(500);

    process.env.QR_SIGNING_SECRET = saved;
  });

  it('returns 500 when QR_SIGNING_SECRET is shorter than 32 chars', async () => {
    const saved = process.env.QR_SIGNING_SECRET;
    process.env.QR_SIGNING_SECRET = 'short';

    const res = await POST(makeRequest({ items: [{ name: 'Alice' }] }));
    expect(res.status).toBe(500);

    process.env.QR_SIGNING_SECRET = saved;
  });

  // ── Success ──────────────────────────────────────────────────────────────────

  it('creates QR codes for all valid items and returns totalCreated', async () => {
    const res = await POST(makeRequest({
      items: [
        { name: 'Alice', type: 'SINGLE' },
        { name: 'Bob', type: 'PERMANENT' },
      ],
    }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.totalCreated).toBe(2);
    expect(data.data.totalErrors).toBe(0);
    expect(mockQRCodeCreateMany).toHaveBeenCalledTimes(1);
    expect(mockQRCodeCreateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ code: expect.any(String) }),
          expect.objectContaining({ code: expect.any(String) }),
        ]),
      }),
    );
  });

  // ── Gate resolution ──────────────────────────────────────────────────────────

  it('resolves gate by name (case-insensitive) and assigns gateId', async () => {
    mockGateFindMany.mockResolvedValue([{ id: 'gate_1', name: 'Main Gate' }]);

    const res = await POST(makeRequest({
      items: [{ name: 'Alice', gate: 'main gate', type: 'SINGLE' }],
    }));
    const data = await res.json();

    expect(data.data.totalCreated).toBe(1);
    expect(mockQRCodeCreateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ gateId: 'gate_1' }),
        ]),
      }),
    );
  });

  // ── Per-item errors ──────────────────────────────────────────────────────────

  it('adds item to errors when the gate name is not found', async () => {
    mockGateFindMany.mockResolvedValue([{ id: 'gate_1', name: 'Main Gate' }]);

    const res = await POST(makeRequest({
      items: [{ name: 'Alice', gate: 'Unknown Gate', type: 'SINGLE' }],
    }));
    const data = await res.json();

    expect(data.data.totalCreated).toBe(0);
    expect(data.data.totalErrors).toBe(1);
    expect(data.data.errors[0].error).toMatch(/not found/i);
  });

  it('adds item to errors when expiresAt is in the past', async () => {
    const res = await POST(makeRequest({
      items: [{
        name: 'Alice',
        type: 'SINGLE',
        expiresAt: new Date(Date.now() - 60_000).toISOString(),
      }],
    }));
    const data = await res.json();

    expect(data.data.totalErrors).toBe(1);
    expect(data.data.errors[0].error).toMatch(/future/i);
  });

  it('adds item to errors for RECURRING type without maxUses', async () => {
    const res = await POST(makeRequest({
      items: [{ name: 'Alice', type: 'RECURRING' }],
    }));
    const data = await res.json();

    expect(data.data.totalErrors).toBe(1);
    expect(data.data.errors[0].error).toMatch(/maxUses/);
  });

  it('PERMANENT type ignores expiresAt and sets maxUses to null', async () => {
    const res = await POST(makeRequest({
      items: [{
        name: 'Permanent Alice',
        type: 'PERMANENT',
        expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
      }],
    }));
    const data = await res.json();

    expect(data.data.totalCreated).toBe(1);
    expect(mockQRCodeCreateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ expiresAt: null, maxUses: null }),
        ]),
      }),
    );
  });

  // ── Partial success ───────────────────────────────────────────────────────────

  it('returns partial success when some items are valid and some are not', async () => {
    const res = await POST(makeRequest({
      items: [
        { name: 'Good User', type: 'SINGLE' },
        { name: 'Bad User', type: 'RECURRING' }, // missing maxUses
      ],
    }));
    const data = await res.json();

    expect(data.data.totalCreated).toBe(1);
    expect(data.data.totalErrors).toBe(1);
    expect(data.data.created[0].name).toBe('Good User');
    expect(data.data.errors[0].name).toBe('Bad User');
  });
});
