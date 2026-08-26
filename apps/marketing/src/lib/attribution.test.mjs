import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseUtmParams,
  aggregateAttributionTelemetry,
} from './attribution.ts';

describe('attribution (node:test)', () => {
  describe('parseUtmParams', () => {
    it('parses explicit UTM parameters from query string', () => {
      const query =
        '?utm_source=google_ads&utm_medium=cpc&utm_campaign=compound_security_2026&utm_content=hero_banner';
      const now = 1700000000000;
      const attr = parseUtmParams(query, 'https://google.com', now);

      assert.equal(attr.utmSource, 'google_ads');
      assert.equal(attr.utmMedium, 'cpc');
      assert.equal(attr.utmCampaign, 'compound_security_2026');
      assert.equal(attr.utmContent, 'hero_banner');
      assert.equal(attr.referrer, 'https://google.com');
      assert.equal(attr.firstSeenAt, new Date(now).toISOString());
    });

    it('falls back to referrer domain or direct when no query parameters are present', () => {
      const attrWithRef = parseUtmParams('', 'https://linkedin.com/feed');
      assert.equal(attrWithRef.utmSource, 'linkedin.com');
      assert.equal(attrWithRef.utmMedium, 'organic');

      const attrDirect = parseUtmParams('', '');
      assert.equal(attrDirect.utmSource, 'direct');
      assert.equal(attrDirect.utmMedium, 'organic');
    });
  });

  describe('aggregateAttributionTelemetry', () => {
    it('aggregates multi-stage conversion events correctly', () => {
      const events = [
        {
          id: '1',
          type: 'PASS_SIMULATED',
          utmSource: 'google',
          utmCampaign: 'c1',
          timestamp: '',
        },
        {
          id: '2',
          type: 'PASS_SIMULATED',
          utmSource: 'google',
          utmCampaign: 'c1',
          timestamp: '',
        },
        {
          id: '3',
          type: 'LEAD_SUBMITTED',
          utmSource: 'google',
          utmCampaign: 'c1',
          timestamp: '',
        },
        {
          id: '4',
          type: 'LEAD_SUBMITTED',
          utmSource: 'linkedin',
          utmCampaign: 'c2',
          timestamp: '',
        },
        {
          id: '5',
          type: 'FIRST_GATE_SCAN',
          utmSource: 'google',
          utmCampaign: 'c1',
          timestamp: '',
        },
      ];

      const summary = aggregateAttributionTelemetry(events);

      assert.equal(summary.totalLeads, 2);
      assert.equal(summary.bySource['google'], 4);
      assert.equal(summary.bySource['linkedin'], 1);
      assert.equal(summary.byCampaign['c1'], 4);
      assert.equal(summary.conversionRateByStage.passSimulatedCount, 2);
      assert.equal(summary.conversionRateByStage.leadsSubmittedCount, 2);
      assert.equal(summary.conversionRateByStage.firstScanCount, 1);
    });
  });
});
