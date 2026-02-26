'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Building2,
  Users,
  ScanLine,
  LogOut,
  ShieldCheck,
  FolderOpen,
  DoorOpen,
  BarChart3,
  ScrollText,
  Activity,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@gate-access/ui';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// To support i18n safely within the component
const getNavGroups = (t: any): NavGroup[] => [
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
    label: t('admin:nav.system', 'System'),
    items: [
      { href: '/monitoring', label: t('admin:nav.monitoring'), icon: Activity },
      { href: '/settings', label: t('admin:nav.settings'), icon: Settings },
      { href: '/admins', label: t('admin:nav.admins'), icon: Shield },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [signingOut, setSigningOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navGroups = getNavGroups(t);
  const localePrefix = `/${i18n.language}`;

  async function handleSignOut() {
    setSigningOut(true);
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div 
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 shrink-0 items-center border-b border-sidebar-border px-6", isCollapsed ? "justify-center px-0" : "justify-between")}>
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            GF
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-sidebar-foreground uppercase">GateFlow</span>
              <span className="text-[9px] font-bold text-blue-400 tracking-[0.2em] uppercase">Control</span>
            </div>
          )}
        </Link>
        {!isCollapsed && (
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-sidebar-accent border border-sidebar-border">
            <ShieldCheck className="h-3 w-3 text-blue-400" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 opacity-70">
                {group.label}
              </p>
            )}
            <div className={cn("space-y-0.5", isCollapsed && "flex flex-col items-center")}>
              {group.items.map((item) => {
                const itemHref = `${localePrefix}${item.href === '/' ? '' : item.href}`;
                const active =
                  item.exact
                    ? pathname === itemHref || pathname === `${itemHref}/`
                    : pathname.startsWith(itemHref);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={itemHref}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-primary/10 text-sidebar-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-sidebar-accent hover:text-slate-200',
                      isCollapsed && 'justify-center px-0 w-10 h-10'
                    )}
                  >
                    {active && (
                      <span className="absolute rtl:right-0 ltr:left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                    )}
                    <Icon
                      className={cn(
                        'h-[17px] w-[17px] transition-all duration-300 shrink-0',
                        active
                          ? 'text-blue-400 scale-110'
                          : 'text-slate-500 group-hover:scale-110 group-hover:text-slate-300'
                      )}
                    />
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Sign out */}
      <div className={cn("mt-auto shrink-0 border-t border-sidebar-border p-3", isCollapsed ? "px-2" : "px-3")}>
        <div className={cn("flex items-center gap-2", isCollapsed ? "flex-col" : "flex-row")}>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className={cn(
              "group flex items-center gap-3 rounded-xl transition-all duration-200 disabled:opacity-50 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400",
              isCollapsed ? "justify-center w-10 h-10 px-0" : "flex-1 px-4 py-3"
            )}
            title={isCollapsed ? t('admin:nav.signOut', 'Sign out') : undefined}
          >
            <LogOut className="h-[17px] w-[17px] text-slate-500 group-hover:text-red-400 transition-colors shrink-0 rtl:rotate-180" />
            {!isCollapsed && <span className="truncate">{signingOut ? '...' : t('admin:nav.signOut', 'Sign out')}</span>}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "group flex items-center justify-center rounded-xl transition-all duration-200 text-slate-400 hover:bg-sidebar-accent hover:text-slate-200",
              isCollapsed ? "w-10 h-10" : "w-12 h-12"
            )}
            title={isCollapsed ? t('admin:nav.expand') : t('admin:nav.collapse')}
          >
            {isCollapsed ? (
              <ChevronRight className="h-[18px] w-[18px] text-slate-500 group-hover:text-slate-200 transition-colors shrink-0 rtl:rotate-180" />
            ) : (
              <ChevronLeft className="h-[18px] w-[18px] text-slate-500 group-hover:text-slate-200 transition-colors shrink-0 rtl:rotate-180" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
