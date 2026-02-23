import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

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

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white shadow-md">
            G
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">GateFlow</span>
        </Link>

        {/* Links */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/#features"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Product <span className="text-[10px] text-slate-400 font-normal ml-0.5 align-middle">▼</span>
          </Link>
          <Link
            href="/#use-cases"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Template <span className="text-[10px] text-slate-400 font-normal ml-0.5 align-middle">▼</span>
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-5">
          <Link
            href="http://localhost:3001/login"
            className="hidden text-sm font-semibold text-slate-600 hover:text-indigo-700 md:block transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/contact"
            className="rounded-lg bg-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all"
          >
            Start Free
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 text-slate-600 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20 relative">
        {/* Subtle background element */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
        </div>
        
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          {/* Brand */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white shadow-md">
                G
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">GateFlow</span>
            </div>
            <p className="mt-5 text-sm font-medium leading-relaxed text-slate-500">
              End-to-end access and security management in a single solution. Meet the right platform to help realize your community's safety.
            </p>
            <div className="mt-6 flex gap-3">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold shadow-sm text-slate-700">🇪🇬 Egypt</span>
              <span className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold shadow-sm text-slate-700">🇦🇪 Gulf</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Product</p>
            <ul className="mt-6 space-y-3.5">
              {[
                { label: 'Features', href: '/#features' },
                { label: 'Use Cases', href: '/#use-cases' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Security', href: '/#security' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm font-medium hover:text-indigo-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Company</p>
            <ul className="mt-6 space-y-3.5">
              {[
                { label: 'About Us', href: '/contact' },
                { label: 'Contact Sales', href: '/contact' },
                { label: 'Request Demo', href: '/contact' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-medium hover:text-indigo-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Get in Touch</p>
            <ul className="mt-6 space-y-3.5 text-sm font-medium">
              <li className="flex items-center gap-2"><span className="text-indigo-400">📧</span> hello@gateflow.io</li>
              <li className="flex items-center gap-2"><span className="text-indigo-400">📞</span> +20 100 000 0000</li>
              <li className="flex items-center gap-2"><span className="text-indigo-400">📍</span> Cairo, Egypt</li>
              <li className="pt-2">
                <a
                  href="https://wa.me/201000000000"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366]/10 px-4 py-2 text-sm font-bold text-[#1DA851] hover:bg-[#25D366]/20 transition-colors"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row text-sm font-medium">
          <p className="text-slate-500">&copy; {new Date().getFullYear()} GateFlow Technologies Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
