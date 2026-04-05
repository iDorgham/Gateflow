'use client';

import * as React from 'react';
import { cn } from '@gateflow/ui';

export interface StreamingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dots' | 'pulse';
}

export function StreamingIndicator({
  variant = 'dots',
  className,
  ...props
}: StreamingIndicatorProps) {
  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          'flex h-2 w-12 items-center gap-1 rounded-full bg-[var(--ds-background-brand-subtle)] px-2',
          className
        )}
        {...props}
      >
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--ds-background-brand-bold)]" />
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--ds-background-brand-bold)] [animation-delay:200ms]" />
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--ds-background-brand-bold)] [animation-delay:400ms]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex h-4 w-10 items-center justify-center gap-1 bg-transparent px-1',
        className
      )}
      aria-busy="true"
      aria-label="AI is thinking"
      {...props}
    >
      <div className="h-1 w-1 bg-[var(--ds-background-neutral-pressed)] rounded-full animate-bounce [animation-duration:800ms]" />
      <div className="h-1 w-1 bg-[var(--ds-background-neutral-pressed)] rounded-full animate-bounce [animation-duration:800ms] [animation-delay:150ms]" />
      <div className="h-1 w-1 bg-[var(--ds-background-neutral-pressed)] rounded-full animate-bounce [animation-duration:800ms] [animation-delay:300ms]" />
    </div>
  );
}

StreamingIndicator.displayName = 'StreamingIndicator';
