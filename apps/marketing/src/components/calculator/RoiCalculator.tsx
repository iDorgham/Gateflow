'use client';

import { useState, useMemo } from 'react';
import {
  calculateGateRoi,
  DEFAULT_ROI_INPUT,
  REGION_GUARD_SALARIES,
  type RoiCalculatorInput,
  type RegionCode,
  type PropertyType,
} from './roi-calculator-state';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number, currency = true) {
  if (currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n);
  }
  return new Intl.NumberFormat('en-US').format(n);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const display = format ? format(value) : fmt(value, false);
  return (
    <div className="roi-field">
      <div className="roi-field-header">
        <label className="roi-label">{label}</label>
        <span className="roi-value">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-slider"
        aria-label={label}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`metric-card${highlight ? ' metric-card--highlight' : ''}`}>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {sub && <p className="metric-sub">{sub}</p>}
    </div>
  );
}

function BreakdownBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="breakdown-row">
      <div className="breakdown-label-row">
        <span className="breakdown-label">{label}</span>
        <span className="breakdown-amount">
          {fmt(value)} <span className="breakdown-pct">({pct}%)</span>
        </span>
      </div>
      <div className="breakdown-track">
        <div
          className="breakdown-fill"
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${pct}%`}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const REGIONS: { code: RegionCode; name: string }[] = [
  { code: 'SA', name: '🇸🇦 Saudi Arabia' },
  { code: 'AE', name: '🇦🇪 UAE' },
  { code: 'EG', name: '🇪🇬 Egypt' },
  { code: 'QA', name: '🇶🇦 Qatar' },
  { code: 'KW', name: '🇰🇼 Kuwait' },
  { code: 'BH', name: '🇧🇭 Bahrain' },
  { code: 'OM', name: '🇴🇲 Oman' },
  { code: 'JO', name: '🇯🇴 Jordan' },
];

const PROPERTY_TYPES: { code: PropertyType; name: string }[] = [
  { code: 'gated_community', name: 'Gated Community' },
  { code: 'compound', name: 'Residential Compound' },
  { code: 'office_tower', name: 'Office Tower' },
  { code: 'mixed_use', name: 'Mixed-Use Development' },
  { code: 'industrial_park', name: 'Industrial Park' },
];

const BAR_COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#ec4899', // pink
  '#8b5cf6', // violet
];

export function RoiCalculator() {
  const [input, setInput] = useState<RoiCalculatorInput>({
    ...DEFAULT_ROI_INPUT,
  });

  const result = useMemo(() => calculateGateRoi(input), [input]);

  function update<K extends keyof RoiCalculatorInput>(
    key: K,
    value: RoiCalculatorInput[K]
  ) {
    setInput((prev) => {
      const next = { ...prev, [key]: value };
      // When region changes, clear manual salary override so region default kicks in
      if (key === 'region') {
        next.averageGuardSalaryMonthly = undefined;
      }
      return next;
    });
  }

  const breakdownEntries = [
    {
      label: 'Guard Labor Reallocation',
      value: result.breakdown.guardLaborSavingsAnnual,
    },
    {
      label: 'ANPR Vehicle Processing',
      value: result.breakdown.anprVehicleSavingsAnnual,
    },
    {
      label: 'Visitor Queue Time Value',
      value: result.breakdown.queueTimeValueAnnual,
    },
    {
      label: 'Paper & Badge Printing',
      value: result.breakdown.paperBadgeSavingsAnnual,
    },
    {
      label: 'Compliance Fine Mitigation',
      value: result.breakdown.complianceFineRiskMitigatedAnnual,
    },
    {
      label: 'Insurance Premium Reduction',
      value: result.breakdown.insurancePremiumReductionAnnual,
    },
  ];

  return (
    <section
      id="roi-calculator"
      className="roi-root"
      aria-label="ROI Calculator"
    >
      <style>{`
        .roi-root {
          --roi-accent: #6366f1;
          --roi-bg: #0f0f14;
          --roi-card: #16161e;
          --roi-border: rgba(255,255,255,0.08);
          --roi-text: #e2e8f0;
          --roi-muted: #94a3b8;
          font-family: 'Inter', system-ui, sans-serif;
          background: var(--roi-bg);
          color: var(--roi-text);
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          max-width: 960px;
          margin: 0 auto;
        }
        .roi-header { text-align: center; margin-bottom: 2rem; }
        .roi-header h2 {
          font-size: clamp(1.5rem, 4vw, 2.2rem);
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #a78bfa, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }
        .roi-header p { color: var(--roi-muted); font-size: 1rem; }

        .roi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 700px) {
          .roi-grid { grid-template-columns: 1fr; }
        }

        .roi-panel {
          background: var(--roi-card);
          border: 1px solid var(--roi-border);
          border-radius: 1rem;
          padding: 1.5rem;
        }
        .roi-panel h3 {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--roi-accent);
          margin-bottom: 1.25rem;
        }

        .roi-select-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
        .roi-select-group { display: flex; flex-direction: column; gap: 0.25rem; }
        .roi-select-label { font-size: 0.75rem; color: var(--roi-muted); }
        select.roi-select {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--roi-border);
          color: var(--roi-text);
          border-radius: 0.5rem;
          padding: 0.45rem 0.6rem;
          font-size: 0.85rem;
          appearance: none;
          cursor: pointer;
        }
        select.roi-select:focus { outline: 2px solid var(--roi-accent); }

        .roi-toggles { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .roi-toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .roi-toggle-label input[type="checkbox"] { accent-color: var(--roi-accent); width: 1rem; height: 1rem; }

        .roi-field { margin-bottom: 1.2rem; }
        .roi-field-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem; }
        .roi-label { font-size: 0.85rem; color: var(--roi-muted); }
        .roi-value { font-size: 0.9rem; font-weight: 700; color: var(--roi-text); }
        .roi-slider {
          width: 100%;
          accent-color: var(--roi-accent);
          height: 4px;
          cursor: pointer;
        }

        .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
        .metric-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--roi-border);
          border-radius: 0.75rem;
          padding: 0.9rem;
          transition: transform 0.15s;
        }
        .metric-card:hover { transform: translateY(-1px); }
        .metric-card--highlight {
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(16,185,129,0.12));
          border-color: rgba(99,102,241,0.4);
        }
        .metric-label { font-size: 0.72rem; color: var(--roi-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
        .metric-value { font-size: 1.3rem; font-weight: 800; }
        .metric-sub { font-size: 0.72rem; color: var(--roi-muted); margin-top: 0.2rem; }

        .breakdown-row { margin-bottom: 0.9rem; }
        .breakdown-label-row { display: flex; justify-content: space-between; margin-bottom: 0.25rem; }
        .breakdown-label { font-size: 0.8rem; color: var(--roi-muted); }
        .breakdown-amount { font-size: 0.8rem; font-weight: 600; }
        .breakdown-pct { color: var(--roi-muted); font-weight: 400; }
        .breakdown-track { height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
        .breakdown-fill { height: 100%; border-radius: 3px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }

        .roi-cta {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--roi-border);
        }
        .roi-cta-headline { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
        .roi-cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #fff;
          border: none;
          border-radius: 0.6rem;
          padding: 0.75rem 2rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          text-decoration: none;
        }
        .roi-cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .roi-cta-note { font-size: 0.75rem; color: var(--roi-muted); margin-top: 0.5rem; }
      `}</style>

      <div className="roi-header">
        <h2>MENA Security ROI Calculator</h2>
        <p>
          See how much GateFlow saves your property annually — in guards, time,
          paper, and compliance risk.
        </p>
      </div>

      <div className="roi-grid">
        {/* ─── Inputs ─────────────────────────────────────────── */}
        <div className="roi-panel">
          <h3>Property Details</h3>

          <div className="roi-select-row">
            <div className="roi-select-group">
              <span className="roi-select-label">Region</span>
              <select
                className="roi-select"
                value={input.region}
                onChange={(e) => update('region', e.target.value as RegionCode)}
                aria-label="Select region"
              >
                {REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="roi-select-group">
              <span className="roi-select-label">Property Type</span>
              <select
                className="roi-select"
                value={input.propertyType}
                onChange={(e) =>
                  update('propertyType', e.target.value as PropertyType)
                }
                aria-label="Select property type"
              >
                {PROPERTY_TYPES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="roi-toggles">
            <label className="roi-toggle-label">
              <input
                type="checkbox"
                checked={!!input.hasANPR}
                onChange={(e) => update('hasANPR', e.target.checked)}
                aria-label="Include ANPR vehicle recognition"
              />
              ANPR Vehicle Recognition
            </label>
            <label className="roi-toggle-label">
              <input
                type="checkbox"
                checked={!!input.hasWalletPasses}
                onChange={(e) => update('hasWalletPasses', e.target.checked)}
                aria-label="Include Wallet Passes"
              />
              Wallet Passes
            </label>
          </div>

          <SliderField
            label="Gate Count"
            value={input.gateCount}
            min={1}
            max={20}
            step={1}
            onChange={(v) => update('gateCount', v)}
            format={(v) => `${v} gate${v !== 1 ? 's' : ''}`}
          />
          <SliderField
            label="Residential Units"
            value={input.unitCount}
            min={20}
            max={2000}
            step={10}
            onChange={(v) => update('unitCount', v)}
            format={(v) => fmt(v, false)}
          />
          <SliderField
            label="Monthly Visitors"
            value={input.monthlyVisitorVolume}
            min={500}
            max={100000}
            step={500}
            onChange={(v) => update('monthlyVisitorVolume', v)}
            format={(v) => fmt(v, false)}
          />
          <SliderField
            label="Monthly Vehicle Entries"
            value={input.monthlyVehicleCount}
            min={0}
            max={50000}
            step={500}
            onChange={(v) => update('monthlyVehicleCount', v)}
            format={(v) => fmt(v, false)}
          />
          <SliderField
            label="Security Guards"
            value={input.currentGuardCount}
            min={1}
            max={50}
            step={1}
            onChange={(v) => update('currentGuardCount', v)}
            format={(v) => `${v} FTE`}
          />
          <SliderField
            label="Guard Monthly Salary"
            value={
              input.averageGuardSalaryMonthly ??
              REGION_GUARD_SALARIES[input.region] ??
              600
            }
            min={200}
            max={2000}
            step={50}
            onChange={(v) => update('averageGuardSalaryMonthly', v)}
            format={(v) => `$${fmt(v, false)}/mo`}
          />
        </div>

        {/* ─── Results ─────────────────────────────────────────── */}
        <div>
          <div className="roi-panel" style={{ marginBottom: '1rem' }}>
            <h3>Annual ROI Summary</h3>
            <div className="metrics-grid">
              <MetricCard
                label="Total Annual Savings"
                value={fmt(result.totalAnnualSavingsUsd)}
                highlight
              />
              <MetricCard
                label="Net Annual Benefit"
                value={fmt(result.netAnnualBenefitUsd)}
                highlight
              />
              <MetricCard
                label="ROI"
                value={`${result.roiPercent}%`}
                sub="on software investment"
              />
              <MetricCard
                label="Payback Period"
                value={`${result.paybackMonths} mo`}
                sub="to break even"
              />
              <MetricCard
                label="Guard FTEs Reallocated"
                value={`${result.guardsFteSaved} FTE`}
                sub="to perimeter patrol"
              />
              <MetricCard
                label="Labor Hours Saved/Mo"
                value={fmt(result.laborHoursSavedMonthly, false)}
                sub="visitor processing time"
              />
              <MetricCard
                label="Queue Time Reduction"
                value={`${result.queueTimeReductionPercent}%`}
                sub="vs. manual check-in"
              />
              <MetricCard
                label="CO₂ Saved"
                value={`${fmt(result.co2KgSavedAnnual, false)} kg`}
                sub="annually (paper printing)"
              />
            </div>
          </div>

          <div className="roi-panel">
            <h3>Savings Breakdown</h3>
            {breakdownEntries.map((entry, i) => (
              <BreakdownBar
                key={entry.label}
                label={entry.label}
                value={entry.value}
                total={result.totalAnnualSavingsUsd}
                color={BAR_COLORS[i % BAR_COLORS.length]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="roi-cta">
        <p className="roi-cta-headline">
          Save {fmt(result.totalAnnualSavingsUsd)} annually — start your free
          14-day trial
        </p>
        <a
          href="/sandbox"
          className="roi-cta-btn"
          id="roi-calculator-cta"
          aria-label="Start free 14-day sandbox trial"
        >
          Start Free Sandbox Trial →
        </a>
        <p className="roi-cta-note">
          No credit card required · 14-day demo org · Cancel anytime
        </p>
      </div>
    </section>
  );
}
