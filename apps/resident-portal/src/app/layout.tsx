import './globals.css';
import { Inter, Cairo } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { PwaBootstrap } from '@/components/pwa/pwa-bootstrap';

export const metadata: Metadata = {
  title: 'GateFlow Resident Portal',
  description: 'Manage your visitor access codes',
  manifest: '/manifest.json',
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
}: {
  children: React.ReactNode;
}) {
  // Portal doesn't seem to have locale in params yet, but let's prepare the classes
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background antialiased ${inter.variable} ${cairo.variable} font-sans`}>
        <PwaBootstrap />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
