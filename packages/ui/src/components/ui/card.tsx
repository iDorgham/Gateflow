import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * GateFlow Card — ADS-inspired monorepo component
 * Uses semantic tokens only.
 */
const cardVariants = cva(
  [
    'rounded-[var(--ds-border-radius-400)]',
    'text-[var(--ds-text-primary)]',
    'transition-shadow',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--ds-surface-raised)]',
          'border border-[var(--ds-border)]',
          'shadow-[var(--ds-shadow-raised)]',
        ].join(' '),
        sunken: [
          'bg-[var(--ds-surface-sunken)]',
          'border border-[var(--ds-border-subtle)]',
        ].join(' '),
        overlay: [
          'bg-[var(--ds-surface-overlay)]',
          'border border-[var(--ds-border)]',
          'shadow-[var(--ds-shadow-overlay)]',
        ].join(' '),
        ghost: 'bg-transparent border-transparent',
        outline: 'bg-transparent border-2 border-[var(--ds-border)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

Card.displayName = 'Card';

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  );
}

CardHeader.displayName = 'CardHeader';

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-[var(--ds-text-primary)]',
        className
      )}
      {...props}
    />
  );
}

CardTitle.displayName = 'CardTitle';

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-[var(--ds-text-subtle)]', className)}
      {...props}
    />
  );
}

CardDescription.displayName = 'CardDescription';

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

CardContent.displayName = 'CardContent';

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
  );
}

CardFooter.displayName = 'CardFooter';

export { cardVariants };
