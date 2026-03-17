'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Breadcrumbs, BreadcrumbItem } from './breadcrumbs';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  showHome = true,
  homeHref = '/',
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-2 mb-8', className)} {...props}>
      {breadcrumbs && (
        <Breadcrumbs items={breadcrumbs} showHome={showHome} homeHref={homeHref} />
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-1">
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ds-text)] truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
