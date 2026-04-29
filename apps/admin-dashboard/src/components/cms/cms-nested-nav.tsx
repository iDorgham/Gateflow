'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@gateflow/ui';
import { FileText, Rocket, BookOpen, Menu, Settings } from 'lucide-react';

export function CmsNestedNav() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const prefix = `/${i18n.language}/cms`;

  const navItems = [
    { href: '/pages', label: t('cms:nav.pages', 'Pages'), icon: FileText },
    {
      href: '/landing-pages',
      label: t('cms:nav.landing_pages', 'Landing Pages'),
      icon: Rocket,
    },
    { href: '/blog', label: t('cms:nav.blog', 'Blog'), icon: BookOpen },
    { href: '/menus', label: t('cms:nav.menus', 'Menus'), icon: Menu },
    {
      href: '/settings',
      label: t('cms:nav.settings', 'Settings'),
      icon: Settings,
    },
  ];

  return (
    <nav className="flex flex-col gap-1 rounded-2xl bg-ds-surface-raised border border-ds-border p-3 sticky top-0 shadow-sm">
      <div className="px-3 pb-3 pt-1 mb-2 border-b border-ds-border/50">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
          {t('cms:nav.section_title', 'CMS Management')}
        </h3>
        <p className="text-[10px] font-medium text-ds-text-subtlest mt-1">
          www.gateflow.site
        </p>
      </div>
      {navItems.map((item) => {
        const fullHref = `${prefix}${item.href}`;
        const isActive = pathname.startsWith(fullHref);

        return (
          <Link
            key={item.href}
            href={fullHref}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden',
              isActive
                ? 'bg-ds-background-brand-bold text-ds-text-inverse font-bold shadow-md shadow-ds-background-brand-bold/20'
                : 'text-ds-text-subtle hover:bg-ds-background-neutral-subtle hover:text-ds-text font-medium'
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 rounded-r-full" />
            )}
            <item.icon
              className={cn(
                'h-4 w-4 shrink-0',
                isActive
                  ? 'text-ds-icon-inverse'
                  : 'text-ds-icon-subtle group-hover:text-ds-icon'
              )}
            />
            <span className="text-sm truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
