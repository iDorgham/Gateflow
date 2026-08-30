'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * GateFlow Button — Impeccable GA Spec
 * Accessible, density-aware, micro-interactions, dark mode inner rim highlight.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-[var(--ds-radius-md)]',
    'text-sm font-semibold',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[var(--ds-border-focused)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-layer-01)]',
    'disabled:pointer-events-none disabled:opacity-40 select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--ds-layer-03)]',
          'text-[var(--ds-text-primary)]',
          'border border-[var(--ds-border-subtle)]',
          'hover:bg-[var(--ds-layer-04)] hover:border-[var(--ds-border-bold)]',
          'active:scale-[0.98]',
        ].join(' '),
        primary: [
          'bg-[var(--ds-color-primary)]',
          'text-white font-medium',
          'shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
          'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.4)]',
          'hover:bg-[var(--ds-color-primary-hover)] hover:translate-y-[-1px]',
          'active:translate-y-[0px] active:scale-[0.98]',
        ].join(' '),
        secondary: [
          'bg-[var(--ds-layer-03)]',
          'text-[var(--ds-text-primary)]',
          'border border-[var(--ds-border-subtle)]',
          'hover:bg-[var(--ds-layer-04)]',
          'active:scale-[0.98]',
        ].join(' '),
        destructive: [
          'bg-[var(--ds-color-danger)]',
          'text-white font-medium',
          'hover:bg-red-600',
          'active:scale-[0.98]',
        ].join(' '),
        outline: [
          'border border-[var(--ds-border-subtle)]',
          'bg-transparent',
          'text-[var(--ds-text-primary)]',
          'hover:bg-[var(--ds-layer-02)] hover:border-[var(--ds-border-bold)]',
          'active:scale-[0.98]',
        ].join(' '),
        ghost: [
          'bg-transparent',
          'text-[var(--ds-text-subtle)]',
          'hover:bg-[var(--ds-layer-02)] hover:text-[var(--ds-text-primary)]',
          'active:scale-[0.98]',
        ].join(' '),
        link: [
          'bg-transparent',
          'text-[var(--ds-text-brand)]',
          'underline-offset-4 hover:underline',
          'p-0 h-auto',
        ].join(' '),
        fab: [
          'bg-[var(--ds-color-primary)]',
          'text-white font-bold',
          'rounded-full',
          'shadow-[0_8px_24px_rgba(0,0,0,0.35)]',
          'hover:scale-105 hover:bg-[var(--ds-color-primary-hover)]',
          'active:scale-95',
        ].join(' '),
      },
      size: {
        default: 'h-[var(--ds-control-height)] px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        md: 'h-[var(--ds-control-height)] px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        compact: 'h-9 px-3 text-xs',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-7 w-7 p-0 text-xs',
        fab: 'h-14 w-14 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const isDisabled = disabled || isLoading;

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

Button.displayName = 'Button';

export { buttonVariants };
