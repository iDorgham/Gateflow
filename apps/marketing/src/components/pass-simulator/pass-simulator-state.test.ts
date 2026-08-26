import {
  validatePassSimulatorInput,
  generateSimulatedPass,
  DEFAULT_PASS_INPUT,
} from './pass-simulator-state';

describe('pass-simulator-state', () => {
  describe('validatePassSimulatorInput', () => {
    it('validates default input as valid', () => {
      const result = validatePassSimulatorInput(DEFAULT_PASS_INPUT);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('rejects short or empty visitor names', () => {
      const result = validatePassSimulatorInput({
        ...DEFAULT_PASS_INPUT,
        visitorName: 'A',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.visitorName).toBeDefined();
    });

    it('rejects empty destination unit', () => {
      const result = validatePassSimulatorInput({
        ...DEFAULT_PASS_INPUT,
        destinationUnit: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.destinationUnit).toBeDefined();
    });

    it('rejects validHours out of bounds', () => {
      const result = validatePassSimulatorInput({
        ...DEFAULT_PASS_INPUT,
        validHours: 100,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.validHours).toBeDefined();
    });
  });

  describe('generateSimulatedPass', () => {
    it('generates a complete simulated pass payload', () => {
      const baseTime = 1700000000000;
      const pass = generateSimulatedPass(
        {
          visitorName: 'Omar Khaled',
          destinationUnit: 'Building 14',
          gateZone: 'East Gate',
          accessType: 'VIP_ESCORT',
          validHours: 12,
        },
        baseTime
      );

      expect(pass.passId).toMatch(/^demo_pass_/);
      expect(pass.visitorName).toBe('Omar Khaled');
      expect(pass.destinationUnit).toBe('Building 14');
      expect(pass.gateZone).toBe('East Gate');
      expect(pass.accessType).toBe('VIP_ESCORT');
      expect(pass.isSimulatedDemo).toBe(true);
      expect(pass.scanUrl).toContain('https://gateflow.site/p/');
      expect(pass.expiresAt).toBe(
        new Date(baseTime + 12 * 3600 * 1000).toISOString()
      );
    });
  });
});
