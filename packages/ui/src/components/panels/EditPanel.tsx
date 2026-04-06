'use client';

import * as React from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EditPanelProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void | Promise<void>;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  isSaving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  /**
   * Apply Midnight Blue header when the panel belongs to a project
   * context. Provides visual hierarchy cue for project-scoped actions.
   */
  projectHeader?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  /** Override the default footer with a custom footer node */
  footer?: React.ReactNode;
}

const PANEL_WIDTHS: Record<NonNullable<EditPanelProps['width']>, string> = {
  sm: 'max-w-[360px]',
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
  xl: 'max-w-[800px]',
};

/**
 * EditPanel — slide-from-right (LTR) / slide-from-left (RTL) side drawer.
 *
 * - Blocks background interaction while open (via backdrop + inert body scroll)
 * - Midnight Blue header when `projectHeader={true}`
 * - Escape key closes the panel
 * - RTL aware: uses logical properties (end-0, ms-*, ps-*)
 */
export function EditPanel({
  open,
  onClose,
  onSave,
  title,
  subtitle,
  children,
  isSaving = false,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  projectHeader = false,
  width = 'md',
  footer,
}: EditPanelProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      {/* Backdrop — dims background and blocks interaction */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — slides from inline-end (right in LTR, left in RTL) */}
      <div
        className={cn(
          'absolute inset-y-0 end-0 flex w-full flex-col shadow-2xl',
          'bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-raised)]',
          'animate-in slide-in-from-right duration-300 ease-out',
          PANEL_WIDTHS[width]
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-background z-10 transition-colors',
            projectHeader
              ? 'bg-[var(--ds-background-neutral-bold)] text-white'
              : 'bg-background text-foreground'
          )}
        >
          <div className="flex min-w-0 flex-col">
            {title && (
              <h2
                className={cn(
                  'truncate text-base font-semibold',
                  projectHeader ? 'text-white' : 'text-[var(--ds-text)]'
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  'mt-0.5 truncate text-xs',
                  projectHeader
                    ? 'text-white/70'
                    : 'text-[var(--ds-text-subtle)]'
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'ms-4 shrink-0 rounded-md p-1.5 transition-colors',
              projectHeader
                ? 'text-white/70 hover:bg-white/10 hover:text-white'
                : 'text-[var(--ds-icon-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] hover:text-[var(--ds-icon)]'
            )}
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--ds-border)] px-6 py-4">
          {footer ?? (
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-md px-4 py-2 text-sm font-medium text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              {onSave && (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saveLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
