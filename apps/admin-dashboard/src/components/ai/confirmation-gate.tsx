'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Button,
  Checkbox,
  Label,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
} from '@gateflow/ui';
import { Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConfirmationGateProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  aiContentCount: number;
  contentType: 'blog' | 'landingPage' | 'section' | 'email';
  reviewChecklist: string[];
}

export function ConfirmationGate({
  isOpen,
  onConfirm,
  onCancel,
  aiContentCount,
  contentType,
  reviewChecklist,
}: ConfirmationGateProps) {
  const { t } = useTranslation('admin');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const allChecked = reviewChecklist.every((item) =>
    checkedItems.includes(item)
  );

  const handleConfirm = () => {
    // In a real implementation, this would also call an API to log the confirmation
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {t('cms.publishConfirmation', 'Publish Confirmation')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'cms.publishConfirmationDesc',
              'Please review the AI-generated content before making it public.'
            )}
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-primary/5 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-bold">
            {aiContentCount}{' '}
            {t(`cms.${contentType}Items`, `${contentType} items`)}
          </AlertTitle>
          <AlertDescription className="text-primary/80">
            {t(
              'cms.aiReviewRequired',
              'This content contains AI-generated elements that require human verification.'
            )}
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-4">
          <p className="text-sm font-medium text-ds-text-subtle">
            {t('cms.reviewChecklist', 'Review Checklist')}
          </p>
          <div className="space-y-3">
            {reviewChecklist.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 p-3 rounded-lg border border-ds-border hover:bg-ds-background-neutral-subtle transition-colors"
              >
                <Checkbox
                  id={item}
                  checked={checkedItems.includes(item)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedItems([...checkedItems, item]);
                    } else {
                      setCheckedItems(checkedItems.filter((i) => i !== item));
                    }
                  }}
                  className="mt-1"
                />
                <Label
                  htmlFor={item}
                  className="text-sm leading-relaxed cursor-pointer select-none"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 sm:flex-none"
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!allChecked}
            className="flex-1 sm:flex-none"
          >
            {t('cms.confirmAndPublish', 'Confirm & Publish')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
