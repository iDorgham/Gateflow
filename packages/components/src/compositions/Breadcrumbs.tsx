'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
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
      className={cn('flex items-center text-sm', className)}
      {...props}
    >
      <ol className="flex items-center gap-2 list-none m-0 p-0">
        {showHome && (
          <li className="flex items-center">
            <Link
              href={homeHref}
              className="flex items-center gap-1.5 text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)] transition-colors p-1"
            >
              <Home size={14} />
              <span className="font-medium">Home</span>
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={item.label}>
              <li className="flex items-center text-[var(--ds-border-bold)] rtl:rotate-180">
                <ChevronRight size={14} />
              </li>
              <li className="flex items-center">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)] transition-colors font-medium px-1"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'px-1 font-medium',
                      isLast || item.active
                        ? 'text-[var(--ds-text)]'
                        : 'text-[var(--ds-text-subtle)]'
                    )}
                    aria-current={isLast || item.active ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumbs.displayName = 'Breadcrumbs';
