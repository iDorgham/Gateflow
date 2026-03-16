import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Card — ADS Phase 6
 * Uses elevation surface and shadow tokens.
 * Elevation levels: sunken < default < raised < overlay
 */
const cardVariants = cva(
  [
    'rounded-[var(--ds-border-radius-400,8px)]',
    'text-[var(--ds-text,#172B4D)]',
    'transition-shadow',
  ].join(' '),
  {
    variants: {
      variant: {
        // Raised card — the standard dashboard card
        default: [
          'bg-[var(--ds-surface-raised,#FFFFFF)]',
          'border border-[var(--ds-border,#DFE1E6)]',
          'shadow-[var(--ds-shadow-raised,0_1px_1px_rgba(9,30,66,.25),0_0_0_1px_rgba(9,30,66,.08))]',
        ].join(' '),
        // Sunken "inset" panel (e.g. sidebar background)
        sunken: [
          'bg-[var(--ds-surface-sunken,#F4F5F7)]',
          'border border-[var(--ds-border-subtle,#EBECF0)]',
        ].join(' '),
        // Overlay — modals, popovers, dropdowns
        overlay: [
          'bg-[var(--ds-surface-overlay,#FFFFFF)]',
          'border border-[var(--ds-border,#DFE1E6)]',
          'shadow-[var(--ds-shadow-overlay,0_8px_16px_-4px_rgba(9,30,66,.25),0_0_0_1px_rgba(9,30,66,.08))]',
        ].join(' '),
        // No background / border — for transparent areas
        ghost: 'bg-transparent border-transparent',
        // Explicit outline with no fill
        outline: 'bg-transparent border-2 border-[var(--ds-border,#DFE1E6)]',
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

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-[var(--ds-text,#172B4D)]',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[var(--ds-text-subtle,#42526E)]', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};


