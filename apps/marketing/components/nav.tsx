'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@gate-access/ui';
import { Shield, Menu } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { I18nLink } from './i18n-link';
import type { Locale } from '../i18n-config';
import { useTranslation } from '../hooks/use-translation';

/**
 * GateFlow Navigation - Manual implementation to bypass AtlassianNavigation build crash
 * Next.js 15 build worker stabilization.
 */
export function Nav({ locale }: { locale: Locale }) {
  const { t } = useTranslation('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isRtl = locale === 'ar-EG';

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <I18nLink
            locale={locale}
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="rounded-sm bg-primary p-1 text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Shield size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              GateFlow
            </span>
          </I18nLink>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <I18nLink
              locale={locale}
              href="/pricing"
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t('header.menu.pricing')}
            </I18nLink>
            <I18nLink
              locale={locale}
              href="/solutions"
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t('header.menu.solutions')}
            </I18nLink>
            <I18nLink
              locale={locale}
              href="/resources"
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t('header.menu.resources')}
            </I18nLink>
          </nav>
        </div>

        <div
          className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <div
            className={`flex items-center gap-1 ${isRtl ? 'border-s ps-2' : 'border-e pe-2'}`}
          >
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
          </div>

          <div
            className={`hidden items-center gap-2 md:flex ${isRtl ? 'flex-row-reverse' : ''}`}
          >
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
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
