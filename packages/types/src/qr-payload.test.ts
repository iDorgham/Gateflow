import { describe, it, expect } from 'bun:test';
import { z } from 'zod';
import { QRPayloadSchema, SignedQRStringSchema } from './qr-payload';
import { QRCodeType } from './qr';

describe('QRPayloadSchema', () => {
  const validPayload = {
    qrId: 'ckp0k5j4c000001l700000000',
    organizationId: 'ckp0k5j4c000001l700000001',
    type: QRCodeType.SINGLE,
    maxUses: 1,
    expiresAt: '2023-01-01T00:00:00.000Z',
    issuedAt: '2023-01-01T00:00:00.000Z',
    nonce: '123e4567-e89b-12d3-a456-426614174000',
  };

  it('validates a correct payload', () => {
    expect(QRPayloadSchema.safeParse(validPayload).success).toBe(true);
  });

  it('allows null maxUses for PERMANENT type', () => {
    const payload = { ...validPayload, type: QRCodeType.PERMANENT, maxUses: null };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(true);
  });

  it('allows null expiresAt', () => {
    const payload = { ...validPayload, expiresAt: null };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(true);
  });

  it('rejects invalid qrId (missing)', () => {
    const { qrId, ...invalid } = validPayload;
    expect(QRPayloadSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects invalid organizationId (missing)', () => {
    const { organizationId, ...invalid } = validPayload;
    expect(QRPayloadSchema.safeParse(invalid).success).toBe(false);
  });

  it('rejects invalid type', () => {
    const payload = { ...validPayload, type: 'INVALID_TYPE' };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects negative maxUses', () => {
    const payload = { ...validPayload, maxUses: -1 };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects zero maxUses', () => {
    const payload = { ...validPayload, maxUses: 0 };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects float maxUses', () => {
    const payload = { ...validPayload, maxUses: 1.5 };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects invalid expiresAt (not datetime)', () => {
    const payload = { ...validPayload, expiresAt: 'invalid-date' };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects invalid issuedAt (not datetime)', () => {
    const payload = { ...validPayload, issuedAt: 'invalid-date' };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(false);
  });

  it('rejects invalid nonce (not UUID)', () => {
    const payload = { ...validPayload, nonce: 'not-a-uuid' };
    expect(QRPayloadSchema.safeParse(payload).success).toBe(false);
  });
});

describe('SignedQRStringSchema', () => {
  it('validates a correct signed QR string', () => {
    const validString = 'gateflow:1:base64payload.0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    expect(SignedQRStringSchema.safeParse(validString).success).toBe(true);
  });

  it('rejects missing prefix', () => {
    const invalidString = '1:base64payload.0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    expect(SignedQRStringSchema.safeParse(invalidString).success).toBe(false);
  });

  it('rejects wrong version', () => {
    const invalidString = 'gateflow:2:base64payload.0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    expect(SignedQRStringSchema.safeParse(invalidString).success).toBe(false);
  });

  it('rejects invalid signature length', () => {
    const invalidString = 'gateflow:1:base64payload.0123456789abcdef';
    expect(SignedQRStringSchema.safeParse(invalidString).success).toBe(false);
  });

  it('rejects invalid signature characters', () => {
    const invalidString = 'gateflow:1:base64payload.zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
    expect(SignedQRStringSchema.safeParse(invalidString).success).toBe(false);
  });
});
