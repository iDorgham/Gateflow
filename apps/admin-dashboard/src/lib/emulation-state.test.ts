import {
  getEmulationBannerData,
  calculatePlatformHealthStatus,
  EmulationSession,
  PlatformHealthMetrics,
} from './emulation-state';

describe('emulation-state', () => {
  describe('getEmulationBannerData', () => {
    it('returns shouldShowBanner: false when emulation is inactive', () => {
      const session: EmulationSession = { isEmulating: false };
      const banner = getEmulationBannerData(session);
      expect(banner.shouldShowBanner).toBe(false);
    });

    it('returns formatted banner details for active emulation session', () => {
      const session: EmulationSession = {
        isEmulating: true,
        targetOrgId: 'org-palm-hills',
        targetOrgName: 'Palm Hills Estate',
        superAdminEmail: 'superadmin@gateflow.site',
      };
      const banner = getEmulationBannerData(session);

      expect(banner.shouldShowBanner).toBe(true);
      expect(banner.bannerTitleEn).toContain('Palm Hills Estate');
      expect(banner.bannerTitleAr).toContain('Palm Hills Estate');
      expect(banner.exitActionLabelEn).toBe('Exit Emulation');
      expect(banner.exitActionLabelAr).toBe('إنهاء المحاكاة');
    });
  });

  describe('calculatePlatformHealthStatus', () => {
    it('grades nominal telemetry metrics as HEALTHY', () => {
      const metrics: PlatformHealthMetrics = {
        scannerP95LatencyMs: 250,
        redisQueueDepth: 12,
        apiErrorRatePercent: 0.05,
        activeScannersCount: 45,
      };
      const status = calculatePlatformHealthStatus(metrics);
      expect(status.grade).toBe('HEALTHY');
      expect(status.reasons).toHaveLength(1);
    });

    it('grades high latency or queue backlog as DEGRADED', () => {
      const metrics: PlatformHealthMetrics = {
        scannerP95LatencyMs: 950,
        redisQueueDepth: 600,
        apiErrorRatePercent: 0.2,
        activeScannersCount: 80,
      };
      const status = calculatePlatformHealthStatus(metrics);
      expect(status.grade).toBe('DEGRADED');
      expect(status.reasons.length).toBeGreaterThanOrEqual(2);
    });

    it('grades excessive error rate or critical latency as CRITICAL', () => {
      const metrics: PlatformHealthMetrics = {
        scannerP95LatencyMs: 2500,
        redisQueueDepth: 1200,
        apiErrorRatePercent: 8.5,
        activeScannersCount: 10,
      };
      const status = calculatePlatformHealthStatus(metrics);
      expect(status.grade).toBe('CRITICAL');
    });
  });
});
