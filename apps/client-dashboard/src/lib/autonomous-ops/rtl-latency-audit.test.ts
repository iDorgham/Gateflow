import {
  measureAlertLatency,
  validateArabicPerimeterStrings,
  getCertifiedPerimeterStatuses,
} from './rtl-latency-audit';

describe('rtl-latency-audit', () => {
  describe('measureAlertLatency', () => {
    it('passes when total duration is strictly under 200ms target', () => {
      const report = measureAlertLatency(25, 40, 55, 200);

      expect(report.totalDurationMs).toBe(120);
      expect(report.isWithinBenchmark).toBe(true);
      expect(report.breakdown.ingestionMs).toBe(25);
    });

    it('flags benchmark failure when latency exceeds 200ms', () => {
      const report = measureAlertLatency(80, 75, 90, 200);

      expect(report.totalDurationMs).toBe(245);
      expect(report.isWithinBenchmark).toBe(false);
    });
  });

  describe('validateArabicPerimeterStrings', () => {
    it('validates genuine Arabic dictionary entries', () => {
      const strings = {
        tailgating: 'اختراق تتبعي للمركبة',
        anomaly: 'عطل في حساس البوابة',
        approval: 'تم اعتماد تصريح الزائر',
      };

      const result = validateArabicPerimeterStrings(strings);
      expect(result.allValid).toBe(true);
      expect(result.checkedCount).toBe(3);
      expect(result.invalidKeys.length).toBe(0);
    });

    it('catches missing or non-Arabic strings', () => {
      const strings = {
        valid: 'تمت الموافقة',
        invalid: 'Approved Pass Only',
      };

      const result = validateArabicPerimeterStrings(strings);
      expect(result.allValid).toBe(false);
      expect(result.invalidKeys).toContain('invalid');
    });
  });

  describe('getCertifiedPerimeterStatuses', () => {
    it('returns valid Arabic translations for all operational statuses', () => {
      const statuses = getCertifiedPerimeterStatuses();
      const arabicMap = Object.keys(statuses).reduce(
        (acc, k) => {
          acc[k] = statuses[k].ar;
          return acc;
        },
        {} as Record<string, string>
      );

      const audit = validateArabicPerimeterStrings(arabicMap);
      expect(audit.allValid).toBe(true);
    });
  });
});
