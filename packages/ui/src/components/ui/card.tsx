'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * GateFlow Card (v7.1 Overhaul)
 * Supports default, interactive (hover lift + glow), selectable, and metric variants.
 */
const cardVariants = cva(
  'rounded-[var(--ds-radius-lg)] text-[var(--ds-text-primary)] transition-all duration-200 text-start',
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--ds-layer-02)]',
          'border border-[var(--ds-border-subtle)]',
          'shadow-[var(--ds-glow-subtle)]',
        ].join(' '),
        interactive: [
          'bg-[var(--ds-layer-02)]',
          'border border-[var(--ds-border-subtle)]',
          'shadow-[var(--ds-glow-subtle)]',
          'cursor-pointer',
          'hover:translate-y-[-2px]',
          'hover:border-[var(--ds-border-bold)]',
          'hover:shadow-[var(--ds-glow-focused)]',
          'active:translate-y-[0px]',
          'active:scale-[0.99]',
        ].join(' '),
        selectable: [
          'bg-[var(--ds-layer-02)]',
          'border border-[var(--ds-border-subtle)]',
          'cursor-pointer',
          'hover:border-[var(--ds-border-bold)]',
        ].join(' '),
        sunken: [
          'bg-[var(--ds-layer-01)]',
          'border border-[var(--ds-border-subtle)]',
        ].join(' '),
        raised: [
          'bg-[var(--ds-layer-03)]',
          'border border-[var(--ds-border-subtle)]',
          'shadow-[var(--ds-glow-focused)]',
        ].join(' '),
        metric: [
          'bg-[var(--ds-layer-02)]',
          'border border-[var(--ds-border-subtle)]',
          'p-5 flex flex-col justify-between',
        ].join(' '),
        ghost: 'bg-transparent border-transparent shadow-none',
        outline: 'bg-transparent border-2 border-[var(--ds-border-subtle)]',
      },
      isSelected: {
        true: 'border-[var(--ds-color-primary)] ring-2 ring-[var(--ds-color-primary)] ring-offset-2 ring-offset-[var(--ds-layer-01)] shadow-[var(--ds-glow-focused)]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      isSelected: false,
    },
  }
);

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  isSelected?: boolean;
}

export function Card({ className, variant, isSelected, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, isSelected }), className)}
      {...props}
    />
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
        'text-base font-semibold leading-none tracking-tight text-[var(--ds-text-primary)]',
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
