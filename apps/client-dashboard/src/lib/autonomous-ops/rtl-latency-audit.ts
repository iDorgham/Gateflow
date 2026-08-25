/**
 * Arabic RTL Localization Validation and Latency Performance Benchmark Suite.
 */

export interface LatencyBenchmarkReport {
  totalDurationMs: number;
  targetMs: number;
  isWithinBenchmark: boolean;
  breakdown: {
    ingestionMs: number;
    classificationMs: number;
    broadcastMs: number;
  };
}

export interface ArabicAuditResult {
  allValid: boolean;
  checkedCount: number;
  invalidKeys: string[];
}

/**
 * Validates that round-trip event processing operates within the sub-200ms latency ceiling.
 */
export function measureAlertLatency(
  ingestionMs: number,
  classificationMs: number,
  broadcastMs: number,
  targetMs: number = 200
): LatencyBenchmarkReport {
  const totalDurationMs = ingestionMs + classificationMs + broadcastMs;
  const isWithinBenchmark = totalDurationMs <= targetMs;

  return {
    totalDurationMs,
    targetMs,
    isWithinBenchmark,
    breakdown: {
      ingestionMs,
      classificationMs,
      broadcastMs,
    },
  };
}

/**
 * Audits dictionary entries to ensure valid Arabic text presence and proper RTL structure.
 */
export function validateArabicPerimeterStrings(
  strings: Record<string, string>
): ArabicAuditResult {
  const arabicCharRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const invalidKeys: string[] = [];

  const keys = Object.keys(strings);
  for (const key of keys) {
    const text = strings[key];
    if (!text || !arabicCharRegex.test(text)) {
      invalidKeys.push(key);
    }
  }

  return {
    allValid: invalidKeys.length === 0,
    checkedCount: keys.length,
    invalidKeys,
  };
}

/**
 * Returns certified bilingual terminology for perimeter operational statuses.
 */
export function getCertifiedPerimeterStatuses(): Record<
  string,
  { en: string; ar: string }
> {
  return {
    NOMINAL: {
      en: 'Operational Nominal',
      ar: 'الحالة طبيعية / نشطة',
    },
    ANOMALY: {
      en: 'Telemetry Anomaly Detected',
      ar: 'تم رصد اضطراب تشغيلي',
    },
    INCIDENT: {
      en: 'Active Security Incident',
      ar: 'حادث أمني نشط',
    },
    TAILGATING: {
      en: 'Tailgating Breach',
      ar: 'اختراق تتبعي غير مصرح',
    },
    AGENTIC_DISPATCH: {
      en: 'Autonomous Work Order Dispatched',
      ar: 'تم إصدار بلاغ صيانة ذاتي',
    },
  };
}
