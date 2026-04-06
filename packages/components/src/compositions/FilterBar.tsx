'use client';

import * as React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { Input, Button } from '@gateflow/ui';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  placeholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  onClear?: () => void;
  isLoading?: boolean;
}

export function FilterBar({
  onSearchChange,
  searchValue,
  placeholder = 'Search...',
  filters,
  actions,
  onClear,
  isLoading = false,
  className,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-1',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="relative flex-1 max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--ds-icon-subtle)] focus-within:text-[var(--ds-icon-brand)] transition-colors">
            <Search size={18} />
          </div>
          <Input
            autoFocus
            type="search"
            placeholder={placeholder}
            className="pl-10 h-10 w-full bg-[var(--ds-background-input)] border-[var(--ds-border)] focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[var(--ds-border-focused)] focus-visible:border-transparent transition-all hover:bg-[var(--ds-background-neutral-subtle)]"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          {searchValue && (
            <button
              onClick={onClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--ds-icon-subtle)] hover:text-[var(--ds-text)]"
            >
              <X size={16} />
              <span className="sr-only">Clear</span>
            </button>
          )}
        </div>
        {filters && (
          <div className="hidden md:flex items-center gap-2">
            <div className="h-6 w-px bg-[var(--ds-border-subtle)] mx-1" />
            {filters}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}
        {!filters && (
          <Button variant="outline" size="icon" className="md:hidden">
            <Filter size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}

FilterBar.displayName = 'FilterBar';
