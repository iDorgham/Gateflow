'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Badge, Card, CardContent, Button } from '@gateflow/ui';
import {
  Terminal,
  Layers,
  CheckCircle2,
  Box,
  Download,
  ShieldCheck,
} from 'lucide-react';

const packages = [
  {
    name: '@gateflow/tokens',
    purpose:
      'The atomic foundation: OKLCH CSS variables, semantic aliases, and Tailwind @theme integration.',
    npm: 'Yes',
    install: 'pnpm add @gateflow/tokens',
    peers: 'none',
    internalDeps: 'none',
    status: 'Stable',
  },
  {
    name: '@gateflow/theme',
    purpose:
      'Theme provider and data-color-mode management. Orchestrates Light/Dark/System transitions.',
    npm: 'Yes',
    install: 'pnpm add @gateflow/theme',
    peers: 'react, react-dom, next-themes',
    internalDeps: '@gateflow/tokens',
    status: 'Stable',
  },
  {
    name: '@gateflow/ui',
    purpose:
      'Atomic primitives (Button, Input, Card). High-performance, unstyled-first compositions.',
    npm: 'Yes',
    install: 'pnpm add @gateflow/ui',
    peers: 'react, react-dom, lucide-react, clsx, tailwind-merge',
    internalDeps: '@gateflow/tokens, @gateflow/theme',
    status: 'Stable',
  },
  {
    name: '@gateflow/components',
    purpose:
      'Standard product patterns: PageHeader, EntityCard, FilterBar. Reusable domain layouts.',
    npm: 'Yes',
    install: 'pnpm add @gateflow/components',
    peers: '@gateflow/ui, react, react-dom, lucide-react',
    internalDeps: '@gateflow/tokens, @gateflow/theme, @gateflow/ui',
    status: 'Stable',
  },
  {
    name: '@gateflow/ai',
    purpose:
      'Agentic UI patterns: Chat, Streaming, ToolCallCards. Specialized for LLM interactions.',
    npm: 'Yes',
    install: 'pnpm add @gateflow/ai',
    peers: '@gateflow/ui, react, react-dom, ai',
    internalDeps: '@gateflow/tokens, @gateflow/theme, @gateflow/ui',
    status: 'Stable',
  },
  {
    name: '@gateflow/design-system',
    purpose:
      'The documentation site (this site). Interactive explorer for tokens and component galleries.',
    npm: 'No',
    install: 'n/a (Vercel deploy only)',
    peers: 'all above',
    internalDeps: 'all above',
    status: 'Private',
  },
];

export default function PackagesPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Packages"
        subtitle="The authoritative catalog of the @gateflow monorepo libraries. Managed via Turborepo and Changesets."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Packages' },
        ]}
      />

      <section className="flex flex-col gap-6">
        <div className="rounded-3xl border border-[var(--ds-border-subtle)] bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)]">
                  <th className="px-6 py-4 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                    Package
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                    Purpose
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                    npm
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                    Internal Deps
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-tight text-[var(--ds-text-subtle)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr
                    key={pkg.name}
                    className="border-b border-[var(--ds-border-subtle)] last:border-0 hover:bg-[var(--ds-background-neutral-subtle)] transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[var(--ds-background-neutral-pressed)] flex items-center justify-center text-[var(--ds-icon-brand)]">
                          <Box size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[var(--ds-text)]">
                            {pkg.name}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)] group-hover:text-[var(--ds-text-brand)] transition-colors">
                            v0.1.0-alpha
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[var(--ds-text-subtle)] leading-relaxed max-w-sm">
                        {pkg.purpose}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant={pkg.npm === 'Yes' ? 'default' : 'secondary'}
                        className="rounded-lg uppercase font-black text-[9px] px-1.5 py-0"
                      >
                        {pkg.npm === 'Yes' ? 'Public' : 'Private'}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <code className="text-[10px] font-mono text-[var(--ds-text-subtlest)]">
                        {pkg.internalDeps}
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--ds-text-success)]">
                        <CheckCircle2 size={12} strokeWidth={3} /> {pkg.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {packages
            .filter((p) => p.npm === 'Yes')
            .map((pkg) => (
              <Card
                key={pkg.name}
                className="rounded-3xl border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] hover:bg-white hover:shadow-xl transition-all h-full"
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="rounded-lg uppercase font-black tracking-tight text-[9px] h-5 border-[var(--ds-border-brand)] text-[var(--ds-text-brand)]"
                      >
                        Stable Release
                      </Badge>
                      <Download
                        size={14}
                        className="text-[var(--ds-text-subtlest)]"
                      />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-tight text-[var(--ds-text)]">
                        {pkg.name.replace('@gateflow/', '')}
                      </h3>
                      <p className="text-[10px] text-[var(--ds-text-subtle)] leading-relaxed mt-1">
                        Unified install command for stable monorepo releases.
                      </p>
                    </div>
                    <div className="p-3 bg-[#09090b] rounded-xl flex items-center justify-between group shadow-sm">
                      <code className="text-[11px] font-mono text-blue-300 truncate mr-2">
                        {pkg.install}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white/40 hover:text-white rounded-md"
                      >
                        <Terminal size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-[var(--ds-border-subtle)] flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[9px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                      <span>Peer Dependencies</span>
                      <Layers size={10} />
                    </div>
                    <p className="text-[10px] font-mono text-[var(--ds-text-subtle)] truncate">
                      {pkg.peers}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>

      <section className="mt-8 p-10 rounded-[2.5rem] bg-[var(--ds-background-brand-bold)] text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <ShieldCheck size={200} />
        </div>
        <div className="flex flex-col gap-4 max-w-xl relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tight leading-none">
            Safe Workspace Architecture
          </h2>
          <p className="text-sm text-white/80 leading-relaxed font-medium">
            GateFlow packages utilize **OKLCH color theory**, **strict
            accessibility contracts**, and **logical properties** for 100%
            RTL/Arabic compatibility across the MENA compound management sector.
          </p>
        </div>
        <div className="relative z-10">
          <Button
            size="lg"
            className="rounded-2xl h-14 px-8 bg-white text-[var(--ds-background-brand-bold)] font-black uppercase tracking-tight hover:bg-white/90 shadow-2xl gap-3"
          >
            <Download size={20} /> Deploy All Packages
          </Button>
        </div>
      </section>
    </div>
  );
}
