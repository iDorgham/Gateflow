'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Zap,
  Shield,
  FileText,
  Building2,
  GraduationCap,
  Calendar,
  Anchor,
  BookOpen,
  HelpCircle,
  Users,
  Briefcase,
  Newspaper,
  Sun,
  Moon,
  CreditCard,
} from 'lucide-react';

// ─── Dropdown definitions ──────────────────────────────────────────────────────

const PRODUCT_ITEMS = [
  { href: '/features', icon: Zap, label: 'Features', desc: 'QR access, offline scanning, analytics' },
  { href: '/pricing', icon: CreditCard, label: 'Pricing', desc: 'Flexible plans for every size' },
  { href: '/#security', icon: Shield, label: 'Security', desc: 'Zero-trust, HMAC-signed QR codes' },
  { href: '/resources#changelog', icon: FileText, label: "What's New", desc: 'Latest updates & releases' },
];

const SOLUTIONS_ITEMS = [
  { href: '/solutions#compounds', icon: Building2, label: 'Compounds', desc: 'Gated residential communities' },
  { href: '/solutions#schools', icon: GraduationCap, label: 'Schools', desc: 'Campus access & parent pickup' },
  { href: '/solutions#events', icon: Calendar, label: 'Events & Venues', desc: 'Ticketed events, concerts' },
  { href: '/solutions#clubs', icon: Anchor, label: 'Clubs & Marinas', desc: 'Member access control' },
];

const RESOURCES_ITEMS = [
  { href: '/blog', icon: BookOpen, label: 'Blog', desc: 'Insights & best practices' },
  { href: '/help', icon: HelpCircle, label: 'Help Center', desc: 'Guides & troubleshooting' },
  { href: '/resources', icon: FileText, label: 'Developer Docs', desc: 'API reference & SDKs' },
];

const COMPANY_ITEMS = [
  { href: '/company#about', icon: Users, label: 'About Us', desc: 'Our mission & team' },
  { href: '/company#careers', icon: Briefcase, label: 'Careers', desc: 'Open positions' },
  { href: '/company#press', icon: Newspaper, label: 'Press', desc: 'Media kit & news' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

interface DropdownItem {
  href: string;
  icon: React.ElementType;
  label: string;
  desc: string;
}

function NavDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">
        {label}
        <ChevronDown
          size={13}
          className="opacity-60 transition-transform duration-200 group-hover:rotate-180"
        />
      </button>

      {/* Dropdown panel — CSS-only, no JS state needed */}
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-all duration-150">
        <div className="w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 shadow-xl">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DarkModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800" />;
  }

  const isDark = resolvedTheme === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// ─── Main Nav ──────────────────────────────────────────────────────────────────

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm'
            : 'border-slate-100 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white shadow-md">
              G
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
              GateFlow
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            <NavDropdown label="Product" items={PRODUCT_ITEMS} />
            <NavDropdown label="Solutions" items={SOLUTIONS_ITEMS} />
            <NavDropdown label="Resources" items={RESOURCES_ITEMS} />
            <NavDropdown label="Company" items={COMPANY_ITEMS} />
            <Link
              href="/pricing"
              className={`text-sm font-semibold transition-colors ${
                pathname === '/pricing'
                  ? 'text-indigo-700 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400'
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'}/login`}
              className="hidden lg:block px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/contact"
              className="hidden lg:block rounded-lg bg-indigo-700 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-600/20"
            >
              Get Started
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-700 text-xs font-bold text-white">
                  G
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white uppercase">GateFlow</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer links */}
            <div className="flex-1 p-4 space-y-1">
              {[
                { label: 'Home', href: '/' },
                { label: 'Features', href: '/features' },
                { label: 'Solutions', href: '/solutions' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Blog', href: '/blog' },
                { label: 'Help Center', href: '/help' },
                { label: 'About', href: '/company' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === item.href
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Drawer CTA */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'}/login`}
                className="block w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="block w-full text-center py-2.5 rounded-xl bg-indigo-700 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
