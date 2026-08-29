'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Smartphone, BarChart3, ArrowRight } from 'lucide-react';

const revealProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  zap: Zap,
  smartphone: Smartphone,
  chart: BarChart3,
};

/* Card accent badges using ADS standard background colors */
const colorMap: Record<string, string> = {
  brand:
    'bg-ds-background-brand-subtle       text-ds-text-brand       border-ds-border-brand',
  success:
    'bg-ds-background-success-subtle     text-ds-text-success     border-ds-border-success',
  information:
    'bg-ds-background-information-subtle text-ds-text-information border-ds-border-information',
  warning:
    'bg-ds-background-warning-subtle     text-ds-text-warning     border-ds-border-warning',
};

interface Feature {
  icon: string;
  title: string;
  desc: string;
  color: 'brand' | 'success' | 'information' | 'warning';
}

export function FeaturesSection({
  sectionTitle,
  featuresTitle,
  features,
  locale = 'en',
}: {
  sectionTitle: string;
  featuresTitle: string;
  features: Feature[];
  locale?: string;
}) {
  const isRtl = locale.startsWith('ar');

  return (
    <section className="relative overflow-hidden py-24 md:py-36 bg-ds-surface">
      {/* Brand-orange radial glow from top */}
      <div
        className="absolute inset-0 bg-ds-background-brand-bold opacity-[0.03]"
        style={{
          maskImage:
            'radial-gradient(ellipse 70% 50% at 50% -10%, black, transparent)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 50% at 50% -10%, black, transparent)',
        }}
      />

      {/* Subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--ds-border) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top & bottom rules */}
      <div className="absolute top-0 inset-x-0 h-px bg-ds-border" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-ds-border" />

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* ── Section header ── */}
        <motion.div
          {...revealProps}
          className="text-center max-w-4xl mx-auto mb-16 lg:mb-24"
        >
          <span className="mb-6 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-ds-text-brand px-4 py-1.5 bg-ds-background-brand-subtle rounded-full border border-ds-border-brand/30 shadow-sm">
            {sectionTitle}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-ds-text-heading leading-[1.1]">
            {featuresTitle}
          </h2>
        </motion.div>

        {/* ── Feature cards ── */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon] ?? Shield;
            return (
              <motion.div
                key={i}
                {...revealProps}
                transition={{ ...revealProps.transition, delay: i * 0.1 }}
                className="group flex h-full flex-col rounded-[28px] border border-ds-border bg-ds-surface-raised p-8 lg:p-10 transition-all duration-500 hover:border-ds-border-bold hover:shadow-xl hover:-translate-y-1.5 relative overflow-hidden active:scale-[0.99]"
              >
                {/* Hover shimmer overlay */}
                <div className="absolute inset-0 bg-ds-background-neutral opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[28px]" />

                {/* Icon badge */}
                <div
                  className={`relative z-10 mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-110 shadow-sm group-hover:shadow-md ${colorMap[feature.color]}`}
                >
                  <Icon size={30} strokeWidth={1.75} />
                </div>

                {/* Title */}
                <h3 className="relative z-10 mb-4 text-[22px] font-black tracking-tight text-ds-text-heading group-hover:text-ds-text-brand transition-colors leading-snug">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 flex-grow text-[15px] leading-relaxed text-ds-text-subtle font-medium group-hover:text-ds-text transition-colors">
                  {feature.desc}
                </p>

                {/* Learn more arrow */}
                <div className="relative z-10 mt-8 flex items-center gap-2 text-ds-text-brand font-black uppercase tracking-wider text-[11px] opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span>{isRtl ? 'المزيد' : 'Learn More'}</span>
                  <ArrowRight size={13} className="rtl:-scale-x-100" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
