import * as React from 'react';
import { CheckCircle2, ArrowRight, AlertTriangle, Quote } from 'lucide-react';
import { Button } from '@gateflow/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import { IntentLandingTracker } from '../intent-landing-tracker';

interface SolutionLayoutProps {
  locale: Locale;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  ctaText: string;
  imagePlaceholder?: React.ReactNode;
  benefits: { title: string; desc: string }[];
  // Phase 2 additions
  painPoints?: string[];
  quote?: { text: string; author: string; role: string };
  secondaryCtaText?: string;
  intent: 'demo' | 'pilot' | 'migration' | 'consult';
  surfacePrefix: string;
}

export function SolutionLayout({
  locale,
  title,
  subtitle,
  description,
  icon,
  features,
  ctaText,
  imagePlaceholder,
  benefits,
  painPoints,
  quote,
  secondaryCtaText,
  intent,
  surfacePrefix,
}: SolutionLayoutProps) {
  return (
    <div className="flex flex-col w-full pb-24">
      <IntentLandingTracker
        locale={locale}
        surface={`${surfacePrefix}_page`}
        intent={intent}
      />
      {/* Hero */}
      <section className="pt-48 pb-32 container px-6 relative overflow-hidden">
        <div className="absolute top-0 end-0 -z-10 opacity-10">
          <div className="scale-[16.6] origin-top-right">{icon}</div>
        </div>

        <div className="max-w-3xl">
          <p className="text-ds-text-brand font-black uppercase tracking-widest mb-4">
            {subtitle}
          </p>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6">
            {title}
          </h1>
          <p className="text-xl text-ds-text-subtle leading-relaxed mb-10 font-medium">
            {description}
          </p>

          <div className="flex flex-wrap gap-4">
            <IntentLink
              locale={locale}
              href="/contact"
              intent={intent}
              surface={`${surfacePrefix}_hero_cta`}
            >
              <Button size="lg" className="h-14 px-8 rounded-xl font-bold">
                {ctaText}
                <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </IntentLink>
            {secondaryCtaText && (
              <IntentLink
                locale={locale}
                href="/pricing"
                intent={intent}
                surface={`${surfacePrefix}_pricing_cta`}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-xl font-bold"
                >
                  {secondaryCtaText}
                </Button>
              </IntentLink>
            )}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      {painPoints && painPoints.length > 0 && (
        <section className="bg-muted/40 border-y border-border/40 py-14">
          <div className="container px-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground mb-8">
              Before GateFlow
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {painPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-5 rounded-2xl bg-ds-background-danger-subtle border border-ds-border-danger/20"
                >
                  <AlertTriangle className="h-5 w-5 text-ds-text-danger shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits / Key Features */}
      <section className="container px-6 grid lg:grid-cols-2 gap-16 items-center py-24">
        <div className="space-y-8">
          <h2 className="text-3xl font-black">
            Tailored for your specific workflows
          </h2>
          <div className="grid gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex gap-4 p-6 rounded-2xl border border-ds-border bg-ds-surface-raised hover:bg-ds-surface-sunken transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-ds-background-brand-subtle flex items-center justify-center text-ds-text-brand shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-ds-text-heading">
                    {b.title}
                  </h4>
                  <p className="text-ds-text-subtle text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-[3rem] bg-muted border overflow-hidden flex items-center justify-center">
          {imagePlaceholder || (
            <div className="text-center opacity-20">
              <div className="scale-5 origin-center">{icon}</div>
            </div>
          )}
          <div className="absolute inset-x-8 bottom-8 p-6 bg-background/80 backdrop-blur rounded-2xl border shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="h-2 w-24 bg-primary rounded-full" />
              <div className="h-2 w-12 bg-muted rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded-md" />
              <div className="h-4 w-2/3 bg-muted rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-slate-900 py-16 text-white border-y border-white/10">
        <div className="container px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="h-2 w-2 bg-ds-background-brand-bold rounded-full"
                  style={{ boxShadow: 'var(--ds-glow-accent)' }}
                />
                <span className="font-black uppercase tracking-widest text-xs">
                  {f}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Quote */}
      {quote && (
        <section className="py-20 container px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-10 w-10 text-primary/30 mx-auto mb-6" />
            <blockquote className="text-2xl lg:text-3xl font-black tracking-tight leading-snug mb-8">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                {quote.author.charAt(0)}
              </div>
              <div className="text-start">
                <p className="font-bold text-sm">{quote.author}</p>
                <p className="text-muted-foreground text-xs">{quote.role}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 bg-primary/5 border-t border-border/40">
        <div className="container px-6 text-center">
          <h3 className="text-3xl font-black mb-4">
            Ready to upgrade your gate?
          </h3>
          <IntentLink
            locale={locale}
            href="/contact"
            intent={intent}
            surface={`${surfacePrefix}_bottom_cta`}
          >
            <Button size="lg" className="h-14 px-10 rounded-xl font-bold">
              {ctaText}
              <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </IntentLink>
        </div>
      </section>
    </div>
  );
}
