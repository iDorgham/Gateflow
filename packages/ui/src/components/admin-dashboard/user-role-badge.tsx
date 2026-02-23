import * as React from "react";
import { Shield, User, Star, Settings } from "lucide-react";

import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

export type UserRole = "superadmin" | "admin" | "manager" | "user";

export interface UserRoleBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  role: UserRole;
}

export function UserRoleBadge({ role, className, ...props }: UserRoleBadgeProps) {
  const config = {
    superadmin: {
      icon: Shield,
      variant: "default" as const,
      label: "Super Admin",
      colorClass: "bg-danger hover:bg-danger/90 text-danger-foreground border-danger",
    },
    admin: {
      icon: Star,
      variant: "default" as const,
      label: "Admin",
      colorClass: "bg-primary hover:bg-primary/90 text-primary-foreground border-primary",
    },
    manager: {
      icon: Settings,
      variant: "secondary" as const,
      label: "Manager",
      colorClass: "bg-warning/20 text-warning-foreground border-warning/30 hover:bg-warning/30",
    },
    user: {
      icon: User,
      variant: "outline" as const,
      label: "User",
      colorClass: "text-muted-foreground border-muted-foreground/30",
    },
  }[role];

  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn("flex w-fit items-center gap-1.5 pr-2.5", config.colorClass, className)}
      {...props}
    >
      <Icon className="h-3 w-3" />
      <span className="font-semibold">{config.label}</span>
    </Badge>
  );
}
