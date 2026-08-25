import {
  generateGpsNavigationUrl,
  resolveInviteeLandingViewModel,
  generateAppleWalletPassPayload,
  generateGoogleWalletPassPayload,
  CompoundLocation,
} from './invitee-landing-state';
import { ExpressPassRecord } from './express-pass-engine';

describe('invitee-landing-state', () => {
  const MOCK_COMPOUND: CompoundLocation = {
    nameEn: 'Palm Hills Estate',
    nameAr: 'بالم هيلز إستيت',
    latitude: 30.0123,
    longitude: 31.0456,
    addressEn: '6th of October City, Giza',
    addressAr: 'مدينة السادس من أكتوبر، الجيزة',
  };

  const MOCK_PASS: ExpressPassRecord = {
    id: 'pass-exp-999',
    organizationId: 'org-palm-hills',
    unitId: 'Villa 104',
    residentId: 'res-sarah-jenkins',
    status: 'CLAIMED',
    visitorName: 'Karim Mansour',
    signedUrl: 'https://gateflow.site/s/pass-exp-999?sig=abc',
    rawPayload: 'exp|pass-exp-999|...',
    signature: 'abc12345',
    validFrom: '2026-08-24T12:00:00.000Z',
    validUntil: '2026-08-25T12:00:00.000Z',
    createdAt: '2026-08-24T12:00:00.000Z',
    qrToken: 'GF-EXP:pass-exp-999:Karim Mansour:abc12345',
  };

  describe('generateGpsNavigationUrl', () => {
    it('generates accurate Google Maps, Apple Maps, and Waze links', () => {
      const gUrl = generateGpsNavigationUrl(
        { latitude: 30.0123, longitude: 31.0456, name: 'Palm Hills' },
        'GOOGLE'
      );
      const aUrl = generateGpsNavigationUrl(
        { latitude: 30.0123, longitude: 31.0456, name: 'Palm Hills' },
        'APPLE'
      );
      const wUrl = generateGpsNavigationUrl(
        { latitude: 30.0123, longitude: 31.0456 },
        'WAZE'
      );

      expect(gUrl).toContain('maps.google.com');
      expect(gUrl).toContain('30.0123,31.0456');
      expect(aUrl).toContain('maps.apple.com');
      expect(wUrl).toContain('waze.com/ul');
    });
  });

  describe('resolveInviteeLandingViewModel', () => {
    it('constructs a view model with GPS links and instructions', () => {
      const now = new Date('2026-08-24T15:00:00.000Z');
      const model = resolveInviteeLandingViewModel(
        MOCK_PASS,
        { name: 'Sarah Jenkins' },
        MOCK_COMPOUND,
        now
      );

      expect(model.passId).toBe('pass-exp-999');
      expect(model.guestName).toBe('Karim Mansour');
      expect(model.hostName).toBe('Sarah Jenkins');
      expect(model.isExpired).toBe(false);
      expect(model.googleMapsUrl).toBeDefined();
      expect(model.gateInstructionsAr).toContain('يرجى إبراز رمز QR');
    });
  });

  describe('generateAppleWalletPassPayload', () => {
    it('creates compliant PKPass schema', () => {
      const model = resolveInviteeLandingViewModel(
        MOCK_PASS,
        { name: 'Sarah Jenkins' },
        MOCK_COMPOUND
      );
      const applePass = generateAppleWalletPassPayload(model);

      expect(applePass.formatVersion).toBe(1);
      expect(applePass.passTypeIdentifier).toBe('pass.site.gateflow.visitor');
      expect(applePass.barcode.format).toBe('PKBarcodeFormatQR');
      expect(applePass.barcode.message).toContain('GF-EXP:pass-exp-999');
    });
  });

  describe('generateGoogleWalletPassPayload', () => {
    it('creates compliant Google Wallet schema', () => {
      const model = resolveInviteeLandingViewModel(
        MOCK_PASS,
        { name: 'Sarah Jenkins' },
        MOCK_COMPOUND
      );
      const googlePass = generateGoogleWalletPassPayload(model);

      expect(googlePass.state).toBe('ACTIVE');
      expect(googlePass.barcode.type).toBe('QR_CODE');
      expect(googlePass.barcode.value).toContain('GF-EXP:pass-exp-999');
    });
  });
});
