'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  snapPoints?: ('min' | 'half' | 'full')[];
  className?: string;
}

/**
 * GateFlow BottomSheet
 * Mobile-first overlay primitive with drag handle, safe-area-inset support, and backdrop blur.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: BottomSheetProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-[var(--ds-radius-xl)] border-t border-[var(--ds-border-subtle)] bg-[var(--ds-layer-03)] shadow-[0_-8px_32px_rgba(0,0,0,0.5)] outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            'pb-[env(safe-area-inset-bottom,16px)]',
            className
          )}
        >
          {/* Drag Handle Indicator */}
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--ds-border-bold)]/60 opacity-80" />

          <div className="flex items-center justify-between px-6 pt-4 pb-2">
            <div>
              {title && (
                <DialogPrimitive.Title className="text-base font-semibold text-[var(--ds-text-primary)]">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-xs text-[var(--ds-text-subtle)]">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close className="rounded-full p-1.5 text-[var(--ds-text-subtle)] hover:bg-[var(--ds-layer-04)] hover:text-[var(--ds-text-primary)] transition-colors">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <div className="overflow-y-auto px-6 py-4">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

BottomSheet.displayName = 'BottomSheet';
