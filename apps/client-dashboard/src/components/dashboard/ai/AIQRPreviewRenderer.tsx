'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableHeader,
  Badge,
} from '@gateflow/ui';
import { QrCode, Calendar, Tag, User } from 'lucide-react';

interface QRIntent {
  count: number;
  type: 'WORKER' | 'VIRTUAL' | 'PHYSICAL';
  validFrom?: string;
  validUntil?: string;
  tag?: string;
  assignTo?: string;
}

interface AIQRPreviewRendererProps {
  intent: QRIntent;
}

export const AIQRPreviewRenderer: React.FC<AIQRPreviewRendererProps> = ({
  intent,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'No limit';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mt-3 border rounded-lg overflow-hidden bg-background shadow-sm">
      <div className="bg-muted px-3 py-2 border-b flex items-center gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
        <QrCode className="w-3 h-3" />
        QR Creation Preview
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-none h-8">
            <TableHead className="text-[10px] py-1 h-8">Count</TableHead>
            <TableHead className="text-[10px] py-1 h-8">Type</TableHead>
            <TableHead className="text-[10px] py-1 h-8">Tag/Label</TableHead>
            <TableHead className="text-[10px] py-1 h-8">Validity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-background border-none py-1 h-10">
            <TableCell className="text-xs py-1 h-10">
              <span className="font-bold text-foreground">{intent.count}</span>{' '}
              codes
            </TableCell>
            <TableCell className="text-xs py-1 h-10">
              <Badge variant="outline" className="text-[10px] h-5 py-0">
                {intent.type}
              </Badge>
            </TableCell>
            <TableCell className="text-xs py-1 h-10">
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-muted-foreground" />
                {intent.tag || 'None'}
              </div>
            </TableCell>
            <TableCell className="text-[10px] py-1 h-10 text-muted-foreground">
              <div className="flex flex-col">
                <span className="flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  Ends: {formatDate(intent.validUntil)}
                </span>
                {intent.assignTo && (
                  <span className="flex items-center gap-1 text-[9px] text-info mt-0.5">
                    <User className="w-2.5 h-2.5" />
                    Assign to: {intent.assignTo}
                  </span>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="px-3 py-2 bg-info/10 border-t">
        <p className="text-[10px] text-info flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3 h-3" />
          Click &apos;Confirm&apos; below to batch generate these resources.
        </p>
      </div>
    </div>
  );
};

const AlertCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
