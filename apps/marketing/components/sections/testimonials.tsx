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

/**
 * Renders a testimonial card with author details, quote, company, and rating.
 *
 * @param item - The testimonial content and author information to display.
 * @returns The rendered testimonial card.
 */
function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="flex-shrink-0 w-[420px] mx-4 bg-ds-surface-overlay p-8 rounded-[32px] border border-ds-border-bold hover:border-ds-accent-bold/30 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ds-accent-bold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Official ID Header */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-ds-surface-sunken border border-ds-border-subtle p-0.5">
            <img
              src={item.avatar}
              alt={item.author}
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover rounded-[14px] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          {/* Official Verification Badge */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-ds-background-success-bold rounded-full border-2 border-ds-background-default flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="w-2.5 h-2.5"
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
            <span className="font-bold text-ds-text-heading text-[17px] tracking-tight truncate leading-tight">
              {item.author}
            </span>
            <div className="px-1.5 py-0.5 rounded-[4px] bg-ds-accent-bold/10 text-ds-accent-bold text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
              OFFICIAL
            </div>
          </div>
          <div className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-[0.12em] truncate">
            {item.role}
          </div>
        </div>
      </div>

      {/* Quote Body */}
      <div className="relative mb-8 min-h-[80px] z-10">
        <Quote
          size={32}
          className="text-ds-accent-bold opacity-[0.08] absolute -top-4 -left-4"
        />
        <p className="text-[16px] font-medium text-ds-text-heading leading-[1.6] tracking-tight relative z-10 px-1">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      {/* Footer / Company Badge */}
      <div className="flex items-center justify-between pt-5 border-t border-ds-border-subtle/50 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-ds-accent-bold group-hover:animate-pulse" />
          <span className="text-[11px] font-black tracking-[0.1em] text-ds-text-heading uppercase">
            {item.company}
          </span>
        </div>

        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className="text-ds-text-warning"
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
  const isLeft = direction === 'left';
  const animClass = isLeft
    ? isRtl
      ? 'animate-gf-marquee-slow-right'
      : 'animate-gf-marquee-slow-left'
    : isRtl
      ? 'animate-gf-marquee-slow-left'
      : 'animate-gf-marquee-slow-right';

  return (
    <div
      className="flex overflow-hidden py-4 -mx-4 group"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className={`flex ${animClass} pause-on-hover`}
        style={{ willChange: 'transform' }}
      >
        {tripledItems.map((item, i) => (
          <TestimonialCard key={i} item={item} />
        ))}
      </div>
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
          <p className="text-[12px] font-black uppercase tracking-[0.45em] text-ds-text-brand mb-8">
            {t('testimonials.badge')}
          </p>
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
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-ds-surface-sunken to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-ds-surface-sunken to-transparent z-20 pointer-events-none" />
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ds-border to-transparent" />
    </section>
  );
}
