'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';
import { Hero } from '../../components/sections/hero';
import { TrustBar } from '../../components/sections/trust-bar';
import { SecurityGrid } from '../../components/sections/security-grid';
import { BottomCTA } from '../../components/sections/bottom-cta';
import { StatsSection } from '../../components/sections/stats-section';
import { HowItWorksSection } from '../../components/sections/how-it-works';
import { ProductScreenshots } from '../../components/sections/product-screenshots';
import { TestimonialsSection } from '../../components/sections/testimonials';
import { ComparisonSection } from '../../components/sections/comparison';
import { CookieConsent } from '../../components/cookie-consent';
import { Shield, Zap, Smartphone, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@gate-access/ui';
import { IntentLink } from '../../components/intent-link';
import { IntentLandingTracker } from '../../components/intent-landing-tracker';
import { useTranslation } from '../../hooks/use-translation';

const revealProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const { t } = useTranslation('landing');

  return (
    <div className="flex flex-col w-full bg-ds-surface selection:bg-ds-background-brand-bold selection:text-white">
      <IntentLandingTracker locale={locale} surface="home_page" intent="demo" />
      
      <Hero locale={locale} />
      
      <motion.div {...revealProps} className="relative z-10 -mt-16 sm:-mt-24">
        <TrustBar locale={locale} />
      </motion.div>

      <motion.div {...revealProps} className="py-32 lg:py-48">
        <StatsSection locale={locale} />
      </motion.div>

      {/* Problem/Solution Section */}
      <section className="relative overflow-hidden border-y border-ds-border bg-ds-surface-sunken py-32 md:py-64">
        <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-transparent via-ds-border-brand to-transparent opacity-30" />
        
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <motion.div 
            {...revealProps}
            className="text-center max-w-3xl mx-auto mb-24 lg:mb-32"
          >
            <h2 className="mb-8 text-[14px] font-black uppercase tracking-[0.4em] text-ds-text-brand">
              {t('problems.title')}
            </h2>
            <p className="text-5xl lg:text-8xl font-black tracking-tight text-ds-text-heading leading-[1.1]">
              {t('features.title')}
            </p>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Shield />, title: t('features.items.qr.title'), desc: t('features.items.qr.description'), color: 'brand' },
              { icon: <Zap />, title: t('features.items.offline.title'), desc: t('features.items.offline.description'), color: 'success' },
              { icon: <Smartphone />, title: t('features.items.portal.title'), desc: t('features.items.portal.description'), color: 'information' },
              { icon: <BarChart3 />, title: t('features.items.analytics.title'), desc: t('features.items.analytics.description'), color: 'warning' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                {...revealProps}
                transition={{ ...revealProps.transition, delay: i * 0.1 }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  desc={feature.desc}
                  color={feature.color as any}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.div {...revealProps} className="py-32 lg:py-48 bg-ds-surface">
        <HowItWorksSection locale={locale} />
      </motion.div>

      <motion.div {...revealProps} className="py-32 lg:py-48 bg-ds-surface-sunken border-y border-ds-border">
        <ProductScreenshots locale={locale} />
      </motion.div>

      <motion.div {...revealProps} className="py-32 lg:py-48">
        <ComparisonSection locale={locale} />
      </motion.div>

      <motion.div {...revealProps} className="py-32 lg:py-48 bg-ds-surface-sunken border-y border-ds-border">
        <TestimonialsSection locale={locale} />
      </motion.div>

      <motion.div {...revealProps} className="py-32 lg:py-48">
        <SecurityGrid locale={locale} />
      </motion.div>

      {/* Visual Momentum Section - High Conversion Mid-CTA */}
      <section className="relative overflow-hidden py-32 md:py-64 bg-ds-surface">
        <div className="container mx-auto px-6">
          <motion.div 
            {...revealProps}
            className="relative isolate overflow-hidden rounded-[40px] border border-ds-border-bold bg-ds-text-heading p-12 lg:p-32 shadow-[0_48px_96px_rgba(0,0,0,0.3)]"
          >
            {/* Dark Mode Specific Glow */}
            <div className="absolute top-0 end-0 -z-10 w-[600px] h-[600px] bg-ds-background-brand-bold/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
            
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-10 text-5xl lg:text-[88px] font-black leading-[1] tracking-tighter text-white"
                >
                  {t('cta.headline')}
                </motion.h2>
                <motion.p 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                  className="mb-12 max-w-lg text-2xl text-white/60 font-medium leading-relaxed"
                >
                  {t('cta.subHeadline')}
                </motion.p>
                <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 }}
                >
                  <IntentLink locale={locale} href="/contact" intent="demo" surface="home_mid_cta">
                    <Button variant="brand" size="lg" className="h-20 px-16 text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-ds-background-brand-bold/40 hover:-translate-y-1 transition-all">
                      {t('hero.primaryCta')}
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
                      className="h-full bg-ds-background-brand-bold shadow-[0_0_15px_rgba(var(--ds-background-brand-bold),0.8)]" 
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

      <motion.div {...revealProps} className="pb-32 lg:pb-64">
        <BottomCTA locale={locale} />
      </motion.div>

      <CookieConsent locale={locale} />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color = 'brand',
}: {
  icon: React.ReactElement;
  title: string;
  desc: string;
  color?: 'brand' | 'success' | 'information' | 'warning';
}) {
  const colorMap = {
    brand: 'bg-ds-background-brand-subtle text-ds-text-brand border-ds-border-brand/20',
    success: 'bg-ds-background-success-subtle text-ds-text-success border-ds-border-success/20',
    information: 'bg-ds-background-information-subtle text-ds-text-information border-ds-border-information/20',
    warning: 'bg-ds-background-warning-subtle text-ds-text-warning border-ds-border-warning/20',
  };

  return (
    <div className="group flex h-full flex-col rounded-[32px] border border-ds-border bg-ds-surface-raised p-12 transition-all hover:border-ds-border-bold hover:shadow-[0_32px_64px_rgba(0,0,0,0.12)] hover:-translate-y-2">
      <div
        className={`mb-10 flex h-20 w-20 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${colorMap[color]}`}
      >
        {React.cloneElement(icon, { size: 36, strokeWidth: 1.5 })}
      </div>
      <h3 className="mb-6 text-[24px] font-black tracking-tight text-ds-text-heading">
        {title}
      </h3>
      <p className="flex-grow text-[16px] leading-[1.6] text-ds-text-subtle font-medium">
        {desc}
      </p>
      <div className="mt-10 flex items-center gap-2 text-ds-text-brand font-black uppercase tracking-widest text-[11px] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
        <span>Learn More</span>
        <ArrowRight size={14} />
      </div>
    </div>
  );
}
