import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * GateFlow Input — Impeccable GA Spec
 * Semantic tokens, density-aware (Compact 36px vs Comfortable 48px), focus ring.
 */
export function Input({ className, type, ref, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-[var(--ds-control-height)] w-full rounded-[var(--ds-radius-md)] border border-[var(--ds-border-subtle)] bg-[var(--ds-layer-01)] px-[var(--ds-control-padding-x)] py-[var(--ds-control-padding-y)] text-sm font-medium text-[var(--ds-text-primary)] transition-all duration-150 placeholder:text-[var(--ds-text-subtlest)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused)] focus-visible:border-[var(--ds-border-focused)] disabled:cursor-not-allowed disabled:opacity-40 hover:border-[var(--ds-border-bold)]',
        className
      )}
      ref={ref}
      {...props}
    />
  );
}

Input.displayName = 'Input';
