import * as React from 'react';
import { Infinity, RefreshCw } from 'lucide-react';
import QRCode from 'react-qr-code';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Button,
  cn,
} from '@gateflow/ui';

export interface OpenQRCardProps {
  propertyName: string;
  unitId: string;
  qrValue: string;
  onRegenerate?: () => void;
  className?: string;
  offlineCached?: boolean;
}

export function OpenQRCard({
  propertyName,
  unitId,
  qrValue,
  onRegenerate,
  className,
  offlineCached = false,
}: OpenQRCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden border-primary/20 max-w-sm bg-gradient-to-br from-background to-primary/5 shadow-md',
        className
      )}
    >
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 ring-4 ring-background">
          <Infinity className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Open House Pass</CardTitle>
        <CardDescription className="text-sm font-medium mt-1 text-foreground">
          {propertyName} - Unit {unitId}
          {offlineCached ? ' · offline copy' : ''}
        </CardDescription>
        <p className="text-xs text-muted-foreground mt-2">
          Unlimited scans. Valid today only.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white p-4 rounded-xl border border-border shadow-sm">
            <div
              className="bg-white w-48 h-48 flex items-center justify-center rounded p-2"
              data-testid="open-qr-code"
            >
              {qrValue ? (
                <QRCode
                  value={qrValue}
                  size={176}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  viewBox="0 0 176 176"
                />
              ) : (
                <span className="text-xs text-muted-foreground">No QR</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center pt-2 pb-6">
        <Button
          variant="outline"
          className="w-full text-primary border-primary/20 hover:bg-primary/5 font-semibold"
          onClick={onRegenerate}
        >
          <RefreshCw className="me-2 h-4 w-4" /> Regenerate Pass
        </Button>
      </CardFooter>
    </Card>
  );
}
