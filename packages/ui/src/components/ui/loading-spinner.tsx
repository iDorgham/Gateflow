import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: number | string;
  className?: string;
}

export function LoadingSpinner({ size = 24, className, ...props }: LoadingSpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn("animate-spin text-primary", className)}
      {...props}
    />
  );
}
