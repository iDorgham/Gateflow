import { createHmac } from 'crypto';
import {
  verifyPerimeterWebhookSignature,
  detectTailgating,
  CameraPassageEvent,
  GateScanLogEntry,
} from './tailgating-bridge';

describe('tailgating-bridge', () => {
  const SECRET = 'super-secret-perimeter-webhook-key-2026';

  describe('verifyPerimeterWebhookSignature', () => {
    it('validates a correct HMAC signature', () => {
      const payload = JSON.stringify({ eventId: 'evt-101', gateId: 'gate-01' });
      const hmac = createHmac('sha256', SECRET).update(payload).digest('hex');

      const isValid = verifyPerimeterWebhookSignature(payload, hmac, SECRET);
      expect(isValid).toBe(true);
    });

    it('rejects an invalid signature or tampered payload', () => {
      const payload = JSON.stringify({ eventId: 'evt-101', gateId: 'gate-01' });
      const tampered = JSON.stringify({
        eventId: 'evt-101',
        gateId: 'gate-02',
      });
      const hmac = createHmac('sha256', SECRET).update(payload).digest('hex');

      const isValid = verifyPerimeterWebhookSignature(tampered, hmac, SECRET);
      expect(isValid).toBe(false);
    });

    it('rejects empty or missing parameters gracefully', () => {
      expect(verifyPerimeterWebhookSignature('', 'sig', SECRET)).toBe(false);
      expect(verifyPerimeterWebhookSignature('payload', '', SECRET)).toBe(
        false
      );
      expect(verifyPerimeterWebhookSignature('payload', 'sig', '')).toBe(false);
    });
  });

  describe('detectTailgating', () => {
    const GATE_NAME = 'Main Gate 01';
    const ORG_ID = 'org-palm-hills';

    it('returns null when vehicle passes with valid QR scan within threshold', () => {
      const passage: CameraPassageEvent = {
        eventId: 'evt-car-01',
        gateId: 'gate-01',
        organizationId: ORG_ID,
        timestamp: '2026-08-24T16:00:02.500Z',
        vehicleType: 'SEDAN',
      };

      const scans: GateScanLogEntry[] = [
        {
          scanId: 'scan-01',
          gateId: 'gate-01',
          organizationId: ORG_ID,
          timestamp: '2026-08-24T16:00:01.000Z', // 1.5s prior
          isAuthorized: true,
        },
      ];

      const incident = detectTailgating(passage, scans, GATE_NAME, 3.0);
      expect(incident).toBeNull();
    });

    it('detects tailgating when vehicle passes without an authorized QR scan', () => {
      const passage: CameraPassageEvent = {
        eventId: 'evt-car-02',
        gateId: 'gate-01',
        organizationId: ORG_ID,
        timestamp: '2026-08-24T16:00:10.000Z',
        vehicleType: 'SUV',
        licensePlateSnippet: 'XYZ-9876',
      };

      const scans: GateScanLogEntry[] = [
        {
          scanId: 'scan-01',
          gateId: 'gate-01',
          organizationId: ORG_ID,
          timestamp: '2026-08-24T16:00:01.000Z', // 9s prior - outside 3s threshold
          isAuthorized: true,
        },
      ];

      const incident = detectTailgating(passage, scans, GATE_NAME, 3.0);
      expect(incident).not.toBeNull();
      expect(incident?.severity).toBe('CRITICAL');
      expect(incident?.alertEn).toContain('Tailgating Alert');
      expect(incident?.alertEn).toContain('XYZ-9876');
      expect(incident?.alertAr).toContain('تنبيه اختراق تتبعي');
      expect(incident?.alertAr).toContain('XYZ-9876');
    });

    it('detects tailgating if matching scan was unauthorized / denied', () => {
      const passage: CameraPassageEvent = {
        eventId: 'evt-car-03',
        gateId: 'gate-01',
        organizationId: ORG_ID,
        timestamp: '2026-08-24T16:00:02.000Z',
      };

      const scans: GateScanLogEntry[] = [
        {
          scanId: 'scan-denied',
          gateId: 'gate-01',
          organizationId: ORG_ID,
          timestamp: '2026-08-24T16:00:01.000Z',
          isAuthorized: false, // Denied scan
        },
      ];

      const incident = detectTailgating(passage, scans, GATE_NAME, 3.0);
      expect(incident).not.toBeNull();
    });
  });
});
