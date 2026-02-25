import * as React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button, cn } from "@gate-access/ui";

export interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  primaryActionText: string;
  secondaryActionText: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  trustBadge?: string;
}

export function HeroSection({
  title,
  subtitle,
  primaryActionText,
  secondaryActionText,
  onPrimaryAction,
  onSecondaryAction,
  trustBadge,
  className,
  ...props
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48 text-center",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          {trustBadge && (
            <div className="mb-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20">
                <ShieldCheck className="h-4 w-4" />
                {trustBadge}
              </span>
            </div>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {subtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
            <Button size="lg" onClick={onPrimaryAction} className="h-12 px-8 text-base">
              {primaryActionText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={onSecondaryAction} className="h-12 px-8 text-base">
              {secondaryActionText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
