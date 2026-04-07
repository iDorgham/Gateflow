import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * GateFlow Text Input - ATDS Core styled
 * Standardized to semantic tokens.
 */
export function Input({ className, type, ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-[var(--ds-border-radius-100)] border border-[var(--ds-border)] bg-[var(--ds-background-default)] px-3 py-2 text-sm font-semibold transition-all duration-150 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--ds-text-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused)] focus-visible:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--ds-background-neutral-subtle-hovered)]',
        className
      )}
      ref={ref}
      {...props}
    />
  );
}

Input.displayName = 'Input';
