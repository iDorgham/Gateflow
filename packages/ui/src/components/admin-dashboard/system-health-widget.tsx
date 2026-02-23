import * as React from "react";
import { Activity, Server, Database, Globe } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

export type HealthStatus = "healthy" | "degraded" | "down";

export interface SystemService {
  name: string;
  type: "api" | "db" | "cdn" | "worker";
  status: HealthStatus;
  latencyMs: number;
}

export interface SystemHealthWidgetProps {
  services: SystemService[];
  overallStatus: HealthStatus;
  className?: string;
}

export function SystemHealthWidget({ services, overallStatus, className }: SystemHealthWidgetProps) {
  const statusColor = {
    healthy: "bg-success text-success-foreground",
    degraded: "bg-warning text-warning-foreground",
    down: "bg-danger text-danger-foreground",
  };

  const statusBg = {
    healthy: "bg-success/20",
    degraded: "bg-warning/20",
    down: "bg-danger/20",
  };

  const getIcon = (type: SystemService["type"]) => {
    switch (type) {
      case "db": return <Database className="h-4 w-4 text-muted-foreground" />;
      case "cdn": return <Globe className="h-4 w-4 text-muted-foreground" />;
      case "api": return <Server className="h-4 w-4 text-muted-foreground" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("pb-4 flex flex-row items-center justify-between", statusBg[overallStatus])}>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
        <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize flex items-center gap-1.5", statusColor[overallStatus])}>
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", overallStatus !== "down" && "animate-pulse")} />
          {overallStatus}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {services.map((svc) => (
            <div key={svc.name} className="flex px-4 py-3 items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-background rounded-md shadow-sm border">
                  {getIcon(svc.type)}
                </div>
                <div>
                  <p className="font-medium text-sm leading-none">{svc.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{svc.type}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={cn(
                  "flex items-center gap-1.5 text-xs font-medium capitalize",
                  svc.status === 'healthy' ? 'text-success' : svc.status === 'degraded' ? 'text-warning' : 'text-danger'
                )}>
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {svc.status}
                </span>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 rounded">
                  {svc.latencyMs}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
