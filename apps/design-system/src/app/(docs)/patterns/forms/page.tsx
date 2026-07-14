'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import {
  ClipboardCheck,
  ShieldAlert,
  Zap,
  Info,
  ChevronRight,
  CheckCircle2,
  LayoutPanelLeft,
} from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import { Button, Input, Label } from '@gateflow/ui';
import { motion, AnimatePresence } from 'framer-motion';

const formPrinciples = [
  {
    title: 'Glow-Focus Protocol',
    description:
      'Input focus should NOT just use a border. We use a 2px offset ring combined with a subtle outer glow bound to the primary accent.',
    icon: Zap,
  },
  {
    title: 'Institutional Gold',
    description:
      'Validation warnings use --gf-color-warning (Institutional Gold). It projects seriousness without the panic of standard red.',
    icon: ShieldAlert,
  },
  {
    title: 'Cine-Stagger Steps',
    description:
      'Multi-step forms use horizontal motion transitions (easeInOut) to provide context and reduce cognitive load during long flows.',
    icon: LayoutPanelLeft,
  },
];

export default function FormsPatternsPage() {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto py-10 px-6">
      <PageHeader
        title="Forms & Validation"
        subtitle="GateFlow forms are designed for high-stakes enterprise data entry, emphasizing clarity, institutional validation, and cinematic transitions."
        breadcrumbs={[
          { label: 'Patterns', href: '/patterns' },
          { label: 'Forms' },
        ]}
      />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formPrinciples.map((p) => (
          <div
            key={p.title}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-lg transition-transform group-hover:rotate-6">
              <p.icon size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)]">
              {p.title}
            </h3>
            <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
              {p.description}
            </p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
            Multi-Step Pattern Lab
          </h2>
          <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-60">
            Interactive demonstration of tiered form transitions and validation
            states.
          </p>
        </div>
        <FormStepLab />
      </div>

      <section className="p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-surface-subtle)] relative overflow-hidden group">
        <div className="absolute top-2 right-2 p-2 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700">
          <ClipboardCheck
            size={120}
            className="text-[var(--gf-color-warning)]"
          />
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="p-2 w-fit rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-md">
            <Info size={18} />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Focus & Glow Implementation
            </h4>
            <p className="text-sm text-[var(--ds-text-subtle)] leading-relaxed max-w-2xl font-medium">
              In the GateFlow system, an input focus state is a multi-layered
              event. We combine <strong>--ds-border-focused</strong> for the rim
              and <strong>--ds-glow-accent</strong> for the outer bloom. This
              creates a high-fidelity interaction that feels responsive and
              premium.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FormStepLab() {
  const [step, setStep] = React.useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl border border-[var(--ds-border-bold)] bg-[var(--ds-background-default)] shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
      {/* Progress Multi-step */}
      <div className="flex justify-between items-center mb-10 px-4">
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-2 relative">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500',
                  step >= i
                    ? 'bg-[var(--ds-background-brand-bold)] border-[var(--ds-background-brand-bold)] text-white shadow-lg'
                    : 'bg-transparent border-[var(--ds-border-subtle)] text-[var(--ds-text-subtlest)]'
                )}
              >
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              <span
                className={cn(
                  'absolute -bottom-6 text-[9px] font-black uppercase tracking-widest whitespace-nowrap',
                  step >= i
                    ? 'text-[var(--ds-text-primary)]'
                    : 'text-[var(--ds-text-subtlest)]'
                )}
              >
                {i === 1 ? 'General' : i === 2 ? 'Credentials' : 'Finish'}
              </span>
            </div>
            {i < 3 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4 rounded-full transition-all duration-700',
                  step > i
                    ? 'bg-[var(--ds-background-brand-bold)]'
                    : 'bg-[var(--ds-border-subtle)]'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 mt-6 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                    First Name
                  </Label>
                  <Input
                    placeholder="Enter given name..."
                    className="bg-[var(--ds-surface-subtle)] border-[var(--ds-border-subtle)] focus-visible:ring-[var(--ds-primary-accent)] h-11"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                    Last Name
                  </Label>
                  <Input
                    placeholder="Enter family name..."
                    className="bg-[var(--ds-surface-subtle)] border-[var(--ds-border-subtle)] h-11"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                  Institutional Email
                </Label>
                <div className="relative">
                  <Input
                    defaultValue="user@gateflow.corp"
                    className="bg-[var(--ds-surface-subtle)] border-[var(--gf-color-warning)] border-2 h-11 pr-24"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[var(--gf-color-warning)] font-black uppercase text-[9px] tracking-tighter">
                    <ShieldAlert size={12} /> External Domain
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                  Workspace Access Role
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Administrator', 'Scanner Lead'].map((role) => (
                    <div
                      key={role}
                      className="p-4 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-surface-subtle)] hover:bg-[var(--ds-background-selected)] hover:text-[var(--ds-text-selected)] cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <span className="text-[11px] font-black uppercase tracking-tight">
                        {role}
                      </span>
                      <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center opacity-40 group-hover:opacity-100">
                        <div className="h-2 w-2 rounded-full bg-current opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center gap-4 py-8"
            >
              <div className="h-16 w-16 rounded-full bg-[var(--gf-color-success)] text-white flex items-center justify-center shadow-xl shadow-[var(--gf-color-success)]/20 animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
                  Protocol Established
                </h3>
                <p className="text-xs text-[var(--ds-text-subtle)] font-medium">
                  New tenant profile has been successfully generated.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-8 border-t border-[var(--ds-border-subtle)] flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1}
          className="text-xs font-black uppercase tracking-widest text-[var(--ds-text-subtlest)]"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={step === 3}
          className="bg-[var(--ds-background-brand-bold)] text-white rounded-xl px-8 h-12 shadow-lg shadow-[var(--ds-background-brand-bold)]/20 font-black uppercase tracking-widest text-[10px] gap-2 group"
        >
          {step === 3 ? 'Completed' : 'Continue'}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </div>
    </div>
  );
}
