'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Card, Badge, Button } from '@gateflow/ui';
import { useLocale } from '../../../components/providers/LocaleProvider';
import { translations } from '../../../lib/translations';
import {
  Palette,
  Accessibility,
  ChevronRight,
  Layers,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Globe,
  Settings2,
} from 'lucide-react';
import Link from 'next/link';

export default function GuidelinesPage() {
  const { locale, isRTL } = useLocale();
  const t = translations[locale as keyof typeof translations].pages.guidelines;

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        packageName="@gateflow/components"
        breadcrumbs={[
          { label: isRTL ? 'التوثيق' : 'Documentation', href: '/' },
          { label: t.title },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <Card className="rounded-[2rem] p-8 border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] ds-card-premium ds-glass-glow shadow-xl hover:shadow-[var(--ds-glow-premium)] transition-all duration-500">
          <div className="h-12 w-12 rounded-2xl bg-[var(--ds-background-brand-bold)] flex items-center justify-center text-white shadow-lg">
            <Layers size={24} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text)]">
              Package Hierarchy
            </h3>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              Use the right tool for the right abstraction level to ensure
              maintainability.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-subtle)]">
              <Badge className="mt-1 shrink-0 bg-[var(--ds-background-brand-bold)] h-5 text-[9px] uppercase font-black tracking-tight">
                UI
              </Badge>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--ds-text)]">
                  Atomics / Primitives
                </span>
                <span className="text-[11px] text-[var(--ds-text-subtlest)]">
                  Buttons, inputs, cards. No business logic. Use for the basic
                  building blocks of any view.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-subtle)]">
              <Badge
                variant="secondary"
                className="mt-1 shrink-0 bg-blue-500/10 text-blue-500 h-5 text-[9px] uppercase font-black tracking-tight"
              >
                COMP
              </Badge>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--ds-text)]">
                  Product Patterns
                </span>
                <span className="text-[11px] text-[var(--ds-text-subtlest)]">
                  PageHeader, FilterBar. Reusable product UI structures. Use for
                  consistent layout flows.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-subtle)]">
              <Badge
                variant="outline"
                className="mt-1 shrink-0 border-amber-500 text-amber-500 h-5 text-[9px] uppercase font-black tracking-tight"
              >
                AI
              </Badge>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--ds-text)]">
                  Agentic Patterns
                </span>
                <span className="text-[11px] text-[var(--ds-text-subtlest)]">
                  Messages, streaming. LLM-specific interactions. Use for the AI
                  Sentinel experience.
                </span>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-dashed border-[var(--ds-border-subtle)]">
            <a
              href="https://github.com/iDorgham/Gateflow/blob/master/docs/guides/UI_COMPONENT_LIBRARY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black uppercase tracking-tight text-[var(--ds-text-brand)] hover:underline flex items-center gap-2"
            >
              <LinkIcon size={12} /> Read Full Component Library Guide
            </a>
          </div>
        </Card>

        <Card className="rounded-[2rem] p-8 border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] ds-card-premium ds-glass-glow shadow-xl hover:shadow-[var(--ds-glow-premium)] transition-all duration-500">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
            <Globe size={24} />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text)]">
              RTL & Localization
            </h3>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              Native Arabic support is a hard contract for the MENA COMPOUND
              sector.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 p-5 bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] border border-[var(--ds-border-subtle)] rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-xs font-black uppercase tracking-tight text-[var(--ds-text)]">
                  {isRTL ? 'الخصائص المنطقية' : 'Logical Properties'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--ds-text-subtle)] leading-relaxed">
                {isRTL
                  ? 'استخدم `ps-*` بدلاً من `pl-*` ، و `border-e` بدلاً من `border-r`. هذا يضمن انعكاس التخطيط تلقائيًا عند اكتشاف `dir="rtl"`.'
                  : 'Use `ps-*` instead of `pl-*`, and `border-e` instead of `border-r`. This ensures the layout flips automatically when `dir="rtl"` is detected.'}
              </p>
            </div>
            <div className="flex flex-col gap-2 p-5 bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] border border-[var(--ds-border-subtle)] rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} className="text-amber-500" />
                <span className="text-xs font-black uppercase tracking-tight text-[var(--ds-text)]">
                  Icon Reversal
                </span>
              </div>
              <p className="text-[11px] text-[var(--ds-text-subtle)] leading-relaxed font-medium">
                Arrows and direction-based UI icons should mirror in RTL. Static
                brand icons (logos) should remain unchanged.
              </p>
              <div className="flex items-center gap-6 mt-2 pt-2 border-t border-dashed border-[var(--ds-border-subtle)]">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                    LTR
                  </span>
                  <ChevronRight size={16} className="text-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest opacity-40">
                    RTL
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-blue-500 -scale-x-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1 rounded-[2.5rem] p-10 border-[var(--ds-border-subtle)] bg-zinc-950 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
              <Palette size={200} />
            </div>
            <div className="flex flex-col gap-6 relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight leading-none">
                The No-Raw-Hex Law
              </h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-sm">
                Hardcoding hex colors as `text-[#ff0000]` or `bg-white` is
                strictly prohibited. It breaks theme inheritance (Dark Mode) and
                OKLCH perceptual uniform scaling.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <code className="text-xs text-red-400">text-[#0052cc]</code>
                  <Badge
                    variant="danger"
                    className="h-4 px-1 text-[8px] font-black uppercase"
                  >
                    Rejected
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <code className="text-xs text-green-400">
                    text-[var(--ds-text-brand)]
                  </code>
                  <Badge className="h-4 px-1 text-[8px] font-black uppercase bg-green-500">
                    Approved
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-fit text-white/40 hover:text-white gap-2 p-0 h-auto hover:bg-transparent"
              >
                <LinkIcon size={12} /> Explore Token Map{' '}
                <ChevronRight size={14} />
              </Button>
            </div>
          </Card>

          <Card className="flex-1 rounded-[2.5rem] p-10 border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] shadow-lg flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-700">
              <Accessibility size={200} />
            </div>
            <div className="flex flex-col gap-6 relative z-10 h-full">
              <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text)] leading-none">
                Accessibility First
              </h3>
              <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-sm">
                Building for compound residents, security guards, and
                administrators means focusing on **predictability**, **keyboard
                operability**, and **high-contrast** semantic states.
              </p>
              <div className="mt-auto flex flex-col gap-4">
                <p className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                  Universal Standards
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-xs font-bold text-[var(--ds-text)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>{' '}
                    WCAG 2.1 AA Compliance
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-[var(--ds-text)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>{' '}
                    Native Keyboard Navigation
                  </li>
                  <li className="flex items-center gap-2 text-xs font-bold text-[var(--ds-text)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>{' '}
                    Prefers-Reduced-Motion Logic
                  </li>
                </ul>
                <Link href="/accessibility" passHref>
                  <Button className="mt-4 rounded-xl h-11 bg-[var(--ds-background-brand-bold)] font-black uppercase tracking-tight gap-2 w-full">
                    Open A11y Standards <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-subtle)] rounded-[2.5rem] p-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text)] flex items-center gap-3">
              <Settings2 className="text-[var(--ds-text-brand)]" />
              Development Checklist
            </h3>
            <p className="text-sm text-[var(--ds-text-subtle)] font-medium">
              Verify your component against these criteria before publishing to
              @gateflow/*
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-7 px-3 border-[var(--ds-border-subtle)] text-[10px] font-black uppercase"
          >
            v1.2.0-alpha
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'Inherits Light/Dark Tokens',
            'Exports Types Correctly',
            'Supports RTL Logic',
            'Keyboard Operable',
            'Responsive Layout (Mobile)',
            'Zero Dependency Core',
            'Semantic Event Handling',
            'Storybook/Gallery Logic',
          ].map((check) => (
            <div
              key={check}
              className="flex items-center gap-3 p-4 bg-[var(--ds-surface-raised)] dark:bg-[var(--ds-surface-glass)] rounded-2xl shadow-sm border border-[var(--ds-border-subtle)] group hover:border-[var(--ds-border-brand)] transition-all"
            >
              <div className="h-5 w-5 rounded-md bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                <CheckCircle2 size={12} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-bold text-[var(--ds-text)]">
                {check}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
