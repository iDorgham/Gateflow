/**
 * Emulation / Impersonation state manager and telemetry health evaluator for Admin Dashboard.
 */

export interface EmulationSession {
  isEmulating: boolean;
  targetOrgId?: string;
  targetOrgName?: string;
  superAdminEmail?: string;
  startedAt?: string;
}

export interface EmulationBannerData {
  shouldShowBanner: boolean;
  bannerTitleEn: string;
  bannerTitleAr: string;
  bannerSubtitleEn: string;
  bannerSubtitleAr: string;
  exitActionLabelEn: string;
  exitActionLabelAr: string;
}

/**
 * Evaluates emulation state and produces banner presentation details.
 */
export function getEmulationBannerData(
  session: EmulationSession
): EmulationBannerData {
  if (!session.isEmulating || !session.targetOrgName) {
    return {
      shouldShowBanner: false,
      bannerTitleEn: '',
      bannerTitleAr: '',
      bannerSubtitleEn: '',
      bannerSubtitleAr: '',
      exitActionLabelEn: '',
      exitActionLabelAr: '',
    };
  }

  return {
    shouldShowBanner: true,
    bannerTitleEn: `Emulating Organization: ${session.targetOrgName}`,
    bannerTitleAr: `محاكاة المؤسسة: ${session.targetOrgName}`,
    bannerSubtitleEn: `All operations are executed under client tenant scope by ${session.superAdminEmail || 'Super Admin'}.`,
    bannerSubtitleAr: `تتم جميع العمليات ضمن نطاق المؤسسة بواسطة ${session.superAdminEmail || 'المشرف العام'}.`,
    exitActionLabelEn: 'Exit Emulation',
    exitActionLabelAr: 'إنهاء المحاكاة',
  };
}

export interface PlatformHealthMetrics {
  scannerP95LatencyMs: number;
  redisQueueDepth: number;
  apiErrorRatePercent: number;
  activeScannersCount: number;
}

export type PlatformHealthGrade = 'HEALTHY' | 'DEGRADED' | 'CRITICAL';

/**
 * Calculates platform operational health status based on real-time telemetry signals.
 */
export function calculatePlatformHealthStatus(metrics: PlatformHealthMetrics): {
  grade: PlatformHealthGrade;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (metrics.apiErrorRatePercent > 5.0 || metrics.scannerP95LatencyMs > 2000) {
    if (metrics.apiErrorRatePercent > 5.0)
      reasons.push(
        `High API Error Rate (${metrics.apiErrorRatePercent.toFixed(1)}%)`
      );
    if (metrics.scannerP95LatencyMs > 2000)
      reasons.push(`High Scanner Latency (${metrics.scannerP95LatencyMs}ms)`);
    return { grade: 'CRITICAL', reasons };
  }

  if (
    metrics.apiErrorRatePercent > 1.0 ||
    metrics.scannerP95LatencyMs > 800 ||
    metrics.redisQueueDepth > 500
  ) {
    if (metrics.apiErrorRatePercent > 1.0)
      reasons.push(
        `Elevated API Error Rate (${metrics.apiErrorRatePercent.toFixed(1)}%)`
      );
    if (metrics.scannerP95LatencyMs > 800)
      reasons.push(
        `Elevated Scanner Latency (${metrics.scannerP95LatencyMs}ms)`
      );
    if (metrics.redisQueueDepth > 500)
      reasons.push(`Redis Queue Backlog (${metrics.redisQueueDepth} jobs)`);
    return { grade: 'DEGRADED', reasons };
  }

  return {
    grade: 'HEALTHY',
    reasons: ['All telemetry metrics within standard operating bounds.'],
  };
}
