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
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white md:hidden">
      <div className="mx-auto flex w-full max-w-md items-center justify-around px-2 py-2">
        {portalNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors',
                active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
