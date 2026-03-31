'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';
import { Star } from 'lucide-react';

export function TestimonialsSection({ locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');

  const testimonials = [
    {
      quote: t('testimonials.palmHills.quote'),
      author: t('testimonials.palmHills.author'),
      role: t('testimonials.palmHills.role'),
      company: 'Palm Hills Developments',
    },
    {
      quote: t('testimonials.eventManager.quote'),
      author: t('testimonials.eventManager.author'),
      role: t('testimonials.eventManager.role'),
      company: 'MENA Events Co.',
    },
    {
      quote: t('testimonials.security.quote'),
      author: t('testimonials.security.author'),
      role: t('testimonials.security.role'),
      company: 'SecureGuard Solutions',
    },
  ];

  return (
    <section className="py-32 md:py-64 bg-ds-surface relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 start-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ds-border-success/30 to-transparent opacity-50" />
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24 lg:mb-40">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[13px] font-black uppercase tracking-[0.4em] text-ds-text-success mb-8"
          >
            {t('testimonials.badge')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black tracking-tight text-ds-text-heading leading-[1.05]"
          >
            {t('testimonials.title')}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-ds-surface-raised p-16 rounded-[40px] border border-ds-border hover:border-ds-border-bold shadow-[0_32px_64px_rgba(0,0,0,0.06)] hover:shadow-[0_48px_96px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3 text-start flex flex-col relative group"
            >
              <div className="absolute top-10 start-10 text-ds-text-brand/10 text-8xl font-serif pointer-events-none group-hover:text-ds-text-brand/20 transition-colors">
                &ldquo;
              </div>

              <div className="flex gap-2 mb-12 relative z-10">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={20}
                    className="text-ds-background-warning-bold"
                    fill="currentColor"
                  />
                ))}
              </div>

              <blockquote className="text-[22px] font-black mb-12 text-ds-text-heading leading-[1.5] tracking-tight relative z-10 grow">
                {testimonial.quote}
              </blockquote>

              <div className="pt-10 border-t border-ds-border relative z-10">
                <div className="font-black text-[20px] text-ds-text-heading mb-1">{testimonial.author}</div>
                <div className="text-[12px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest mb-4">
                  {testimonial.role}
                </div>
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-ds-background-brand-subtle rounded-lg text-ds-text-brand text-[13px] font-black">
                  <div className="w-1.5 h-1.5 rounded-full bg-ds-background-brand-bold" />
                  {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
