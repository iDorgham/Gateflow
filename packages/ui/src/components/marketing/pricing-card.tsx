import * as React from "react";
import { Check } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface PricingCardProps {
  tier: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  actionText: string;
  onAction?: () => void;
  className?: string;
}

export function PricingCard({
  tier,
  price,
  description,
  features,
  isPopular,
  actionText,
  onAction,
  className,
}: PricingCardProps) {
  return (
    <Card className={cn("relative flex flex-col justify-between", isPopular && "border-primary shadow-lg scale-105 z-10", className)}>
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-primary px-3 py-1 text-center text-xs font-semibold text-primary-foreground shadow-sm">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{tier}</CardTitle>
        <CardDescription className="pt-1">{description}</CardDescription>
        <div className="mt-4 flex items-baseline text-5xl font-extrabold">
          {price}
          <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="mr-3 h-5 w-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full h-12 text-base font-semibold"
          variant={isPopular ? "default" : "outline"}
          onClick={onAction}
        >
          {actionText}
        </Button>
      </CardFooter>
    </Card>
  );
}
