import * as React from "react";
import { Clock, CalendarDays, Ban } from "lucide-react";

import { Card, RadioGroup, RadioGroupItem, Label, cn } from "@gate-access/ui";

export type AccessRule = "always" | "schedule" | "blocked";

export interface AccessRuleSelectorProps {
  value: AccessRule;
  onChange: (value: AccessRule) => void;
  className?: string;
}

export function AccessRuleSelector({ value, onChange, className }: AccessRuleSelectorProps) {
  const rules = [
    {
      id: "always",
      label: "Always Allow",
      description: "Grant 24/7 access to this visitor without restrictions.",
      icon: Clock,
      color: "text-success",
      bgHover: "hover:bg-success/5",
      borderActive: "border-success bg-success/5",
    },
    {
      id: "schedule",
      label: "Scheduled",
      description: "Only allow access during specific days and hours.",
      icon: CalendarDays,
      color: "text-primary",
      bgHover: "hover:bg-primary/5",
      borderActive: "border-primary bg-primary/5",
    },
    {
      id: "blocked",
      label: "Blocked",
      description: "Deny access to this visitor entirely.",
      icon: Ban,
      color: "text-danger",
      bgHover: "hover:bg-danger/5",
      borderActive: "border-danger bg-danger/5 text-danger",
    },
  ];

  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as AccessRule)}
      className={cn("grid gap-4 sm:grid-cols-3", className)}
    >
      {rules.map((rule) => {
        const Icon = rule.icon;
        const isActive = value === rule.id;

        return (
          <div key={rule.id}>
            <RadioGroupItem value={rule.id} id={rule.id} className="peer sr-only" />
            <Label
              htmlFor={rule.id}
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-all",
                rule.bgHover,
                isActive && rule.borderActive
              )}
            >
              <Icon className={cn("mb-3 h-6 w-6", isActive ? rule.color : "text-muted-foreground")} />
              <div className="space-y-1 text-center">
                <p className={cn("font-medium leading-none", isActive && rule.id === 'blocked' ? 'text-danger' : '')}>
                  {rule.label}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-2 min-h-[30px] flex items-center">
                  {rule.description}
                </p>
              </div>
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
