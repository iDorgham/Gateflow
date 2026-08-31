import {
  buildApplePassDictionary,
  generatePassManifest,
} from './apple-pass-service';
import {
  buildGooglePassObject,
  createGooglePaySaveUrl,
} from './google-pass-service';

describe('Wallet Pass Services', () => {
  const samplePassData = {
    passId: 'pass_12345',
    organizationName: 'Palm Hills Estate',
    residentName: 'Karim Zaki',
    unitName: 'Villa 108',
    qrPayload: 'https://app.gateflow.site/qr/valid_123',
    expiresAt: '2026-12-31T23:59:59Z',
  };

  describe('Apple Pass Service', () => {
    it('builds valid Apple Wallet pass.json dictionary', () => {
      const pass = buildApplePassDictionary(samplePassData);

      expect(pass.formatVersion).toBe(1);
      expect(pass.serialNumber).toBe('pass_12345');
      expect(pass.organizationName).toBe('Palm Hills Estate');
      expect(pass.barcode.message).toBe(samplePassData.qrPayload);
      expect(pass.generic.primaryFields[0].value).toBe('Karim Zaki');
    });

    it('generates SHA1 manifest hashes for pass files', () => {
      const manifest = generatePassManifest({
        'pass.json': JSON.stringify({ test: 1 }),
      });

      expect(manifest['pass.json']).toMatch(/^[0-9a-f]{40}$/);
    });
  });

  describe('Google Pass Service', () => {
    it('builds valid Google Wallet generic pass object', () => {
      const pass = buildGooglePassObject(samplePassData);

      expect(pass.cardTitle.defaultValue.value).toBe('Palm Hills Estate');
      expect(pass.header.defaultValue.value).toBe('Karim Zaki');
      expect(pass.barcode.type).toBe('QR_CODE');
      expect(pass.barcode.value).toBe(samplePassData.qrPayload);
    });

    it('generates Save to Google Pay URL with signature', () => {
      const saveUrl = createGooglePaySaveUrl(samplePassData);

      expect(saveUrl).toContain('https://pay.google.com/gp/v/save/');
      expect(saveUrl).toContain('?sig=');
    });
  });
});
