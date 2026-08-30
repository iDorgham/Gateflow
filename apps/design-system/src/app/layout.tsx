import * as React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider, ThemeScript } from '@gateflow/theme';
import { ToastProvider } from '@gateflow/ui';
import { cn } from '@gateflow/ui/utils';

export const metadata: Metadata = {
  metadataBase: new URL('https://design.gateflow.site'),
  title: {
    default: 'GateFlow Design System',
    template: '%s | GateFlow Design System',
  },
  description:
    'The authoritative documentation for the GateFlow design system. Primitives, patterns, and agentic AI components.',
  openGraph: {
    title: 'GateFlow Design System',
    description: 'Universal building blocks for the MENA COMPOUND sector.',
    url: 'https://design.gateflow.site',
    siteName: 'GateFlow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GateFlow Design System',
    description:
      'Premium UI primitives and AI patterns for intelligent compound management.',
  },
  alternates: {
    canonical: 'https://design.gateflow.site',
  },
  icons: {
    icon: [{ url: '/icon', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icon',
  },
};

import { Inter, Cairo } from 'next/font/google';
import { LocaleProvider } from '../components/providers/LocaleProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'ui-sans-serif', 'sans-serif'],
  adjustFontFallback: true,
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('overflow-x-hidden', inter.variable, cairo.variable)}
    >
      <head>
        <ThemeScript />
      </head>
      <body
        className="min-h-screen font-sans antialiased bg-background text-foreground"
      >
        <LocaleProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
