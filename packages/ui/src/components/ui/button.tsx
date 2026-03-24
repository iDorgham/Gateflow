'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * GateFlow Button — Atlassian Design System GA spec
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-[var(--ds-border-radius-200)]',
    'text-sm font-semibold',
    'ring-offset-background transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[var(--ds-border-focused)]',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    'active:scale-[0.98]',
    'select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--ds-background-neutral)]',
          'text-[var(--ds-text)]',
          'hover:bg-[var(--ds-background-neutral-hovered)]',
          'active:bg-[var(--ds-background-neutral-pressed)]',
        ].join(' '),
        primary: [
          'bg-[var(--ds-background-brand-bold)]',
          'text-[var(--ds-text-inverse)]',
          'hover:bg-[var(--ds-background-brand-bold-hovered)]',
          'active:bg-[var(--ds-background-brand-bold-pressed)]',
          'shadow-[var(--ds-shadow-raised)]',
        ].join(' '),
        brand: [
          'bg-[var(--ds-background-brand-bold)]',
          'text-[var(--ds-text-inverse)]',
          'hover:bg-[var(--ds-background-brand-bold-hovered)]',
          'active:bg-[var(--ds-background-brand-bold-pressed)]',
          'shadow-[var(--ds-shadow-raised)]',
        ].join(' '),
        destructive: [
          'bg-[var(--ds-background-danger-bold)]',
          'text-[var(--ds-text-inverse)]',
          'hover:bg-[var(--ds-background-danger-bold-hovered)]',
        ].join(' '),
        outline: [
          'border border-[var(--ds-border)]',
          'bg-transparent',
          'text-[var(--ds-text)]',
          'hover:bg-[var(--ds-background-neutral-subtle)]',
          'hover:border-[var(--ds-border-bold)]',
          'active:bg-[var(--ds-background-neutral-hovered)]',
        ].join(' '),
        secondary: [
          'bg-[var(--ds-background-selected)]',
          'text-[var(--ds-text-selected)]',
          'hover:bg-[var(--ds-background-selected-hovered)]',
        ].join(' '),
        ghost: [
          'bg-transparent',
          'text-[var(--ds-text-subtle)]',
          'hover:bg-[var(--ds-background-neutral-subtle)]',
          'active:bg-[var(--ds-background-neutral-hovered)]',
        ].join(' '),
        link: [
          'bg-transparent',
          'text-[var(--ds-text-link)]',
          'underline-offset-4 hover:underline',
          'hover:text-[var(--ds-text-brand)]',
          'p-0 h-auto',
        ].join(' '),
        subtle: [
          'bg-transparent',
          'text-[var(--ds-text-subtle)]',
          'hover:bg-[var(--ds-background-neutral-subtle)]',
        ].join(' '),
        success: [
          'bg-[var(--ds-background-success-bold)]',
          'text-[var(--ds-text-inverse)]',
          'hover:bg-[var(--ds-background-success-bold-hovered)]',
          'shadow-[var(--ds-shadow-raised)]',
        ].join(' '),
        warning: [
          'bg-[var(--ds-background-warning-bold)]',
          'text-[var(--ds-text-warning-inverse)]',
          'hover:bg-[var(--ds-background-warning-bold-hovered)]',
        ].join(' '),
        discovery: [
          'bg-[var(--ds-background-discovery-bold)]',
          'text-[var(--ds-text-inverse)]',
          'hover:bg-[var(--ds-background-discovery-bold-hovered)]',
          'shadow-[var(--ds-shadow-raised)]',
        ].join(' '),
        'discovery-subtle': [
          'bg-[var(--ds-background-discovery-subtle)]',
          'text-[var(--ds-text-discovery)]',
          'hover:bg-[var(--ds-background-discovery-subtle-hovered)]',
          'border border-[var(--ds-border-discovery)]',
        ].join(' '),
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base font-bold',
        icon: 'h-9 w-9 p-0 rounded-[var(--ds-border-radius-200)]',
        'icon-sm': 'h-7 w-7 p-0 text-xs rounded-[var(--ds-border-radius-200)]',
        compact: 'h-7 px-2 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * GateFlow Button - Plain function for React 19 compatibility
 */
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

Button.displayName = 'Button';

export { buttonVariants };
