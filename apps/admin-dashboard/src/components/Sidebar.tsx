'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  LayoutDashboard,
  Building2,
  Users,
  ScanLine,
  LogOut,
  Shield,
  ChevronLeft,
  BarChart3,
  ScrollText,
  Activity,
  KeyRound,
  Settings,
  FolderOpen,
  DoorOpen,
  Zap,
  Database,
} from 'lucide-react';
import {
  cn,
  SideNavigationShell,
  SideNavItem,
  NavGroup,
} from '@gate-access/ui';

interface NavItemData {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavGroupData {
  label: string;
  items: NavItemData[];
}

const getNavGroups = (t: TFunction): NavGroupData[] => [
  {
    label: t('admin:nav.management', 'Management'),
    items: [
      {
        href: '/',
        label: t('admin:nav.overview'),
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: '/organizations',
        label: t('admin:nav.organizations'),
        icon: Building2,
      },
      { href: '/users', label: t('admin:nav.users'), icon: Users },
      { href: '/projects', label: t('admin:nav.projects'), icon: FolderOpen },
      { href: '/gates', label: t('admin:nav.gates'), icon: DoorOpen },
    ],
  },
  {
    label: t('admin:nav.intelligence', 'Intelligence'),
    items: [
      { href: '/analytics', label: t('admin:nav.analytics'), icon: BarChart3 },
      { href: '/scans', label: t('admin:nav.scans'), icon: ScanLine },
      { href: '/audit-logs', label: t('admin:nav.audit'), icon: ScrollText },
    ],
  },
  {
    label: t('admin:nav.infrastructure', 'Infrastructure'),
    items: [
      {
        href: '/monitoring/hub',
        label: t('admin:nav.ops_hub'),
        icon: Activity,
      },
      {
        href: '/monitoring/emulation',
        label: t('admin:nav.emulation'),
        icon: Zap,
      },
      {
        href: '/monitoring/seeding',
        label: t('admin:nav.seeding'),
        icon: Database,
      },
    ],
  },
  {
    label: t('admin:nav.governance', 'Governance'),
    items: [
      { href: '/monitoring', label: t('admin:nav.monitoring'), icon: Activity },
      {
        href: '/authorization-keys',
        label: t('admin:nav.authKeys', 'Auth Keys'),
        icon: KeyRound,
      },
      { href: '/settings', label: t('admin:nav.settings'), icon: Settings },
      { href: '/admins', label: t('admin:nav.admins'), icon: Shield },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navGroups = getNavGroups(t);
  const localePrefix = `/${i18n.language}`;

  async function handleSignOut() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="relative h-full transition-all duration-300">
      <SideNavigationShell
        isCollapsed={isCollapsed}
        header={
          <div
            className={cn(
              'flex h-20 items-center px-4 gap-3 border-b border-ds-border/30 mb-2',
              isCollapsed && 'justify-center border-none'
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ds-background-brand-bold text-white shadow-lg shadow-primary/25 ring-2 ring-background transition-transform hover:scale-105 active:scale-95 cursor-default">
              <Shield className="h-5 w-5" fill="currentColor" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black italic tracking-tighter text-ds-text uppercase">
                  GateFlow
                </span>
                <span className="text-[10px] font-black text-ds-text-brand tracking-widest uppercase opacity-90">
                  Global Admin
                </span>
              </div>
            )}
          </div>
        }
        footer={
          <div className="flex flex-col gap-0.5 p-2">
            <SideNavItem
              href="#"
              label={t('admin:nav.signOut', 'Sign out')}
              icon={LogOut}
              isCollapsed={isCollapsed}
              onClick={() => {
                handleSignOut();
              }}
            />
          </div>
        }
      >
        {navGroups.map((group) => (
          <NavGroup
            key={group.label}
            label={group.label}
            isCollapsed={isCollapsed}
          >
            {group.items.map((item) => {
              const itemHref = `${localePrefix}${item.href === '/' ? '' : item.href}`;
              const active = item.exact
                ? pathname === itemHref || pathname === `${itemHref}/`
                : pathname.startsWith(itemHref);
              return (
                <SideNavItem
                  key={item.href}
                  label={item.label}
                  href={itemHref}
                  icon={item.icon}
                  isActive={active}
                  isCollapsed={isCollapsed}
                />
              );
            })}
          </NavGroup>
        ))}
      </SideNavigationShell>

      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-ds-border bg-ds-background-default shadow-sm hover:bg-ds-background-neutral-subtle transition-all group',
          'ltr:-right-3 rtl:-left-3'
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          className={cn(
            'h-3.5 w-3.5 text-ds-icon-subtle transition-transform group-hover:text-ds-icon',
            // Default: points left. If collapsed: points right.
            // But in RTL: default should point right. If collapsed: points left.
            i18n.language === 'ar-EG'
              ? isCollapsed
                ? 'rotate-0'
                : 'rotate-180'
              : isCollapsed
                ? 'rotate-180'
                : 'rotate-0'
          )}
        />
      </button>
    </div>
  );
}
