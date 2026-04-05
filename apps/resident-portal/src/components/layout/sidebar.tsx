'use client';

import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@gateflow/ui';
import { portalNavItems } from './nav-items';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen border-e border-slate-200 bg-white p-3 transition-all md:block',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="mb-6 flex items-center justify-between px-2">
        <span
          className={cn('font-semibold text-slate-900', collapsed && 'sr-only')}
        >
          Resident Portal
        </span>
        <button
          onClick={onToggle}
          type="button"
          className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="space-y-1">
        {portalNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={cn(collapsed && 'hidden')}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
