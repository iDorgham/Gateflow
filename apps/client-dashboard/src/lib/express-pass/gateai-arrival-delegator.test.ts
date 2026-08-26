import {
  processGuestArrivalNotification,
  createVipArrivalBanner,
  validateArabicOneTapStrings,
  ArrivalEvent,
} from './gateai-arrival-delegator';
import { ExpressPassRecord } from './express-pass-engine';

describe('gateai-arrival-delegator', () => {
  const MOCK_PASS: ExpressPassRecord = {
    id: 'pass-exp-555',
    organizationId: 'org-palm-hills',
    unitId: 'Villa 104',
    residentId: 'res-sarah-jenkins',
    status: 'CLAIMED',
    visitorName: 'Michael Scott',
    signedUrl: 'https://gateflow.site/s/pass-exp-555?sig=abc',
    rawPayload: 'exp|pass-exp-555|...',
    signature: 'abc12345',
    validFrom: '2026-08-24T12:00:00.000Z',
    validUntil: '2026-08-25T12:00:00.000Z',
    createdAt: '2026-08-24T12:00:00.000Z',
    qrToken: 'GF-EXP:pass-exp-555:Michael Scott:abc12345',
  };

  const MOCK_ARRIVAL: ArrivalEvent = {
    passId: 'pass-exp-555',
    gateId: 'gate-north-01',
    gateName: 'North Gate Main',
    scannedAt: '2026-08-24T14:30:00.000Z',
    guardName: 'Officer Tarek',
  };

  describe('processGuestArrivalNotification', () => {
    it('generates English push alert for resident', () => {
      const notification = processGuestArrivalNotification(
        MOCK_ARRIVAL,
        MOCK_PASS,
        {
          id: 'res-sarah-jenkins',
          name: 'Sarah Jenkins',
          pushToken: 'token-sarah-123',
          preferredLanguage: 'en',
        }
      );

      expect(notification.title).toBe('🎉 Guest Arrived');
      expect(notification.body).toBe(
        'Michael Scott has just arrived through North Gate Main.'
      );
      expect(notification.data.passId).toBe('pass-exp-555');
    });

    it('generates Arabic push alert for resident', () => {
      const notification = processGuestArrivalNotification(
        MOCK_ARRIVAL,
        MOCK_PASS,
        {
          id: 'res-sarah-jenkins',
          name: 'سارة',
          pushToken: 'token-sarah-123',
          preferredLanguage: 'ar',
        }
      );

      expect(notification.title).toBe('🎉 وصول الزائر');
      expect(notification.body).toContain(
        'وصل Michael Scott الآن إلى North Gate Main.'
      );
    });
  });

  describe('createVipArrivalBanner', () => {
    it('creates bilingual celebration banner metadata for guard app', () => {
      const banner = createVipArrivalBanner(MOCK_PASS, 'North Gate Main');

      expect(banner.title).toContain('VIP Guest Entry: Michael Scott');
      expect(banner.titleAr).toContain('دخول زائر مميز: Michael Scott');
      expect(banner.badgeText).toBe('ONE-TAP VERIFIED');
      expect(banner.badgeTextAr).toBe('تصريح معتمد');
      expect(banner.themeColor).toBe('#0052CC');
    });
  });

  describe('validateArabicOneTapStrings', () => {
    it('validates Arabic Unicode presence in dictionaries', () => {
      const strings = {
        title: 'تصريح دخول سريع',
        arrived: 'وصل ضيفك إلى البوابة',
        welcome: 'أهلاً وسهلاً بك في بالم هيلز',
      };

      const result = validateArabicOneTapStrings(strings);
      expect(result.allValid).toBe(true);
      expect(result.checkedCount).toBe(3);
    });

    it('flags non-Arabic text', () => {
      const strings = {
        valid: 'مرحباً',
        invalid: 'Welcome Guest',
      };

      const result = validateArabicOneTapStrings(strings);
      expect(result.allValid).toBe(false);
      expect(result.invalidKeys).toContain('invalid');
    });
  });
});
