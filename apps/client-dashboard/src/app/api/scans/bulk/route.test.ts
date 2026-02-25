/**
 * Unit tests for POST /api/scans/bulk (offline sync)
 *
 * Coverage:
 *  — 401 when not authenticated
 *  — 400 for invalid body
 *  — 429 when rate limit exceeded
 *  — New scan: creates ScanLog, adds to synced
 *  — Idempotency: scanUuid already exists → synced without DB write
 *  — LWW: incoming newer → updates existing + adds to conflicted
 *  — LWW: existing newer → keeps existing + adds to conflicted
 *  — QR code not found → adds to failed
 */

// Set env vars before any imports.
process.env.NEXTAUTH_SECRET = 'test-jwt-secret-must-be-long-enough-for-hmac256';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRequireAuth = jest.fn();
const mockCheckRateLimit = jest.fn();
const mockScanLogFindUnique = jest.fn();
const mockScanLogFindFirst = jest.fn();
const mockScanLogCreate = jest.fn();
const mockScanLogUpdate = jest.fn();
const mockQRCodeFindUnique = jest.fn();
const mockTransaction = jest.fn();

jest.mock('@/lib/require-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  isNextResponse: (v: unknown): boolean => {
    if (v === null || typeof v !== 'object') return false;
    const obj = v as { status?: unknown; json?: unknown };
    return typeof obj.status === 'number' && typeof obj.json === 'function';
  },
}));

jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    $transaction: (fn: (tx: unknown) => Promise<unknown>) => mockTransaction(fn),
  },
  // Prisma namespace (used for type casts in the route)
  Prisma: {},
}));

// Use real @gate-access/types for schema validation.
jest.mock('@gate-access/types', () => jest.requireActual('@gate-access/types'));

// ─── Imports ──────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AUTH_CLAIMS = { sub: 'user_1', email: 'test@test.com', orgId: 'org_1', role: 'TENANT_USER' };

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/scans/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
    body: JSON.stringify(body),
  });
}

function makeScan(overrides: Record<string, unknown> = {}) {
  return {
    id: 'local_id_1',
    scanUuid: '550e8400-e29b-41d4-a716-446655440000',
    qrCode: 'gateflow:1:testpayload.sig',
    gateId: 'gate_1',
    scannedAt: new Date().toISOString(),
    status: 'SUCCESS',
    retryCount: 0,
    ...overrides,
  };
}

function makeTx() {
  return {
    scanLog: {
      findUnique: (...args: unknown[]) => mockScanLogFindUnique(...args),
      findFirst: (...args: unknown[]) => mockScanLogFindFirst(...args),
      create: (...args: unknown[]) => mockScanLogCreate(...args),
      update: (...args: unknown[]) => mockScanLogUpdate(...args),
    },
    qRCode: {
      findUnique: (...args: unknown[]) => mockQRCodeFindUnique(...args),
    },
  };
}

// ─── Lazy route import ────────────────────────────────────────────────────────

let POST: (req: NextRequest) => Promise<Response>;

