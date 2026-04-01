'use client';

import * as React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@gate-access/ui';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { VisitorForm } from '@/components/visitor-form';

interface NewVisitorSheetProps {
  unitId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewVisitorSheet({
  unitId,
  open,
  onOpenChange,
}: NewVisitorSheetProps) {
  const { isMd } = useBreakpoint();

  if (isMd) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Visitor Pass</DialogTitle>
          </DialogHeader>
          <VisitorForm unitId={unitId} />
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader>
          <SheetTitle>Create Visitor Pass</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <VisitorForm unitId={unitId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
