'use client';

import * as React from 'react';
import { cn } from '@gateflow/ui/utils';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { InstallGuide } from './InstallGuide';
import { motion } from 'framer-motion';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  titleClassName?: string;
  packageName?: string;
  installCommand?: string;
}

/**
 * PageHeader - Premium Redesign Component
 * Uses semantic tokens for typography and layout.
 */
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
  packageName,
  installCommand,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-6 mb-12 relative', className)}
      {...props}
    >
      {/* Decorative background accent — uses dynamic accent profile */}
      <div className="absolute -top-12 -left-12 h-64 w-64 bg-[var(--ds-primary-accent)]/5 rounded-full blur-[100px] pointer-events-none opacity-100 transition-all duration-1000" />

      {breadcrumbs && (
        <Breadcrumbs
          items={breadcrumbs}
          showHome={showHome}
          homeHref={homeHref}
        />
      )}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between py-1 relative z-10">
        <div className="flex flex-col gap-5 min-w-0 flex-1">
          <div className="flex flex-col gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center gap-3"
            >
              <h1
                className={cn(
                  'text-3xl md:text-4xl font-black tracking-tight text-[var(--ds-text-primary)] truncate py-0.5',
                  titleClassName
                )}
              >
                {title}
              </h1>
              {badge}
            </motion.div>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                className="text-base text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {(packageName || installCommand) && (
            <div className="max-w-fit">
              <InstallGuide
                packageName={packageName}
                command={installCommand}
              />
            </div>
          )}
        </div>

        {actions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-3 shrink-0 self-start md:self-center"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
}

PageHeader.displayName = 'PageHeader';
export type { BreadcrumbItem };
