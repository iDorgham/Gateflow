'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
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
} from '@gateflow/ui';
import { useBreakpoint } from '@/hooks/use-breakpoint';

const VisitorForm = dynamic(
  () => import('@/components/visitor-form').then((mod) => mod.VisitorForm),
  {
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
    ssr: false,
  }
);

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
