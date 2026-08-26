import { evaluateGateScanPolicy, buildScanLogPayload } from './gate-security';

describe('gate-security', () => {
  describe('evaluateGateScanPolicy', () => {
    it('allows scan immediately when gate policy does not require biometrics', () => {
      const result = evaluateGateScanPolicy({
        gate: { gateId: 'gate-1', requireBiometric: false },
        isGracePeriodValid: false,
        isBiometricAvailable: true,
      });

      expect(result).toEqual({
        requiresPrompt: false,
        canProceed: true,
        reason: 'POLICY_DISABLED',
      });
    });

    it('allows scan without prompt when within active grace period on high-security gate', () => {
      const result = evaluateGateScanPolicy({
        gate: { gateId: 'gate-vip', requireBiometric: true },
        isGracePeriodValid: true,
        isBiometricAvailable: true,
      });

      expect(result).toEqual({
        requiresPrompt: false,
        canProceed: true,
        reason: 'GRACE_PERIOD_ACTIVE',
      });
    });

    it('requires biometric prompt on high-security gate when grace period is expired', () => {
      const result = evaluateGateScanPolicy({
        gate: { gateId: 'gate-vip', requireBiometric: true },
        isGracePeriodValid: false,
        isBiometricAvailable: true,
      });

      expect(result).toEqual({
        requiresPrompt: true,
        canProceed: false,
        reason: 'BIOMETRICS_REQUIRED',
      });
    });

    it('triggers fallback to PIN when biometrics are unavailable on a high-security gate', () => {
      const result = evaluateGateScanPolicy({
        gate: { gateId: 'gate-vip', requireBiometric: true },
        isGracePeriodValid: false,
        isBiometricAvailable: false,
      });

      expect(result).toEqual({
        requiresPrompt: true,
        canProceed: false,
        reason: 'UNENROLLED_FALLBACK',
      });
    });
  });

  describe('buildScanLogPayload', () => {
    it('constructs a valid scan log entry stamped with biometricVerified: true', () => {
      const payload = buildScanLogPayload({
        qrId: 'qr-12345',
        gateId: 'gate-north',
        status: 'GRANTED',
        biometricVerified: true,
        notes: { vehiclePlate: 'ABC 1234' },
      });

      expect(payload.qrId).toBe('qr-12345');
      expect(payload.gateId).toBe('gate-north');
      expect(payload.status).toBe('GRANTED');
      expect(payload.biometricVerified).toBe(true);
      expect(payload.auditNotes).toEqual(
        expect.objectContaining({
          biometricVerified: true,
          verificationSource: 'ON_DEVICE_BIOMETRIC',
          vehiclePlate: 'ABC 1234',
        })
      );
    });

    it('constructs scan log with biometricVerified: false when skipped or un-enrolled', () => {
      const payload = buildScanLogPayload({
        qrId: 'qr-67890',
        gateId: 'gate-south',
        status: 'GRANTED',
        biometricVerified: false,
      });

      expect(payload.biometricVerified).toBe(false);
      expect(payload.auditNotes?.verificationSource).toBe(
        'PIN_FALLBACK_OR_NONE'
      );
    });
  });
});
