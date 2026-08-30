'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Card, CardTitle, CardDescription, Badge, Button, useToast } from '@gateflow/ui';
import { Sparkles, Copy, Check, Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function PromptGuidePage() {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const { addToast } = useToast();

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    addToast({
      title: 'Prompt Recipe Copied',
      description: 'Ready to paste into Cursor Composer, Antigravity, or Claude CLI.',
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const PROMPT_RECIPES = [
    {
      title: '1. Master System Prompt Injection',
      description: 'Paste into Cursor System Rules (.cursorrules) or LLM system context before prompting UI tasks.',
      prompt: `You are generating UI components for GateFlow.
CRITICAL INVARIANTS:
1. ALWAYS use components from \`@gateflow/ui\` (Button, Card, FormField, Badge, DynamicTable).
2. NEVER use arbitrary Tailwind colors (bg-gray-900, text-blue-500). ALWAYS use \`--ds-\` semantic tokens.
3. Dark mode layers: Canvas (\`--ds-layer-01\`), Card (\`--ds-layer-02\`), Raised (\`--ds-layer-03\`), Modal (\`--ds-layer-04\`).
4. Primary Accent: Kimchi Vermilion (\`--ds-color-primary\`). AI Features: Virtual Lab Orchid (\`--ds-color-ai-lab\`).
5. Forms: ALWAYS use composable \`<FormField label="" helperText="" errorMessage="">\`.
6. Tables: ALWAYS use \`<DynamicTable columns={...} items={...} responsiveCardView />\`.`,
    },
    {
      title: '2. Metric Dashboard Card Recipe',
      description: 'Generate high-density operational metric cards with badge indicators.',
      prompt: `Build a GateFlow Metric Card for "Daily Gate Scans":
- Use \`<Card variant="interactive" className="p-5">\`
- Header: Title "Daily Gate Scans" with \`<Badge variant="soft" tone="success">+12% vs last week</Badge>\`
- Value: "14,280" formatted with \`text-3xl font-black text-[var(--ds-text-primary)]\`
- Subtext: "99.8% approved access passes" with \`text-xs text-[var(--ds-text-subtle)]\`
- Rim-light hover glow enabled.`,
    },
    {
      title: '3. Accessible Form Dialog Recipe',
      description: 'Create a modal dialog with full FormField validation and action buttons.',
      prompt: `Create a GateFlow modal dialog for "Register Visitor":
- Use \`<Dialog>\`, \`<DialogContent>\`, and \`<FormField>\`
- Fields:
  1. Full Name (isRequired, input text)
  2. Phone Number (helperText="Include country code", input tel)
  3. Gate Access Level (Select: Visitor, Contractor, VIP)
- Actions: \`<Button variant="ghost">Cancel</Button>\` and \`<Button variant="primary">Generate Pass</Button>\`
- Dark mode elevation: \`--ds-layer-04\``,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="AI Prompt Writing Guide"
        subtitle="The definitive handbook and prompt recipes for vibe coders and AI agents generating GateFlow UI."
        packageName="@gateflow/ui"
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Guidelines', href: '/guidelines' },
          { label: 'Prompt Writing Guide' },
        ]}
      />

      <div className="flex flex-col gap-6">
        <Card variant="interactive" className="p-6 border-l-4 border-l-[var(--ds-color-ai-lab)] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--ds-color-ai-lab)]" />
            <CardTitle className="text-lg">The Machine-Readable Design Invariant</CardTitle>
          </div>
          <CardDescription className="text-sm">
            GateFlow provides a root <code className="text-[var(--ds-text-brand)]">DESIGN.md</code> and <code className="text-[var(--ds-text-brand)]">llms.txt</code> that encapsulates all color registers, 60-30-10 distribution rules, and component architectures for direct injection into any AI agent.
          </CardDescription>
        </Card>

        {PROMPT_RECIPES.map((recipe, index) => (
          <Card key={index} variant="interactive" className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--ds-text-primary)]">{recipe.title}</h3>
                <p className="text-xs text-[var(--ds-text-subtle)] mt-0.5">{recipe.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(recipe.prompt, index)}
                className="gap-1.5 text-xs"
              >
                {copiedIndex === index ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedIndex === index ? 'Copied' : 'Copy Prompt'}
              </Button>
            </div>

            <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border-subtle)] bg-zinc-950 p-4 font-mono text-xs text-blue-200 overflow-x-auto">
              <pre className="whitespace-pre-wrap">{recipe.prompt}</pre>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
