'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
}

export function Breadcrumbs({
  items,
  showHome = true,
  homeHref = '/',
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs font-medium text-[var(--ds-text-subtle,#42526E)]', className)}
      {...props}
    >
      <ol className="flex items-center gap-1.5">
        {showHome && (
          <li className="flex items-center gap-1.5">
            <Link
              href={homeHref}
              className="hover:text-[var(--ds-text,#172B4D)] transition-colors p-0.5 rounded-sm hover:bg-[var(--ds-background-subtle,#F4F5F7)]"
              aria-label="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
            {items.length > 0 && (
              <ChevronRight className="h-3 w-3 text-[var(--ds-text-subtlest,#6B778C)] select-none rtl:rotate-180" />
            )}
          </li>
        )}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.active || isLast;

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isActive ? (
                <Link
                  href={item.href}
                  className="hover:text-[var(--ds-text,#172B4D)] transition-colors whitespace-nowrap p-0.5 rounded-sm hover:bg-[var(--ds-background-subtle,#F4F5F7)] font-bold tracking-tight"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn('whitespace-nowrap px-0.5', isActive && 'text-[var(--ds-text,#172B4D)] font-black uppercase tracking-widest')}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight className="h-3 w-3 text-[var(--ds-text-subtlest,#6B778C)] select-none rtl:rotate-180" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
