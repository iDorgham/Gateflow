'use client';

import * as React from 'react';
import { Card, CardContent, Button } from '@gateflow/ui';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { AIQRPreviewRenderer } from './AIQRPreviewRenderer';

export interface ActionDataBlock {
  type: 'confirm';
  actionType: string;
  title: string;
  description?: string;
  intentJson: any;
  actionId?: string; // If already logged
}

interface AIConfirmationRendererProps {
  data: ActionDataBlock;
  onConfirm: (data: ActionDataBlock) => void;
  onCancel: (data: ActionDataBlock) => void;
  isExecuting?: boolean;
  status: 'pending' | 'confirmed' | 'cancelled' | 'executed' | 'failed';
}

export const AIConfirmationRenderer: React.FC<AIConfirmationRendererProps> = ({
  data,
  onConfirm,
  onCancel,
  isExecuting = false,
  status = 'pending',
}) => {
  const isPending = status === 'pending';
  const isConfirmed = status === 'confirmed' || status === 'executed';
  const isCancelled = status === 'cancelled';

  return (
    <Card className="my-4 border-warning bg-warning-subtle overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-warning-subtle text-warning-bold">
            {isConfirmed ? (
              <ShieldCheck className="w-5 h-5 text-success-bold" />
            ) : isCancelled ? (
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {isConfirmed
                  ? 'Action Confirmed'
                  : isCancelled
                    ? 'Action Cancelled'
                    : 'Confirmation Required'}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{data.title}</p>
              {data.description && (
                <p className="text-[11px] text-muted-foreground italic mt-1">
                  {data.description}
                </p>
              )}
            </div>

            {isPending && data.actionType === 'BULK_QR_CREATE' && (
              <AIQRPreviewRenderer intent={data.intentJson} />
            )}

            {isPending && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary hover:bg-primary/90"
                  onClick={() => onConfirm(data)}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    'Confirm Action'
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-border"
                  onClick={() => onCancel(data)}
                  disabled={isExecuting}
                >
                  Cancel
                </Button>
              </div>
            )}

            {isConfirmed && (
              <p className="text-[10px] font-medium text-success-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                This action has been securely authorized and logged.
              </p>
            )}

            {isCancelled && (
              <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                This action was cancelled by the user.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
