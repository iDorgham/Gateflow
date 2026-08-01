import { resolveQrSecretForScan, QR_SECRET_MISSING } from './qr-secret';

describe('resolveQrSecretForScan', () => {
  it('fails closed when secret is empty outside explicit development', () => {
    const result = resolveQrSecretForScan({
      secret: '',
      isExplicitDev: false,
    });
    expect(result).toEqual({
      ok: false,
      reason: QR_SECRET_MISSING,
      message: expect.stringMatching(/QR.*secret|HMAC/i),
    });
  });

  it('fails closed when secret is whitespace outside explicit development', () => {
    const result = resolveQrSecretForScan({
      secret: '   ',
      isExplicitDev: false,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe(QR_SECRET_MISSING);
  });

  it('allows a non-empty secret outside development', () => {
    const secret = 'a'.repeat(32);
    const result = resolveQrSecretForScan({
      secret,
      isExplicitDev: false,
    });
    expect(result).toEqual({ ok: true, secret });
  });

  it('allows empty secret only in explicit development', () => {
    const result = resolveQrSecretForScan({
      secret: '',
      isExplicitDev: true,
    });
    expect(result).toEqual({ ok: true, secret: '' });
  });
});
