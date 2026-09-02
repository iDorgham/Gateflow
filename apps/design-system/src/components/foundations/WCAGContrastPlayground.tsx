'use client';

import * as React from 'react';
import { cn } from '@gateflow/ui/utils';
import { CheckCircle2, XCircle, AlertTriangle, Scale, Eye } from 'lucide-react';
import {
  evaluateContrast,
  isMeasurableColor,
  roundRatio,
} from '../../lib/wcag';

/**
 * Token pairs worth auditing. Each pair expresses a foreground/background
 * relationship used in real GateFlow UI, resolved at runtime from the active
 * theme so the audit always reflects light/dark and the active accent profile.
 */
const AUDIT_PAIRS: { name: string; fg: string; bg: string; note?: string }[] = [
  { name: 'Heading on page', fg: '--ds-text-heading', bg: '--ds-background' },
  { name: 'Body on page', fg: '--ds-text', bg: '--ds-background' },
  {
    name: 'Subtle body on page',
    fg: '--ds-text-subtle',
    bg: '--ds-background',
  },
  {
    name: 'Subtlest on page',
    fg: '--ds-text-subtlest',
    bg: '--ds-background',
    note: 'Advisory — subtlest is intentionally faint',
  },
  {
    name: 'Body on surface-raised',
    fg: '--ds-text',
    bg: '--ds-surface-raised',
  },
  {
    name: 'Subtle on surface-raised',
    fg: '--ds-text-subtle',
    bg: '--ds-surface-raised',
  },
  {
    name: 'Inverse text on brand',
    fg: '--ds-text-inverse',
    bg: '--ds-background-brand-bold',
  },
  { name: 'Brand text on page', fg: '--ds-text-brand', bg: '--ds-background' },
  {
    name: 'Link on page',
    fg: '--ds-text-link',
    bg: '--ds-background',
    note: 'WCAG 2.2 1.4.1 non-color cue applies for links',
  },
  {
    name: 'Success text on page',
    fg: '--ds-text-success',
    bg: '--ds-background',
  },
  {
    name: 'Danger text on page',
    fg: '--ds-text-danger',
    bg: '--ds-background',
  },
  {
    name: 'Warning text on page',
    fg: '--ds-text-warning',
    bg: '--ds-background',
  },
  {
    name: 'Muted on page',
    fg: '--ds-text-subtle',
    bg: '--ds-background-neutral',
  },
  {
    name: 'Text on subtle surface',
    fg: '--ds-text',
    bg: '--ds-surface-subtle',
  },
];

function readToken(varName: string): string | null {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest',
        pass
          ? 'bg-[var(--ds-background-success-subtle)] text-[var(--ds-text-success)]'
          : 'bg-[var(--ds-background-danger-subtle)] text-[var(--ds-text-danger)]'
      )}
    >
      {pass ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
      {label}
    </span>
  );
}

function Sample({
  fg,
  bg,
  children,
}: {
  fg: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="rounded px-2 py-1 text-sm font-semibold"
      style={{ color: `var(${fg})`, backgroundColor: `var(${bg})` }}
    >
      {children}
    </span>
  );
}

