'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Locale } from '../i18n-config';
import {
  buildMarketingEvent,
  emitMarketingEvent,
  getUtmFromSearchParams,
  type MarketingIntent,
} from '../lib/marketing-intent';

interface IntentLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  locale: Locale;
  intent: MarketingIntent;
  surface: string;
}

export function IntentLink({
  locale,
  href,
  intent,
  surface,
  onClick,
  children,
  ...props
}: IntentLinkProps) {
  const path = href.toString();
  const localizedHref = path.startsWith('/')
    ? `/${locale}${path === '/' ? '' : path}`
    : path;

  const finalHref = React.useMemo(() => {
    if (!localizedHref.startsWith('/')) return localizedHref;

    const url = new URL(localizedHref, 'https://gateflow.local');
    if (!url.searchParams.has('intent')) {
      url.searchParams.set('intent', intent);
    }
    if (!url.searchParams.has('surface')) {
      url.searchParams.set('surface', surface);
    }
    return `${url.pathname}${url.search}`;
  }, [intent, localizedHref, surface]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const payload = buildMarketingEvent({
        intent,
        locale,
        surface,
        funnelStage: 'cta_click',
        utm: getUtmFromSearchParams(
          new URLSearchParams(window.location.search)
        ),
      });

      emitMarketingEvent(payload);
    },
    [intent, locale, onClick, surface]
  );

  return (
    <Link href={finalHref} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
