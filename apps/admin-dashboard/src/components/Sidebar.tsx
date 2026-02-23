'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  ScanLine,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@gate-access/ui';

const NAV: { href: string; label: string; icon: any; exact?: boolean }[] = [
  { href: '/', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/scans', label: 'Scan Logs', icon: ScanLine },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            G
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground uppercase">GateFlow</span>
            <span className="text-[9px] font-bold text-blue-400 tracking-[0.2em] uppercase">Control</span>
          </div>
        </Link>
        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-sidebar-muted border border-sidebar-border">
          <ShieldCheck className="h-3 w-3 text-blue-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 opacity-60">
          Super Admin
        </p>
        {NAV.map((item) => {
          const active =
            item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
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
                  'h-[18px] w-[18px] transition-all duration-300',
                  active ? 'text-blue-400 scale-110' : 'text-slate-500 group-hover:scale-110 group-hover:text-slate-300'
                )}
              />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account */}
      <div className="mt-auto shrink-0 border-t border-sidebar-border p-4">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className="h-[18px] w-[18px] text-slate-500 group-hover:text-red-400 transition-colors" />
          <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
        </button>
      </div>
    </div>
  );
}
