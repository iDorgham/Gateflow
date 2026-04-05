import * as React from 'react';
import { PageHeader } from '@gateflow/components';

export default function Page() {
  const title = 'changelog'
    .split('/')
    .pop()
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={title}
        subtitle="This section is currently under development. Content will be populated in Phase 7 and 8."
        breadcrumbs={[{ label: 'Documentation', href: '/' }, { label: title }]}
      />

      <div className="rounded-3xl border border-dashed border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] p-20 flex items-center justify-center text-center">
        <div className="flex flex-col gap-4 max-w-sm">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-subtlest)]">
            Placeholder
          </h2>
          <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed">
            Content for ${title} is scheduled for implementation in the next
            phase of the GateFlow Design System roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
