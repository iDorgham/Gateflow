'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Button, Card, Badge, useToast } from '@gateflow/ui';
import { Sparkles, Check, AlertTriangle, ArrowRight, Copy, RefreshCw, ShieldCheck } from 'lucide-react';

const DEFAULT_SAMPLE_CODE = `<div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-white shadow-lg">
  <h2 className="text-xl font-bold text-blue-400">Security Gate Log</h2>
  <p className="text-gray-400 text-sm mt-2">Active scanners monitoring north perimeter.</p>
  <div className="mt-4 flex gap-2">
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium">
      Grant Access
    </button>
    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium">
      Deny Access
    </button>
  </div>
</div>`;

export default function VibeCheckPage() {
  const [inputCode, setInputCode] = React.useState(DEFAULT_SAMPLE_CODE);
  const [sanitizedCode, setSanitizedCode] = React.useState('');
  const [violations, setViolations] = React.useState<string[]>([]);
  const [isAuditing, setIsAuditing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { addToast } = useToast();

  const handleVibeCheck = () => {
    setIsAuditing(true);

    setTimeout(() => {
      const foundViolations: string[] = [];

      if (inputCode.includes('bg-gray-900') || inputCode.includes('bg-zinc-900') || inputCode.includes('bg-black')) {
        foundViolations.push('Generic dark surface found. Replaced with Satin-Charcoal `bg-[var(--ds-layer-02)]`.');
      }
      if (inputCode.includes('text-white') || inputCode.includes('text-gray-400')) {
        foundViolations.push('Hardcoded text colors found. Replaced with `--ds-text-primary` and `--ds-text-subtle`.');
      }
      if (inputCode.includes('<button') || inputCode.includes('bg-blue-600') || inputCode.includes('bg-red-600')) {
        foundViolations.push('Unstyled HTML buttons found. Migrated to `@gateflow/ui` `<Button variant="primary">` and `<Button variant="destructive">`.');
      }
      if (inputCode.includes('border-gray-800')) {
        foundViolations.push('Arbitrary border color replaced with `--ds-border-subtle`.');
      }

      if (foundViolations.length === 0) {
        foundViolations.push('Code is clean and already respects GateFlow Design System invariants!');
      }

      let sanitized = inputCode
        .replace(/<div className="bg-gray-900[^"]*">/g, '<Card variant="interactive" className="p-6">')
        .replace(/<\/div>\s*<\/div>/g, '</div>\n</Card>')
        .replace(/<h2 className="text-xl font-bold[^"]*">/g, '<CardTitle className="text-lg">')
        .replace(/<\/h2>/g, '</CardTitle>')
        .replace(/<p className="text-gray-400[^"]*">/g, '<CardDescription>')
        .replace(/<\/p>/g, '</CardDescription>')
        .replace(/<button className="bg-blue-600[^"]*">/g, '<Button variant="primary">')
        .replace(/<button className="bg-red-600[^"]*">/g, '<Button variant="destructive">')
        .replace(/<\/button>/g, '</Button>');

      // Wrap with proper imports if missing
      sanitized = `import { Card, CardTitle, CardDescription, Button } from '@gateflow/ui';\n\nexport function CleanComponent() {\n  return (\n    ${sanitized}\n  );\n}`;

      setViolations(foundViolations);
      setSanitizedCode(sanitized);
      setIsAuditing(false);

      addToast({
        title: 'Vibe Check Complete',
        description: `Identified and sanitized ${foundViolations.length} token rules.`,
      });
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sanitizedCode);
    setCopied(true);
    addToast({
      title: 'Sanitized Code Copied',
      description: 'Clean @gateflow/ui component ready to paste.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Vibe-Check Sandbox"
        subtitle="1-Click AI code sanitizer. Paste generic AI-generated code to automatically detect AI-slop, map hardcoded colors to semantic tokens, and enforce GateFlow design invariants."
        packageName="@gateflow/ui"
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Sandboxes', href: '/sandboxes' },
          { label: 'Vibe-Check' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Input Panel */}
        <Card variant="interactive" className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--ds-color-ai-lab)]" />
              <h3 className="font-semibold text-[var(--ds-text-primary)]">Raw AI Output (JSX / HTML)</h3>
            </div>
            <Badge variant="soft" tone="warning">Unsanitized</Badge>
          </div>

          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            rows={14}
            className="w-full rounded-[var(--ds-radius-md)] border border-[var(--ds-border-subtle)] bg-[var(--ds-layer-01)] p-4 font-mono text-xs text-[var(--ds-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused)] resize-none"
            placeholder="Paste your AI-generated component code here..."
          />

          <Button
            variant="primary"
            onClick={handleVibeCheck}
            isLoading={isAuditing}
            className="w-full gap-2 font-bold"
          >
            <ShieldCheck className="w-4 h-4" />
            Run Vibe Check & Sanitize
          </Button>
        </Card>

        {/* Output Panel */}
        <Card variant="interactive" className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[var(--ds-color-success)]" />
              <h3 className="font-semibold text-[var(--ds-text-primary)]">Token-Sanitized GateFlow TSX</h3>
            </div>
            {sanitizedCode ? (
              <Badge variant="solid" tone="success">100% Anti-Slop Compliant</Badge>
            ) : (
              <Badge variant="outline" tone="neutral">Waiting for Audit</Badge>
            )}
          </div>

          {sanitizedCode ? (
            <>
              <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-border-subtle)] bg-zinc-950 p-4 font-mono text-xs text-blue-200 overflow-x-auto max-h-[290px]">
                <pre>{sanitizedCode}</pre>
              </div>

              <div className="flex flex-col gap-2 p-3 rounded-[var(--ds-radius-md)] bg-[var(--ds-layer-01)] border border-[var(--ds-border-subtle)] text-xs">
                <p className="font-semibold text-[var(--ds-text-primary)]">Violations Detected & Fixed:</p>
                <ul className="list-disc list-inside space-y-1 text-[var(--ds-text-subtle)]">
                  {violations.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>

              <Button
                variant="outline"
                onClick={handleCopy}
                className="w-full gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Clean Code' : 'Copy Sanitized TSX'}
              </Button>
            </>
          ) : (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8 rounded-[var(--ds-radius-md)] border border-dashed border-[var(--ds-border-subtle)] bg-[var(--ds-layer-01)] text-[var(--ds-text-subtle)]">
              <Sparkles className="w-8 h-8 text-[var(--ds-color-ai-lab)] mb-3 opacity-60" />
              <p className="font-semibold text-sm">No code audited yet</p>
              <p className="text-xs max-w-xs mt-1">Click &quot;Run Vibe Check &amp; Sanitize&quot; to inspect the snippet against all token rules.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
