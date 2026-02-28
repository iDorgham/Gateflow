import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import CryptoJS from 'crypto-js';

const mockAsyncStore: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(mockAsyncStore[key] ?? null)),
  setItem: jest.fn((key: string, value: string) => {
    mockAsyncStore[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete mockAsyncStore[key];
    return Promise.resolve();
  }),
}));

import { signQRPayload, verifyQRSignature, type QRPayload, QRCodeType } from '@gate-access/types';
import { verifyScanQR, clearNonceCache } from './qr-verify';

const TEST_SECRET = 'test-secret-that-is-at-least-32-chars-long!!';

function makePayload(overrides?: Partial<QRPayload>): QRPayload {
  return {
    qrId: 'cltest123',
    organizationId: 'clorg456',
    type: QRCodeType.SINGLE,
    maxUses: 1,
    expiresAt: new Date(Date.now() + 3600_000).toISOString(), // +1 hour
    issuedAt: new Date().toISOString(),
    nonce: crypto.randomUUID ? crypto.randomUUID() : generateTestUuid(),
    ...overrides,
  };
}

function generateTestUuid(): string {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function clearStore() {
  Object.keys(mockAsyncStore).forEach(k => delete mockAsyncStore[k]);
}

// ─── Shared signing library tests ────────────────────────────────────────────

describe('signQRPayload', () => {
  it('should produce a valid gateflow:1: prefixed string', () => {
    const payload = makePayload();
    const signed = signQRPayload(payload, TEST_SECRET);

    expect(signed).toMatch(/^gateflow:1:/);
    expect(signed.split('.').length).toBe(2);
  });

  it('should reject secrets shorter than 32 characters', () => {
    const payload = makePayload();
    expect(() => signQRPayload(payload, 'short')).toThrow('at least 32 characters');
  });

  it('should produce different signatures for different payloads', () => {
    const sig1 = signQRPayload(makePayload({ qrId: 'a' }), TEST_SECRET);
    const sig2 = signQRPayload(makePayload({ qrId: 'b' }), TEST_SECRET);

    const getSig = (s: string) => s.split('.')[1];
    expect(getSig(sig1)).not.toBe(getSig(sig2));
  });

  it('should produce different signatures for different secrets', () => {
    const payload = makePayload();
    const sig1 = signQRPayload(payload, TEST_SECRET);
    const sig2 = signQRPayload(payload, 'another-secret-that-is-32-chars-long!!');

    const getSig = (s: string) => s.split('.')[1];
    expect(getSig(sig1)).not.toBe(getSig(sig2));
  });
});

describe('verifyQRSignature', () => {
  it('should verify a validly signed QR and return payload', () => {
    const payload = makePayload();
    const signed = signQRPayload(payload, TEST_SECRET);

    const result = verifyQRSignature(signed, TEST_SECRET);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.payload.qrId).toBe(payload.qrId);
      expect(result.payload.nonce).toBe(payload.nonce);
      expect(result.payload.organizationId).toBe(payload.organizationId);
    }
  });

  it('should reject a tampered payload', () => {
    const signed = signQRPayload(makePayload(), TEST_SECRET);

    // Tamper with payload portion (flip a character in the base64)
    const parts = signed.split(':');
    const payloadAndSig = parts[2];
    const [encodedPayload, sig] = payloadAndSig.split('.');
    const tampered = encodedPayload.slice(0, -1) +
      (encodedPayload.slice(-1) === 'A' ? 'B' : 'A');
    const tamperedQR = `${parts[0]}:${parts[1]}:${tampered}.${sig}`;

    const result = verifyQRSignature(tamperedQR, TEST_SECRET);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(['INVALID_SIGNATURE', 'MALFORMED_PAYLOAD']).toContain(result.reason);
    }
  });

  it('should reject a forged signature', () => {
    const signed = signQRPayload(makePayload(), TEST_SECRET);
    const forged = signed.replace(/\.[0-9a-f]{64}$/, '.' + '0'.repeat(64));

    const result = verifyQRSignature(forged, TEST_SECRET);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('INVALID_SIGNATURE');
    }
  });

  it('should reject with wrong secret', () => {
    const signed = signQRPayload(makePayload(), TEST_SECRET);
    const result = verifyQRSignature(signed, 'wrong-secret-that-is-32-characters-long!');

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('INVALID_SIGNATURE');
    }
  });

  it('should reject an expired QR', () => {
    const payload = makePayload({
      expiresAt: new Date(Date.now() - 1000).toISOString(), // expired 1s ago
    });
    const signed = signQRPayload(payload, TEST_SECRET);

    const result = verifyQRSignature(signed, TEST_SECRET);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('EXPIRED');
    }
  });

  it('should accept a QR with no expiration (null expiresAt)', () => {
    const payload = makePayload({ expiresAt: null, type: QRCodeType.PERMANENT });
    const signed = signQRPayload(payload, TEST_SECRET);

    const result = verifyQRSignature(signed, TEST_SECRET);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid format strings', () => {
    expect(verifyQRSignature('', TEST_SECRET).valid).toBe(false);
    expect(verifyQRSignature('random-string', TEST_SECRET).valid).toBe(false);
    expect(verifyQRSignature('gateflow:2:abc.def', TEST_SECRET).valid).toBe(false);
    expect(verifyQRSignature('gateflow:1:', TEST_SECRET).valid).toBe(false);
  });
});

// ─── Scanner-side verification with nonce replay ─────────────────────────────

describe('verifyScanQR (scanner-side with nonce cache)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearStore();
  });

  it('should accept a valid QR on first scan', async () => {
    const signed = signQRPayload(makePayload(), TEST_SECRET);
    const result = await verifyScanQR(signed, TEST_SECRET);

    expect(result.valid).toBe(true);
  });

  it('should reject a replayed nonce (same QR scanned twice)', async () => {
    const signed = signQRPayload(makePayload(), TEST_SECRET);

    const first = await verifyScanQR(signed, TEST_SECRET);
    expect(first.valid).toBe(true);

    const second = await verifyScanQR(signed, TEST_SECRET);
    expect(second.valid).toBe(false);
    if (!second.valid) {
      expect(second.reason).toBe('NONCE_REUSED');
    }
  });

  it('should accept different nonces for same qrId', async () => {
    const payload1 = makePayload({ qrId: 'same-qr' });
    const payload2 = makePayload({ qrId: 'same-qr' }); // different nonce

    const signed1 = signQRPayload(payload1, TEST_SECRET);
    const signed2 = signQRPayload(payload2, TEST_SECRET);

    const r1 = await verifyScanQR(signed1, TEST_SECRET);
    const r2 = await verifyScanQR(signed2, TEST_SECRET);

    expect(r1.valid).toBe(true);
    expect(r2.valid).toBe(true);
  });

  it('should reject invalid signature before checking nonce', async () => {
    const result = await verifyScanQR('gateflow:1:bad.' + '0'.repeat(64), TEST_SECRET);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).not.toBe('NONCE_REUSED');
    }
  });

  it('should clear nonce cache', async () => {
    const signed = signQRPayload(makePayload(), TEST_SECRET);
    await verifyScanQR(signed, TEST_SECRET);

    await clearNonceCache();

    // After clearing, same nonce should be accepted again
    const result = await verifyScanQR(signed, TEST_SECRET);
    expect(result.valid).toBe(true);
  });
});
