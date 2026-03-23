'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  Button,
  AtlassianNavigation,
  type NavItem,
} from '@gate-access/ui';
import {
  Menu,
  Shield,
  Zap,
  Building2,
  GraduationCap,
  Calendar,
  Anchor,
  ChevronDown,
} from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { I18nLink } from './i18n-link';
import type { Locale } from '../i18n-config';

import { useTranslation } from '../hooks/use-translation';

export function Nav({ locale }: { locale: Locale }) {
  const { t } = useTranslation('navigation');
  const pathname = usePathname();

  const primaryItems: NavItem[] = [
    {
      label: t('header.menu.product'),
      items: [
        {
          href: '/features',
          icon: Zap,
          label: t('header.dropdowns.product.features.label'),
          description: t('header.dropdowns.product.features.desc'),
        },
        {
          href: '/#security',
          icon: Shield,
          label: t('header.dropdowns.product.security.label'),
          description: t('header.dropdowns.product.security.desc'),
        },
      ],
    },
    {
      label: t('header.menu.solutions'),
      items: [
        {
          href: '/solutions#compounds',
          icon: Building2,
          label: t('header.dropdowns.solutions.compounds.label'),
          description: t('header.dropdowns.solutions.compounds.desc'),
        },
        {
          href: '/solutions#schools',
          icon: GraduationCap,
          label: t('header.dropdowns.solutions.schools.label'),
          description: t('header.dropdowns.solutions.schools.desc'),
        },
        {
          href: '/solutions#events',
          icon: Calendar,
          label: t('header.dropdowns.solutions.events.label'),
          description: t('header.dropdowns.solutions.events.desc'),
        },
        {
          href: '/solutions#clubs',
          icon: Anchor,
          label: t('header.dropdowns.solutions.clubs.label'),
          description: t('header.dropdowns.solutions.clubs.desc'),
        },
      ],
    },
    { label: t('header.menu.pricing'), href: '/pricing' },
    { label: t('header.menu.contact'), href: '/contact' },
  ];

  const logo = (
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
  );

  const actions = (
    <>
      <div className="flex items-center gap-1 me-2 border-e border-border pe-2">
        <LanguageSwitcher currentLocale={locale} />
        <ThemeToggle />
      </div>
      <Button
        variant="subtle"
        size="compact"
        asChild
        className="hidden md:flex"
      >
        <Link href={`https://app.gateflow.site/${locale}/login`}>
          {t('header.actions.signIn')}
        </Link>
      </Button>
      <Button variant="brand" size="compact" asChild>
        <I18nLink locale={locale} href="/contact">
          {t('header.actions.getStarted')}
        </I18nLink>
      </Button>
    </>
  );

  return (
    <AtlassianNavigation
      logo={logo}
      primaryItems={primaryItems}
      actions={actions}
      renderLink={({ href, children, className }) => (
        <I18nLink locale={locale} href={href as any} className={className}>
          {children}
        </I18nLink>
      )}
    />
  );
}
