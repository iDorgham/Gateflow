import {
  createSilentExpressPass,
  claimExpressPass,
  ExpressPassRecord,
} from './express-pass-engine';

describe('express-pass-engine', () => {
  const SECRET = 'resident-one-tap-master-crypto-secret-2026';

  const MOCK_RESIDENT = {
    id: 'res-sarah-jenkins',
    orgId: 'org-palm-hills',
    unitId: 'unit-villa-104',
  };

  describe('createSilentExpressPass', () => {
    it('creates an unassigned pass with valid HMAC signature and shortUrl', () => {
      const pass = createSilentExpressPass(
        MOCK_RESIDENT,
        SECRET,
        24,
        'pass-silent-101'
      );

      expect(pass.id).toBe('pass-silent-101');
      expect(pass.status).toBe('UNASSIGNED');
      expect(pass.visitorName).toBeUndefined();
      expect(pass.signedUrl).toContain(
        'https://gateflow.site/s/pass-silent-101?sig='
      );
      expect(pass.organizationId).toBe('org-palm-hills');
      expect(pass.unitId).toBe('unit-villa-104');
    });
  });

  describe('claimExpressPass', () => {
    let unassignedPass: ExpressPassRecord;

    beforeEach(() => {
      unassignedPass = createSilentExpressPass(
        MOCK_RESIDENT,
        SECRET,
        24,
        'pass-silent-102'
      );
    });

    it('claims an unassigned pass with visitor name and generates QR token', () => {
      const result = claimExpressPass(
        unassignedPass,
        { visitorName: 'Karim Mansour', visitorPhone: '+201001234567' },
        SECRET
      );

      expect(result.success).toBe(true);
      expect(result.pass?.status).toBe('CLAIMED');
      expect(result.pass?.visitorName).toBe('Karim Mansour');
      expect(result.pass?.visitorPhone).toBe('+201001234567');
      expect(result.pass?.claimedAt).toBeDefined();
      expect(result.pass?.qrToken).toContain(
        'GF-EXP:pass-silent-102:Karim Mansour:'
      );
    });

    it('rejects claim without visitor name', () => {
      const result = claimExpressPass(
        unassignedPass,
        { visitorName: '   ' },
        SECRET
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('VISITOR_NAME_REQUIRED');
    });

    it('rejects claim if pass has expired', () => {
      const futureNow = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours later
      const result = claimExpressPass(
        unassignedPass,
        { visitorName: 'Karim Mansour' },
        SECRET,
        futureNow
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('PASS_EXPIRED');
    });

    it('rejects claim if pass is revoked', () => {
      const revokedPass: ExpressPassRecord = {
        ...unassignedPass,
        status: 'REVOKED',
      };

      const result = claimExpressPass(
        revokedPass,
        { visitorName: 'Karim Mansour' },
        SECRET
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('PASS_REVOKED');
    });
  });
});
