/**
 * UTM Campaign Attribution & Closed-Loop Telemetry Aggregator.
 */

export interface UtmAttribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm?: string;
  utmContent?: string;
  referrer: string;
  firstSeenAt: string;
}

export type FunnelEventType =
  | 'PAGE_VIEW'
  | 'PASS_SIMULATED'
  | 'ROI_CALCULATED'
  | 'LEAD_SUBMITTED'
  | 'DEMO_BOOKED'
  | 'ORG_ACTIVATED'
  | 'FIRST_GATE_SCAN';

export interface TelemetryEvent {
  id: string;
  type: FunnelEventType;
  utmSource: string;
  utmCampaign: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export const DEFAULT_ATTRIBUTION: UtmAttribution = {
  utmSource: 'direct',
  utmMedium: 'none',
  utmCampaign: 'none',
  referrer: 'direct',
  firstSeenAt: new Date(0).toISOString(),
};

/**
 * Extracts UTM query parameters and referrer information from URL strings.
 */
export function parseUtmParams(
  queryString: string,
  referrer: string = '',
  now: number = Date.now()
): UtmAttribution {
  const params = new URLSearchParams(
    queryString.startsWith('?') ? queryString.slice(1) : queryString
  );

  const utmSource =
    params.get('utm_source') ||
    (referrer ? new URL(referrer, 'https://dummy.com').hostname : 'direct');
  const utmMedium =
    params.get('utm_medium') || (params.get('utm_source') ? 'cpc' : 'organic');
  const utmCampaign = params.get('utm_campaign') || 'brand_direct';
  const utmTerm = params.get('utm_term') || undefined;
  const utmContent = params.get('utm_content') || undefined;

  return {
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    referrer: referrer || 'direct',
    firstSeenAt: new Date(now).toISOString(),
  };
}

export interface AttributionSummary {
  totalLeads: number;
  bySource: Record<string, number>;
  byCampaign: Record<string, number>;
  conversionRateByStage: {
    passSimulatedCount: number;
    leadsSubmittedCount: number;
    firstScanCount: number;
  };
}

/**
 * Aggregates raw telemetry events into structured conversion performance metrics.
 */
export function aggregateAttributionTelemetry(
  events: TelemetryEvent[]
): AttributionSummary {
  const bySource: Record<string, number> = {};
  const byCampaign: Record<string, number> = {};
  let totalLeads = 0;
  let passSimulatedCount = 0;
  let leadsSubmittedCount = 0;
  let firstScanCount = 0;

  for (const ev of events) {
    bySource[ev.utmSource] = (bySource[ev.utmSource] || 0) + 1;
    byCampaign[ev.utmCampaign] = (byCampaign[ev.utmCampaign] || 0) + 1;

    if (ev.type === 'PASS_SIMULATED') passSimulatedCount += 1;
    if (ev.type === 'LEAD_SUBMITTED') {
      leadsSubmittedCount += 1;
      totalLeads += 1;
    }
    if (ev.type === 'FIRST_GATE_SCAN') firstScanCount += 1;
  }

  return {
    totalLeads,
    bySource,
    byCampaign,
    conversionRateByStage: {
      passSimulatedCount,
      leadsSubmittedCount,
      firstScanCount,
    },
  };
}
