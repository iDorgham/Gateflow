import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import '../globals.css';

export const metadata: Metadata = {
  title: { template: '%s | GateFlow', default: 'GateFlow' },
  description: 'QR Access Control Platform',
  icons: {
    icon: [{ url: '/icon.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icon.png',
  },
};

import { Locale, i18n } from '@/lib/i18n-config';
import { Poppins, Cairo } from 'next/font/google';
import { I18nProvider } from '@/components/i18n-provider';
import { QueryProvider } from '@/components/query-provider';
import { notFound } from 'next/navigation';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});
const cairo = Cairo({
  subsets: ['arabic', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const { children } = props;

  if (!i18n.locales.includes(params.locale)) {
    notFound();
  }
  const isRtl = params.locale === 'ar-EG';
  return (
    <html
      lang={params.locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body
        className={`min-h-dvh bg-background antialiased ${poppins.variable} ${cairo.variable} ${isRtl ? 'font-arabic' : 'font-sans'}`}
        suppressHydrationWarning
      >
        <I18nProvider locale={params.locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
