import type { Metadata, Viewport } from 'next';
import { ThemeProvider, ThemeScript } from '@gateflow/theme';
import { Inter, Cairo } from 'next/font/google';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { Locale, i18n, isRtl } from '@/lib/i18n/i18n-config';
import { Toaster } from 'sonner';
import { notFound } from 'next/navigation';
import '../globals.css';

export const metadata: Metadata = {
  title: { default: 'GateFlow Admin', template: '%s | GateFlow Admin' },
  description: 'Super-admin management dashboard',
  icons: {
    icon: [{ url: '/icon', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icon',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#091e42' },
    { media: '(prefers-color-scheme: light)', color: '#0c66e4' },
  ],
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'ui-sans-serif', 'sans-serif'],
  adjustFontFallback: true,
});

const cairo = Cairo({
  subsets: ['arabic', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'ui-sans-serif', 'sans-serif'],
  adjustFontFallback: true,
});

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale = params.locale as Locale;

  if (!i18n.locales.includes(locale)) {
    notFound();
  }

  const rtl = isRtl(locale);

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'} data-density="compact" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`bg-background text-foreground antialiased ${inter.variable} ${cairo.variable} ${rtl ? 'font-arabic' : 'font-sans'}`}
      >
        <I18nProvider locale={locale}>
          <ThemeProvider>
            {props.children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
