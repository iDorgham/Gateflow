'use client';

import * as React from 'react';
import { cn } from '@gateflow/ui/utils';
import { Activity, MonitorCog, ShieldCheck, RotateCcw } from 'lucide-react';
import { motion, type Transition } from 'framer-motion';
import {
  resolveMotionForAccessibility,
  systemPrefersReducedMotion,
  type MotionConfig,
  type ReducedMotion,
} from '../../lib/motion-physics';

type Source = 'auto' | 'simulator';
type SimMode = 'reduced' | 'full';

function buildSpring(
  stiffness: number,
  damping: number,
  mass: number
): MotionConfig {
  return {
    initial: { opacity: 0, x: -48, filter: 'blur(12px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    transition: { type: 'spring', stiffness, damping, mass },
    animatableOpacity: 0,
    targetOpacity: 1,
  };
}

function springLabel(config: MotionConfig): string {
  if (config.transition.type === 'spring') {
    const t = config.transition;
    return `spring · k=${t.stiffness} · d=${t.damping} · m=${t.mass}`;
  }
  return `tween · ${config.transition.duration}s`;
}

export function MotionPhysicsInspector() {
  const [source, setSource] = React.useState<Source>('auto');
  const [simMode, setSimMode] = React.useState<SimMode>('full');
  const [systemReduced, setSystemReduced] = React.useState(false);
  const [stiffness, setStiffness] = React.useState(500);
  const [damping, setDamping] = React.useState(20);
  const [mass, setMass] = React.useState(1);
  const [runKey, setRunKey] = React.useState(0);

  React.useEffect(() => {
    const update = () => setSystemReduced(systemPrefersReducedMotion());
    update();
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
    ) {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      mql.addEventListener?.('change', update);
      return () => mql.removeEventListener?.('change', update);
    }
  }, []);

  const reduced: ReducedMotion = React.useMemo<ReducedMotion>(() => {
    if (source === 'simulator') {
      return { enabled: simMode === 'reduced', source: 'simulator' };
    }
    return { enabled: systemReduced, source: 'media' };
  }, [source, simMode, systemReduced]);

  const spec = React.useMemo(
    () => buildSpring(stiffness, damping, mass),
    [stiffness, damping, mass]
  );
  const config = resolveMotionForAccessibility(spec, reduced);
  const reducedActive = reduced.enabled;

  const restart = () => setRunKey((c) => c + 1);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-xl">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)]">
            <Activity size={20} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-heading)]">
              Motion Physics Inspector
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)] font-medium">
              Tune spring/tween physics and verify the reduced-motion contract
            </p>
          </div>
        </div>
      </div>

      {/* Reduced-motion controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-2 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] p-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
            Source
          </span>
          <div className="flex gap-1">
            {(['auto', 'simulator'] as Source[]).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={cn(
                  'flex-1 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all',
                  source === s
                    ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                    : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)]'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] p-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
            prefers-reduced-motion
          </span>
          <div
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2',
              reducedActive
                ? 'bg-[var(--ds-background-danger-subtle)] text-[var(--ds-text-danger)]'
                : 'bg-[var(--ds-background-success-subtle)] text-[var(--ds-text-success)]'
            )}
          >
            <ShieldCheck size={14} />
            {reducedActive ? 'Reduced' : 'Full'}
            {source === 'auto' && (
              <span className="normal-case font-medium opacity-70">
                {systemReduced ? '(system: reduce)' : '(system: no-preference)'}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] p-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
            Simulator
          </span>
          <div className="flex gap-1">
            {(['full', 'reduced'] as SimMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSimMode(m)}
                disabled={source !== 'simulator'}
                className={cn(
                  'flex-1 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all',
                  source !== 'simulator' && 'opacity-40 cursor-not-allowed',
                  source === 'simulator' && simMode === m
                    ? m === 'reduced'
                      ? 'bg-[var(--ds-background-danger-subtle)] text-[var(--ds-text-danger)]'
                      : 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                    : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)]'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Physics sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SliderRow
          label="Stiffness"
          hint="higher = snappier return"
          value={stiffness}
          min={100}
          max={1200}
          step={10}
          disabled={reducedActive}
          onChange={setStiffness}
          format={(v) => `${v}`}
        />
        <SliderRow
          label="Damping"
          hint="higher = less bounce"
          value={damping}
          min={5}
          max={60}
          step={1}
          disabled={reducedActive}
          onChange={setDamping}
          format={(v) => `${v}`}
        />
        <SliderRow
          label="Mass"
          hint="higher = slower buildup"
          value={mass}
          min={0.5}
          max={3}
          step={0.1}
          disabled={reducedActive}
          onChange={setMass}
          format={(v) => v.toFixed(1)}
        />
      </div>

      {/* Live specimen */}
      <div className="flex flex-col gap-2 rounded-2xl border border-[var(--ds-border-subtle)] bg-[var(--ds-surface-raised)] px-4 py-5 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(var(--ds-text-primary)_1.5px,transparent_1.5px)] bg-[length:16px_16px]" />
        <motion.div
          key={`${runKey}-${reducedActive}`}
          initial={config.initial}
          animate={config.animate}
          transition={config.transition as Transition}
          className="h-10 w-10 rounded-lg bg-[var(--ds-accent-bold)] shadow-[var(--ds-glow-accent)] relative z-10 flex items-center justify-center text-white"
        >
          <span className="text-xs font-black">Aa</span>
        </motion.div>
        <span className="absolute bottom-2 end-3 z-10 text-[9px] font-mono text-[var(--ds-text-subtlest)]">
          {reducedActive
            ? `fade · ${config.transition.type} ${config.transition.type === 'tween' ? config.transition.duration : ''}s · linear`
            : springLabel(config)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-[11px] text-[var(--ds-text-subtle)] font-medium max-w-md">
          <MonitorCog size={14} className="shrink-0" />
          {reducedActive
            ? 'Reduced motion is active — travelled/blur physics is neutralised to a fast opacity fade, per the WCAG 2.3.3 contract.'
            : 'Full motion active. Toggle the simulator or use Auto to reflect the real OS preference.'}
        </div>
        <button
          onClick={restart}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--ds-accent-bold)] px-5 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all"
        >
          <RotateCcw size={13} /> Run
        </button>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  hint,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
  format,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] p-3">
      <label htmlFor={id} className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-[var(--ds-text)]">
          {label}
        </span>
        <span className="text-[9px] font-mono text-[var(--ds-text-subtle)]">
          {format(value)}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full accent-[var(--ds-accent-bold)]',
          disabled && 'opacity-40'
        )}
      />
      <span className="text-[9px] font-medium text-[var(--ds-text-subtlest)]">
        {hint}
      </span>
    </div>
  );
}
