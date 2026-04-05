'use client';

import * as React from 'react';
import { cn } from '@gateflow/ui';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  titleClassName?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  showHome = true,
  homeHref = '/',
  className,
  titleClassName,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-6 mb-8', className)} {...props}>
      {breadcrumbs && (
        <Breadcrumbs
          items={breadcrumbs}
          showHome={showHome}
          homeHref={homeHref}
        />
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-1">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1
              className={cn(
                'text-2xl font-black tracking-tight text-[var(--ds-text)] dark:text-white truncate',
                titleClassName
              )}
            >
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}

PageHeader.displayName = 'PageHeader';
export type { BreadcrumbItem };
