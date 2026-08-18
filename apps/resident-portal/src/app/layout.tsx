import './globals.css';
import { Inter, Cairo } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider, ThemeScript } from '@gateflow/theme';
import { PwaBootstrap } from '@/components/pwa/pwa-bootstrap';
import { resolveHtmlDocumentAttrs } from '@/lib/portal-i18n';

export const metadata: Metadata = {
  title: 'GateFlow Resident Portal',
  description: 'Manage your visitor access codes and gate entry',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icon',
  },
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({
  subsets: ['arabic', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Phase 09: interim EN-only — explicit lang/dir; AR/RTL deferred (portal-i18n).
  const { lang, dir } = resolveHtmlDocumentAttrs();

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`min-h-screen bg-background antialiased ${inter.variable} ${cairo.variable} font-sans`}
      >
        <ThemeProvider>
          <PwaBootstrap />
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
