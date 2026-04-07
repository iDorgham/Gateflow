'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { Locale } from '../../i18n-config';
import { useTranslation } from '../../hooks/use-translation';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'GateFlow reduced our gate wait times by 60% and gave residents complete visibility over who visits their homes.',
    author: 'Ahmed Hassan',
    role: 'Head of Operations',
    company: 'Palm Hills Developments',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
  },
  {
    quote:
      'We process 50,000+ visitor scans during our annual exhibitions. GateFlow handles it flawlessly.',
    author: 'Sarah Al-Masri',
    role: 'Event Director',
    company: 'MENA Events Co.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
  },
  {
    quote:
      'Finally, a system that gives us real-time audit trails. Security has never been this transparent.',
    author: 'Mohamed Khaled',
    role: 'Security Manager',
    company: 'SecureGuard Solutions',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop',
  },
  {
    quote:
      'The offline capability was the game-changer for our remote compound location. Flawless sync.',
    author: 'Lalia Mansour',
    role: 'Compound Admin',
    company: 'Red Sea Residences',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop',
  },
  {
    quote:
      'Onboarding was surprisingly fast. Our guards learned to use the scanner app in less than 30 minutes.',
    author: 'Ibrahim Aziz',
    role: 'Facility Manager',
    company: 'Central Hub Office Park',
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&auto=format&fit=crop',
  },
  {
    quote:
      'Cryptographic QR codes stopped pass sharing instantly. Our security metrics improved by 40% in week one.',
    author: 'Fatima Noor',
    role: 'Security Consultant',
    company: 'Shield Group',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop',
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div
      className="flex-shrink-0 w-[450px] mx-space-200 bg-ds-surface-overlay p-space-400 rounded-[24px] border border-ds-border-bold hover:border-ds-border-brand transition-all duration-300 group"
      style={{ boxShadow: 'var(--ds-shadow-overlay)' }}
    >
      {/* Official ID Header */}
      <div className="flex items-center gap-space-200 mb-space-300">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-ds-surface-sunken border border-ds-border-bold p-0.5">
            <img
              src={item.avatar}
              alt={item.author}
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          {/* Official Verification Badge */}
          <div
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-ds-background-success-bold rounded-full border-2 border-ds-surface-overlay flex items-center justify-center"
            style={{ boxShadow: 'var(--ds-shadow-raised)' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="w-3 h-3"
              >
                <path
                  d="M20 6L9 17L4 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-black text-ds-text-heading text-[18px] tracking-tight truncate">
              {item.author}
            </span>
            <div className="px-1.5 py-0.5 rounded-[4px] bg-ds-background-brand-subtle text-ds-text-brand text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
              OFFICIAL
            </div>
          </div>
          <div className="text-[11px] font-bold text-ds-text-subtle uppercase tracking-[0.1em] truncate">
            {item.role}
          </div>
        </div>
      </div>

      {/* Quote Body */}
      <div className="relative mb-space-300">
        <Quote
          size={20}
          className="text-ds-text-brand opacity-20 absolute -top-2 -left-2"
        />
        <p className="text-[17px] font-medium text-ds-text-heading leading-[1.6] tracking-tight relative z-10 px-space-100 italic">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      {/* Footer / Company Badge */}
      <div className="flex items-center justify-between pt-space-250 border-t border-ds-border-bold">
        <div className="flex items-center gap-space-100">
          <div className="w-2 h-2 rounded-full bg-ds-background-brand-bold animate-pulse" />
          <span className="text-[12px] font-black tracking-widest text-ds-text-heading uppercase">
            {item.company}
          </span>
        </div>

        <div className="flex gap-px">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              className="text-ds-background-warning-bold"
              fill="currentColor"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  direction = 'left',
  locale,
}: {
  items: Testimonial[];
  direction?: 'left' | 'right';
  locale: Locale;
}) {
  const isRtl = locale.startsWith('ar');
  const tripledItems = [...items, ...items, ...items];

  // Flip directions for RTL to ensure smooth physical translation resets
  const animX = direction === 'left' ? [0, -33.333 + '%'] : [-33.333 + '%', 0];
  const rtlAnimX = direction === 'left' ? [0, 33.333 + '%'] : [33.333 + '%', 0];

  return (
    <div
      className="flex overflow-hidden py-4 -mx-4 group"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <motion.div
        className="flex"
        animate={{
          x: isRtl ? rtlAnimX : animX,
        }}
        transition={{
          duration: 60,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {tripledItems.map((item, i) => (
          <TestimonialCard key={i} item={item} />
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsSection({ locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');
  const half = Math.ceil(TESTIMONIALS.length / 2);
  const row1 = TESTIMONIALS.slice(0, half);
  const row2 = TESTIMONIALS.slice(half);

  return (
    <section className="py-24 lg:py-48 bg-ds-surface-sunken relative overflow-hidden">
      {/* Background radial gradients for premium feel */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ds-border to-transparent" />
      <div className="absolute top-1/2 left-0 w-1/4 h-1/2 bg-ds-background-brand-bold/10 blur-[150px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-1/4 h-1/2 bg-ds-background-brand-bold/10 blur-[150px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 mb-20 lg:mb-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] font-black uppercase tracking-[0.45em] text-ds-text-brand mb-8"
          >
            {t('testimonials.badge')}
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black tracking-tight text-ds-text-heading leading-tight"
          >
            {t('testimonials.title')}
          </motion.h2>
        </div>
      </div>

      {/* Infinite Scrolling Rows */}
      <div className="relative flex flex-col gap-8 select-none">
        {/* Row 1: Left */}
        <MarqueeRow items={row1} direction="left" locale={locale} />

        {/* Row 2: Right */}
        <MarqueeRow items={row2} direction="right" locale={locale} />

        {/* Gradual edge fading mask */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-ds-surface to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-ds-surface to-transparent z-20 pointer-events-none" />
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ds-border to-transparent" />
    </section>
  );
}
