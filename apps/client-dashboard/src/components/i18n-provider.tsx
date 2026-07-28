'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18n, type Locale } from '@/lib/i18n-config';

// This root layout wraps every route, including the public login page, which
// only needs `common` + `login`. Loading the full en/ar translation trees
// (common, nav, admin, dashboard, login) via a static import forces the
// bundler to parse and evaluate them synchronously as part of every route's
// critical bundle. A dynamic import turns them into a separate chunk fetched
// after mount instead, so pages that don't need admin/dashboard strings don't
// pay to parse them before becoming interactive.
let initPromise: Promise<void> | null = null;

function ensureI18next(): Promise<void> {
  if (!initPromise) {
    initPromise = Promise.all([
      import('@gate-access/i18n/en'),
      import('@gate-access/i18n/ar'),
    ]).then(([enModule, arModule]) => {
      const enTranslations = enModule.default;
      const arTranslations = arModule.default;
      return i18next
        .use(initReactI18next)
        .init({
          resources: {
            en: {
              common: enTranslations.common,
              nav: enTranslations.nav,
              admin: enTranslations.admin,
              dashboard: enTranslations.dashboard,
              login: enTranslations.login,
            },
            'ar-EG': {
              common: arTranslations.common,
              nav: arTranslations.nav,
              admin: arTranslations.admin,
              dashboard: arTranslations.dashboard,
              login: arTranslations.login,
            },
          },
          lng: i18n.defaultLocale,
          fallbackLng: i18n.defaultLocale,
          supportedLngs: i18n.locales,
          ns: ['common', 'nav', 'admin', 'dashboard', 'login'],
          defaultNS: 'common',
          interpolation: {
            escapeValue: false, // react already safes from xss
          },
        })
        .then(() => undefined);
    });
  }
  return initPromise;
}

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureI18next().then(() => {
      if (cancelled) return;
      if (locale && i18next.language !== locale) {
        i18next.changeLanguage(locale);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // Render children without the provider until translations are ready (same
  // fallback this component already did while `mounted` was false) — the
  // dynamic import resolves within a render or two since it's a local chunk.
  if (!ready) return <>{children}</>;

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
