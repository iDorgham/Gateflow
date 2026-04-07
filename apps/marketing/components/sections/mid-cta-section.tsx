'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@gateflow/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import { Zap } from 'lucide-react';

export function MidCtaSection({
  locale,
  headline,
  subHeadline,
  ctaLabel,
}: {
  locale: Locale;
  headline: string;
  subHeadline: string;
  ctaLabel: string;
}) {
  return (
    <section className="relative overflow-hidden py-32 md:py-64 bg-ds-surface-sunken">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[40px] border border-ds-border-bold bg-ds-surface-overlay p-12 lg:p-32"
          style={{ boxShadow: 'var(--ds-shadow-deep)' }}
        >
          <div className="absolute top-0 end-0 -z-10 w-[600px] h-[600px] bg-ds-background-brand-bold/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-10 text-4xl lg:text-5xl font-black leading-[0.9] tracking-tighter text-white"
              >
                {headline}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12 max-w-lg text-2xl lg:text-3xl text-white/60 font-medium leading-relaxed tracking-tight"
              >
                {subHeadline}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <IntentLink
                  locale={locale}
                  href="/contact"
                  intent="demo"
                  surface="home_mid_cta"
                >
                  <Button
                    variant="brand"
                    size="lg"
                    className="h-20 px-16 text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-ds-background-brand-bold/40 hover:-translate-y-1 transition-all"
                  >
                    {ctaLabel}
                  </Button>
                </IntentLink>
              </motion.div>
            </div>

            <div className="relative lg:block hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                className="rounded-[32px] border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-xl"
              >
                <div className="mb-8 p-4 bg-ds-background-brand-bold rounded-2xl w-fit text-white shadow-xl">
                  <Zap className="w-10 h-10" fill="currentColor" />
                </div>
                <h3 className="mb-8 text-3xl font-black text-white tracking-tight">
                  Upgrade your perimeter intelligence today.
                </h3>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10 mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '92%' }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-ds-background-brand-bold"
                    style={{ boxShadow: 'var(--ds-glow-accent)' }}
                  />
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-[0.3em] text-white/40">
                  <span>Performance Efficiency</span>
                  <span className="text-ds-text-brand">92% Optimized</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
