'use client';

import * as React from 'react';
import { cn } from '@gateflow/ui/utils';
import { Card, CardContent, Badge } from '@gateflow/ui';
import { LucideIcon } from 'lucide-react';

export interface EntityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  status?: string;
  statusVariant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline';
  icon?: LucideIcon;
  meta?: { label: string; value: string }[];
  actions?: React.ReactNode;
}

export function EntityCard({
  title,
  subtitle,
  status,
  statusVariant = 'default',
  icon: Icon,
  meta,
  actions,
  className,
  ...props
}: EntityCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-[var(--ds-shadow-raised)]',
        className
      )}
      {...props}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            {Icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-icon)]">
                <Icon size={20} />
              </div>
            )}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--ds-text)] truncate">
                  {title}
                </h3>
                {status && (
                  <Badge
                    variant={statusVariant}
                    className="h-5 px-1.5 text-[10px] font-black uppercase tracking-wider"
                  >
                    {status}
                  </Badge>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-[var(--ds-text-subtle)] line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>

        {meta && meta.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--ds-border-subtle)] pt-4">
            {meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-tight text-[var(--ds-text-subtlest)]">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-[var(--ds-text)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

EntityCard.displayName = 'EntityCard';
