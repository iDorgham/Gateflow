import { auditAttributionConfig } from './route';

describe('auditAttributionConfig()', () => {
  describe('all pixels configured correctly', () => {
    const report = auditAttributionConfig({
      gtmContainerId: 'GTM-ABCD123',
      ga4MeasurementId: 'G-ABCDEF1234',
      metaPixelId: '1234567890123',
      posthogApiKey: 'phc_testkey12345',
    });

    it('returns overallScore of 100', () => {
      expect(report.overallScore).toBe(100);
    });

    it('marks all probes as detected', () => {
      for (const probe of report.probes) {
        expect(probe.detected).toBe(true);
      }
    });

    it('has no issues on any probe', () => {
      for (const probe of report.probes) {
        expect(probe.issues).toHaveLength(0);
      }
    });

    it('summary indicates all configured', () => {
      expect(report.summary).toContain('correctly');
    });
  });

  describe('all pixels missing', () => {
    const report = auditAttributionConfig({});

    it('overallScore is between 0 and 50 (PostHog partial credit)', () => {
      expect(report.overallScore).toBeLessThan(60);
    });

    it('all required probes have issues', () => {
      const gtm = report.probes.find((p) => p.provider === 'GTM')!;
      const ga4 = report.probes.find((p) => p.provider === 'GA4')!;
      const meta = report.probes.find((p) => p.provider === 'META_PIXEL')!;
      expect(gtm.issues.length).toBeGreaterThan(0);
      expect(ga4.issues.length).toBeGreaterThan(0);
      expect(meta.issues.length).toBeGreaterThan(0);
    });

    it('recommendations include all missing pixels', () => {
      const text = report.recommendations.join(' ');
      expect(text).toMatch(/GTM/);
      expect(text).toMatch(/GA4/);
      expect(text).toMatch(/Meta Pixel/);
    });
  });

  describe('invalid ID formats', () => {
    it('flags invalid GTM container ID format', () => {
      const report = auditAttributionConfig({ gtmContainerId: 'INVALID-123' });
      const gtm = report.probes.find((p) => p.provider === 'GTM')!;
      expect(gtm.score).toBe(0);
      expect(gtm.issues[0]).toMatch(/Invalid GTM Container ID format/);
    });

    it('flags invalid GA4 measurement ID format', () => {
      const report = auditAttributionConfig({
        ga4MeasurementId: 'UA-12345678-1',
      });
      const ga4 = report.probes.find((p) => p.provider === 'GA4')!;
      expect(ga4.score).toBe(0);
      expect(ga4.issues[0]).toMatch(/Invalid GA4 Measurement ID format/);
    });

    it('flags invalid Meta Pixel ID (non-numeric)', () => {
      const report = auditAttributionConfig({ metaPixelId: 'abc123' });
      const meta = report.probes.find((p) => p.provider === 'META_PIXEL')!;
      expect(meta.score).toBe(0);
      expect(meta.issues[0]).toMatch(/Invalid Meta Pixel ID format/);
    });

    it('flags PostHog key with wrong prefix', () => {
      const report = auditAttributionConfig({
        posthogApiKey: 'pk_wrong_prefix',
      });
      const ph = report.probes.find((p) => p.provider === 'POSTHOG')!;
      expect(ph.issues[0]).toMatch(/phc_/);
    });
  });

  describe('valid GTM formats', () => {
    it('accepts GTM-ABCD1234', () => {
      const report = auditAttributionConfig({ gtmContainerId: 'GTM-ABCD1234' });
      const gtm = report.probes.find((p) => p.provider === 'GTM')!;
      expect(gtm.score).toBe(100);
      expect(gtm.issues).toHaveLength(0);
    });

    it('accepts G-XXXXXXX for GA4', () => {
      const report = auditAttributionConfig({
        ga4MeasurementId: 'G-TESTKEY99',
      });
      const ga4 = report.probes.find((p) => p.provider === 'GA4')!;
      expect(ga4.score).toBe(100);
    });

    it('accepts 15-digit Meta Pixel ID', () => {
      const report = auditAttributionConfig({ metaPixelId: '987654321098765' });
      const meta = report.probes.find((p) => p.provider === 'META_PIXEL')!;
      expect(meta.score).toBe(100);
    });
  });

  describe('report structure', () => {
    it('always returns 4 probes (GTM, GA4, META_PIXEL, POSTHOG)', () => {
      const report = auditAttributionConfig({});
      expect(report.probes).toHaveLength(4);
      const providers = report.probes.map((p) => p.provider);
      expect(providers).toContain('GTM');
      expect(providers).toContain('GA4');
      expect(providers).toContain('META_PIXEL');
      expect(providers).toContain('POSTHOG');
    });

    it('auditedAt is a valid ISO timestamp', () => {
      const report = auditAttributionConfig({});
      expect(() => new Date(report.auditedAt)).not.toThrow();
      expect(new Date(report.auditedAt).getTime()).not.toBeNaN();
    });

    it('overallScore is between 0 and 100', () => {
      const report = auditAttributionConfig({});
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.overallScore).toBeLessThanOrEqual(100);
    });
  });
});
