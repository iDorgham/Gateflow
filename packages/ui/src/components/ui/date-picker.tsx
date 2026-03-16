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
          <label className="text-[11px] font-black text-[var(--ds-text-subtle,#6B778C)] dark:text-[#97A0AF] uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--ds-icon-subtle,#6B778C)] group-focus-within:text-[var(--ds-icon-selected,#0052CC)] transition-colors">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <input
            type="date"
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-lg border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] bg-white dark:bg-[#2C333A] pl-10 pr-10 py-2 text-sm font-bold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--ds-text-subtlest,#A5ADBA)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused,#4C9AFF)] focus-visible:border-[var(--ds-border-focused,#4C9AFF)] disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:border-[var(--ds-border-focused,#0052CC)]",
              className
            )}
            {...props}
          />
          {props.value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--ds-background-neutral-subtle,#EBECF0)] text-[var(--ds-icon-subtle,#6B778C)] transition-colors"
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
