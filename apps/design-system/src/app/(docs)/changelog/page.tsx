'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { useLocale } from '../../components/providers/LocaleProvider';
import { Badge } from '@gateflow/ui';
import { CheckCircle2, Milestone } from 'lucide-react';

const releases = [
  {
    version: 'v0.1.9-beta',
    date: 'April 2026',
    title: 'Final Polish & RTL Parity',
    type: 'Update',
    changes: [
      'Implemented full RTL support with automatic layout mirroring.',
      'Added high-fidelity search index for client-side discovery.',
      'Standardized SEO metadata, OG images, and sitemaps.',
      'Transitioned to authoritative package catalog in /packages.',
    ],
  },
  {
    version: 'v0.1.8-alpha',
    date: 'March 2026',
    title: 'Galleries & Guidelines',
    type: 'Feature',
    changes: [
      'Created interactive galleries for Primitives, Patterns, and AI AI.',
      'Codified "No-Raw-Hex" and logical property design rules.',
      'Stabilized @gateflow/ai agentic UI components.',
    ],
  },
  {
    version: 'v0.1.5-alpha',
    date: 'March 2026',
    title: 'Core Pattern Assembly',
    type: 'Feature',
    changes: [
      'Stabilized PageHeader, EntityCard, and StatGrid patterns.',
      'Initialized documentation infrastructure with Next.js App Router.',
      'Integrated @gateflow/tokens into @gateflow/ui primitives.',
    ],
  },
  {
    version: 'v0.1.0-alpha',
    date: 'February 2026',
    title: 'Foundational Infrastructure',
    type: 'Launch',
    changes: [
      'Defined OKLCH color theory foundations in the tokens package.',
      'Established Turborepo workspace for @gateflow design system.',
      'Set up baseline Tailwind configuration with ADS-compliant tokens.',
    ],
  },
];

export default function ChangelogPage() {
  const { isRTL } = useLocale();

  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title={isRTL ? 'سجل التغييرات' : 'Changelog'}
        subtitle={
          isRTL
            ? 'متابعة تطور نظام تصميم GateFlow عبر جميع الإصدارات.'
            : 'Tracking the evolution of the GateFlow Design System across all versions.'
        }
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: isRTL ? 'سجل التغييرات' : 'Changelog' },
        ]}
      />

      <div className="flex flex-col gap-10">
        {releases.map((release, idx) => (
          <div
            key={idx}
            className="relative flex flex-col gap-4 border-s border-[var(--ds-border-subtle)] ps-8 pe-4"
          >
            <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-[var(--ds-background-brand-bold)] ring-4 ring-white shadow-sm" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-black uppercase tracking-tight text-xl text-[var(--ds-text)]">
                    {release.title}
                  </span>
                  <Badge
                    variant={
                      release.version.includes('beta') ? 'default' : 'secondary'
                    }
                    className="rounded-lg h-5 text-[9px] uppercase font-black tracking-tight"
                  >
                    {release.version}
                  </Badge>
                </div>
                <span className="text-xs font-bold text-[var(--ds-text-subtlest)] flex items-center gap-1.5">
                  <Milestone
                    size={14}
                    className="text-[var(--ds-text-brand)]"
                  />
                  {release.date}
                </span>
              </div>
              <Badge
                variant="outline"
                className="w-fit rounded-lg h-6 px-3 border-[var(--ds-border-subtle)] text-[10px] font-black uppercase"
              >
                {release.type}
              </Badge>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-subtle)] mt-2">
              <ul className="flex flex-col gap-4">
                {release.changes.map((change, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-3">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 text-[var(--ds-text-success)] shrink-0"
                      strokeWidth={3}
                    />
                    <span className="text-sm font-medium text-[var(--ds-text-subtle)] leading-relaxed">
                      {change}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-[var(--ds-background-brand-bold)] text-white p-10 rounded-[2.5rem] flex flex-col gap-4 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <History size={200} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight relative z-10">
          Roadmap to v1.0.0
        </h2>
        <p className="text-sm font-medium text-white/70 max-w-xl relative z-10">
          We are rapidly moving towards the stable v1.0.0 release. Up next: Full
          npm distribution pipeline, standardized documentation for 100% of
          @gateflow/* exports, and E2E visual regression testing.
        </p>
      </section>
    </div>
  );
}

// Dummy icon for group hover effect relative layout above
function History({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
