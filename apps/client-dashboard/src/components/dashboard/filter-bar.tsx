'use client';

import React from 'react';
import { cn, Input, NativeSelect } from '@gate-access/ui';
import { Search } from 'lucide-react';

// ─── Container ────────────────────────────────────────────────────────────────

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card px-4 py-3 flex flex-wrap items-center gap-2',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── DatePresets ──────────────────────────────────────────────────────────────

type DatePreset = '7d' | '30d' | 'custom';

interface DatePresetsProps {
  value: DatePreset | string;
  onChange: (preset: DatePreset) => void;
  labels?: Partial<Record<DatePreset, string>>;
  className?: string;
}

FilterBar.DatePresets = function DatePresets({
  value,
  onChange,
  labels = {},
  className,
}: DatePresetsProps) {
  const presets: { key: DatePreset; label: string }[] = [
    { key: '7d', label: labels['7d'] ?? '7d' },
    { key: '30d', label: labels['30d'] ?? '30d' },
    { key: 'custom', label: labels['custom'] ?? 'Custom' },
  ];

  return (
    <div className={cn('flex items-center gap-1 rounded-xl bg-muted/50 p-1', className)}>
      {presets.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'rounded-lg px-3 py-1 text-xs font-semibold transition-colors',
            value === key
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

// ─── Select ───────────────────────────────────────────────────────────────────

interface FilterBarSelectProps extends React.ComponentPropsWithoutRef<typeof NativeSelect> {
  icon?: React.ReactNode;
  containerClassName?: string;
}

FilterBar.Select = function FilterBarSelect({
  icon,
  containerClassName,
  className,
  ...props
}: FilterBarSelectProps) {
  return (
    <div className={cn('relative flex items-center', containerClassName)}>
      {icon && (
        <span className="pointer-events-none absolute left-2.5 flex items-center text-muted-foreground [&>svg]:h-3.5 [&>svg]:w-3.5">
          {icon}
        </span>
      )}
      <NativeSelect
        className={cn('h-9 rounded-xl text-xs', icon ? 'pl-8' : 'pl-3', className)}
        {...props}
      />
    </div>
  );
};

// ─── Search ───────────────────────────────────────────────────────────────────

interface FilterBarSearchProps extends React.ComponentPropsWithoutRef<typeof Input> {
  containerClassName?: string;
}

FilterBar.Search = function FilterBarSearch({ containerClassName, className, ...props }: FilterBarSearchProps) {
  return (
    <div className={cn('relative ml-auto', containerClassName)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        className={cn('h-9 rounded-xl pl-8 text-xs', className)}
        {...props}
      />
    </div>
  );
};

// ─── Divider ──────────────────────────────────────────────────────────────────

interface FilterBarDividerProps {
  className?: string;
}

FilterBar.Divider = function FilterBarDivider({ className }: FilterBarDividerProps) {
  return <div className={cn('h-6 w-px bg-border/50 hidden sm:block', className)} />;
};
