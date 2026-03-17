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
  HelpCircle,
  BarChart3,
  ScrollText,
  CreditCard,
  Activity,
  KeyRound,
  Settings,
  FolderOpen,
  DoorOpen,
} from 'lucide-react';
import { 
  cn, 
  SideNavigationShell, 
  SideNavItem, 
  NavGroup,
  Avatar,
  AvatarFallback
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
    label: t('admin:nav.platform', 'Platform'),
    items: [
      { href: '/', label: t('admin:nav.overview'), icon: LayoutDashboard, exact: true },
      { href: '/organizations', label: t('admin:nav.organizations'), icon: Building2 },
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
    label: t('admin:nav.revenue', 'Revenue'),
    items: [
      { href: '/finance', label: t('admin:nav.finance', 'Finance'), icon: CreditCard },
    ],
  },
  {
    label: t('admin:nav.system', 'System'),
    items: [
      { href: '/monitoring', label: t('admin:nav.monitoring'), icon: Activity },
      { href: '/authorization-keys', label: t('admin:nav.authKeys', 'Auth Keys'), icon: KeyRound },
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
    <div className="relative h-full">
      <SideNavigationShell
        isCollapsed={isCollapsed}
        header={
          <div className={cn(
            "flex h-16 items-center px-4 gap-3",
            isCollapsed && "justify-center px-0"
          )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--ds-background-brand-bold,#0052CC)] text-[13px] font-bold text-white shadow-sm">
              GF
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-[var(--ds-text,#172B4D)] uppercase">
                  GateFlow
                </span>
                <span className="text-[10px] font-bold text-[var(--ds-text-brand,#0052CC)] tracking-[0.1em] uppercase">
                  Admin Console
                </span>
              </div>
            )}
          </div>
        }
        footer={
          <div className="flex flex-col gap-0.5 p-2">
            <SideNavItem
              href="#"
              label={t('admin:nav.help', 'Help')}
              icon={HelpCircle}
              isCollapsed={isCollapsed}
            />
            <SideNavItem
              href="#"
              label={t('admin:nav.signOut', 'Sign out')}
              icon={LogOut}
              isCollapsed={isCollapsed}
              onClick={() => {
                handleSignOut();
              }}
            />
            <div className={cn(
              "mt-2 flex items-center gap-3 rounded-[3px] p-2 transition-colors hover:bg-[var(--ds-background-subtle,#F4F5F7)] cursor-pointer group",
              isCollapsed && "justify-center"
            )}>
              <Avatar size="small">
                <AvatarFallback className="text-[10px] bg-[var(--ds-background-brand-subtle,#DEEBFF)] text-[var(--ds-text-brand,#0052CC)]">
                  AD
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[var(--ds-text,#172B4D)] truncate">
                    Admin User
                  </span>
                  <span className="text-[10px] text-[var(--ds-text-subtlest,#6B778C)] truncate">
                    admin@gateflow.io
                  </span>
                </div>
              )}
            </div>
          </div>
        }
      >
        {navGroups.map((group) => (
          <NavGroup key={group.label} label={group.label} isCollapsed={isCollapsed}>
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

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-10 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-default,#FFFFFF)] shadow-sm hover:bg-[var(--ds-background-subtle,#F4F5F7)] transition-all group"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft className={cn('h-3.5 w-3.5 text-[var(--ds-icon-subtle,#6B778C)] transition-transform group-hover:text-[var(--ds-icon,#172B4D)]', isCollapsed && 'rotate-180')} />
      </button>
    </div>
  );
}
