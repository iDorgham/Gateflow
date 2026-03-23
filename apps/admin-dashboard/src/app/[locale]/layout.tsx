import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
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
    icon: '/icon.png',
  },
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ 
  subsets: ['arabic', 'latin-ext'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap'
});

export default async function RootLayout(
  props: { 
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  const locale = params.locale as Locale;

  if (!i18n.locales.includes(locale)) {
    notFound();
  }

  const rtl = isRtl(locale);

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={`bg-background text-foreground antialiased ${inter.variable} ${cairo.variable} ${rtl ? 'font-arabic' : 'font-sans'}`}>
        <I18nProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {props.children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
