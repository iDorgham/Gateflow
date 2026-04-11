'use client';

import * as React from 'react';
import { translations } from '../../lib/translations';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Library,
  Layers,
  Palette,
  Accessibility,
  Package,
  BookOpen,
  History,
  Menu,
  Moon,
  Sun,
  Laptop,
  Globe,
  Layout,
} from 'lucide-react';
import { useLocale } from '../../components/providers/LocaleProvider';
import { Search } from '../../components/navigation/Search';
import { motion, AnimatePresence } from 'framer-motion';

import {
  cn,
  Button,
  ScrollArea,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@gateflow/ui';
import { GateFlowLogo } from '../../../../../packages/ui/src/components/ui/gateflow-logo';
import { useGateFlowColorMode } from '@gateflow/theme';

const sidebarItems = (t: Record<string, string>) => [
  {
    label: t.foundations,
    href: '/foundations',
    icon: Library,
    subItems: [
      { label: t.foundations, href: '/foundations' },
      { label: t.color, href: '/foundations/color' },
      { label: t.typography, href: '/foundations/typography' },
      { label: t.iconography, href: '/foundations/iconography' },
      { label: t.spacing, href: '/foundations/spacing' },
      { label: t.layering, href: '/foundations/layering' },
      { label: t.motion, href: '/foundations/motion' },
      { label: t.tokenMaster, href: '/foundations/tokens-system' },
    ],
  },
  { label: t.tokens, href: '/tokens', icon: Palette },
  {
    label: t.patterns,
    href: '/patterns',
    icon: Layout,
    subItems: [
      { label: t.aiUi, href: '/patterns/ai-ui' },
      { label: t.analytics, href: '/patterns/analytics' },
      { label: t.forms, href: '/patterns/forms' },
      { label: t.complexUi, href: '/patterns/complex-ui' },
      { label: t.authBranding, href: '/patterns/auth-branding' },
      { label: t.calendar, href: '/patterns/calendar' },
    ],
  },

  { label: t.accessibility, href: '/accessibility', icon: Accessibility },
  {
    label: t.components,
    href: '/components',
    icon: Layers,
    subItems: [
      { label: t.primitives, href: '/components/primitives' },
      { label: t.patterns, href: '/components/patterns' },
      { label: t.aiUi, href: '/components/ai' },
    ],
  },
  { label: t.packages, href: '/packages', icon: Package },
  { label: t.guidelines, href: '/guidelines', icon: BookOpen },
  { label: t.changelog, href: '/changelog', icon: History },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme: colorMode, setTheme: setColorMode } = useGateFlowColorMode();
  const { locale, setLocale, isRTL } = useLocale();
  const t = translations[locale as keyof typeof translations];
  const items = sidebarItems(t.sidebar);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col bg-background selection:bg-[var(--ds-background-brand-bold)] selection:text-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gf-surface-mesh)] opacity-[0.4] dark:opacity-[0.2]" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'var(--gf-pattern-sentinel)',
            backgroundSize: 'var(--gf-pattern-size)',
          }}
        />
        <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] bg-[var(--ds-background-brand-bold)]/5 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[40%] -left-[5%] h-[400px] w-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse duration-[8s]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--ds-border-subtle)] bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
            </Button>
            <Link
              href="/"
              className="flex items-center gap-2 group"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <GateFlowLogo size={32} />
              <span className="hidden font-semibold tracking-tighter text-lg md:inline-block text-ds-text-subtle/60 ms-[-4px]">
                Design
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="flex-1 max-w-sm hidden md:block">
              <Search />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                >
                  <Globe size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  onClick={() => setLocale('en')}
                  className={cn(
                    locale === 'en' &&
                      'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                  )}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocale('ar')}
                  className={cn(
                    locale === 'ar' &&
                      'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] text-right'
                  )}
                >
                  العربية (Arabic)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                >
                  {!mounted ? null : colorMode === 'dark' ? (
                    <Moon size={18} />
                  ) : colorMode === 'light' ? (
                    <Sun size={18} />
                  ) : (
                    <Laptop size={18} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setColorMode('light')}>
                  <Sun size={14} className="mr-2" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorMode('dark')}>
                  <Moon size={14} className="mr-2" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorMode('system')}>
                  <Laptop size={14} className="mr-2" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 z-40 w-64 border-e border-[var(--ds-border-subtle)] bg-background transition-transform duration-200 ease-in-out md:sticky md:block',
            isRTL ? 'right-0' : 'left-0',
            isSidebarOpen
              ? 'translate-x-0'
              : isRTL
                ? 'translate-x-full md:translate-x-0'
                : '-translate-x-full md:translate-x-0',
            'top-16 h-[calc(100vh-64px)]'
          )}
        >
          <ScrollArea className="h-full py-6 px-4">
            <nav className="flex flex-col gap-1.5 relative z-10">
              {items.map((item, idx) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + '/');

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col gap-1"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all group overflow-hidden relative',
                        isActive
                          ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] shadow-[var(--ds-glow-premium)] ring-1 ring-[var(--ds-border-brand)]/20'
                          : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] hover:text-[var(--ds-text)]'
                      )}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-[var(--ds-background-brand-bold)]/5 to-transparent pointer-events-none"
                        />
                      )}
                      <item.icon
                        size={18}
                        className={cn(
                          'transition-transform group-hover:scale-110 duration-300',
                          isActive
                            ? 'text-[var(--ds-icon-brand)]'
                            : 'text-[var(--ds-text-subtlest)] group-hover:text-[var(--ds-text-brand)]',
                          isRTL ? 'order-1' : 'order-1'
                        )}
                      />
                      <span
                        className={cn(
                          'relative z-10',
                          isRTL ? 'order-2' : 'order-2'
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>

                    <AnimatePresence>
                      {item.subItems && isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={cn(
                            'flex flex-col gap-1 border-s border-[var(--ds-border-subtle)] overflow-hidden',
                            isRTL
                              ? 'me-10 pe-4 border-e border-s-0'
                              : 'ms-10 ps-4'
                          )}
                        >
                          {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={cn(
                                  'rounded-lg px-3 py-2 text-xs font-medium transition-all hover:translate-x-1 rtl:hover:-translate-x-1',
                                  isSubActive
                                    ? 'text-[var(--ds-text-selected)] font-bold'
                                    : 'text-[var(--ds-text-subtlest)] hover:text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-subtle)]'
                                )}
                                dir={isRTL ? 'rtl' : 'ltr'}
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden md:px-4">
          <div className="mx-auto max-w-5xl py-10 px-4 md:px-8">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
