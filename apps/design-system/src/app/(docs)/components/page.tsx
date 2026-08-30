'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@gateflow/components';
import { Button, Card, CardContent, Badge } from '@gateflow/ui';
import {
  Layers,
  Sparkles,
  Grid,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code2,
  Palette,
  Terminal,
} from 'lucide-react';

export default function ComponentsOverviewPage() {
  const componentCategories = [
    {
      title: 'Core Primitives',
      description:
        '38 Atomic primitives including Buttons, Badges, Cards, FormField, and Inputs with 8-state coverage.',
      href: '/components/primitives',
      count: '38 Components',
      icon: Layers,
      tag: 'Ready (v7.1)',
      variant: 'solid' as const,
    },
    {
      title: 'Domain Patterns',
      description:
        'Higher-order operational compositions: DynamicTable, EntityCard, FilterBar, and Handover Drawer.',
      href: '/components/patterns',
      count: '12 Patterns',
      icon: Grid,
      tag: 'Ready (v7.1)',
      variant: 'soft' as const,
    },
    {
      title: 'AI UX Toolkit',
      description:
        'Streaming chat interfaces, Virtual Lab Orchid palette, mutation confirmations, and prompt injectors.',
      href: '/components/ai',
      count: '6 Modules',
      icon: Sparkles,
      tag: 'Ready (v7.1)',
      variant: 'outline' as const,
    },
  ];

  const roadmapMilestones = [
    {
      phase: 'Phase 1–4',
      title: 'Impeccable Foundations & Primitives',
      status: 'Completed',
      date: 'Q3 2026',
      items: [
        '3-Tier token architecture (Foundations → Semantic → Component)',
        'Satin-Charcoal Dark Mode + Porcelain Light Mode (OKLCH)',
        '38 UI Primitives overhauled with 8 canonical interaction states',
        'Vibe-Check AI Code Sanitizer & Prompt Writing Guide',
      ],
    },
    {
      phase: 'Phase 5',
      title: 'Multi-App Ecosystem Rollout',
      status: 'Completed',
      date: 'Q3 2026',
      items: [
        'Compact Density (36px) across Client & Admin Dashboards',
        'Comfortable Density (48px) across Marketing & Resident Portal',
        'Expo nativeTokens & 44px touch targets across Mobile Apps',
        'Arabic RTL (Cairo) and Latin (Inter) typography calibration',
      ],
    },
    {
      phase: 'Phase 6',
      title: 'Monorepo Certification & Release',
      status: 'Completed',
      date: 'Q3 2026',
      items: [
        '19/19 WCAG 2.2 AA Contrast Verification automation',
        '100% Showcase route and component coverage audit',
        '5-Gate Security, Invariant, and Performance sign-off',
      ],
    },
    {
      phase: 'Upcoming (Q4 2026)',
      title: 'Advanced AI Widgets & 3D Spatial Maps',
      status: 'Roadmap',
      date: 'Q4 2026',
      items: [
        'GateAI Interactive Map Annotation widget',
        'Biometric Guard Liveness visualizer 2.0',
        'Enterprise Custom Tenant Theme Builder with live token export',
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-5xl">
      <PageHeader
        title="Component Architecture"
        subtitle="Explore the 38 production-ready UI primitives, operational domain patterns, and AI-native UX widgets powered by @gateflow/ui and @gateflow/tokens."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Components' },
        ]}
      />

      {/* Component Hub Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {componentCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.title} href={category.href} className="group">
              <Card
                variant="interactive"
                className="h-full border border-[var(--ds-border-subtle)] bg-[var(--ds-background-surface)] hover:border-[var(--ds-border-brand)] transition-all p-6 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant={category.variant} tone="brand">
                      {category.tag}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--ds-text-heading)] group-hover:text-[var(--ds-text-brand)] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-[var(--ds-text-subtlest)] font-mono mt-1">
                      {category.count}
                    </p>
                    <p className="text-sm text-[var(--ds-text-subtle)] mt-3 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ds-text-brand)] mt-6 pt-4 border-t border-[var(--ds-border-subtle)] group-hover:translate-x-1 transition-transform">
                  Explore {category.title} <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Roadmap Section */}
      <section className="flex flex-col gap-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--ds-text-heading)]">
              GateFlow Design System Roadmap
            </h2>
            <p className="text-sm text-[var(--ds-text-subtle)] mt-1">
              Evolutionary lifecycle from atomic tokens to multi-app monorepo deployment.
            </p>
          </div>
          <Badge tone="success" variant="soft" className="px-3 py-1">
            Status: v7.1 Certified
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmapMilestones.map((milestone) => (
            <Card
              key={milestone.title}
              className="p-6 bg-[var(--ds-background-surface)] border border-[var(--ds-border-subtle)] flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ds-text-brand)]">
                    {milestone.phase}
                  </span>
                  <Badge
                    tone={milestone.status === 'Completed' ? 'success' : 'information'}
                    variant="soft"
                  >
                    {milestone.status}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-[var(--ds-text-heading)]">
                  {milestone.title}
                </h3>
                <ul className="flex flex-col gap-2 mt-2">
                  {milestone.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-[var(--ds-text-subtle)] flex items-start gap-2"
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          milestone.status === 'Completed'
                            ? 'text-[var(--ds-text-success)]'
                            : 'text-[var(--ds-text-subtlest)]'
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-[11px] font-mono text-[var(--ds-text-subtlest)] mt-6 pt-3 border-t border-[var(--ds-border-subtle)]">
                Target: {milestone.date}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
