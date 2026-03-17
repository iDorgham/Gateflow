'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  label?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, onClear, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[11px] font-bold text-[var(--ds-text-subtle,#6B778C)] dark:text-[#97A0AF] uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="relative group min-w-[140px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--ds-icon-subtle,#6B778C)] group-focus-within:text-[var(--ds-icon-selected,#0052CC)] transition-colors">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <input
            type="date"
            ref={ref}
            className={cn(
              "flex h-8 w-full rounded-sm border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] bg-[var(--ds-background-input,#FFFFFF)] dark:bg-[#1D2125] pl-9 pr-8 py-1.5 text-sm font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8] placeholder:text-[var(--ds-text-subtlest,#A5ADBA)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)] focus:border-[var(--ds-border-focused,#4C9AFF)] disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-[var(--ds-background-input-hovered,#FAFBFC)] dark:hover:bg-[#2C333A]",
              className
            )}
            {...props}
          />
          {props.value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-[var(--ds-background-neutral-subtle,#EBECF0)] dark:hover:bg-[#343A46] text-[var(--ds-icon-subtle,#6B778C)] transition-colors"
              title="Clear date"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
