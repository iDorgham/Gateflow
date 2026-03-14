'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFourIcon,
  QrCodeIcon,
  ScanIcon,
  ChartLineUpIcon,
  DoorOpenIcon,
  BuildingsIcon,
  AddressBookIcon,
  UsersFourIcon,
  ListChecksIcon,
  WarningIcon,
  ShieldCheckIcon,
  CaretLeftIcon,
  StackIcon,
  GearIcon,
} from '@phosphor-icons/react';
import { cn } from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { HeaderUserMenu } from './header-user-menu';


import { Permission } from '@gate-access/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
  permission?: Permission;
}

const getNavGroups = (t: TFunction, permissions: Record<string, boolean>) => {
  const hasPerm = (p?: Permission) => !p || permissions[p] === true;

  // No workspace-specific nav items for now

  const WORKSPACE_NAV: NavItem[] = [
    { label: t('sidebar.overview', 'Overview'), href: '/dashboard', icon: SquaresFourIcon, exact: true },
    { label: t('sidebar.projects', 'Projects'), href: '/dashboard/projects', icon: StackIcon },
    { label: t('sidebar.analytics', 'Analytics'), href: '/dashboard/analytics', icon: ChartLineUpIcon, permission: 'analytics:view' as Permission },
  ].filter(item => hasPerm(item.permission));

  const RESIDENTS_NAV: NavItem[] = [
    { label: t('sidebar.contacts', 'Contacts'), href: '/dashboard/residents/contacts', icon: AddressBookIcon, permission: 'gates:manage' as Permission },
    { label: t('sidebar.units', 'Units'), href: '/dashboard/residents/units', icon: BuildingsIcon, permission: 'gates:manage' as Permission },
  ].filter(item => hasPerm(item.permission));

  const ACCESS_CONTROL_NAV: NavItem[] = [
    { label: t('sidebar.qrCodes', 'QR Codes'), href: '/dashboard/qrcodes', icon: QrCodeIcon, permission: 'qr:create' as Permission },
    { label: t('sidebar.accessLogs', 'Access logs'), href: '/dashboard/scans', icon: ScanIcon, permission: 'scans:view' as Permission },
    { label: t('sidebar.gates', 'Gates'), href: '/dashboard/gates', icon: DoorOpenIcon, permission: 'gates:manage' as Permission },
    { label: t('sidebar.gateAssignments', 'Gate assignments'), href: '/dashboard/team/gate-assignments', icon: UsersFourIcon, permission: 'gates:manage' as Permission },
  ].filter(item => hasPerm(item.permission));

  const SECURITY_NAV: NavItem[] = [
    { label: t('sidebar.watchlist', 'Watchlist'), href: '/dashboard/team/watchlist', icon: ListChecksIcon, permission: 'gates:manage' as Permission },
    { label: t('sidebar.incidents', 'Incidents'), href: '/dashboard/team/incidents', icon: WarningIcon, permission: 'gates:manage' as Permission },
  ].filter(item => hasPerm(item.permission));

  const groups = [
    { label: t('sidebar.groupWorkspace', 'Workspace'), items: WORKSPACE_NAV },
    { label: t('sidebar.groupResidents', 'Residents'), items: RESIDENTS_NAV },
    { label: t('sidebar.groupAccessControl', 'Access Control'), items: ACCESS_CONTROL_NAV },
    { label: t('sidebar.groupSecurity', 'Security'), items: SECURITY_NAV },
  ];

  return groups.filter(g => g.items.length > 0);
};

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
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
  permissions?: Record<string, boolean>;
}

export function Sidebar({
  user,
  org,
  projects: _projects,
  currentProjectId: _currentProjectId,
  locale,
  isCollapsed,
  onToggleCollapse,
  hideGates: _hideGates,
  permissions = {},
}: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation('dashboard');

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const groups = getNavGroups(t, permissions);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG] Sidebar Permissions:', permissions);
    console.log('[DEBUG] Nav Groups Count:', groups.length);
  }

  const NAV_GROUPS = groups;

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border relative z-20 transition-all duration-300 ease-in-out select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      onMouseMove={handleMouseMove}
    >
      {/* GateFlow Logo */}
      <div className={cn(
        'shrink-0 border-b border-sidebar-border/50 flex items-center justify-center',
        'h-20 w-20' // 1:1 Square with same width as collapsed side panel (w-20 = 80px)
      )}>
        <Link
          href={`/${locale}/dashboard`}
          className="flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg h-12 w-12 transition-transform hover:scale-105"
        >
          <ShieldCheckIcon size={28} className="h-7 w-7" weight="fill" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {NAV_GROUPS.map((group, idx) => (
          <div key={group.label}>
            {/* Divider between groups when collapsed; label when expanded */}
            {idx > 0 && isCollapsed && (
              <div className="h-px bg-sidebar-border/30 mx-2 my-2" />
            )}
            {!isCollapsed && (
              <p className={cn(
                'px-3 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 mb-1',
                idx === 0 ? 'pt-2' : 'pt-5'
              )}>
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
                    onMouseEnter={() => isCollapsed && setHoveredLabel(item.label)}
                    onMouseLeave={() => setHoveredLabel(null)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl transition-all duration-200',
                      isCollapsed ? 'justify-center p-3' : 'px-3.5 py-3',
                      active
                        ? 'bg-primary/10 text-sidebar-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
                    )}
                    <Icon
                      size={20}
                      weight="regular"
                      className={cn(
                        'transition-all duration-300 shrink-0',
                        active
                          ? 'text-primary scale-110'
                          : 'text-muted-foreground group-hover:scale-110 group-hover:text-foreground'
                      )}
                    />
                    {!isCollapsed && (
                      <span className="flex-1 truncate text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: Profile link + Collapse */}
      <div
        className={cn(
          'mt-auto shrink-0 p-3 flex flex-col gap-2 border-t border-sidebar-border/50',
          isCollapsed ? 'items-center' : 'px-3'
        )}
      >
        <HeaderUserMenu 
            user={user} 
            org={org} 
            locale={locale} 
            variant="sidebar" 
            isCollapsed={isCollapsed} 
        />
        
        <Link
          href={`/${locale}/dashboard/settings`}
          onMouseEnter={() => isCollapsed && setHoveredLabel(t('sidebar.settings', 'Settings'))}
          onMouseLeave={() => setHoveredLabel(null)}
          className={cn(
            'group flex items-center gap-3 rounded-xl transition-all text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
            isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5'
          )}
        >
          <GearIcon size={20} weight="regular" className="shrink-0 text-muted-foreground group-hover:text-foreground" />
          {!isCollapsed && (
            <span className="flex-1 truncate text-[11px] font-bold uppercase tracking-wider">{t('sidebar.settings', 'Settings')}</span>
          )}
        </Link>
      </div>

      {/* Collapse toggle — floats on the right edge of the sidebar, positioned "out down" */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute bottom-4 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-sm hover:bg-sidebar-accent transition-all group"
        onMouseEnter={() => setHoveredLabel(isCollapsed ? t('sidebar.expand', 'Expand') : t('sidebar.collapse', 'Collapse'))}
        onMouseLeave={() => setHoveredLabel(null)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <CaretLeftIcon className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:text-foreground', isCollapsed && 'rotate-180')} />
      </button>

      {/* Photoshop-style Floating Label */}
      {hoveredLabel && (
        <div
          className="fixed z-[9999] pointer-events-none px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: mousePos.x + 12,
            top: mousePos.y - 12,
          }}
        >
          {hoveredLabel}
        </div>
      )}
    </div>
  );
}
