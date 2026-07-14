'use client';

import * as React from 'react';
import { cn, Card, CardContent, Badge, LoadingSpinner } from '@gateflow/ui';
import { LucideIcon, Check, AlertCircle, Play } from 'lucide-react';

export type ToolStatus = 'pending' | 'running' | 'success' | 'error';

export interface ToolCallCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  status: ToolStatus;
  icon?: LucideIcon;
  arguments?: string | Record<string, unknown>;
  result?: string | React.ReactNode;
  collapsible?: boolean;
}

export function ToolCallCard({
  name,
  status,
  icon: Icon = Play,
  arguments: args,
  result,
  collapsible = true,
  className,
  ...props
}: ToolCallCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(!collapsible);
  const isRunning = status === 'running' || status === 'pending';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <Card
      className={cn(
        'my-2 bg-[var(--ds-background-neutral-subtle)] border shadow-sm transition-all',
        isRunning && 'border-[var(--ds-border-focused)] shadow-md',
        isError && 'border-[var(--ds-background-danger-bold)]',
        className
      )}
      {...props}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                isRunning && 'bg-[var(--ds-background-brand-bold)] text-white',
                isSuccess &&
                  'bg-[var(--ds-background-success-bold)] text-white',
                isError && 'bg-[var(--ds-background-danger-bold)] text-white',
                !isRunning &&
                  !isSuccess &&
                  !isError &&
                  'bg-[var(--ds-background-neutral-pressed)] text-[var(--ds-icon)]'
              )}
            >
              {isRunning ? (
                <LoadingSpinner size={16} />
              ) : isSuccess ? (
                <Check size={16} />
              ) : isError ? (
                <AlertCircle size={16} />
              ) : (
                <Icon size={16} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-[var(--ds-text-subtlest)] leading-none tracking-tight">
                Tool Invocation
              </span>
              <h5 className="text-sm font-bold text-[var(--ds-text)]">
                {name}
              </h5>
            </div>
          </div>

          <Badge
            variant={isSuccess ? 'success' : isError ? 'danger' : 'outline'}
            className="h-5 px-1.5 text-[9px] uppercase font-black"
          >
            {status}
          </Badge>
        </div>

        {args && (
          <div className="mt-3 overflow-hidden rounded-md bg-[var(--ds-background-neutral-subtle-hovered)] p-2">
            <pre className="text-[11px] font-mono text-[var(--ds-text-subtle)] whitespace-pre-wrap leading-relaxed">
              {typeof args === 'string' ? args : JSON.stringify(args, null, 2)}
            </pre>
          </div>
        )}

        {result && isExpanded && (
          <div className="mt-4 border-t border-[var(--ds-border-subtle)] pt-3 text-sm text-[var(--ds-text)]">
            {result}
          </div>
        )}

        {collapsible && result && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[10px] font-bold text-[var(--ds-text-brand)] hover:underline flex items-center gap-1 uppercase tracking-tight"
          >
            {isExpanded ? 'Hide Result' : 'View Result'}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

ToolCallCard.displayName = 'ToolCallCard';
