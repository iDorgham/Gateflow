'use client';

import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@gateflow/ui';
import { portalNavItems } from './nav-items';
import { ThemeToggle } from '@/components/theme-toggle';

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
        'sticky top-0 hidden h-screen border-e border-ds-border bg-ds-surface/60 backdrop-blur-xl p-3 transition-all md:block',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="mb-6 flex items-center justify-between px-2">
        <span
          className={cn(
            'font-black uppercase tracking-widest text-[11px] text-ds-text-heading',
            collapsed && 'sr-only'
          )}
        >
          Resident Portal
        </span>
        <button
          onClick={onToggle}
          type="button"
          className="rounded-md p-2 text-ds-icon-subtle transition-colors hover:bg-ds-surface-raised hover:text-ds-text"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
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
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                active
                  ? 'bg-ds-background-selected text-ds-text-selected shadow-sm'
                  : 'text-ds-text-subtle hover:bg-ds-surface-raised hover:text-ds-text'
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  'font-bold tracking-tight',
                  collapsed && 'hidden'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="absolute inset-x-3 bottom-3">
        <ThemeToggle compact={collapsed} />
      </div>
    </aside>
  );
}
