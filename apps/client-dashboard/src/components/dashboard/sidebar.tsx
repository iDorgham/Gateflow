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
  FolderKanban,
  Users,
  Settings,
  LogOut,
  ChevronsUpDown,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@gate-access/ui';

const MAIN_NAV = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'QR Codes', href: '/dashboard/qrcodes', icon: QrCode },
  { label: 'Scan Logs', href: '/dashboard/scans', icon: ScanLine },
  { label: 'Gates', href: '/dashboard/gates', icon: Shield },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
];

const WORKSPACE_NAV = [
  {
    label: 'Projects',
    href: '/dashboard/settings?tab=projects',
    icon: FolderKanban,
  },
  { label: 'Team', href: '/dashboard/settings?tab=team', icon: Users },
  {
    label: 'Settings',
    href: '/dashboard/settings?tab=workspace',
    icon: Settings,
  },
];

interface NavGroup {
  label: string;
  items: typeof MAIN_NAV;
}

const NAV_GROUPS: NavGroup[] = [
  { label: 'Operations', items: MAIN_NAV },
  { label: 'Workspace', items: WORKSPACE_NAV },
];

interface SidebarProps {
  org: { name: string; plan: string } | null;
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
}

export function Sidebar({ org, projects, currentProjectId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleProjectSwitch = (projectId: string) => {
    const val = projectId === 'all' ? 'all' : projectId;
    fetch('/api/project/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: val }),
    }).then(() => {
      startTransition(() => {
        router.refresh();
      });
    });
  };

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl relative z-20">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            G
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground uppercase">
              GateFlow
            </span>
            <span className="text-[9px] font-bold text-blue-400 tracking-[0.2em] uppercase">
              Client
            </span>
          </div>
        </Link>
        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-sidebar-accent border border-sidebar-border">
          <ShieldCheck className="h-3 w-3 text-blue-400" />
        </div>
      </div>

      {/* Org & Project Context */}
      <div className="px-3 py-4 space-y-4">
        {org && (
          <div className="px-3 py-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-bold truncate">{org.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {org.plan} Plan
              </span>
            </div>
          </div>
        )}

        {/* Project Switcher */}
        {projects.length > 0 && (
          <div className="relative group px-1">
            <p className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 opacity-70">
              Active Project
            </p>
            <div className="relative">
              <select
                value={currentProjectId ?? 'all'}
                onChange={(e) => handleProjectSwitch(e.target.value)}
                disabled={isPending}
                className="w-full appearance-none rounded-xl bg-sidebar-accent border border-sidebar-border px-3.5 py-2.5 text-sm font-bold text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 transition-all hover:bg-sidebar-accent/80"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 opacity-70">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
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
                    <span className="flex-1 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Sign Out */}
      <div className="mt-auto shrink-0 border-t border-sidebar-border p-4">
        <Link
          href="/logout"
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-[17px] w-[17px] text-slate-500 group-hover:text-red-400 transition-colors shrink-0" />
          <span>Sign out</span>
        </Link>
      </div>
    </div>
  );
}
