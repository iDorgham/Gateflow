/**
 * Unit tests for validateOnServer()
 *
 * Coverage:
 *  1. Scan success      — server returns "accepted" → status accepted, offline false
 *  2. Invalid signature — server returns "rejected"  → status rejected, offline false
 *                         (locally invalid QRs are caught by verifyScanQR before this
 *                          function is ever called; here we test server-side rejection)
 *  3. Offline fallback  — fetch throws / no token   → optimistic accepted, offline true,
 *                         scan enqueued
 */

// ─── Hoist mocks before any imports ──────────────────────────────────────────

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: {
    Success: 'success',
    Error: 'error',
    Warning: 'warning',
  },
}));

jest.mock('expo-device', () => ({
  osName: 'iOS',
  modelName: 'iPhone-15',
}));

jest.mock('./auth-client', () => ({
  getValidAccessToken: jest.fn(),
}));

jest.mock('./offline-queue', () => ({
  scanQueue: {
    addScan: jest.fn(() =>
      Promise.resolve({ id: 'q1', scanUuid: 'uuid-1', qrCode: '', gateId: '', scannedAt: '', synced: false, retryCount: 0 }),
    ),
  },
}));

// ─── Imports after mocks ──────────────────────────────────────────────────────

import { getValidAccessToken } from './auth-client';
import { scanQueue } from './offline-queue';
import { validateOnServer } from './scanner';
import type { QRPayload } from '@gate-access/types';

// ─── Typed mock helpers ───────────────────────────────────────────────────────

const mockGetToken = getValidAccessToken as jest.MockedFunction<typeof getValidAccessToken>;
const mockAddScan = scanQueue.addScan as jest.MockedFunction<typeof scanQueue.addScan>;

// ─── Fixtures ────────────────────────────────────────────────────────────────

const VALID_PAYLOAD: QRPayload = {
  qrId: 'cltest123',
  organizationId: 'clorg456',
  type: 'SINGLE' as const,
  maxUses: 1,
  expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
  issuedAt: new Date().toISOString(),
  nonce: '550e8400-e29b-41d4-a716-446655440000',
};

// A plausible (but not truly valid) signed QR string for unit test purposes.
// verifyScanQR has already accepted it before validateOnServer is called.
const QR_STRING = 'gateflow:1:eyJxcklkIjoiY2x0ZXN0MTIzIn0=.abcdef1234567890'.padEnd(
  'gateflow:1:'.length + 68, // prefix + base64payload.64hexchars
  '0',
);

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

// ─── 1. Scan success ──────────────────────────────────────────────────────────

describe('scan success', () => {
  it('returns accepted with scanId when server responds 200 accepted', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ status: 'accepted', scanId: 'scan_abc123', message: 'Welcome!' }),
    });

    const result = await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(result.status).toBe('accepted');
    expect(result.scanId).toBe('scan_abc123');
    expect(result.message).toBe('Welcome!');
    expect(result.offline).toBe(false);
  });

  it('sends Authorization header and correct body to the validate endpoint', async () => {
    mockGetToken.mockResolvedValue('my-jwt-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'accepted', scanId: 'scan_xyz' }),
    });

    await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];

    expect(url).toContain('/qrcodes/validate');
    const body = JSON.parse(options.body as string);
    expect(body.qrPayload).toBe(QR_STRING);
    expect(body.scanContext.deviceId).toBe('iOS-iPhone-15');
    expect((options.headers as Record<string, string>)['Authorization']).toBe('Bearer my-jwt-token');
  });

  it('does NOT enqueue the scan on server success', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'accepted', scanId: 'scan_def' }),
    });

    await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(mockAddScan).not.toHaveBeenCalled();
  });
});

// ─── 2. Invalid signature / server rejection ──────────────────────────────────

describe('server rejection (invalid_signature / other reasons)', () => {
  it('returns rejected with reason when server rejects with invalid_signature', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ status: 'rejected', reason: 'invalid_signature', message: 'Bad QR' }),
    });

    const result = await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(result.status).toBe('rejected');
    expect(result.reason).toBe('invalid_signature');
    expect(result.message).toBe('Bad QR');
    expect(result.offline).toBe(false);
  });

  it('returns rejected for max_uses_reached with fallback message', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ status: 'rejected', reason: 'max_uses_reached' }),
    });

    const result = await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(result.status).toBe('rejected');
    expect(result.reason).toBe('max_uses_reached');
    expect(result.message).toBe('QR code has reached its scan limit');
    expect(result.offline).toBe(false);
  });

  it('does NOT enqueue scan on server rejection', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'rejected', reason: 'revoked' }),
    });

    await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(mockAddScan).not.toHaveBeenCalled();
  });
});

// ─── 3. Offline fallback ──────────────────────────────────────────────────────

describe('offline fallback', () => {
  it('returns optimistic accepted and queues scan when fetch throws (no network)', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network request failed'));

    const result = await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(result.status).toBe('accepted');
    expect(result.offline).toBe(true);
    expect(result.message).toMatch(/queue/i);
    expect(mockAddScan).toHaveBeenCalledWith(QR_STRING, VALID_PAYLOAD.organizationId);
  });

  it('returns optimistic accepted and queues when no auth token', async () => {
    mockGetToken.mockResolvedValue(null);

    const result = await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(result.status).toBe('accepted');
    expect(result.offline).toBe(true);
    // Queue is attempted (addScan will throw if not auth — swallowed)
    expect(mockAddScan).toHaveBeenCalled();
  });

  it('returns offline accepted and queues on non-OK HTTP response (503)', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 503,
      json: () => Promise.resolve({ error: 'Service Unavailable' }),
    });

    const result = await validateOnServer(QR_STRING, VALID_PAYLOAD);

    expect(result.status).toBe('accepted');
    expect(result.offline).toBe(true);
    expect(result.message).toContain('503');
    expect(mockAddScan).toHaveBeenCalledWith(QR_STRING, VALID_PAYLOAD.organizationId);
  });

  it('swallows queue error silently and still returns accepted when queue throws', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network request failed'));
    mockAddScan.mockRejectedValue(new Error('Authentication required'));

    const result = await validateOnServer(QR_STRING, VALID_PAYLOAD);

    // Result must still be optimistic accepted even if queue fails
    expect(result.status).toBe('accepted');
    expect(result.offline).toBe(true);
  });
});

// ─── 4. Location in scanContext ───────────────────────────────────────────────

describe('location in scanContext', () => {
  it('includes location in scanContext body when provided', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'accepted', scanId: 'scan_loc' }),
    });

    const location = { latitude: 30.0444, longitude: 31.2357, accuracy: 10 };
    await validateOnServer(QR_STRING, VALID_PAYLOAD, location);

    const [, options] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(options.body as string);
    expect(body.scanContext.location).toEqual(location);
  });

  it('omits location key from scanContext when not provided', async () => {
    mockGetToken.mockResolvedValue('valid-access-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'accepted', scanId: 'scan_noloc' }),
    });

    await validateOnServer(QR_STRING, VALID_PAYLOAD); // no location arg

    const [, options] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(options.body as string);
    expect(body.scanContext).not.toHaveProperty('location');
  });
});
