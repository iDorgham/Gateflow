'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@gate-access/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';
import { ShieldCheck, ArrowRight, ArrowLeft, Lock, Zap } from 'lucide-react';

/* Brand color — centralized so it's easy to update */
const BRAND_RGB = '237, 75, 0';

function GridBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-ds-surface-sunken" />

      {/* Brand glow using opacity of the brand background token */}
      <div
        className="absolute inset-0 bg-ds-background-brand-bold opacity-[0.05]"
        style={{
          maskImage:
            'radial-gradient(ellipse 90% 60% at 50% 120%, black, transparent)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 60% at 50% 120%, black, transparent)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--ds-border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="absolute top-0 inset-x-0 h-px bg-ds-border" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-ds-border" />

      {/* Ambient glow orbs using standard brand subtle tokens */}
      <motion.div
        className="absolute -left-24 top-1/3 w-96 h-96 rounded-full blur-[130px] pointer-events-none bg-ds-background-brand-bold opacity-10"
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 bottom-1/3 w-80 h-80 rounded-full blur-[110px] pointer-events-none bg-ds-background-brand-bold opacity-10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </>
  );
}

export function BottomCTA({ locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');
  const { t: tc } = useTranslation('common');
  const isRtl = locale.startsWith('ar');

  const trustPills = [
    { icon: Lock, label: 'Bank-grade security' },
    { icon: Zap, label: 'Live in 48 hours' },
    { icon: ShieldCheck, label: 'No card required' },
  ];

  return (
    <section
      id="cta"
      className="relative overflow-hidden py-32 md:py-64"
      aria-labelledby="cta-heading"
    >
      <GridBackdrop />

      <div className="container px-8 mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          {/* ── Badge ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-ds-surface-raised rounded-full border border-ds-border text-ds-text-subtle text-[11px] font-black uppercase tracking-[0.35em] shadow-sm">
              <motion.div
                className="w-2 h-2 rounded-full bg-ds-background-brand-bold"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              Ready for Enterprise Deployment
            </div>
          </motion.div>

          {/* ── Headline ── */}
          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.15,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-10 text-4xl lg:text-5xl font-black tracking-tighter leading-[0.9] text-ds-text-heading max-w-4xl mx-auto"
          >
            {t('cta.headline')}
          </motion.h2>

          {/* ── Sub-headline ── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mb-16 text-xl md:text-2xl text-ds-text-subtle max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {t('cta.subHeadline')}
          </motion.p>

          {/* ── CTA button ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col items-center gap-10"
          >
            <IntentLink
              locale={locale}
              href="/contact"
              intent="consult"
              surface="home_bottom_cta"
              className="w-full sm:w-auto"
            >
              <Button
                variant="brand"
                size="lg"
                className="h-20 px-16 text-xl font-black uppercase tracking-[0.2em] hover:-translate-y-1 transition-all duration-300 group shadow-lg hover:shadow-xl"
              >
                {tc('buttons.getStarted')}
                {isRtl ? (
                  <ArrowLeft className="ms-3 h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="ms-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </IntentLink>

            {/* ── Trust pills ── */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {trustPills.map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-ds-text-subtlest"
                >
                  <Icon
                    size={13}
                    className="text-ds-text-subtlest opacity-70"
                  />
                  <span>{label}</span>
                  {i < trustPills.length - 1 && (
                    <div className="w-1 h-1 rounded-full bg-ds-border-bold ms-4" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