export function WCAGContrastPlayground() {
  const [revision, setRevision] = React.useState(0);
  const [results, setResults] = React.useState<
    {
      name: string;
      fg: string;
      bg: string;
      note?: string;
      fgValue: string | null;
      bgValue: string | null;
    }[]
  >([]);

  React.useEffect(() => {
    const mapped = AUDIT_PAIRS.map((pair) => ({
      ...pair,
      fgValue: readToken(pair.fg),
      bgValue: readToken(pair.bg),
    }));
    setResults(mapped);
  }, [revision]);

  const passAA = results.filter((r) => {
    if (
      !r.fgValue ||
      !r.bgValue ||
      !isMeasurableColor(r.fgValue) ||
      !isMeasurableColor(r.bgValue)
    )
      return false;
    return evaluateContrast(r.fgValue, r.bgValue).aaNormal;
  }).length;
  const total = results.length;

  const refresh = () => {
    setRevision((v) => v + 1);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-xl">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)]">
              <Scale size={20} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-heading)]">
                WCAG 2.2 Contrast Audit
              </h3>
              <p className="text-xs text-[var(--ds-text-subtle)] font-medium">
                Live measurement of DS token pairs against AA / AAA thresholds
              </p>
            </div>
          </div>
          <button
            onClick={refresh}
            className="rounded-xl border border-[var(--ds-border-bold)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] hover:text-[var(--ds-text)] transition-all"
          >
            Re-measure
          </button>
        </div>

        <p className="text-[11px] leading-relaxed text-[var(--ds-text-subtle)] font-medium">
          Reads the resolved{' '}
          <code className="text-[var(--ds-text-accent)]">--ds-*</code> tokens
          from the active theme and computes WCAG 2.2 relative-luminance
          contrast. Switch light/dark or an accent profile above, then hit{' '}
          <strong>Re-measure</strong> to re-audit.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatLabel value={`${passAA}/${total}`} label="AA normal passes" />
        <StatLabel
          value={`${Math.round((passAA / Math.max(total, 1)) * 100)}%`}
          label="overall coverage"
        />
        <StatLabel value="4.5:1" label="AA normal target" />
        <StatLabel value="3:1" label="AA large target" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[1.4fr_1fr_2fr_1.5fr] gap-2 px-2 text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)] hidden md:grid">
          <span>Relationship</span>
          <span>Preview</span>
          <span>AAA / AA / AA-Large</span>
          <span className="text-end">Ratio</span>
        </div>
        {results.map((row) => {
          const measurable =
            row.fgValue &&
            row.bgValue &&
            isMeasurableColor(row.fgValue) &&
            isMeasurableColor(row.bgValue);
          const outcome = measurable
            ? evaluateContrast(row.fgValue!, row.bgValue!)
            : null;

          return (
            <div
              key={row.name}
              className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_2fr_1.5fr] md:items-center gap-2 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[var(--ds-text)]">
                  {row.name}
                </span>
                <code className="text-[9px] text-[var(--ds-text-subtlest)] font-mono">
                  {row.fg} / {row.bg}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <Sample fg={row.fg} bg={row.bg}>
                  Aa
                </Sample>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {outcome ? (
                  <>
                    <Badge pass={outcome.aaNormal} label="AA Normal" />
                    <Badge pass={outcome.aaLarge} label="AA Large" />
                    <Badge pass={outcome.aaaNormal} label="AAA" />
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]">
                    <AlertTriangle size={10} /> unmeasurable
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-0.5">
                <span
                  className={cn(
                    'text-sm font-black tabular-nums',
                    outcome
                      ? outcome.aaNormal
                        ? 'text-[var(--ds-text-success)]'
                        : outcome.fails
                          ? 'text-[var(--ds-text-danger)]'
                          : 'text-[var(--ds-text-warning)]'
                      : 'text-[var(--ds-text-subtlest)]'
                  )}
                >
                  {outcome ? `${roundRatio(outcome.ratio)}:1` : '—'}
                </span>
                {row.note && (
                  <span className="text-[9px] text-[var(--ds-text-subtlest)]">
                    {row.note}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-[10px] font-medium text-[var(--ds-text-subtle)]">
        <Eye size={12} />
        Ratios computed per WCAG 2.x relative luminance. Non-text / UI component
        contrast uses the AA 3:1 bar (1.4.11); GateFlow targets AA and treats
        AAA as advisory.
      </div>
    </div>
  );
}

function StatLabel({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] px-3 py-2">
      <span className="text-lg font-black tabular-nums text-[var(--ds-text-heading)]">
        {value}
      </span>
      <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
        {label}
      </span>
    </div>
  );
}
