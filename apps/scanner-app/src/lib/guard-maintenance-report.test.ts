import {
  createGuardHardwareReport,
  getLocalizedFaultTypes,
  FAULT_TYPE_METADATA,
} from './guard-maintenance-report';

describe('guard-maintenance-report', () => {
  describe('createGuardHardwareReport', () => {
    it('creates an urgent work order payload with auto-populated context', () => {
      const report = createGuardHardwareReport({
        gateId: 'gate-north-01',
        gateName: 'North Gate Main Entrance',
        guardId: 'guard-88',
        guardName: 'Mahmoud Saeed',
        faultType: 'BARRIER_ARM_JAMMED',
        notes: 'Barrier stuck at 45 degree angle after car passed',
        timestamp: '2026-08-24T14:30:00Z',
      });

      expect(report.priority).toBe('URGENT');
      expect(report.category).toBe('GATE_HARDWARE');
      expect(report.assetType).toBe('GATE');
      expect(report.assetId).toBe('gate-north-01');
      expect(report.titleEn).toContain('[URGENT] Barrier Arm Jammed');
      expect(report.titleAr).toContain('[عاجل] تعطل ذراع البوابة');
      expect(report.description).toContain('North Gate Main Entrance');
      expect(report.description).toContain('Mahmoud Saeed');
      expect(report.description).toContain('Barrier stuck at 45 degree angle');
      expect(report.createdAt).toBe('2026-08-24T14:30:00Z');
    });
  });

  describe('getLocalizedFaultTypes', () => {
    it('provides localized English labels for fault options', () => {
      const enTypes = getLocalizedFaultTypes('en');
      expect(enTypes).toHaveLength(Object.keys(FAULT_TYPE_METADATA).length);
      expect(enTypes[0].label).toBe('Barrier Arm Jammed / Broken');
    });

    it('provides localized Arabic labels for fault options', () => {
      const arTypes = getLocalizedFaultTypes('ar');
      expect(arTypes).toHaveLength(Object.keys(FAULT_TYPE_METADATA).length);
      expect(arTypes[0].label).toBe('عطل / كسر في ذراع البوابة');
    });
  });
});
