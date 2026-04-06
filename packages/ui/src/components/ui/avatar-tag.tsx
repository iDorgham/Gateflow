'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { X } from 'lucide-react';

export interface AvatarTagProps {
  label: string;
  src?: string;
  initials?: string;
  onRemove?: () => void;
  className?: string;
}

export function AvatarTag({
  label,
  src,
  initials,
  onRemove,
  className,
}: AvatarTagProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[var(--ds-border)] bg-[var(--ds-background-neutral-subtle)] pl-1 pr-2 py-0.5 text-[11px] font-semibold text-[var(--ds-text)] transition-colors hover:bg-[var(--ds-background-neutral)] group select-none',
        onRemove && 'pr-1',
        className
      )}
    >
      <Avatar className="h-4 w-4">
        {src && <AvatarImage src={src} alt={label} />}
        <AvatarFallback className="text-[7px] bg-[var(--ds-background-neutral-bold)] text-white font-bold">
          {initials || label.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="truncate max-w-[120px] tracking-tight">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex h-4 w-4 items-center justify-center rounded-full text-[var(--ds-icon-subtle)] hover:bg-[var(--ds-background-danger-bold)] hover:text-white transition-colors ml-0.5"
          aria-label={`Remove ${label}`}
        >
          <X size={10} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
