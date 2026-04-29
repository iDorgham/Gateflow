'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Checkbox,
  Label,
  Badge,
  cn,
  Progress,
} from '@gateflow/ui';

interface ConfirmationGateProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  contentType: 'BLOG_POST' | 'LANDING_PAGE' | 'SECTION' | 'EMAIL' | 'CAMPAIGN';
  itemCount: number;
  reviewChecklist?: string[];
}

export function ConfirmationGate({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirm AI Publication',
  description = 'Please verify the AI-generated content follows brand guidelines and regional regulations.',
  contentType,
  itemCount,
  reviewChecklist = [
    'Content accuracy and factual correctness',
    'Brand voice and tone alignment',
    'Regional compliance (Law 151/2020)',
    'RTL/LTR layout consistency',
    'Call-to-action effectiveness',
  ],
}: ConfirmationGateProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const allChecked = reviewChecklist.every((item) =>
    checkedItems.includes(item)
  );
  const progress = (checkedItems.length / reviewChecklist.length) * 100;

  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate audit logging
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false);
      setCheckedItems([]);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-xl border-ds-border bg-card/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden border-dashed">
        <div className="p-8 space-y-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-ds-background-brand-bold flex items-center justify-center text-ds-icon-inverse shadow-lg shadow-primary/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                {title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs font-bold text-ds-text-subtle uppercase tracking-widest leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-ds-background-brand-subtle/30 border border-ds-border-brand/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="h-16 w-16" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-ds-background-brand-bold text-ds-icon-inverse font-black text-[9px] uppercase tracking-widest px-2 h-5">
                  {contentType}
                </Badge>
                <span className="text-[10px] font-black uppercase tracking-tight opacity-60">
                  {itemCount} Neutral Vector{itemCount > 1 ? 's' : ''} Pending
                </span>
              </div>
              <p className="text-[11px] font-bold leading-relaxed">
                AI Agent{' '}
                <span className="text-ds-text-brand font-black">
                  GateAI OMEGA
                </span>{' '}
                synthesized these artifacts. Human validation is mandatory for
                publication.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
              <span>Verification Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1 bg-muted" />
          </div>

          <div className="space-y-3 pt-2">
            {reviewChecklist.map((item, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group/item',
                  checkedItems.includes(item)
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-muted/20 border-border/30 hover:border-ds-border-brand/30'
                )}
                onClick={() => {
                  if (checkedItems.includes(item)) {
                    setCheckedItems(checkedItems.filter((i) => i !== item));
                  } else {
                    setCheckedItems([...checkedItems, item]);
                  }
                }}
              >
                <div
                  className={cn(
                    'h-5 w-5 rounded-md border flex items-center justify-center transition-colors',
                    checkedItems.includes(item)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-border/50 bg-card group-hover/item:border-ds-border-brand'
                  )}
                >
                  {checkedItems.includes(item) && (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </div>
                <Label className="text-[11px] font-bold cursor-pointer flex-1 group-hover/item:text-ds-text transition-colors">
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-border/30 bg-muted/20 gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-11 border-ds-border text-[10px] font-black uppercase tracking-widest px-8"
          >
            Archive Draft
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!allChecked || isConfirming}
            className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-10 shadow-lg shadow-primary/20 flex-1 sm:flex-none"
          >
            {isConfirming ? 'Processing...' : 'Confirm & Publish'}{' '}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
