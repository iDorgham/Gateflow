import * as React from "react";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

import { cn, Card, CardHeader, CardTitle, CardContent, Badge } from "@gate-access/ui";

export type GateStatus = "online" | "offline" | "maintenance";

export interface GateStatusIndicatorProps {
  gateName: string;
  status: GateStatus;
  lastPing?: string;
  activeScanners?: number;
  className?: string;
}

export function GateStatusIndicator({
  gateName,
  status,
  lastPing,
  activeScanners = 0,
  className,
}: GateStatusIndicatorProps) {
  const Icon = {
    online: ShieldCheck,
    offline: ShieldAlert,
    maintenance: Shield,
  }[status];

  const config = {
    online: { color: "text-success", bg: "bg-success/10", border: "border-success/20", text: "Online" },
    offline: { color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", text: "Offline" },
    maintenance: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", text: "Maintenance" },
  }[status];

  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md", config.border, className)}>
      <CardHeader className={cn("p-4 pb-2 flex flex-row items-center justify-between", config.bg)}>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon className={cn("w-5 h-5", config.color)} />
          {gateName}
        </CardTitle>
        <Badge variant={status === "online" ? "default" : status === "offline" ? "destructive" : "secondary"} className="capitalize">
          {config.text}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-3 grid grid-cols-2 gap-4 bg-card">
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">Status</p>
          <div className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", status === "online" ? "bg-success" : status === "offline" ? "bg-danger" : "bg-warning animate-pulse")} />
            <span className="text-sm font-medium">{status === "online" ? "Operational" : status === "offline" ? "Disconnected" : "Service Mode"}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">Active Scanners</p>
          <p className="text-sm font-medium">{activeScanners} devices</p>
        </div>
        {lastPing && (
          <div className="col-span-2 mt-2 border-t pt-3">
            <p className="text-xs text-muted-foreground flex justify-between">
              <span>Last Sync</span>
              <span className="font-mono">{lastPing}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
