import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "../ui/card";

export interface QuotaProgressCircleProps {
  used: number;
  total: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function QuotaProgressCircle({
  used,
  total,
  label,
  size = 120,
  strokeWidth = 10,
  className,
}: QuotaProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(used / total, 1);
  const strokeDashoffset = circumference - percent * circumference;

  const isNearingLimit = percent > 0.8;
  const isAtLimit = percent >= 1;

  const colorClass = isAtLimit
    ? "text-danger"
    : isNearingLimit
    ? "text-warning"
    : "text-primary";

  return (
    <Card className={cn("inline-flex flex-col items-center justify-center border-none shadow-none bg-transparent", className)}>
      <CardContent className="p-0 relative flex items-center justify-center">
        <svg height={size} width={size} className="transform -rotate-90">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className="text-muted/30"
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className={cn("transition-all duration-1000 ease-out", colorClass)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-foreground">
            {used}
            <span className="text-base text-muted-foreground">/{total}</span>
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
