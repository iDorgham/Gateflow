'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  QrCode,
  ScanLine,
  Shield,
  BarChart3,
  Settings,
  Power,
  ChevronsUpDown,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Contact2,
  Building,
  Building2,
  Layers,
} from 'lucide-react';
import { cn, Button } from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  exact?: boolean;
}

const getNavGroups = (t: TFunction) => {
  const WORKSPACE_NAV: NavItem[] = [
    {
      label: t('sidebar.projects', 'Projects'),
      href: '/dashboard/projects',
      icon: Layers,
    },
    {
      label: t('sidebar.gates', 'Gates'),
      href: '/dashboard/gates',
      icon: Shield,
    },
    {
      label: t('sidebar.contacts', 'Contacts'),
      href: '/dashboard/residents/contacts',
      icon: Contact2,
      exact: false,
    },
    {
      label: t('sidebar.units', 'Units'),
      href: '/dashboard/residents/units',
      icon: Building,
      exact: false,
    },
  ];

  const MAIN_NAV: NavItem[] = [
    {
      label: t('sidebar.overview', 'Overview'),
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: t('sidebar.qrCodes', 'QR Codes'),
      href: '/dashboard/qrcodes',
      icon: QrCode,
    },
    {
      label: t('sidebar.scanLogs', 'Scan Logs'),
      href: '/dashboard/scans',
      icon: ScanLine,
    },
    {
      label: t('sidebar.analytics', 'Analytics'),
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
  ];

  return [
    { label: t('sidebar.operations', 'Operations'), items: MAIN_NAV },
    { label: t('sidebar.workspace', 'Workspace'), items: WORKSPACE_NAV },
  ];
};
interface SidebarProps {
  org: {
    id: string;
    name: string;
    plan: string;
  } | null;
  projects: {
    id: string;
    name: string;
  }[];
  currentProjectId: string | null;
  locale: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  hideGates?: boolean;
}

export function Sidebar({
  org,
  projects,
  currentProjectId,
  locale,
  isCollapsed,
  onToggleCollapse,
  hideGates,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('dashboard');

  let groups = getNavGroups(t);

  if (hideGates) {
    groups = groups.map(group => {
      if (group.label === t('sidebar.workspace', 'Workspace')) {
        return {
          ...group,
          items: group.items.filter(item => !item.href.includes('/gates'))
        };
      }
      return group;
    });
  }

  const NAV_GROUPS = groups;

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl relative z-20 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-sidebar-border',
          isCollapsed ? 'justify-center px-0' : 'justify-between px-6'
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            G
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-sidebar-foreground uppercase">
                {t('common:appName', 'GateFlow')}
              </span>
            </div>
          )}
        </Link>
        {!isCollapsed && (
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-sidebar-accent border border-sidebar-border">
            <ShieldCheck className="h-3 w-3 text-blue-400" />
          </div>
        )}
      </div>

      {/* Org & Project Context */}
      <div className={cn('py-4 space-y-4', isCollapsed ? 'px-2' : 'px-3')}>
        {org && !isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-bold truncate">{org.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {org.plan} {t('common:pricing.plan', 'Plan')}
              </span>
            </div>
          </div>
        )}
        {org && isCollapsed && (
          <div
            className="flex justify-center py-2"
            title={`${org.name} (${org.plan})`}
          >
            <Building2 className="h-5 w-5 text-blue-400" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 opacity-70">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const localizedHref = `/${locale}${item.href}`;
                const active = item.exact
                  ? pathname === localizedHref
                  : pathname === localizedHref ||
                    pathname.startsWith(localizedHref + '/');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={localizedHref}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl transition-all duration-200',
                      isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5',
                      active
                        ? 'bg-primary/10 text-sidebar-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-sidebar-accent hover:text-slate-200'
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                    )}
                    <Icon
                      className={cn(
                        'h-[17px] w-[17px] transition-all duration-300 shrink-0',
                        active
                          ? 'text-blue-400 scale-110'
                          : 'text-slate-500 group-hover:scale-110 group-hover:text-slate-300'
                      )}
                    />
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Sign Out */}
      <div
        className={cn(
          'mt-auto shrink-0 p-3',
          isCollapsed ? 'px-2' : 'px-3'
        )}
      >
        <div className="flex flex-col">
          <Link
            href={`/${locale}/dashboard/settings?tab=profile`}
            title={isCollapsed ? t('sidebar.settings', 'Settings') : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-sidebar-accent hover:text-slate-200 transition-all duration-200',
              isCollapsed ? 'justify-center w-10 h-10 px-0' : 'flex-1 px-4 py-3'
            )}
          >
            <Settings className="h-[17px] w-[17px] text-slate-500 group-hover:text-slate-200 transition-colors shrink-0" />
            {!isCollapsed && (
              <span className="truncate">
                {t('sidebar.settings', 'Settings')}
              </span>
            )}
          </Link>

          <Link
            href={`/${locale}/logout`}
            title={
              isCollapsed
                ? t('nav.signOut', { ns: 'admin', defaultValue: 'Sign out' })
                : undefined
            }
            className={cn(
              'group flex items-center gap-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 border-t border-sidebar-border pt-3 mt-1 rounded-t-none',
              isCollapsed ? 'justify-center w-10 h-10 px-0 pt-0 mt-0 border-t-0' : 'flex-1 px-4 py-3'
            )}
          >
            <Power className="h-[17px] w-[17px] text-slate-500 group-hover:text-red-400 transition-colors shrink-0" />
            {!isCollapsed && (
              <span className="truncate">
                {t('nav.signOut', { ns: 'admin', defaultValue: 'Sign out' })}
              </span>
            )}
          </Link>
          
          {/* Collapse Button aligned with right edge of sidebar, vertically aligned with separator */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "absolute -right-3 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar hover:bg-sidebar-accent shadow-sm group",
              isCollapsed ? "top-[calc(100%-3rem)]" : "bottom-[62px]"
            )}
            title={isCollapsed ? t('sidebar.expand', 'Expand Sidebar') : t('sidebar.collapse', 'Collapse Sidebar')}
          >
            <ChevronLeft className={cn("h-3 w-3 text-slate-500 transition-transform group-hover:text-slate-200", isCollapsed && "rotate-180")} />
          </button>
        </div>
      </div>
    </div>
  );
}
