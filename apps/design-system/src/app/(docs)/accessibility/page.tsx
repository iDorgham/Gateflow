'use client';

import * as React from 'react';
import { PageHeader, EntityCard } from '@gateflow/components';
import { Keyboard, Eye, Move, Globe, ShieldCheck } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Accessibility"
        subtitle="Our commitment to building an inclusive and operable design system for every user."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Accessibility' },
        ]}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text)]">
          Our Commitment
        </h2>
        <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-3xl">
          GateFlow is dedicated to ensuring digital accessibility for people
          with disabilities. We are continuously improving the user experience
          for everyone and applying the relevant accessibility standards, aiming
          for WCAG 2.1 AA compliance.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EntityCard
          title="Keyboard Navigation"
          subtitle="All interactive elements are reachable and operable via keyboard."
          icon={Keyboard}
          meta={[
            { label: 'Standard', value: 'Tab / Focus trapping' },
            { label: 'Status', value: 'Enforced' },
          ]}
        />
        <EntityCard
          title="Color & Contrast"
          subtitle="Semantic tokens are mapped to meet WCAG 2.1 AA contrast ratios."
          icon={Eye}
          meta={[
            { label: 'Visual', value: '4.5:1 Minimum' },
            { label: 'Tokens', value: 'OKLCH Automated' },
          ]}
        />
        <EntityCard
          title="Reduced Motion"
          subtitle="Animations respect user preferences via prefers-reduced-motion."
          icon={Move}
          meta={[
            { label: 'Policy', value: 'CSS/Tailwind Only' },
            { label: 'Default', value: 'Restricted' },
          ]}
        />
        <EntityCard
          title="RTL / Internationalization"
          subtitle="Support for Arabic (RTL) via logical CSS properties (ms/me)."
          icon={Globe}
          meta={[
            { label: 'Mirroring', value: 'Logical Layout' },
            { label: 'Lang', value: 'AR/EN First' },
          ]}
        />
      </div>

      <section className="rounded-3xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[var(--ds-icon-brand)]" size={24} />
          <h3 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text)]">
            Guidance & Reference
          </h3>
        </div>
        <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
          GateFlow’s accessibility strategy is inspired by industry leaders. For
          normative patterns and deep technical guidance on building accessible
          components, we recommend the following external resources:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
          <li>
            <a
              href="https://primer.style/accessibility"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 p-4 rounded-xl border border-[var(--ds-border-subtle)] hover:border-[var(--ds-border-brand)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] transition-all"
            >
              <span className="font-bold text-[var(--ds-text)] group-hover:text-[var(--ds-text-brand)]">
                Primer Accessibility
              </span>
              <span className="text-xs text-[var(--ds-text-subtlest)]">
                GitHub&apos;s accessible design handbook.
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://atlassian.design/foundations/accessibility"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 p-4 rounded-xl border border-[var(--ds-border-subtle)] hover:border-[var(--ds-border-brand)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] transition-all"
            >
              <span className="font-bold text-[var(--ds-text)] group-hover:text-[var(--ds-text-brand)]">
                Atlassian Accessibility
              </span>
              <span className="text-xs text-[var(--ds-text-subtlest)]">
                Foundational inclusive design principles.
              </span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
