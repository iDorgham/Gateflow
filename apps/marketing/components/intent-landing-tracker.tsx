'use client';

import { useEffect } from 'react';
import {
  buildMarketingEvent,
  emitMarketingEvent,
  type MarketingIntent,
  getUtmFromSearchParams,
} from '../lib/marketing-intent';
import type { Locale } from '../i18n-config';

type IntentLandingTrackerProps = {
  locale: Locale;
  surface: string;
  intent: MarketingIntent;
};

export function IntentLandingTracker({
  locale,
  surface,
  intent,
}: IntentLandingTrackerProps) {
  useEffect(() => {
    const payload = buildMarketingEvent({
      intent,
      locale,
      surface,
      funnelStage: 'landing',
      utm: getUtmFromSearchParams(new URLSearchParams(window.location.search)),
    });

    emitMarketingEvent(payload);
  }, [intent, locale, surface]);

  return null;
}
