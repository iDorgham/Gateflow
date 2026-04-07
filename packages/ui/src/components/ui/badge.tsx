import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[11px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-tight',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--ds-background-neutral)] text-[var(--ds-text)]',
        primary:
          'border-transparent bg-[var(--ds-background-brand-bold)] text-[var(--ds-text-inverse)]',
        secondary:
          'border-transparent bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]',
        success:
          'border-transparent bg-[var(--ds-background-success-bold)] text-[var(--ds-text-inverse)]',
        danger:
          'border-transparent bg-[var(--ds-background-danger-bold)] text-[var(--ds-text-inverse)]',
        warning:
          'border-transparent bg-[var(--ds-background-warning-bold)] text-[var(--ds-text-warning-inverse)]',
        info: 'border-transparent bg-[var(--ds-background-information-bold)] text-[var(--ds-text-inverse)]',
        outline:
          'border-[var(--ds-border)] text-[var(--ds-text-subtle)] bg-transparent',
        subtle:
          'border-transparent bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
