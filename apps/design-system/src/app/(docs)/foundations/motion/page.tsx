'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { Activity, Zap, Play, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@gateflow/ui';
import { motion, AnimatePresence, type Easing } from 'framer-motion';

function curveToEasing(curve: string): Easing {
  const nums = curve
    .split('(')[1]
    ?.split(')')[0]
    ?.split(',')
    .map((n) => Number(n.trim()));
  if (nums?.length === 4 && nums.every((n) => Number.isFinite(n))) {
    return nums as [number, number, number, number];
  }
  return 'linear';
}

const motionPrinciples = [
  {
    title: 'Cine-Serious Intention',
    description:
      'We avoid "bouncy" or playful motion. All transitions use a high-tension cubic-bezier curve that feels intentional, architectural, and reliable.',
    icon: Activity,
  },
  {
    title: 'Staggered Entrances',
    description:
      'High-density UI components never appear all at once. We stagger their entrance by 50ms to express "building" the information layer.',
    icon: Sparkles,
  },
  {
    title: 'Institutional Speed',
    description:
      'Fast (150ms) for UI feedback (hover/click); Base (300ms) for page transitions; Slow (500ms) for complex layouts.',
    icon: Zap,
  },
];

const easings = [
  {
    name: 'Entrance / Standard',
    curve: 'cubic-bezier(0.22, 1, 0.36, 1)',
    description: 'Fast start, decel into place.',
  },
  {
    name: 'Expressive / Smooth',
    curve: 'cubic-bezier(0.4, 0, 0.2, 1)',
    description: 'Architectural, calm transition.',
  },
  {
    name: 'Linear (Usage Restricted)',
    curve: 'linear',
    description: 'Strictly for data progress/opacity.',
  },
];

export default function MotionFoundationsPage() {
  const [isPlaying, setIsPlaying] = React.useState(0);
  const restart = () => setIsPlaying((c) => c + 1);

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto py-10 px-6 overflow-hidden">
      <PageHeader
        title="Motion & Easing"
        subtitle="GateFlow isn't static. It's an intentional interface that uses motion to express weight, focus, and institutional speed."
        breadcrumbs={[
          { label: 'Foundations', href: '/foundations' },
          { label: 'Motion' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {motionPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)]"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-lg">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)] leading-none">
              {p.title}
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      {/* Easing Playground */}
      <section className="flex flex-col gap-8 mt-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              The Easing Lab
            </h2>
            <p className="text-xs font-bold text-[var(--ds-text-subtle)] max-w-2xl opacity-60 uppercase tracking-widest leading-relaxed">
              Test the tension of our institutional curves.
            </p>
          </div>
          <Button
            onClick={restart}
            className="bg-[var(--ds-accent-bold)] text-white rounded-xl h-9 px-6 font-bold flex gap-2 active:scale-95 transition-all"
          >
            <RotateCcw size={14} /> Run Test
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {easings.map((ease) => (
            <div
              key={ease.name}
              className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] transition-all hover:bg-[var(--ds-background-default)] group/ease"
            >
              <div className="flex flex-col gap-1 w-56 shrink-0">
                <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-accent-bold)] opacity-60 leading-none">
                  Institutional Curve
                </span>
                <h4 className="text-sm font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
                  {ease.name}
                </h4>
                <code className="text-[10px] font-mono font-bold text-[var(--ds-text-subtlest)] opacity-40 leading-none mt-1 group-hover/ease:opacity-100 transition-opacity truncate">
                  {ease.curve}
                </code>
              </div>
              <div className="flex-1 min-h-[40px] flex items-center bg-[var(--ds-surface-raised)] rounded-2xl border border-[var(--ds-border-subtle)] px-4 overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(var(--ds-text-primary)_1.5px,transparent_1.5px)] bg-[length:16px_16px]" />
                <motion.div
                  key={isPlaying}
                  initial={{ x: 0 }}
                  animate={{ x: 'calc(100% - 32px)' }}
                  transition={{
                    duration: 0.8,
                    ease: curveToEasing(ease.curve),
                  }}
                  className="h-8 w-8 rounded-lg bg-[var(--ds-accent-bold)] shadow-[var(--ds-glow-accent)] relative z-10"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cine-Entrance / Stagger Demo */}
      <section className="flex flex-col gap-6 p-10 rounded-3xl border border-[var(--ds-border-bold)] bg-[oklch(8%_0.015_250)] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ds-accent-subtle)] to-transparent opacity-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 mb-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-black uppercase tracking-tight text-white leading-none">
              Cine-Stagger Logic
            </h3>
            <p className="text-xs text-white/60 max-w-lg leading-relaxed font-medium">
              This is how we build complex operational views. Each item enters
              with a <code className="text-[var(--ds-accent-bold)]">+50ms</code>{' '}
              delay from its predecessor.
            </p>
          </div>
          <Button
            onClick={restart}
            variant="outline"
            className="border-white/20 text-white rounded-xl h-8 px-4 font-bold text-xs hover:bg-white/5 transition-all"
          >
            Re-mount Specimen
          </Button>
        </div>

        <div className="flex flex-col gap-3 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={isPlaying} className="flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-12 w-full rounded-xl bg-white/5 border border-white/10 flex items-center px-6"
                >
                  <div className="h-2 w-2 rounded-full bg-[var(--ds-accent-bold)] me-4" />
                  <div className="h-3 w-32 rounded bg-white/10" />
                  <div className="h-3 w-16 rounded bg-white/5 ms-auto" />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="p-8 rounded-3xl border border-[var(--ds-accent-bold)]/20 bg-gradient-to-br from-[var(--ds-background-neutral-subtle)] to-transparent relative group mt-12 shadow-md">
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-accent-bold)] text-white shadow-md">
            <Play size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Reduced Motion Protocol
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              We strictly honor{' '}
              <code className="text-[var(--ds-text-accent)]">
                prefers-reduced-motion
              </code>
              . When active, all staggered entrances and transforms are replaced
              with simple, institutional 150ms opacity fades. Security
              interfaces must remain accessible to all vestibular sensitivities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
