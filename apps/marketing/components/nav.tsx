'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@gate-access/ui';
import {
  Shield,
  Zap,
  Building2,
  GraduationCap,
  Calendar,
  Anchor,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { I18nLink } from './i18n-link';
import type { Locale } from '../i18n-config';
import { useTranslation } from '../hooks/use-translation';
import { cn } from '../lib/utils';

/**
 * GateFlow Navigation - Manual implementation to bypass AtlassianNavigation build crash
 * Next.js 15 build worker stabilization.
 */
export function Nav({ locale }: { locale: Locale }) {
  const { t } = useTranslation('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b h-14 flex items-center px-4">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <I18nLink
            locale={locale}
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="bg-[#0052CC] text-white p-1 rounded-sm shadow-sm transition-transform group-hover:scale-105">
              <Shield size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#172B4D] dark:text-[#E3E9F0]">
              GateFlow
            </span>
          </I18nLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <I18nLink
              locale={locale}
              href="/pricing"
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#0052CC] transition-colors"
            >
              {t('header.menu.pricing')}
            </I18nLink>
            <I18nLink
              locale={locale}
              href="/solutions"
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#0052CC] transition-colors"
            >
              {t('header.menu.solutions')}
            </I18nLink>
            <I18nLink
              locale={locale}
              href="/resources"
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#0052CC] transition-colors"
            >
              {t('header.menu.resources')}
            </I18nLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border-e pe-2">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href={`https://app.gateflow.site/${locale}/login`}>
              <Button variant="subtle" size="compact">
                {t('header.actions.signIn')}
              </Button>
            </Link>
            <I18nLink locale={locale} href="/contact">
              <Button variant="brand" size="compact">
                {t('header.actions.getStarted')}
              </Button>
            </I18nLink>
          </div>

          <Button
            variant="subtle"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
