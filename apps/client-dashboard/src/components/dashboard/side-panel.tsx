'use client';

import * as React from 'react';
import { cn, Button } from '@gate-access/ui';
import { ChevronRight, X } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';

interface SidePanelProps {
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function SidePanel({ isOpen, onToggle, children }: SidePanelProps) {
  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-l border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
        isOpen ? 'w-[400px]' : 'w-0 border-l-0'
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute bottom-[38px] -left-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-sm transition-transform hover:bg-sidebar-accent',
          !isOpen && 'rotate-180'
        )}
        aria-label={isOpen ? 'Close panel' : 'Open panel'}
      >
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <div className={cn('flex h-full flex-col overflow-hidden', !isOpen && 'hidden')}>
        {/* Close button */}
        <div className="flex shrink-0 items-center justify-end border-b border-border px-3 py-2 bg-muted/20">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content — AI assistant (Phases 3+4 will add Tasks/Chat tabs here) */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
