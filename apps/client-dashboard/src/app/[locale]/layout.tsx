import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import '../globals.css';

export const metadata: Metadata = {
  title: { template: '%s | GateFlow', default: 'GateFlow' },
  description: 'QR Access Control Platform',
};

import { Locale, i18n } from '@/lib/i18n-config';
import { Inter, Cairo } from 'next/font/google';
import { I18nProvider } from '@/components/i18n-provider';
import { QueryProvider } from '@/components/query-provider';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ 
  subsets: ['arabic', 'latin-ext'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap'
});

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!i18n.locales.includes(params.locale)) {
    notFound();
  }
  const isRtl = params.locale === 'ar-EG';
  return (
    <html lang={params.locale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`min-h-screen bg-background antialiased ${inter.variable} ${cairo.variable} ${isRtl ? 'font-arabic' : 'font-sans'}`}>
        <I18nProvider locale={params.locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
