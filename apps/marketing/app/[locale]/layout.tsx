import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import '../globals.css';
import { Providers } from '../providers';
import { Nav } from '../../components/nav';
import { Footer } from '../../components/footer';
import { CookieBanner } from '../../components/cookie-banner';
import { ChatWidget } from '../../components/chat-widget';
import { i18n, type Locale } from '../../i18n-config';
import { fetchTranslations } from '../../lib/i18n/get-translation';
import { I18nProvider } from '../../hooks/use-translation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ 
  subsets: ['arabic', 'latin-ext'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap'
});

import { OrganizationJsonLd } from '../../components/json-ld';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gateflow.io';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'GateFlow — Smart QR Access Control for Egypt & Gulf',
    template: '%s | GateFlow',
  },
  description:
    'Modern QR-based access control for gated communities, schools, events, and clubs across Egypt and the Gulf. Real-time monitoring, offline scanning, and full audit logs.',
  keywords: ['access control', 'QR security', 'gated community', 'Egypt tech', 'Gulf security', 'visitor management'],
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
      'en-US': '/en',
      'ar-EG': '/ar-EG',
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

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const isRtl = params.locale === 'ar-EG';

  // Pre-load common dictionaries for the global layout and Nav/Footer
  const commonDict = await fetchTranslations(params.locale, 'common');
  const navDict = await fetchTranslations(params.locale, 'navigation');
  const cookiesDict = await fetchTranslations(params.locale, 'cookies');
  const formsDict = await fetchTranslations(params.locale, 'forms');
  const componentsDict = await fetchTranslations(params.locale, 'components');
  
  const dictionaries = {
    common: commonDict,
    navigation: navDict,
    cookies: cookiesDict,
    forms: formsDict,
    components: componentsDict
  };

  return (
    <html lang={params.locale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <OrganizationJsonLd locale={params.locale} />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} ${isRtl ? 'font-arabic' : 'font-sans'} antialiased selection:bg-primary/10 selection:text-primary transition-colors duration-300`}
      >
        <I18nProvider locale={params.locale} dictionaries={dictionaries}>
          <Providers>
          <Nav locale={params.locale} />
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
          <Footer locale={params.locale} />
          <CookieBanner />
          <ChatWidget />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
