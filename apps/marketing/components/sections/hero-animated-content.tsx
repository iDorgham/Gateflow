'use client';

import * as React from 'react';
import { Button } from '@gate-access/ui';
import { IntentLink } from '../intent-link';
import type { Locale } from '../../i18n-config';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Home,
  Shield,
} from 'lucide-react';
import { useTranslation } from '../../hooks/use-translation';

export function HeroAnimatedContent({ locale }: { locale: Locale }) {
  const { t } = useTranslation('landing');
  const isRtl = locale.startsWith('ar');

  return (
    <section className="relative overflow-hidden pt-24 pb-32 lg:pt-40 lg:pb-48 bg-ds-surface">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(var(--ds-background-brand-bold),0.06),transparent)]" />
      <div className="absolute top-0 end-0 -z-10 w-[500px] h-[500px] bg-ds-selected/30 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 rtl:-translate-x-1/2" />

      <div className="container px-[var(--ds-grid-margin-xs,1rem)] md:px-[var(--ds-grid-margin-md,2rem)] lg:px-[var(--ds-grid-margin-lg,4rem)] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-[var(--ds-grid-gutter,1.5rem)] items-center">
          {/* Left Text Content - 7 columns */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-ds-radius-small bg-ds-selected text-ds-text-brand text-[13px] font-black tracking-wide mb-10 w-fit mx-auto lg:mx-0">
              <Shield size={16} fill="currentColor" fillOpacity={0.2} />
              <span>{t('trust.badge')}</span>
            </div>

            <h1 className="text-5xl font-black leading-[1.1] sm:text-6xl lg:text-7xl xl:text-8xl mb-10 tracking-tight text-ds-text-heading">
              {t('hero.headline.prefix')}{' '}
              <span className="text-ds-text-brand">
                {t('hero.headline.highlight')}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-ds-text-subtle leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">
              {t('hero.subHeadline')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-16">
              <IntentLink
                locale={locale}
                href="/contact"
                intent="demo"
                surface="home_hero_primary"
              >
                <Button
                  variant="brand"
                  size="lg"
                  className="h-14 px-10 text-lg min-w-[200px] group transition-all"
                >
                  {t('hero.primaryCta')}
                  {isRtl ? (
                    <ArrowLeft className="ml-2 mr-4 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-4 mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </IntentLink>
              <IntentLink
                locale={locale}
                href="/solutions"
                intent="consult"
                surface="home_hero_secondary"
              >
                <Button
                  variant="subtle"
                  size="lg"
                  className="h-14 px-10 text-lg transition-colors border border-ds-border hover:border-ds-border-bold"
                >
                  {t('hero.secondaryCta')}
                </Button>
              </IntentLink>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-10 gap-y-6 pt-6 border-t border-ds-border w-fit mx-auto lg:mx-0 text-ds-text-subtle font-black uppercase text-[12px] tracking-widest">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-ds-success-bold" />
                <span>
                  {t('features.items.qr.title')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-ds-accent-bold" />
                <span>
                  {t('features.items.offline.title')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-ds-warning-bold" />
                <span>
                  {t('features.items.portal.title')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Artwork Content - 5 columns */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-[600px] flex items-center justify-center">
            <div className="relative z-20 w-[300px] sm:w-[340px] bg-ds-surface border border-ds-border-bold shadow-[0_32px_64px_rgba(9,30,66,0.18)] rounded-2xl p-6 sm:p-7 flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <div className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtlest mb-1">
                    System Core v.9.4
                  </div>
                  <div className="text-sm font-black text-ds-text-heading tracking-tight">
                    GateFlow Digital Pass
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-ds-text-brand" />
              </div>

              <div className="w-full h-1 bg-ds-surface-sunken rounded-full mb-8 relative overflow-hidden">
                <div className="absolute top-0 start-0 h-full w-[70%] bg-ds-background-brand-bold shadow-[0_0_8px_rgba(var(--ds-background-brand-bold),0.5)]" />
              </div>

              <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="p-3 bg-ds-surface-sunken rounded-lg border border-ds-border">
                  <div className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle mb-1">Gate ID</div>
                  <div className="text-[13px] font-black text-ds-text-heading">GH-904-B</div>
                </div>
                <div className="p-3 bg-ds-surface-sunken rounded-lg border border-ds-border">
                  <div className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle mb-1">Expiry</div>
                  <div className="text-[13px] font-black text-ds-text-heading">24H 00M</div>
                </div>
              </div>

              <div className="w-44 h-44 sm:w-52 sm:h-52 bg-white rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-ds-border mb-8 flex items-center justify-center relative group overflow-hidden">
                <QrCode
                  className="w-full h-full text-ds-text-heading"
                  strokeWidth={1}
                />
              </div>

              {/* Status Badge - ADS Lozenge Pattern */}
              <div className="w-full bg-ds-background-success-subtle text-ds-text-success py-3 px-4 rounded-lg flex justify-between items-center border border-ds-border-success">
                <div className="flex items-center gap-2 font-black text-[12px] uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" />
                  {isRtl ? 'تصريح ساري' : 'Access Verified'}
                </div>
                <div className="text-[10px] bg-ds-text-success text-white px-2 py-0.5 rounded-sm font-black">
                  ACTIVE
                </div>
              </div>
            </div>

            {/* Floating Elements (Static) */}
            <div className="absolute -top-4 start-0 sm:-start-12 z-30 bg-ds-surface border border-ds-border shadow-xl rounded-xl p-4 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-lg bg-[var(--ds-background-information-subtle,#EBF1FF)] text-[var(--ds-text-information,#0052CC)] flex items-center justify-center">
                <Home size={20} />
              </div>
              <div className="text-left rtl:text-right">
                <p className="text-[13px] font-bold text-[var(--ds-text,#172B4D)]">
                  {isRtl ? 'بالم هيلز' : 'Palm Hills'}
                </p>
                <p className="text-[11px] text-[var(--ds-text-subtlest,#6B778C)]">
                  {isRtl ? 'البوابة الرئيسية' : 'Main Gate'}
                </p>
              </div>
            </div>

            <div className="absolute bottom-10 -end-4 sm:-end-8 z-30 bg-ds-text-heading text-ds-text-inverse shadow-2xl rounded-xl p-4 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2
                  size={20}
                  className="text-ds-text-success"
                />
              </div>
              <div className="text-start">
                <p className="text-[13px] font-bold leading-tight">
                  {isRtl ? 'تم الدخول' : 'Entry Granted'}
                </p>
                <p className="text-[11px] text-white/60"> Ahmed V-42</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
