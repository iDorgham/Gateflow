import {
  auditArabicRtlAssistantStrings,
  benchmarkStreamAccumulatorLatency,
} from './rtl-latency-audit';

describe('rtl-latency-audit', () => {
  describe('auditArabicRtlAssistantStrings', () => {
    it('validates compliant Arabic assistant dictionary', () => {
      const dict = {
        title: 'مساعد جيت فلو الذكي',
        issuePass: 'إصدار تصريح دخول للزائر',
        lockdown: 'إغلاق أمني للبوابة',
        reasoning: 'جار تحليل السياسات الأمنية...',
      };

      const result = auditArabicRtlAssistantStrings(dict);
      expect(result.isCompliant).toBe(true);
      expect(result.testedKeysCount).toBe(4);
      expect(result.direction).toBe('rtl');
    });

    it('identifies non-Arabic strings', () => {
      const dict = {
        valid: 'أهلاً بك',
        invalid: 'Issue visitor pass',
      };

      const result = auditArabicRtlAssistantStrings(dict);
      expect(result.isCompliant).toBe(false);
      expect(result.invalidKeys).toContain('invalid');
    });
  });

  describe('benchmarkStreamAccumulatorLatency', () => {
    it('processes 100 mixed stream chunks under 150ms total threshold', () => {
      const result = benchmarkStreamAccumulatorLatency(100);

      expect(result.chunksProcessed).toBe(100);
      expect(result.isUnderTarget).toBe(true);
      expect(result.totalProcessingTimeMs).toBeLessThan(150);
      expect(result.averageChunkLatencyMs).toBeLessThan(5);
    });
  });
});
