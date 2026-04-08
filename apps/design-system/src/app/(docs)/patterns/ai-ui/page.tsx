import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  Bot,
  Sparkles,
  Send,
  Zap,
  Info,
  Wand2,
  Terminal,
  Workflow,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for the lab to ensure clean hydration of AI-specific animations
const AIChatLab = dynamic(() => import('./AIChatLab'), {
  ssr: false,
  loading: () => (
    <div className="h-[650px] w-full bg-[var(--gf-color-ai-surface)] animate-pulse rounded-[2.5rem] border border-[var(--ds-border-bold)] shadow-ai-glow" />
  ),
});

const aiPrinciples = [
  {
    title: 'Cognitive Depth',
    description:
      'AI surfaces exist on a superior cognitive layer, utilizing deep translucency and Orchid accents (--gf-color-ai-accent).',
    icon: Sparkles,
  },
  {
    title: 'Reactive Motion',
    description:
      'Content never "pops". Use 0.4s spring transitions with rhythmic staggering for an organic cognitive feel.',
    icon: Zap,
  },
  {
    title: 'Actionable Intelligence',
    description:
      'Tool calls and system operations are encapsulated in interactive cards that signal execution status and outcomes.',
    icon: Workflow,
  },
];

export default function AIElementsPage() {
  return (
    <div className="flex flex-col gap-16 max-w-5xl mx-auto py-12 px-6">
      <PageHeader
        title="AI Pattern Architecture"
        subtitle="Defining the manifestation of artificial intelligence within GateFlow. Emphasis on premium Orchid flows and cognitive assembly."
        packageName="@gateflow/ai"
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'AI Architecture' },
        ]}
      />

      {/* Principles Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {aiPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-5 p-8 rounded-[2rem] border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="p-3 w-fit rounded-xl bg-[var(--gf-color-ai-accent)] text-white shadow-lg shadow-[var(--gf-color-ai-accent)]/20 transition-transform group-hover:rotate-12">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)]">
                {p.title}
              </h3>
              <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-bold opacity-80">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Interactive Hub */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Bot className="text-[var(--gf-color-ai-accent)]" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Cognition Lab
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70 max-w-2xl">
            Test the GateFlow AI interaction model below. Observe how text
            blends with tool invocations under the Orchid Glow protocol.
          </p>
        </div>

        <AIChatLab />
      </div>

      {/* Structural Composition */}
      <section className="flex flex-col gap-12 pt-10 border-t border-[var(--ds-border-bold)]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Terminal className="text-[var(--gf-color-ai-accent)]" size={24} />
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Composition
            </h2>
          </div>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70">
            Assembly patterns for building AI interfaces within the monorepo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tool Card Sample */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gf-color-ai-accent)]">
              1. Tool Invocation
            </h4>
            <div className="p-6 rounded-2xl bg-[var(--ds-surface-sunken)] border border-[var(--ds-border-bold)] font-mono text-[11px] leading-relaxed overflow-x-auto">
              <pre className="text-[var(--ds-text-primary)]">
                {`import { ToolCallCard } from '@gateflow/ai';

<ToolCallCard 
  name="sync_gate_logs"
  status="running"
  arguments={{ gate_id: 'G-42' }}
/>`}
              </pre>
            </div>
          </div>

          {/* Orchid Theming Sample */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gf-color-ai-accent)]">
              2. Orchid Glow System
            </h4>
            <div className="p-6 rounded-2xl bg-[var(--ds-surface-sunken)] border border-[var(--ds-border-bold)] font-mono text-[11px] leading-relaxed overflow-x-auto">
              <pre className="text-[var(--ds-text-primary)]">
                {`// Apply AI surface depth
<div className="bg-[var(--gf-color-ai-surface)] 
                shadow-ai-glow">
  <Bot className="text-[var(--gf-color-ai-accent)]" />
</div>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Guardrail Note */}
      <section className="p-10 rounded-[2.5rem] border border-[var(--gf-color-ai-accent)]/20 bg-gradient-to-br from-[var(--gf-color-ai-accent)]/[0.05] to-transparent relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 p-2 opacity-10 scale-[2.5] rotate-12 transition-all duration-700 group-hover:rotate-0">
          <Wand2 size={120} className="text-[var(--gf-color-ai-accent)]" />
        </div>
        <div className="flex gap-6 relative z-10">
          <div className="p-3 h-fit w-fit rounded-xl bg-[var(--gf-color-ai-accent)] text-white shadow-xl">
            <Info size={24} />
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Cognitive Boundaries
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-bold opacity-80">
              AI elements must remain distinct from human-operated UI. Never
              substitute
              <code className="bg-[var(--gf-color-ai-accent)]/10 text-[var(--gf-color-ai-accent)] px-2 py-0.5 rounded text-xs ml-1">
                --ds-primary-accent
              </code>
              for AI actions. Intelligence always flows through the
              &quot;Orchid&quot; channel to maintain clarity of agency in the
              workspace.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
