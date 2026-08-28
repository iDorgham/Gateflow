import { signQRPayload, verifyQRSignature } from './qr-signing';
import { QRCodeType } from './qr';

describe('QR Signing and Verification (Native Crypto)', () => {
  const secret = 'super-secret-signing-key-32-chars-long!';

  const samplePayload = {
    qrId: 'ckp0k5j4c000001l700000000',
    organizationId: 'ckp0k5j4c000001l700000001',
    type: QRCodeType.SINGLE,
    maxUses: 1,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    issuedAt: new Date().toISOString(),
    nonce: '550e8400-e29b-41d4-a716-446655440000',
  };

  it('signs and verifies a valid payload successfully', () => {
    const signedString = signQRPayload(samplePayload, secret);
    expect(signedString).toMatch(/^gateflow:1:[A-Za-z0-9_-]+\.[a-f0-9]{64}$/);

    const result = verifyQRSignature(signedString, secret);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.payload.qrId).toBe(samplePayload.qrId);
      expect(result.payload.organizationId).toBe(samplePayload.organizationId);
      expect(result.payload.nonce).toBe(samplePayload.nonce);
    }
  });

  it('rejects tampered signature', () => {
    const signedString = signQRPayload(samplePayload, secret);
    const tampered = signedString.slice(0, -4) + '0000';

    const result = verifyQRSignature(tampered, secret);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('INVALID_SIGNATURE');
  });

  it('rejects wrong secret', () => {
    const signedString = signQRPayload(samplePayload, secret);
    const wrongSecret = 'another-secret-signing-key-32-chars-long!';

    const result = verifyQRSignature(signedString, wrongSecret);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('INVALID_SIGNATURE');
  });

  it('rejects expired QR code', () => {
    const expiredPayload = {
      ...samplePayload,
      expiresAt: new Date(Date.now() - 1000 * 60).toISOString(),
    };
    const signedString = signQRPayload(expiredPayload, secret);

    const result = verifyQRSignature(signedString, secret);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('EXPIRED');
  });

  it('rejects malformed string format', () => {
    expect(verifyQRSignature('invalid-qr-string', secret).valid).toBe(false);
    expect(verifyQRSignature('gateflow:1:no-dot-signature', secret).valid).toBe(
      false
    );
    expect(verifyQRSignature('gateflow:99:data.sig', secret).valid).toBe(false);
  });
});
