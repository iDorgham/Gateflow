import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import '../globals.css';
import { Providers } from '../providers';
import { Nav } from '../../components/nav';
import { Footer } from '../../components/footer';
import { i18n, type Locale } from '../../i18n-config';
import { fetchTranslations } from '../../lib/i18n/get-translation';
import { I18nProvider } from '../../hooks/use-translation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const cairo = Cairo({
  subsets: ['arabic', 'latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

import { OrganizationJsonLd, WebSiteJsonLd } from '../../components/json-ld';
import { MarketingScripts } from '../../src/components/MarketingScripts';
import { ThemeScript } from '@gateflow/theme';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gateflow.site';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'GateFlow — Smart QR Access Control for Egypt & Gulf',
    template: '%s | GateFlow',
  },
  description:
    'Modern QR-based access control for gated communities, schools, events, and clubs across Egypt and the Gulf. Real-time monitoring, offline scanning, and full audit logs.',
  keywords: [
    'access control',
    'QR security',
    'gated community',
    'Egypt tech',
    'Gulf security',
    'visitor management',
  ],
  authors: [{ name: 'GateFlow Team' }],
  creator: 'GateFlow',
  publisher: 'GateFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'GateFlow',
    locale: 'en_US',
    url: BASE_URL,
    images: [
      {
        url: '/icons/logo-mark.png',
        width: 1024,
        height: 1024,
        alt: 'GateFlow Security Platform',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'GateFlow — Smart QR Access Control',
    description: 'Modern QR-based access control for the MENA region.',
    images: ['/icons/logo-mark.png'],
    creator: '@gateflow',
  },
  alternates: {
    canonical: '/',
    languages: {
      en: `${BASE_URL}/en`,
      ar: `${BASE_URL}/ar-EG`,
      'x-default': `${BASE_URL}/en`,
    },
  },
  icons: {
    icon: '/icons/logo-mark.png',
    apple: '/icons/logo-mark.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClientWidgets } from '../../components/client-widgets';

/**
 * Renders the localized application layout with navigation, content, footer, providers, and site-wide integrations.
 *
 * @param props - The layout content and route parameters containing the locale.
 * @returns The localized root layout.
 */
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const castLocale = locale as Locale;
  const { children } = props;
  const isRtl = castLocale === 'ar-EG';

  // Pre-load common dictionaries concurrently for global layout and Nav/Footer
  const [
    commonDict,
    navDict,
    cookiesDict,
    formsDict,
    componentsDict,
    landingDict,
  ] = await Promise.all([
    fetchTranslations(castLocale, 'common'),
    fetchTranslations(castLocale, 'navigation'),
    fetchTranslations(castLocale, 'cookies'),
    fetchTranslations(castLocale, 'forms'),
    fetchTranslations(castLocale, 'components'),
    fetchTranslations(castLocale, 'landing'),
  ]);

  const dictionaries = {
    common: commonDict,
    navigation: navDict,
    cookies: cookiesDict,
    forms: formsDict,
    components: componentsDict,
    landing: landingDict,
  };

  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <ThemeScript />
        {ga4MeasurementId && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
          </>
        )}
        {metaPixelId && (
          <link rel="preconnect" href="https://connect.facebook.net" />
        )}
        <OrganizationJsonLd locale={castLocale} />
        <WebSiteJsonLd locale={castLocale} />
        <meta name="theme-color" content="var(--ds-primary-accent)" />
        <link rel="manifest" href="/manifest.json" />
        <MarketingScripts
          metaPixelId={metaPixelId}
          ga4MeasurementId={ga4MeasurementId}
        />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} ${
          isRtl ? 'font-arabic' : 'font-sans'
        } antialiased selection:bg-primary/10 selection:text-primary transition-colors duration-300`}
      >
        <I18nProvider locale={castLocale} dictionaries={dictionaries}>
          <Providers>
            <Nav locale={castLocale} />
            <main className="relative flex min-h-dvh flex-col">{children}</main>
            <Footer locale={castLocale} />
            <ClientWidgets />
            <Analytics />
            <SpeedInsights />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
