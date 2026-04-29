'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@gateflow/ui';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  DoorOpen,
  Columns3,
  Activity,
  Settings,
  Palette,
} from 'lucide-react';

export function OrgNestedNav({ orgId }: { orgId: string }) {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const prefix = `/${i18n.language}/organizations/${orgId}`;

  const navItems = [
    {
      href: '',
      label: t('admin:nav.dashboard', 'Dashboard'),
      icon: LayoutDashboard,
      exact: true,
    },
    { href: '/users', label: t('admin:nav.users', 'Users'), icon: Users },
    {
      href: '/projects',
      label: t('admin:nav.projects', 'Projects'),
      icon: FolderOpen,
    },
    { href: '/gates', label: t('admin:nav.gates', 'Gates'), icon: DoorOpen },
    { href: '/tasks', label: t('admin:nav.tasks', 'Task Hub'), icon: Columns3 },
    {
      href: '/monitoring',
      label: t('admin:nav.monitoring', 'Monitoring'),
      icon: Activity,
    },
    {
      href: '/branding',
      label: t('admin:nav.branding', 'Branding'),
      icon: Palette,
    },
    {
      href: '/settings',
      label: t('admin:nav.settings', 'Settings'),
      icon: Settings,
    },
  ];

  return (
    <nav className="flex flex-col gap-1 rounded-2xl bg-ds-surface-raised border border-ds-border p-3 sticky top-20 shadow-sm">
      <div className="px-3 pb-3 pt-1 mb-2 border-b border-ds-border/50">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle">
          {t('admin:org.context_menu', 'Organization Menu')}
        </h3>
      </div>
      {navItems.map((item) => {
        const fullHref = `${prefix}${item.href}`;
        const isActive = item.exact
          ? pathname === fullHref || pathname === `${fullHref}/`
          : pathname.startsWith(fullHref);

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
