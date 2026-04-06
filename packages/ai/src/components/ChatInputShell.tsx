'use client';

import * as React from 'react';
import { Send, Plus, LucideIcon } from 'lucide-react';
import { cn, Button, Textarea } from '@gateflow/ui';

export interface ChatInputShellProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  onActionClick?: (action: string) => void;
  actions?: { label: string; icon?: LucideIcon; id: string }[];
}

export function ChatInputShell({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  isLoading = false,
  onActionClick,
  actions,
  className,
  ...props
}: ChatInputShellProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div
      className={cn(
        'relative flex w-full flex-col gap-2 rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-background-input)] p-2 shadow-lg transition-all focus-within:border-[var(--ds-border-focused)] focus-within:ring-2 focus-within:ring-[var(--ds-border-focused)] focus-within:ring-offset-2',
        className
      )}
      {...props}
    >
      <Textarea
        rows={1}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[44px] w-full resize-none border-0 bg-transparent py-3 pr-12 focus-visible:ring-0 text-sm leading-relaxed"
      />

      <div className="flex items-center justify-between gap-2 px-1 pb-1">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8 text-[var(--ds-icon)] hover:bg-[var(--ds-background-neutral-subtle-hovered)]"
          >
            <Plus size={16} />
            <span className="sr-only">Attach</span>
          </Button>

          {actions?.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              size="compact"
              onClick={() => onActionClick?.(action.id)}
              className="h-7 text-[9px] font-bold uppercase tracking-tight gap-1 px-2 border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)]"
            >
              {action.icon && <action.icon size={12} />}
              {action.label}
            </Button>
          ))}
        </div>

        <Button
          onClick={onSubmit}
          disabled={!value || isLoading}
          size="icon-sm"
          className={cn(
            'h-8 w-8 shrink-0 transition-all shadow-md',
            value
              ? 'bg-[var(--ds-background-brand-bold)] text-white hover:bg-[var(--ds-background-brand-bold-hovered)] scale-100'
              : 'bg-[var(--ds-background-neutral-pressed)] text-[var(--ds-icon-subtle)] scale-90'
          )}
        >
          <Send size={14} strokeWidth={2.5} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}

ChatInputShell.displayName = 'ChatInputShell';
