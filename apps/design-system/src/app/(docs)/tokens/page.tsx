import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { TokenExplorer } from '../../../components/token-explorer/TokenExplorer';

export default function TokensPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Tokens"
        subtitle="The atomic elements of the GateFlow design system. Browsable, previewable, and ready to use in any workspace."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Tokens' },
        ]}
      />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text)]">
            Token Explorer
          </h2>
          <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
            Use the explorer below to browse our semantic token library. You can
            preview how tokens look in both light and dark modes, and copy
            variable names directly to your CSS or Tailwind configuration.
          </p>
        </div>

        <TokenExplorer />
      </section>
    </div>
  );
}
