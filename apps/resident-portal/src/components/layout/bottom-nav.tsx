'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@gateflow/ui';
import { portalNavItems } from './nav-items';

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ds-border bg-ds-surface/90 backdrop-blur-xl pb-safe md:hidden">
      <div className="mx-auto flex w-full max-w-sm items-center justify-around px-2 py-2">
        {portalNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-[72px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-black uppercase tracking-tighter transition-all',
                active
                  ? 'text-ds-text-selected bg-ds-background-selected/40 shadow-sm'
                  : 'text-ds-text-subtle hover:text-ds-text'
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
