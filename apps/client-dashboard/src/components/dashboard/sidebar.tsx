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
import {
  Avatar,
  AvatarFallback,
  cn,
  Button,
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
import { LanguageSwitcher } from '../language-switcher';

import { Permission } from '@gate-access/types';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  exact?: boolean;
  permission?: Permission;
}

const getNavGroups = (t: TFunction, permissions: Record<string, boolean>) => {
  const hasPerm = (p?: Permission) => !p || permissions[p] === true;

  const WORKSPACE_NAV: NavItem[] = [];

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
      permission: 'qr:create' as Permission, // or qr:manage
    },
    {
      label: t('sidebar.scanLogs', 'Scan Logs'),
      href: '/dashboard/scans',
      icon: ScanLine,
      permission: 'scans:view' as Permission,
    },
    {
      label: t('sidebar.analytics', 'Analytics'),
      href: '/dashboard/analytics',
      icon: BarChart3,
      permission: 'analytics:view' as Permission,
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
  projects,
  currentProjectId,
  locale,
  isCollapsed,
  onToggleCollapse,
  hideGates,
  permissions = {},
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('dashboard');

  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  let groups = getNavGroups(t, permissions);
  
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
        'flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl relative z-20 transition-all duration-300 ease-in-out select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Brand - Removed (now in Header) */}

      {/* Org & Project Context */}
      <div className={cn('py-4 space-y-4', isCollapsed ? 'px-2' : 'px-3')}>
        {org && !isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-bold truncate">{org.name}</span>
            </div>
          </div>
        )}
        {org && isCollapsed && (
          <div
            className="flex justify-center py-2"
            title={`${org.name} (${org.plan})`}
            onMouseEnter={() => setHoveredLabel(`${org.name} (${org.plan})`)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <Building2 className="h-6 w-6 text-blue-400" />
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
                    onMouseEnter={() => isCollapsed && setHoveredLabel(item.label)}
                    onMouseLeave={() => setHoveredLabel(null)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl transition-all duration-200',
                      isCollapsed ? 'justify-center p-3' : 'px-3.5 py-3',
                      active
                        ? 'bg-primary/10 text-sidebar-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-sidebar-accent hover:text-slate-200'
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                    )}
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-all duration-300 shrink-0',
                        active
                          ? 'text-blue-400 scale-110'
                          : 'text-slate-500 group-hover:scale-110 group-hover:text-slate-300'
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
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-sidebar bg-green-500" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side={isCollapsed ? "right" : "top"} align="end" className="w-56" sideOffset={12}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/settings?tab=profile`} className="cursor-pointer w-full">
                    <Building className="mr-2 h-4 w-4" />
                    <span>{t('sidebar.profile', 'Profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/settings`} className="cursor-pointer w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('sidebar.settings', 'Settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={() => router.push(`/${locale}/logout`)}
                >
                  <Power className="mr-2 h-4 w-4" />
                  <span>{t('sidebar.signout', 'Sign out')}</span>
                </DropdownMenuItem>
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
            <ChevronLeft className={cn("h-4 w-4 text-slate-500 transition-transform group-hover:text-slate-200", isCollapsed && "rotate-180")} />
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
