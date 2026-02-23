import * as React from "react";
import { Download, Copy, Share2 } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface QRCodeDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  qrValue: string;
  visitorName: string;
  validUntil: string;
  onDownload?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
}

export function QRCodeDisplay({
  qrValue,
  visitorName,
  validUntil,
  onDownload,
  onCopy,
  onShare,
  className,
  ...props
}: QRCodeDisplayProps) {
  return (
    <Card className={cn("max-w-sm overflow-hidden", className)} {...props}>
      <CardHeader className="text-center bg-muted/50 pb-4">
        <CardTitle className="text-lg">Visitor Pass</CardTitle>
        <p className="text-sm text-muted-foreground">{visitorName}</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 bg-white">
        {/* Placeholder for actual QR code rendering, e.g., react-qr-code */}
        <div className="w-48 h-48 bg-muted rounded-md flex items-center justify-center border-4 border-primary/10">
          <div className="text-center">
            <span className="text-xs text-muted-foreground block font-mono">
              [QR for {qrValue}]
            </span>
          </div>
        </div>
        <p className="text-xs font-mono text-muted-foreground mt-4 tracking-wider">
          {qrValue}
        </p>
        <div className="mt-4 text-center">
          <p className="text-xs font-medium text-danger">Valid Until</p>
          <p className="text-sm font-semibold text-foreground">{validUntil}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 bg-muted/20 border-t p-4">
        <Button variant="outline" size="sm" className="w-full" onClick={onDownload}>
          <Download className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm" className="w-full" onClick={onCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button variant="default" size="sm" className="w-full" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
