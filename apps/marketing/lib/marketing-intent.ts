'use client';

export const MARKETING_EVENT_VERSION = 'v1';

export type MarketingIntent = 'demo' | 'pilot' | 'migration' | 'consult';
export type FunnelStage =
  | 'landing'
  | 'cta_click'
  | 'lead_submit'
  | 'qualified'
  | 'first_scan';

type UTMEnvelope = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

export type MarketingEventPayload = {
  eventVersion: string;
  eventId: string;
  occurredAt: string;
  intent: MarketingIntent;
  locale: 'en' | 'ar-EG';
  surface: string;
  funnelStage: FunnelStage;
  organizationId: string | null;
  leadId: string | null;
  scanId: string | null;
  utm: UTMEnvelope;
};

const EVENT_ENDPOINT = '/api/marketing/intent-event';

function generateEventId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getUtmFromSearchParams(
  searchParams: URLSearchParams
): UTMEnvelope {
  return {
    source: searchParams.get('utm_source') ?? undefined,
    medium: searchParams.get('utm_medium') ?? undefined,
    campaign: searchParams.get('utm_campaign') ?? undefined,
    content: searchParams.get('utm_content') ?? undefined,
    term: searchParams.get('utm_term') ?? undefined,
  };
}

export function buildMarketingEvent(
  input: Pick<
    MarketingEventPayload,
    'intent' | 'locale' | 'surface' | 'funnelStage'
  > & {
    utm?: UTMEnvelope;
  }
): MarketingEventPayload {
  return {
    eventVersion: MARKETING_EVENT_VERSION,
    eventId: generateEventId(),
    occurredAt: new Date().toISOString(),
    intent: input.intent,
    locale: input.locale,
    surface: input.surface,
    funnelStage: input.funnelStage,
    organizationId: null,
    leadId: null,
    scanId: null,
    utm: input.utm ?? {},
  };
}

export function emitMarketingEvent(payload: MarketingEventPayload): void {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify({
    eventName:
      payload.funnelStage === 'landing'
        ? 'mkt_funnel_stage_progressed'
        : 'mkt_intent_cta_clicked',
    payload,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(EVENT_ENDPOINT, blob);
  } else {
    void fetch(EVENT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  }

  const analyticsPayload = {
    ...payload,
    utm_source: payload.utm.source,
    utm_medium: payload.utm.medium,
    utm_campaign: payload.utm.campaign,
    utm_content: payload.utm.content,
    utm_term: payload.utm.term,
  };

  const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push({
      event: 'mkt_intent_event',
      eventName:
        payload.funnelStage === 'landing'
          ? 'mkt_funnel_stage_progressed'
          : 'mkt_intent_cta_clicked',
      ...analyticsPayload,
    });
  }

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag === 'function') {
    gtag('event', 'mkt_intent_event', analyticsPayload);
  }
}
