'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, ScrollArea } from '@gate-access/ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Returns true when document is RTL (dir="rtl") */
function useDocumentRtl(): boolean {
  const [isRtl, setIsRtl] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const check = () => setIsRtl(el.getAttribute('dir') === 'rtl');
    check();
    const obs = new MutationObserver(check);
    obs.observe(el, { attributes: true, attributeFilter: ['dir'] });
    return () => obs.disconnect();
  }, []);
  return isRtl;
}

export interface EditPanelProps {
  /** Whether the panel is open */
  open: boolean;
  /** Called when panel should close (Quit or after Save) */
  onOpenChange: (open: boolean) => void;
  /** Panel title */
  title: string;
  /** Panel content (form, etc.) */
  children: React.ReactNode;
  /** Called when user clicks Save. Caller should persist data then call onOpenChange(false) */
  onSave?: () => void | Promise<void>;
  /** Label for Save button */
  saveLabel?: string;
  /** Disable Save button during submit */
  isSaving?: boolean;
  /** Optional: RTL mode — panel slides from left */
  isRtl?: boolean;
  /** Optional: render search slot in header (for contacts/units/QRs search) */
  headerExtra?: React.ReactNode;
}

export function EditPanel({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  saveLabel = 'Save',
  isSaving = false,
  isRtl: isRtlProp,
  headerExtra,
}: EditPanelProps) {
  const docRtl = useDocumentRtl();
  const isRtl = isRtlProp ?? docRtl;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Do NOT close on overlay click — only Save or Quit
    e.stopPropagation();
  };

  const handleQuit = () => {
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!onSave) {
      onOpenChange(false);
      return;
    }
    try {
      await onSave();
      onOpenChange(false);
    } catch {
      // Stay open so user can fix errors
    }
  };

  const content = (
    <div
      className="fixed inset-0 z-[100] flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-panel-title"
    >
      {/* Overlay: dim + block interaction, no close on click */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Panel: slide from right (or left in RTL) */}
      <div
        className={cn(
          'relative z-10 flex w-full max-w-2xl flex-col bg-background shadow-2xl overflow-hidden',
          'animate-in duration-300 ease-in-out',
          isRtl ? 'slide-in-from-left' : 'slide-in-from-right',
          'ms-auto me-0'
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-8 py-5">
          <div className="flex flex-col gap-1">
            <h2 id="edit-panel-title" className="text-[20px] font-semibold text-foreground dark:text-zinc-100 tracking-tight">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {headerExtra}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:bg-accent"
              onClick={handleQuit}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 bg-background">
          <div className="px-8 py-8">{children}</div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex shrink-0 justify-end items-center gap-3 border-t border-border px-8 py-5 bg-background">
          <Button 
            variant="ghost" 
            onClick={handleQuit} 
            className="text-muted-foreground hover:bg-accent font-semibold"
          >
            Cancel
          </Button>
          {onSave && (
            <Button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-semibold shadow-sm transition-all active:scale-95"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Saving...
                </div>
              ) : saveLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
