'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  BuildingIcon,
  StackIcon,
  CreditCardIcon,
  GearIcon,
  PowerIcon,
} from '@phosphor-icons/react';
import {
  Avatar,
  AvatarFallback,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { ThemeToggle } from './theme-toggle';

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

  const MAIN_NAV: NavItem[] = [
    {
      label: t('sidebar.overview', 'Overview'),
      href: '/dashboard',
      icon: SquaresFourIcon,
      exact: true,
    },
    {
      label: t('sidebar.projects', 'Projects'),
      href: '/dashboard/projects',
      icon: StackIcon,
    },
    {
      label: t('sidebar.contacts', 'Contacts'),
      href: '/dashboard/residents/contacts',
      icon: AddressBookIcon,
      permission: 'gates:manage' as Permission,
    },
    {
      label: t('sidebar.units', 'Units'),
      href: '/dashboard/residents/units',
      icon: BuildingsIcon,
      permission: 'gates:manage' as Permission,
    },
    {
      label: t('sidebar.qrCodes', 'QR Codes'),
      href: '/dashboard/qrcodes',
      icon: QrCodeIcon,
      permission: 'qr:create' as Permission,
    },
    {
      label: t('sidebar.accessLogs', 'Access logs'),
      href: '/dashboard/scans',
      icon: ScanIcon,
      permission: 'scans:view' as Permission,
    },
    {
      label: t('sidebar.analytics', 'Analytics'),
      href: '/dashboard/analytics',
      icon: ChartLineUpIcon,
      permission: 'analytics:view' as Permission,
    },
    {
      label: t('sidebar.watchlist', 'Watchlist'),
      href: '/dashboard/team/watchlist',
      icon: ListChecksIcon,
      permission: 'gates:manage' as Permission,
    },
    {
      label: t('sidebar.gates', 'Gates'),
      href: '/dashboard/gates',
      icon: DoorOpenIcon,
      permission: 'gates:manage' as Permission,
    },
    {
      label: t('sidebar.gateAssignments', 'Gate assignments'),
      href: '/dashboard/team/gate-assignments',
      icon: UsersFourIcon,
      permission: 'gates:manage' as Permission,
    },
    {
      label: t('sidebar.incidents', 'Incidents'),
      href: '/dashboard/team/incidents',
      icon: WarningIcon,
      permission: 'gates:manage' as Permission,
    },
  ].filter(item => hasPerm(item.permission));

  const groups = [
    { label: t('sidebar.operations', 'Operations'), items: MAIN_NAV },
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
  const router = useRouter();
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

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

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
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-70">
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

      {/* Footer / User Profile */}
      <div
        className={cn(
          'mt-auto shrink-0 p-3 flex flex-col gap-4 border-t border-sidebar-border/50',
          isCollapsed ? 'items-center' : 'px-4'
        )}
      >
        <div className={cn("flex items-center w-full", isCollapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div 
                  className="group relative cursor-pointer outline-none"
                  onMouseEnter={() => isCollapsed && setHoveredLabel(t('sidebar.profile', 'Profile'))}
                  onMouseLeave={() => setHoveredLabel(null)}
                >
                  <Avatar className="h-9 w-9 border-2 border-sidebar-border hover:border-primary transition-all">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {isCollapsed && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-sidebar bg-success" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isCollapsed ? 'start' : 'end'}
                side="top"
                className="w-64 p-2 rounded-2xl border-sidebar-border bg-sidebar shadow-2xl animate-in fade-in zoom-in-95"
                sideOffset={12}
              >
                <DropdownMenuLabel className="p-3 mb-1">
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-bold leading-none text-foreground">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground font-medium">
                      {user.email}
                    </p>
                    {org && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary w-fit">
                        <StackIcon className="h-3 w-3" />
                        <span>
                          {org.plan}
                        </span>
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-sidebar-border/50 mx-1" />
                <div className="p-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/dashboard/settings?tab=profile`}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-sidebar-accent transition-colors"
                    >
                      <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{t('sidebar.profile', 'Profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/dashboard/settings`}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-sidebar-accent transition-colors"
                    >
                      <GearIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{t('sidebar.settings', 'Settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/${locale}/dashboard/settings?tab=billing`}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-sidebar-accent transition-colors"
                    >
                      <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{t('sidebar.billing', 'Billing & payments')}</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-sidebar-border/50 mx-1" />
                <div className="p-1">
                  <DropdownMenuItem className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-sidebar-accent transition-colors">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">
                        {t('sidebar.appearance', 'Appearance')}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {t('sidebar.appearanceDescription', 'Light / Dark mode')}
                      </span>
                    </div>
                    <ThemeToggle />
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-sidebar-border/50 mx-1" />
                <div className="p-1">
                  <DropdownMenuItem 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer transition-colors"
                    onClick={() => router.push(`/${locale}/logout`)}
                  >
                    <PowerIcon className="h-4 w-4" />
                    <span className="text-sm font-bold">{t('sidebar.signout', 'Sign out')}</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-foreground truncate">{user.name}</span>
                <span className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">
                  {user.role.toLowerCase().replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={cn("flex items-center justify-center pt-2", isCollapsed ? "flex-col" : "w-full")}>
          {/* Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar/50 hover:bg-sidebar-accent shadow-sm group transition-all"
            )}
            onMouseEnter={() => isCollapsed && setHoveredLabel(isCollapsed ? t('sidebar.expand', 'Expand') : t('sidebar.collapse', 'Collapse'))}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <CaretLeftIcon className={cn("h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground", isCollapsed && "rotate-180")} />
          </button>
        </div>
      </div>

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
