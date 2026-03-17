import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
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
);
Input.displayName = 'Input';

export { Input };
