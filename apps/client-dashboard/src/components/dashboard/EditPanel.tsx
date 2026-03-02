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
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-panel-title"
    >
      {/* Overlay: dim + block interaction, no close on click */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Panel: slide from right (or left in RTL) */}
      <div
        className={cn(
          'relative z-10 flex w-full max-w-xl flex-col border-border bg-card shadow-xl',
          'animate-in duration-300',
          isRtl ? 'slide-in-from-left border-r' : 'slide-in-from-right border-l',
          isRtl ? 'ml-0 mr-auto' : 'ml-auto mr-0'
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 id="edit-panel-title" className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {headerExtra}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={handleQuit}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">{children}</div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={handleQuit} className="border-border">
            Quit
          </Button>
          {onSave && (
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground">
              {isSaving ? 'Saving…' : saveLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
