'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  FileText,
  UserCheck,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';

export function SecurityGrid({ _locale }: { _locale: Locale }) {
  const { t } = useTranslation('landing');

  const securityItems = [
    {
      icon: Shield,
      title: t('securityGrid.items.hmac.title'),
      desc: t('securityGrid.items.hmac.description'),
    },
    {
      icon: UserCheck,
      title: t('securityGrid.items.rbac.title'),
      desc: t('securityGrid.items.rbac.description'),
    },
    {
      icon: Lock,
      title: t('securityGrid.items.aes.title'),
      desc: t('securityGrid.items.aes.description'),
    },
    {
      icon: FileText,
      title: t('securityGrid.items.audit.title'),
      desc: t('securityGrid.items.audit.description'),
    },
    {
      icon: RefreshCw,
      title: t('securityGrid.items.jwt.title'),
      desc: t('securityGrid.items.jwt.description'),
    },
    {
      icon: BarChart3,
      title: t('securityGrid.items.monitoring.title'),
      desc: t('securityGrid.items.monitoring.description'),
    },
  ];

  return (
    <section
      id="security"
      className="py-32 md:py-64 bg-ds-surface-sunken border-y border-ds-border relative overflow-hidden"
    >
      <div className="container px-8 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24 lg:mb-40">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] font-black uppercase tracking-[0.4em] text-ds-text-brand mb-8"
          >
            {t('securityGrid.subtitle')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black tracking-tight mb-12 text-ds-text-heading leading-[1.05]"
          >
            {t('securityGrid.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-ds-text-subtle leading-relaxed max-w-3xl mx-auto font-medium"
          >
            {t('securityGrid.description')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {securityItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                boxShadow: 'var(--ds-shadow-overlay)',
                y: -12,
              }}
              className="group p-12 rounded-[32px] border border-ds-border bg-ds-surface-raised hover:border-ds-border-bold transition-all duration-500"
            >
              <div className="h-20 w-20 bg-ds-background-brand-subtle rounded-2xl flex items-center justify-center text-ds-text-brand mb-10 group-hover:scale-110 transition-transform shadow-inner ring-1 ring-ds-border-brand/10">
                <item.icon size={36} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-black mb-6 text-ds-text-heading tracking-tight">
                {item.title}
              </h3>
              <p className="text-ds-text-subtle text-[17px] leading-[1.6] font-medium group-hover:text-ds-text-heading transition-colors">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic light rays */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ds-background-brand-subtle blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ds-background-success-subtle blur-[150px] rounded-full" />
      </div>
    </section>
  );
}
