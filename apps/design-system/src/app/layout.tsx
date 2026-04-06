import * as React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@gateflow/theme';
import { cn } from '@gateflow/ui/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

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
};

import { LocaleProvider } from '../components/providers/LocaleProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={cn(
          'min-h-screen font-sans antialiased bg-background text-foreground',
          inter.variable
        )}
      >
        <LocaleProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
