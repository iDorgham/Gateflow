import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
          className
        )}
        {...props}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
          <Icon icon={icon} size={40} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mt-2">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            {description}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";
