'use client';

import * as React from 'react';
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
  QuestionIcon,
  SparkleIcon,
} from '@phosphor-icons/react';
import { 
  cn, 
  SideNavigationShell, 
  SideNavItem, 
  NavGroup, 
  NavNestedGroup,
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Permission } from '@gate-access/types';

interface NavItemData {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
  permission?: Permission;
}

interface NavGroupData {
  label: string;
  items: NavItemData[];
  isDashboard?: boolean;
  isResidents?: boolean;
}

const getNavGroups = (t: TFunction, permissions: Record<string, boolean>, hideGates?: boolean): NavGroupData[] => {
  const hasPerm = (p?: Permission) => !p || permissions[p] === true;

  const DASHBOARD_ITEMS: NavItemData[] = [
    { label: t('sidebar.overview', 'Overview'), href: '/dashboard', icon: SquaresFourIcon, exact: true },
    { label: t('sidebar.gateAi', 'AI assistant'), href: '/dashboard/ai', icon: SparkleIcon },
    { label: t('sidebar.projects', 'Projects'), href: '/dashboard/projects', icon: StackIcon },
    { label: t('sidebar.analytics', 'Analytics'), href: '/dashboard/analytics', icon: ChartLineUpIcon, permission: 'analytics:view' as Permission },
  ].filter(item => hasPerm(item.permission));

  const RESIDENTS_NAV: NavItemData[] = [
    { label: t('sidebar.contacts', 'Contacts'), href: '/dashboard/residents/contacts', icon: AddressBookIcon, permission: 'gates:manage' as Permission },
    { label: t('sidebar.units', 'Units'), href: '/dashboard/residents/units', icon: BuildingsIcon, permission: 'gates:manage' as Permission },
  ].filter(item => hasPerm(item.permission));

  const ACCESS_CONTROL_NAV: NavItemData[] = [
    { label: t('sidebar.qrCodes', 'QR Codes'), href: '/dashboard/qrcodes', icon: QrCodeIcon, permission: 'qr:create' as Permission },
    { label: t('sidebar.accessLogs', 'Access logs'), href: '/dashboard/scans', icon: ScanIcon, permission: 'scans:view' as Permission },
    ...(!hideGates ? [
      { label: t('sidebar.gates', 'Gates'), href: '/dashboard/gates', icon: DoorOpenIcon, permission: 'gates:manage' as Permission },
      { label: t('sidebar.gateAssignments', 'Gate assignments'), href: '/dashboard/team/gate-assignments', icon: UsersFourIcon, permission: 'gates:manage' as Permission },
    ] : []),
  ].filter(item => hasPerm(item.permission));

  const SECURITY_NAV: NavItemData[] = [
    { label: t('sidebar.watchlist', 'Watchlist'), href: '/dashboard/team/watchlist', icon: ListChecksIcon, permission: 'gates:manage' as Permission },
    { label: t('sidebar.incidents', 'Incidents'), href: '/dashboard/team/incidents', icon: WarningIcon, permission: 'gates:manage' as Permission },
  ].filter(item => hasPerm(item.permission));

  return [
    { label: t('sidebar.groupWorkspace', 'Main'), items: DASHBOARD_ITEMS, isDashboard: true },
    { label: t('sidebar.groupResidents', 'Residents'), items: RESIDENTS_NAV, isResidents: true },
    { label: t('sidebar.groupAccessControl', 'Access'), items: ACCESS_CONTROL_NAV },
    { label: t('sidebar.groupSecurity', 'Security'), items: SECURITY_NAV },
  ].filter(g => g.items.length > 0);
};

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
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
  locale,
  isCollapsed,
  onToggleCollapse,
  hideGates,
  permissions = {},
}: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation('dashboard');

  const navGroups = getNavGroups(t, permissions, hideGates);
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="relative h-full">
      <SideNavigationShell
        isCollapsed={isCollapsed}
        header={
          <div className={cn(
            "flex items-center gap-3 px-3 py-6",
            isCollapsed && "justify-center"
          )}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--ds-background-brand-bold,#0052CC)] text-white shadow-sm">
              <ShieldCheckIcon size={20} weight="fill" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-[var(--ds-text,#172B4D)] truncate">
                  GateFlow
                </span>
                {org && (
                  <span className="text-[10px] font-medium text-[var(--ds-text-subtlest,#6B778C)] truncate">
                    {org.name}
                  </span>
                )}
              </div>
            )}
          </div>
        }
        footer={
          <div className="flex flex-col p-2 space-y-3 mt-auto pb-4">
            <div className={cn(
              "flex items-center gap-3 rounded-[3px] p-2 transition-colors hover:bg-[var(--ds-background-subtle,#F4F5F7)] cursor-pointer group",
              isCollapsed && "justify-center"
            )}>
              <Avatar size="small">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="text-[10px] bg-[var(--ds-background-brand-subtle,#DEEBFF)] text-[var(--ds-text-brand,#0052CC)]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <span className="text-xs font-semibold text-[var(--ds-text,#172B4D)] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[var(--ds-text-subtlest,#6B778C)] truncate">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-1 pt-3 border-t border-[var(--ds-border,#DFE1E6)]">
              <SideNavItem
                href="#"
                label={t('sidebar.help', 'Help')}
                icon={QuestionIcon}
                isCollapsed={isCollapsed}
              />
              <SideNavItem
                href={`/${locale}/dashboard/settings`}
                label={t('sidebar.settings', 'Settings')}
                icon={GearIcon}
                isCollapsed={isCollapsed}
                isActive={pathname.includes('/settings')}
              />
            </div>
          </div>
        }
      >
        <div className="flex flex-col space-y-8 py-6 px-2">
          {navGroups.map((group) => (
            <NavGroup key={group.label} label={group.label} isCollapsed={isCollapsed}>
              <div className="flex flex-col space-y-2 mt-2">
                {group.isResidents ? (
                  <NavNestedGroup 
                    label={group.label} 
                    icon={group.items[0]?.icon} 
                    isCollapsed={isCollapsed}
                    defaultOpen
                  >
                    <div className="flex flex-col space-y-1">
                      {group.items.map((item) => {
                        const localizedHref = `/${locale}${item.href}`;
                        const active = item.exact
                          ? pathname === localizedHref
                          : pathname === localizedHref || pathname.startsWith(localizedHref + '/');
                        return (
                          <SideNavItem
                            key={item.href}
                            label={item.label}
                            href={localizedHref}
                            icon={item.icon}
                            isActive={active}
                            isCollapsed={isCollapsed}
                          />
                        );
                      })}
                    </div>
                  </NavNestedGroup>
                ) : (
                  group.items.map((item) => {
                    const localizedHref = `/${locale}${item.href}`;
                    const active = item.exact
                      ? pathname === localizedHref
                      : pathname === localizedHref || pathname.startsWith(localizedHref + '/');
                    return (
                      <SideNavItem
                        key={item.href}
                        label={item.label}
                        href={localizedHref}
                        icon={item.icon}
                        isActive={active}
                        isCollapsed={isCollapsed}
                      />
                    );
                  })
                )}
              </div>
            </NavGroup>
          ))}
        </div>
      </SideNavigationShell>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute top-10 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-default,#FFFFFF)] shadow-sm hover:bg-[var(--ds-background-subtle,#F4F5F7)] transition-all group"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <CaretLeftIcon className={cn('h-3 w-3 text-[var(--ds-icon-subtle,#6B778C)] transition-transform group-hover:text-[var(--ds-icon,#172B4D)]', isCollapsed && 'rotate-180')} />
      </button>
    </div>
  );
}
