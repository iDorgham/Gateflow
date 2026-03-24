import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * GateFlow Text Input - ATDS Core styled
 * Refactored to plain function for React 19 / Next.js 15 build worker stability
 */
export function Input({ className, type, ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-[var(--ds-border-radius-100,#3px)] border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-default,#FFFFFF)] px-3 py-2 text-sm font-semibold transition-all duration-150 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--ds-text-subtlest,#A5ADBA)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused,#4C9AFF)] focus-visible:border-[var(--ds-border-focused,#4C9AFF)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--ds-background-neutral-subtle-hovered,#EBECF0)]',
        className
      )}
      ref={ref}
      {...props}
    />
  );
}

Input.displayName = 'Input';