beforeAll(async () => {
  const mod = await import('./route');
  POST = mod.POST;
});

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockRequireAuth.mockResolvedValue(AUTH_CLAIMS);
  mockCheckRateLimit.mockResolvedValue({ allowed: true, limit: 30, remaining: 29, retryAfterMs: 0 });
  mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) =>
    fn(makeTx()),
  );
  // Defaults: no duplicate scanUuid, no existing conflict, QR exists
  mockScanLogFindUnique.mockResolvedValue(null);
  mockScanLogFindFirst.mockResolvedValue(null);
  mockQRCodeFindUnique.mockResolvedValue({ id: 'qr_1', code: 'gateflow:1:testpayload.sig' });
  mockScanLogCreate.mockResolvedValue({ id: 'scan_new_1' });
  mockScanLogUpdate.mockResolvedValue(undefined);
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/scans/bulk', () => {
  // ── Auth ────────────────────────────────────────────────────────────────────

  it('returns 401 when not authenticated', async () => {
    mockRequireAuth.mockResolvedValue(
      NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    );
    const res = await POST(makeRequest({ scans: [] }));
    expect(res.status).toBe(401);
  });

  // ── Validation ──────────────────────────────────────────────────────────────

  it('returns 400 for an invalid request body', async () => {
    const res = await POST(makeRequest({ scans: 'not-an-array' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when a scan entry is missing required fields', async () => {
    const res = await POST(makeRequest({ scans: [{ id: 'x' }] }));
    expect(res.status).toBe(400);
  });

  // ── Rate limiting ────────────────────────────────────────────────────────────

  it('returns 429 with Retry-After header when rate-limited', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      limit: 30,
      remaining: 0,
      retryAfterMs: 30_000,
    });

    const res = await POST(makeRequest({ scans: [] }));

    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('30');
  });

  // ── New scan (no existing record) ────────────────────────────────────────────

  it('creates a new ScanLog and adds id to synced', async () => {
    const res = await POST(makeRequest({ scans: [makeScan()] }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.synced).toContain('local_id_1');
    expect(mockScanLogCreate).toHaveBeenCalledTimes(1);
  });

  // ── Idempotency ──────────────────────────────────────────────────────────────

  it('treats an already-synced scanUuid as success without creating a duplicate', async () => {
    mockScanLogFindUnique.mockResolvedValue({ id: 'existing_scan' }); // duplicate found

    const res = await POST(makeRequest({ scans: [makeScan()] }));
    const data = await res.json();

    expect(data.data.synced).toContain('local_id_1');
    expect(mockScanLogCreate).not.toHaveBeenCalled();
  });

  // ── LWW conflict resolution ──────────────────────────────────────────────────

  it('updates existing record and reports conflict when incoming scan is newer', async () => {
    const existingTime = new Date(Date.now() - 10_000);
    const incomingTime = new Date().toISOString(); // newer

    mockScanLogFindFirst.mockResolvedValue({
      id: 'existing_1',
      scannedAt: existingTime,
      auditTrail: [],
    });

    const res = await POST(makeRequest({ scans: [makeScan({ scannedAt: incomingTime })] }));
    const data = await res.json();

    expect(data.data.synced).toContain('local_id_1');
    expect(data.data.conflicted).toHaveLength(1);
    expect(data.data.conflicted[0].reason).toMatch(/lww/i);
    expect(mockScanLogUpdate).toHaveBeenCalled();
  });

  it('keeps existing record when it is newer (server authoritative)', async () => {
    const existingTime = new Date(); // newer
    const incomingTime = new Date(Date.now() - 10_000).toISOString(); // older

    mockScanLogFindFirst.mockResolvedValue({
      id: 'existing_1',
      scannedAt: existingTime,
      auditTrail: [],
    });

    const res = await POST(makeRequest({ scans: [makeScan({ scannedAt: incomingTime })] }));
    const data = await res.json();

    expect(data.data.conflicted).toHaveLength(1);
    expect(data.data.conflicted[0].reason).toMatch(/existing/i);
    expect(data.data.synced).not.toContain('local_id_1');
  });

  // ── QR code not found ────────────────────────────────────────────────────────

  it('adds scan to failed when its QR code is not in the database', async () => {
    mockQRCodeFindUnique.mockResolvedValue(null);

    const res = await POST(makeRequest({ scans: [makeScan()] }));
    const data = await res.json();

    expect(data.data.failed).toHaveLength(1);
    expect(data.data.failed[0].id).toBe('local_id_1');
    expect(data.data.failed[0].error).toMatch(/not found/i);
    expect(mockScanLogCreate).not.toHaveBeenCalled();
  });

  // ── Mixed batch ──────────────────────────────────────────────────────────────

  it('processes a batch containing synced, conflicted, and failed items independently', async () => {
    // scan_a: new (synced)
    // scan_b: duplicate scanUuid (synced idempotent)
    // scan_c: QR not found (failed)
    mockScanLogFindUnique
      .mockResolvedValueOnce(null)             // scan_a: no duplicate
      .mockResolvedValueOnce({ id: 'dup' })    // scan_b: duplicate found
      .mockResolvedValueOnce(null);            // scan_c: no duplicate

    mockScanLogFindFirst
      .mockResolvedValueOnce(null)             // scan_a: no conflict
      .mockResolvedValueOnce(null);            // scan_c: no conflict

    mockQRCodeFindUnique
      .mockResolvedValueOnce({ id: 'qr_a' })  // scan_a: found
      .mockResolvedValueOnce(null);            // scan_c: not found

    const res = await POST(makeRequest({
      scans: [
        makeScan({ id: 'scan_a', scanUuid: '550e8400-e29b-41d4-a716-446655440001' }),
        makeScan({ id: 'scan_b', scanUuid: '550e8400-e29b-41d4-a716-446655440002' }),
        makeScan({ id: 'scan_c', scanUuid: '550e8400-e29b-41d4-a716-446655440003' }),
      ],
    }));
    const data = await res.json();

    expect(data.data.synced).toContain('scan_a');
    expect(data.data.synced).toContain('scan_b');
    expect(data.data.failed[0].id).toBe('scan_c');
  });
});
