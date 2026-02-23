import * as React from "react";
import { User, Calendar, Clock, Download, Share } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface VisitorQRCardProps {
  visitorName: string;
  date: string;
  timeWindow: string;
  qrValue: string;
  status: "active" | "expired" | "used";
  onShare?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function VisitorQRCard({
  visitorName,
  date,
  timeWindow,
  qrValue,
  status,
  onShare,
  onDownload,
  className,
}: VisitorQRCardProps) {
  const isActive = status === "active";

  return (
    <Card className={cn("overflow-hidden max-w-sm", !isActive && "opacity-70 grayscale-[0.5]", className)}>
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {visitorName}
            </CardTitle>
            <CardDescription className="mt-1">One-time visitor pass</CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "secondary"} className="capitalize">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-6 flex flex-col items-center border-b border-dashed">
        <div className="relative bg-white p-3 rounded-xl border-2 border-primary/10 mb-4 shadow-sm">
          {/* Placeholder for QR Code */}
          <div className="bg-muted w-40 h-40 flex items-center justify-center rounded">
            <span className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
              {qrValue}
            </span>
          </div>
          {!isActive && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
              <span className="font-bold text-lg rotate-[-15deg] uppercase tracking-wider">
                {status}
              </span>
            </div>
          )}
        </div>
        
        <div className="w-full flex flex-col gap-2 mt-2">
          <div className="flex items-center text-sm text-foreground bg-muted/50 p-2 rounded-md">
            <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center text-sm text-foreground bg-muted/50 p-2 rounded-md">
            <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
            <span className="font-medium">{timeWindow}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-muted/10">
        <Button variant="ghost" size="sm" className="w-full" disabled={!isActive} onClick={onShare}>
          <Share className="h-4 w-4 mr-2" /> Share
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button variant="ghost" size="sm" className="w-full" disabled={!isActive} onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" /> Save Image
        </Button>
      </CardFooter>
    </Card>
  );
}
