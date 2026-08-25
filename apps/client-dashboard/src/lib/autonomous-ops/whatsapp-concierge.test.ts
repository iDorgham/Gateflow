import {
  parseWhatsAppVisitorMessage,
  matchResidentToUnit,
  generateResidentApprovalPrompt,
  processResidentApproval,
  ResidentProfile,
} from './whatsapp-concierge';

describe('whatsapp-concierge', () => {
  const SECRET = 'secret-wa-crypto-pass-key-2026';

  const MOCK_RESIDENTS: ResidentProfile[] = [
    {
      residentId: 'res-101',
      residentName: 'Sarah Jenkins',
      unitNumber: 'Villa 104',
      organizationId: 'org-palm-hills',
      pushToken: 'push-token-sarah',
      preferredLanguage: 'en',
    },
    {
      residentId: 'res-102',
      residentName: 'طارق المصري',
      unitNumber: 'فيلا 205',
      organizationId: 'org-palm-hills',
      pushToken: 'push-token-tarek',
      preferredLanguage: 'ar',
    },
  ];

  describe('parseWhatsAppVisitorMessage', () => {
    it('parses English guest requests with unit and visitor name', () => {
      const msg = 'Visiting Villa 104 - Name: Michael Scott';
      const parsed = parseWhatsAppVisitorMessage(msg);

      expect(parsed.isValid).toBe(true);
      expect(parsed.unitNumber).toBe('104');
      expect(parsed.guestName).toBe('Michael Scott');
    });

    it('parses Arabic guest requests accurately', () => {
      const msg = 'طلب زيارة إلى فيلا 205 - كريم منصور';
      const parsed = parseWhatsAppVisitorMessage(msg);

      expect(parsed.isValid).toBe(true);
      expect(parsed.unitNumber).toBe('205');
      expect(parsed.guestName).toBe('كريم منصور');
    });

    it('handles messages without explicit names gracefully', () => {
      const msg = 'Visiting 301';
      const parsed = parseWhatsAppVisitorMessage(msg);

      expect(parsed.isValid).toBe(true);
      expect(parsed.unitNumber).toBe('301');
      expect(parsed.guestName).toBe('Guest');
    });

    it('rejects empty messages as invalid', () => {
      expect(parseWhatsAppVisitorMessage('').isValid).toBe(false);
      expect(parseWhatsAppVisitorMessage('   ').isValid).toBe(false);
    });
  });

  describe('matchResidentToUnit', () => {
    it('matches resident by unit number within organization', () => {
      const resident = matchResidentToUnit(
        MOCK_RESIDENTS,
        'Villa 104',
        'org-palm-hills'
      );
      expect(resident).not.toBeNull();
      expect(resident?.residentName).toBe('Sarah Jenkins');
    });

    it('returns null if unit does not exist in the organization', () => {
      const resident = matchResidentToUnit(
        MOCK_RESIDENTS,
        'Villa 999',
        'org-palm-hills'
      );
      expect(resident).toBeNull();
    });
  });

  describe('generateResidentApprovalPrompt', () => {
    it('generates an English 1-tap push notification prompt', () => {
      const prompt = generateResidentApprovalPrompt(
        { guestName: 'Michael Scott', unitNumber: 'Villa 104', isValid: true },
        MOCK_RESIDENTS[0],
        'req-999'
      );

      expect(prompt.promptTitle).toBe('New Visitor Pass Request');
      expect(prompt.promptBody).toContain('Michael Scott is requesting access');
      expect(prompt.actions.approveAction).toBe('APPROVE:req-999');
    });

    it('generates an Arabic 1-tap push notification prompt', () => {
      const prompt = generateResidentApprovalPrompt(
        { guestName: 'كريم منصور', unitNumber: 'فيلا 205', isValid: true },
        MOCK_RESIDENTS[1],
        'req-888'
      );

      expect(prompt.promptTitle).toBe('طلب تصريح زائر جديد');
      expect(prompt.promptBody).toContain('يطلب كريم منصور الدخول');
      expect(prompt.actions.approveAction).toBe('APPROVE:req-888');
    });
  });

  describe('processResidentApproval', () => {
    it('generates HMAC signed visitor pass on approval', () => {
      const pass = processResidentApproval(
        'req-999',
        MOCK_RESIDENTS[0],
        'Michael Scott',
        SECRET,
        12
      );

      expect(pass.passId).toBe('pass-wa-req-999');
      expect(pass.qrToken).toContain('GF-WA:pass-wa-req-999:');
      expect(pass.guestName).toBe('Michael Scott');
      expect(pass.whatsappReplyMessage).toContain('Sarah Jenkins');
    });
  });
});
