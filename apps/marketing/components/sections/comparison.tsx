'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ShieldCheck } from 'lucide-react';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';

export function ComparisonSection({ _locale }: { _locale: Locale }) {
  const { t } = useTranslation('landing');

  const features = [
    {
      name: t('comparison.features.offline'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.analytics'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.qrCodes'),
      gateflow: true,
      whatsapp: true,
      paper: false,
    },
    {
      name: t('comparison.features.auditLog'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.residentPortal'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.pushNotifications'),
      gateflow: true,
      whatsapp: true,
      paper: false,
    },
    {
      name: t('comparison.features.multiGate'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
    {
      name: t('comparison.features.apiAccess'),
      gateflow: true,
      whatsapp: false,
      paper: false,
    },
  ];

  return (
    <section className="py-32 lg:py-48 bg-ds-surface relative overflow-hidden">
      <div className="container px-8 mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24 lg:mb-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] font-black uppercase tracking-[0.4em] text-ds-text-brand mb-8"
          >
            {t('comparison.badge')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black tracking-tight text-ds-text-heading leading-tight"
          >
            {t('comparison.title')}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden border border-ds-border-bold rounded-[32px] bg-ds-surface-raised"
          style={{ boxShadow: 'var(--ds-shadow-deep)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-ds-surface-sunken/50 border-b border-ds-border-bold">
                  <th className="text-left rtl:text-right py-12 px-12 font-black text-[14px] text-ds-text-subtlest uppercase tracking-[0.3em]">
                    {t('comparison.features_col')}
                  </th>
                  <th className="py-12 px-8 text-center bg-ds-background-brand-subtle/30">
                    <div
                      className="inline-flex items-center gap-3 px-6 py-2.5 bg-ds-background-brand-bold text-white text-[13px] font-black rounded-xl uppercase tracking-[0.2em]"
                      style={{ boxShadow: 'var(--ds-glow-accent)' }}
                    >
                      <ShieldCheck size={16} />
                      GateFlow
                    </div>
                  </th>
                  <th className="py-12 px-8 text-center text-[15px] font-black text-ds-text-subtle uppercase tracking-widest leading-none">
                    WhatsApp/SMS
                  </th>
                  <th className="py-12 px-8 text-center text-[15px] font-black text-ds-text-subtle uppercase tracking-widest leading-none">
                    Manual/Paper
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ds-border">
                {features.map((feature, i) => (
                  <tr
                    key={i}
                    className="group transition-colors hover:bg-ds-surface-sunken/40"
                  >
                    <td className="py-8 px-12 font-black text-[18px] text-ds-text-heading tracking-tight">
                      {feature.name}
                    </td>
                    <td className="py-8 px-8 text-center bg-ds-background-brand-subtle/10 border-x border-ds-border-brand/10">
                      <div className="flex justify-center">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="w-10 h-10 rounded-2xl bg-ds-background-brand-bold text-white flex items-center justify-center"
                          style={{ boxShadow: 'var(--ds-glow-accent)' }}
                        >
                          <Check size={22} strokeWidth={3} />
                        </motion.div>
                      </div>
                    </td>
                    <td className="py-8 px-8 text-center">
                      <div className="flex justify-center">
                        {feature.whatsapp ? (
                          <div className="w-10 h-10 rounded-2xl bg-ds-background-success-subtle text-ds-text-success flex items-center justify-center border border-ds-border-success">
                            <Check size={22} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-ds-background-danger-subtle text-ds-text-danger flex items-center justify-center border border-ds-border-danger">
                            <X size={22} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-8 px-8 text-center">
                      <div className="flex justify-center">
                        {feature.paper ? (
                          <div className="w-10 h-10 rounded-2xl bg-ds-background-success-subtle text-ds-text-success flex items-center justify-center border border-ds-border-success">
                            <Check size={22} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-ds-background-danger-subtle text-ds-text-danger flex items-center justify-center border border-ds-border-danger">
                            <X size={22} />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
