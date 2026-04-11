'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { QrCode, ScanLine, FileCheck } from 'lucide-react';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';

export function HowItWorksSection({ locale: _locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');

  const steps = [
    {
      icon: <QrCode size={40} strokeWidth={1} />,
      title: t('howItWorks.step1.title'),
      desc: t('howItWorks.step1.desc'),
    },
    {
      icon: <ScanLine size={40} strokeWidth={1} />,
      title: t('howItWorks.step2.title'),
      desc: t('howItWorks.step2.desc'),
    },
    {
      icon: <FileCheck size={40} strokeWidth={1} />,
      title: t('howItWorks.step3.title'),
      desc: t('howItWorks.step3.desc'),
    },
  ];

  return (
    <section className="py-32 md:py-64 bg-ds-surface-sunken border-y border-ds-border relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24 lg:mb-40">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] font-black uppercase tracking-[0.4em] text-ds-text-brand mb-8"
          >
            {t('howItWorks.badge')}
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black tracking-tight text-ds-text-heading leading-[1.05]"
          >
            {t('howItWorks.title')}
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group flex flex-col items-center"
            >
              {/* Connector line (Desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 start-[calc(50%+60px)] end-[calc(-50%+60px)] h-[2px] bg-ds-border-brand/20 lg:start-[calc(50%+80px)] lg:end-[calc(-50%+80px)]">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="w-full h-full bg-ds-background-brand-bold origin-left rtl:origin-right"
                  />
                </div>
              )}

              <div className="text-center relative">
                <div className="relative mb-12">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-[32px] bg-ds-background-brand-bold text-white mb-0 shadow-2xl shadow-ds-background-brand-bold/30 ring-4 ring-ds-background-brand-subtle group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                  <div className="absolute -top-4 -end-4 w-12 h-12 rounded-2xl bg-ds-text-heading text-ds-surface-sunken font-black text-xl flex items-center justify-center border-4 border-ds-surface-sunken shadow-lg group-hover:bg-ds-background-brand-bold group-hover:text-white transition-all duration-500">
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-6 text-ds-text-heading tracking-tight">
                  {step.title}
                </h3>
                <p className="text-ds-text-subtle text-lg leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
