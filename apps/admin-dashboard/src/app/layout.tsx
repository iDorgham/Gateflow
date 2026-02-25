import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter, Cairo } from 'next/font/google';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { Locale, isRtl } from '@/lib/i18n/i18n-config';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'GateFlow Admin', template: '%s | GateFlow Admin' },
  description: 'Super-admin management dashboard',
};

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
  const rtl = isRtl(params.locale);

  return (
    <html lang={params.locale} dir={rtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`bg-background text-foreground antialiased ${inter.variable} ${cairo.variable} ${rtl ? 'font-arabic' : 'font-sans'}`}>
        <I18nProvider locale={params.locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
