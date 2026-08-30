'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * GateFlow Badge / Tag System (v7.1 Overhaul)
 * 5 architectural variants, 3 sizes, accessible remove triggers, and pulsating live dot indicator.
 */
const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused)] select-none',
  {
    variants: {
      variant: {
        solid: 'border-transparent text-[var(--ds-text-inverse)] shadow-sm',
        soft: 'border-transparent',
        outline: 'border bg-transparent',
        ghost: 'border-transparent bg-transparent',
        dot: 'border-transparent bg-transparent gap-1.5',
      },
      tone: {
        primary: '',
        neutral: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
        aiLab: '',
      },
      size: {
        sm: 'h-5 px-2 text-[11px] rounded-[var(--ds-radius-sm)]',
        md: 'h-6 px-2.5 text-xs rounded-[var(--ds-radius-md)]',
        lg: 'h-7 px-3 text-sm rounded-[var(--ds-radius-md)]',
      },
    },
    compoundVariants: [
      // Solid Tones
      { variant: 'solid', tone: 'primary', className: 'bg-[var(--ds-color-primary)] text-white' },
      { variant: 'solid', tone: 'neutral', className: 'bg-[var(--ds-layer-03)] text-[var(--ds-text-primary)] border border-[var(--ds-border-subtle)]' },
      { variant: 'solid', tone: 'success', className: 'bg-[var(--ds-color-success)] text-white' },
      { variant: 'solid', tone: 'warning', className: 'bg-[var(--ds-color-warning)] text-white' },
      { variant: 'solid', tone: 'danger', className: 'bg-[var(--ds-color-danger)] text-white' },
      { variant: 'solid', tone: 'info', className: 'bg-[var(--ds-color-info)] text-white' },
      { variant: 'solid', tone: 'aiLab', className: 'bg-[var(--ds-color-ai-lab)] text-white' },

      // Soft Tones (Subtle tint background + saturated text)
      { variant: 'soft', tone: 'primary', className: 'bg-[var(--ds-color-primary-subtle)] text-[var(--ds-text-brand)]' },
      { variant: 'soft', tone: 'neutral', className: 'bg-[var(--ds-layer-01)] text-[var(--ds-text-subtle)] border border-[var(--ds-border-subtle)]' },
      { variant: 'soft', tone: 'success', className: 'bg-emerald-500/10 text-[var(--ds-color-success)]' },
      { variant: 'soft', tone: 'warning', className: 'bg-amber-500/10 text-[var(--ds-color-warning)]' },
      { variant: 'soft', tone: 'danger', className: 'bg-rose-500/10 text-[var(--ds-color-danger)]' },
      { variant: 'soft', tone: 'info', className: 'bg-blue-500/10 text-[var(--ds-color-info)]' },
      { variant: 'soft', tone: 'aiLab', className: 'bg-purple-500/10 text-[var(--ds-color-ai-lab)]' },

      // Outline Tones
      { variant: 'outline', tone: 'primary', className: 'border-[var(--ds-color-primary)] text-[var(--ds-text-brand)]' },
      { variant: 'outline', tone: 'neutral', className: 'border-[var(--ds-border-subtle)] text-[var(--ds-text-subtle)]' },
      { variant: 'outline', tone: 'success', className: 'border-[var(--ds-color-success)] text-[var(--ds-color-success)]' },
      { variant: 'outline', tone: 'warning', className: 'border-[var(--ds-color-warning)] text-[var(--ds-color-warning)]' },
      { variant: 'outline', tone: 'danger', className: 'border-[var(--ds-color-danger)] text-[var(--ds-color-danger)]' },
      { variant: 'outline', tone: 'info', className: 'border-[var(--ds-color-info)] text-[var(--ds-color-info)]' },
      { variant: 'outline', tone: 'aiLab', className: 'border-[var(--ds-color-ai-lab)] text-[var(--ds-color-ai-lab)]' },

      // Ghost Tones
      { variant: 'ghost', tone: 'primary', className: 'text-[var(--ds-text-brand)] hover:bg-[var(--ds-color-primary-subtle)]' },
      { variant: 'ghost', tone: 'neutral', className: 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-layer-01)]' },
      { variant: 'ghost', tone: 'success', className: 'text-[var(--ds-color-success)] hover:bg-emerald-500/10' },
      { variant: 'ghost', tone: 'warning', className: 'text-[var(--ds-color-warning)] hover:bg-amber-500/10' },
      { variant: 'ghost', tone: 'danger', className: 'text-[var(--ds-color-danger)] hover:bg-rose-500/10' },
      { variant: 'ghost', tone: 'info', className: 'text-[var(--ds-color-info)] hover:bg-blue-500/10' },
      { variant: 'ghost', tone: 'aiLab', className: 'text-[var(--ds-color-ai-lab)] hover:bg-purple-500/10' },

      // Dot Tones (Text color)
      { variant: 'dot', tone: 'primary', className: 'text-[var(--ds-text-brand)]' },
      { variant: 'dot', tone: 'neutral', className: 'text-[var(--ds-text-subtle)]' },
      { variant: 'dot', tone: 'success', className: 'text-[var(--ds-color-success)]' },
      { variant: 'dot', tone: 'warning', className: 'text-[var(--ds-color-warning)]' },
      { variant: 'dot', tone: 'danger', className: 'text-[var(--ds-color-danger)]' },
      { variant: 'dot', tone: 'info', className: 'text-[var(--ds-color-info)]' },
      { variant: 'dot', tone: 'aiLab', className: 'text-[var(--ds-color-ai-lab)]' },
    ],
    defaultVariants: {
      variant: 'soft',
      tone: 'neutral',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  isRemovable?: boolean;
  onRemove?: () => void;
  pulse?: boolean;
}

export function Badge({
  className,
  variant = 'soft',
  tone = 'neutral',
  size = 'md',
  isRemovable,
  onRemove,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, tone, size }), className)}
      {...props}
    >
      {variant === 'dot' && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                tone === 'primary' && 'bg-[var(--ds-color-primary)]',
                tone === 'success' && 'bg-[var(--ds-color-success)]',
                tone === 'warning' && 'bg-[var(--ds-color-warning)]',
                tone === 'danger' && 'bg-[var(--ds-color-danger)]',
                tone === 'aiLab' && 'bg-[var(--ds-color-ai-lab)]',
                tone === 'info' && 'bg-[var(--ds-color-info)]',
                tone === 'neutral' && 'bg-[var(--ds-text-subtle)]'
              )}
            />
          )}
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              tone === 'primary' && 'bg-[var(--ds-color-primary)]',
              tone === 'success' && 'bg-[var(--ds-color-success)]',
              tone === 'warning' && 'bg-[var(--ds-color-warning)]',
              tone === 'danger' && 'bg-[var(--ds-color-danger)]',
              tone === 'aiLab' && 'bg-[var(--ds-color-ai-lab)]',
              tone === 'info' && 'bg-[var(--ds-color-info)]',
              tone === 'neutral' && 'bg-[var(--ds-text-subtle)]'
            )}
          />
        </span>
      )}

      <span>{children}</span>

      {isRemovable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ms-1 inline-flex items-center justify-center p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors focus:outline-none"
          aria-label="Remove badge"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

Badge.displayName = 'Badge';

export { badgeVariants };
