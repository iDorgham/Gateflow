import {
  generateExpressPassToken,
  verifyExpressPassToken,
  ExpressPassSignOptions,
} from './crypto-signing';

describe('crypto-signing', () => {
  const SECRET = 'resident-one-tap-master-crypto-secret-2026';

  const MOCK_OPTIONS: ExpressPassSignOptions = {
    passId: 'pass-exp-777',
    organizationId: 'org-palm-hills',
    unitId: 'unit-villa-104',
    residentId: 'res-sarah-jenkins',
    validityHours: 24,
    issuedAt: '2026-08-24T12:00:00.000Z',
  };

  describe('generateExpressPassToken', () => {
    it('creates an HMAC-signed express pass token and short URL', () => {
      const token = generateExpressPassToken(MOCK_OPTIONS, SECRET);

      expect(token.passId).toBe('pass-exp-777');
      expect(token.signature.length).toBe(32);
      expect(token.shortUrl).toBe(
        `https://gateflow.site/s/pass-exp-777?sig=${token.signature}`
      );
      expect(token.validFrom).toBe('2026-08-24T12:00:00.000Z');
      expect(token.validUntil).toBe('2026-08-25T12:00:00.000Z');
      expect(token.rawPayload).toContain(
        'exp|pass-exp-777|org-palm-hills|unit-villa-104'
      );
    });
  });

  describe('verifyExpressPassToken', () => {
    it('verifies a valid token within validity window', () => {
      const token = generateExpressPassToken(MOCK_OPTIONS, SECRET);
      const now = new Date('2026-08-24T14:00:00.000Z');

      const result = verifyExpressPassToken(
        token.passId,
        token.signature,
        token.rawPayload,
        SECRET,
        now
      );

      expect(result.isValid).toBe(true);
      expect(result.isExpired).toBe(false);
      expect(result.organizationId).toBe('org-palm-hills');
      expect(result.unitId).toBe('unit-villa-104');
      expect(result.residentId).toBe('res-sarah-jenkins');
    });

    it('rejects an expired token', () => {
      const token = generateExpressPassToken(MOCK_OPTIONS, SECRET);
      const future = new Date('2026-08-25T14:00:00.000Z'); // 26h later

      const result = verifyExpressPassToken(
        token.passId,
        token.signature,
        token.rawPayload,
        SECRET,
        future
      );

      expect(result.isValid).toBe(false);
      expect(result.isExpired).toBe(true);
      expect(result.errorReason).toBe('TOKEN_EXPIRED');
    });

    it('rejects tampered organizationId or payload modification', () => {
      const token = generateExpressPassToken(MOCK_OPTIONS, SECRET);
      const tamperedPayload = token.rawPayload.replace(
        'org-palm-hills',
        'org-hacked'
      );

      const result = verifyExpressPassToken(
        token.passId,
        token.signature,
        tamperedPayload,
        SECRET
      );

      expect(result.isValid).toBe(false);
      expect(result.errorReason).toBe('SIGNATURE_MISMATCH');
    });

    it('rejects passId mismatch', () => {
      const token = generateExpressPassToken(MOCK_OPTIONS, SECRET);

      const result = verifyExpressPassToken(
        'wrong-pass-id',
        token.signature,
        token.rawPayload,
        SECRET
      );

      expect(result.isValid).toBe(false);
      expect(result.errorReason).toBe('PASS_ID_MISMATCH');
    });
  });
});
