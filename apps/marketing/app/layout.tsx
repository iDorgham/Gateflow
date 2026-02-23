import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Nav } from '../components/nav';
import { Footer } from '../components/footer';
import { CookieBanner } from '../components/cookie-banner';
import { ChatWidget } from '../components/chat-widget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'GateFlow — Smart QR Access Control for Egypt & Gulf',
    template: '%s | GateFlow',
  },
  description:
    'Modern QR-based access control for gated compounds, schools, events, and clubs across Egypt and the Gulf. Real-time monitoring, offline scanning, and full audit logs.',
  openGraph: {
    type: 'website',
    siteName: 'GateFlow',
    title: 'GateFlow — Smart QR Access Control',
    description:
      'Modern QR-based access control for gated compounds, schools, events, and clubs across Egypt and the Gulf.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GateFlow — Smart QR Access Control',
    description:
      'Modern QR-based access control for gated compounds, schools, events, and clubs across Egypt and the Gulf.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100`}
      >
        <Providers>
          <Nav />
          {children}
          <Footer />
          <CookieBanner />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
