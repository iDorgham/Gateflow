import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-8 w-full rounded-sm border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] bg-[var(--ds-background-input,#FFFFFF)] dark:bg-[#1D2125] px-3 py-1.5 text-sm font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8] transition-all hover:bg-[var(--ds-background-input-hovered,#FAFBFC)] dark:hover:bg-[#2C333A] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)] focus:border-[var(--ds-border-focused,#4C9AFF)] placeholder:text-[var(--ds-text-subtlest,#A5ADBA)] disabled:cursor-not-allowed disabled:opacity-50',
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
