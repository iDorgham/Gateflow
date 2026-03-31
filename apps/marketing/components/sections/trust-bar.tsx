'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';

export function TrustBar({ locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');
  const partners = [
    { name: 'Palm Hills', logo: '🌴' },
    { name: 'Sodic', logo: '🏢' },
    { name: 'Emaar', logo: '🏗️' },
    { name: 'British School', logo: '🎓' },
    { name: 'Mountain View', logo: '⛰️' },
  ];

  return (
    <section className="border-y border-ds-border bg-ds-surface-sunken py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-ds-surface-sunken via-transparent to-ds-surface-sunken z-10 pointer-events-none" />
      
      <div className="container mx-auto px-8 relative z-0">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-[12px] font-black uppercase tracking-[0.4em] text-ds-text-subtlest"
        >
          {t('trust.badge')}
        </motion.p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-32">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-5 group cursor-default grayscale hover:grayscale-0 transition-all duration-500"
            >
              <span className="text-4xl group-hover:drop-shadow-[0_0_15px_rgba(var(--ds-background-brand-bold),0.3)] transition-all">
                {p.logo}
              </span>
              <span className="text-[22px] font-black tracking-tight uppercase text-ds-text-heading">
                {p.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
