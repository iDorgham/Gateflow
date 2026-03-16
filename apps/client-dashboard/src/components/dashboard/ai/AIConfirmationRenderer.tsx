
'use client';

import * as React from 'react';
import { 
  Card, 
  CardContent, 
  Button
} from '@gate-access/ui';
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
  status = 'pending'
}) => {
  const isPending = status === 'pending';
  const isConfirmed = status === 'confirmed' || status === 'executed';
  const isCancelled = status === 'cancelled';

  return (
    <Card className="my-4 border-amber-200 bg-amber-50/30 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-amber-100 text-amber-600">
            {isConfirmed ? (
              <ShieldCheck className="w-5 h-5 text-green-600" />
            ) : isCancelled ? (
              <AlertCircle className="w-5 h-5 text-gray-500" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                {isConfirmed ? 'Action Confirmed' : isCancelled ? 'Action Cancelled' : 'Confirmation Required'}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {data.title}
              </p>
              {data.description && (
                <p className="text-[11px] text-slate-500 italic mt-1">
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
                  className="h-8 text-xs bg-slate-900 hover:bg-slate-800"
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
                  className="h-8 text-xs border-slate-200"
                  onClick={() => onCancel(data)}
                  disabled={isExecuting}
                >
                  Cancel
                </Button>
              </div>
            )}

            {isConfirmed && (
              <p className="text-[10px] font-medium text-green-600 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                This action has been securely authorized and logged.
              </p>
            )}

            {isCancelled && (
              <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
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
