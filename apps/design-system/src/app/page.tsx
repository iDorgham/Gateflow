'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Palette,
  Layers,
  Sparkles,
  Accessibility,
  ArrowRight,
  Shield,
  Zap,
  Globe,
} from 'lucide-react';
import { Button, Card, CardContent } from '@gateflow/ui';

const sections = [
  {
    title: 'Foundations',
    description:
      'Core principles, anatomy, and cross-platform design constants.',
    href: '/foundations',
    icon: Palette,
    color:
      'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-neutral)]',
  },
  {
    title: 'Tokens',
    description:
      'The atomic bridge between design and code. OKLCH semantic variables.',
    href: '/tokens',
    icon: Shield,
    color: 'bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)]',
  },
  {
    title: 'Components',
    description:
      'Accessible, multi-tenant patterns from atoms to complex AI modules.',
    href: '/components',
    icon: Layers,
    color: 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]',
  },
  {
    title: 'AI UX',
    description:
      'Specialized toolkit for LLM-driven interactions and streaming UI.',
    href: '/components/ai',
    icon: Sparkles,
    color:
      'bg-[var(--ds-background-information-subtle)] text-[var(--ds-text-information)]',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32 border-b border-[var(--ds-border-subtle)]">
        <div className="container px-4 md:px-8 mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-subtle)] text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtle)] mb-8 animate-fade-in">
            <Zap size={12} className="text-[var(--ds-icon-brand)]" />
            <span>Design System Prototype v0.1.0</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-[var(--ds-text)] leading-[1.05] animate-slide-up">
            Building the unified{' '}
            <span className="text-[var(--ds-text-brand)]">GateFlow</span>{' '}
            experience.
          </h1>
          <p className="text-lg md:text-xl text-[var(--ds-text-subtle)] mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:100ms]">
            An enterprise-grade design system for secure access, community
            resilience, and AI-driven workspace orchestration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up [animation-delay:200ms]">
            <Button
              size="lg"
              className="rounded-xl h-12 px-8 font-bold"
              asChild
            >
              <Link href="/foundations">
                Explore Documentation <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl h-12 px-8 font-bold bg-transparent"
              asChild
            >
              <Link href="/tokens">Token Explorer</Link>
            </Button>
          </div>
        </div>

        {/* Background Decorative */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--ds-background-brand-subtle)_0%,transparent_100%)] opacity-50" />
      </section>

      {/* IA Navigation Grid */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, _idx) => (
              <Link key={section.href} href={section.href} className="group">
                <Card className="h-full border-[var(--ds-border-subtle)] hover:border-[var(--ds-border-focused)] hover:shadow-xl transition-all duration-300 overflow-hidden bg-transparent">
                  <CardContent className="p-8 flex flex-col items-start gap-4">
                    <div
                      className={cn(
                        'p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300',
                        section.color
                      )}
                    >
                      <section.icon size={24} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-black tracking-tight text-[var(--ds-text)] leading-none">
                        {section.title}
                      </h3>
                      <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Core Philosophies */}
      <section className="py-24 bg-[var(--ds-background-neutral-subtle)]">
        <div className="container px-4 md:px-8 mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 text-center mb-16">
            <h2 className="text-3xl font-black uppercase text-[var(--ds-text-subtle)] tracking-widest">
              Principles
            </h2>
            <p className="text-sm font-medium text-[var(--ds-text-subtlest)] uppercase tracking-tight">
              How we think about access and identity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Accessibility',
                description:
                  'Inclusive design by default. WCAG 2.1 AA compliance with RTL/LTR first-level support.',
                icon: Accessibility,
              },
              {
                title: 'Security',
                description:
                  'Zero-trust primitives. Visual cues for encrypted sessions and authenticated actors.',
                icon: Shield,
              },
              {
                title: 'Internationalization',
                description:
                  'MENA-first strategy. Arabic-English mirroring with logical property alignment.',
                icon: Globe,
              },
            ].map((p) => (
              <div
                key={p.title}
                className="flex flex-col items-center gap-6 text-center"
              >
                <div className="p-4 rounded-3xl bg-[var(--ds-background-neutral-pressed)] text-[var(--ds-icon)]">
                  <p.icon size={32} />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl font-bold tracking-tight text-[var(--ds-text)] uppercase leading-none">
                    {p.title}
                  </h4>
                  <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--ds-border-subtle)] py-12">
        <div className="container px-4 md:px-8 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--ds-background-brand-bold)] text-white text-[10px] font-black">
              G
            </div>
            <span className="text-sm font-black tracking-tight">
              GateFlow{' '}
              <span className="font-medium text-[var(--ds-text-subtle)]">
                Design
              </span>
            </span>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold text-[var(--ds-text-subtlest)] uppercase tracking-widest">
            <Link
              href="/license"
              className="hover:text-[var(--ds-text)] transition-colors"
            >
              License
            </Link>
            <Link
              href="/support"
              className="hover:text-[var(--ds-text)] transition-colors"
            >
              Support
            </Link>
            <Link
              href="/github"
              className="hover:text-[var(--ds-text)] transition-colors"
            >
              GitHub
            </Link>
          </div>
          <div className="text-[10px] font-bold text-[var(--ds-text-subtlest)] uppercase tracking-widest order-first md:order-last">
            © 2026 GATE ACCESS LTD. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
