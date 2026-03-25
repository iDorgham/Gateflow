import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[3px] px-1.5 py-0.5 text-[11px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-tight',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--ds-background-neutral,#DFE1E6)] text-[var(--ds-text,#172B4D)]',
        primary:
          'border-transparent bg-[var(--ds-background-brand-bold,#0052CC)] text-[var(--ds-text-inverse,#FFFFFF)]',
        secondary:
          'border-transparent bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--ds-text-selected,#0747A6)]',
        success:
          'border-transparent bg-[var(--ds-background-success-bold,#00875A)] text-[var(--ds-text-inverse,#FFFFFF)]',
        danger:
          'border-transparent bg-[var(--ds-background-danger-bold,#DE350B)] text-[var(--ds-text-inverse,#FFFFFF)]',
        warning:
          'border-transparent bg-[var(--ds-background-warning-bold,#FFAB00)] text-[var(--ds-text-warning-inverse,#172B4D)]',
        outline:
          'border-[var(--ds-border,#DFE1E6)] text-[var(--ds-text-subtle,#42526E)] bg-transparent',
        subtle:
          'border-transparent bg-[var(--ds-background-neutral-subtle,#F4F5F7)] text-[var(--ds-text-subtle,#42526E)]',
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
