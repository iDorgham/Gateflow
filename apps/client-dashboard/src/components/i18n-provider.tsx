'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18n, type Locale } from '@/lib/i18n-config';

// Pre-define translations for the client bundle. Only importing what's needed.
const translations = {
  en: { 
    common: require('@gate-access/i18n/en').common,
    nav: require('@gate-access/i18n/en').nav,
    admin: require('@gate-access/i18n/en').admin,
    dashboard: require('@gate-access/i18n/en').dashboard,
  },
  'ar-EG': { 
    common: require('@gate-access/i18n/ar').common,
    nav: require('@gate-access/i18n/ar').nav,
    admin: require('@gate-access/i18n/ar').admin,
    dashboard: require('@gate-access/i18n/ar').dashboard,
  },
};

i18next
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: i18n.defaultLocale,
    fallbackLng: i18n.defaultLocale,
    supportedLngs: i18n.locales,
    ns: ['common', 'nav', 'admin', 'dashboard'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export function I18nProvider({ 
  children, 
  locale 
}: { 
  children: React.ReactNode; 
  locale: Locale;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (locale && i18next.language !== locale) {
      i18next.changeLanguage(locale);
    }
    setMounted(true);
  }, [locale]);

  // Prevent hydration mismatch by rendering only after mounting hook syncs language
  if (!mounted) return <>{children}</>;

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
