import * as React from "react";
import { Shield, User, Star, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge, cn } from "@gate-access/ui";

export type UserRole = "superadmin" | "admin" | "manager" | "user";

export interface UserRoleBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  role: UserRole;
}

export function UserRoleBadge({ role, className, ...props }: UserRoleBadgeProps) {
  const { t } = useTranslation('common');

  const config = {
    superadmin: {
      icon: Shield,
      variant: "default" as const,
      label: t('admin.users.roles.superAdmin'),
      colorClass: "bg-danger hover:bg-danger/90 text-danger-foreground border-danger",
    },
    admin: {
      icon: Star,
      variant: "default" as const,
      label: t('admin.users.roles.admin'),
      colorClass: "bg-primary hover:bg-primary/90 text-primary-foreground border-primary",
    },
    manager: {
      icon: Settings,
      variant: "secondary" as const,
      label: t('admin.users.roles.manager'),
      colorClass: "bg-warning/20 text-warning-foreground border-warning/30 hover:bg-warning/30",
    },
    user: {
      icon: User,
      variant: "outline" as const,
      label: t('admin.users.roles.user'),
      colorClass: "text-muted-foreground border-muted-foreground/30",
    },
  }[role];

  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn("flex w-fit items-center gap-1.5 ltr:pr-2.5 rtl:pl-2.5", config.colorClass, className)}
      {...props}
    >
      <Icon className="h-3 w-3" />
      <span className="font-semibold">{config.label}</span>
    </Badge>
  );
}
