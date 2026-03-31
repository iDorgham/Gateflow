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
  const isRtl = locale === 'ar-EG';

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-[var(--ds-background-default,#FFFFFF)]">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(0,82,204,0.06),transparent)]" />
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-[#DEEBFF]/30 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

      <div className="container px-[var(--ds-grid-margin-xs,1rem)] md:px-[var(--ds-grid-margin-md,2rem)] lg:px-[var(--ds-grid-margin-lg,4rem)] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-[var(--ds-grid-gutter,1.5rem)] items-center">
          {/* Left Text Content - 7 columns */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[var(--ds-background-selected,#DEEBFF)] dark:bg-[var(--ds-background-brand-subtle,#1C2B41)] text-[var(--ds-text-selected,#0052CC)] dark:text-[var(--ds-text-brand,#579DFF)] text-[12px] font-bold tracking-wide mb-8 w-fit mx-auto lg:mx-0">
              <Shield size={14} fill="currentColor" fillOpacity={0.2} />
              <span>{t('trust.badge')}</span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl xl:text-7xl mb-8 tracking-tight text-[var(--ds-text,#172B4D)]">
              {t('hero.headline.prefix')}{' '}
              <span className="text-[var(--ds-text-brand,#0052CC)]">
                {t('hero.headline.highlight')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--ds-text-subtle,#42526E)] leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              {t('hero.subHeadline')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <IntentLink
                locale={locale}
                href="/contact"
                intent="demo"
                surface="home_hero_primary"
              >
                <Button
                  variant="brand"
                  size="lg"
                  className="h-12 px-8 min-w-[160px] group transition-all"
                >
                  {t('hero.primaryCta')}
                  {isRtl ? (
                    <ArrowLeft className="ml-2 mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-3 mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
                  className="h-12 px-8 transition-colors border border-transparent hover:border-[var(--ds-border,#DFE1E6)]"
                >
                  {t('hero.secondaryCta')}
                </Button>
              </IntentLink>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 pt-4 border-t border-[var(--ds-border,#DFE1E6)] w-fit mx-auto lg:mx-0 text-[var(--ds-text-subtle,#42526E)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--ds-background-success-bold,#36B37E)]" />
                <span className="text-sm font-semibold">
                  {t('features.items.qr.title')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--ds-background-information-bold,#00B8D9)]" />
                <span className="text-sm font-semibold">
                  {t('features.items.offline.title')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--ds-background-warning-bold,#FFAB00)]" />
                <span className="text-sm font-semibold">
                  {t('features.items.portal.title')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Artwork Content - 5 columns */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-[600px] flex items-center justify-center">
            <div className="relative z-20 w-[280px] sm:w-[320px] bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border-bold,#A5ADBA)] shadow-[0_24px_48px_rgba(9,30,66,0.15)] rounded-2xl p-6 sm:p-8 flex flex-col items-center">
              <div className="w-full h-1 bg-[var(--ds-background-subtle,#F4F5F7)] rounded-full mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-[var(--ds-background-brand-bold,#0052CC)]" />
              </div>

              <div className="w-full flex justify-between items-center mb-10">
                <div className="text-sm font-bold text-[var(--ds-text,#172B4D)] tracking-tight">
                  GateFlow Digital Pass
                </div>
                <ShieldCheck className="w-5 h-5 text-[var(--ds-icon-brand,#0052CC)]" />
              </div>

              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[var(--ds-border,#DFE1E6)] mb-10 flex items-center justify-center relative group overflow-hidden">
                <QrCode
                  className="w-full h-full text-[#091E42]"
                  strokeWidth={1}
                />
              </div>

              {/* Status Badge */}
              <div className="w-full bg-[var(--ds-background-success-subtle,#E3FCEF)] text-[var(--ds-text-success,#006644)] py-4 rounded-lg flex justify-center items-center gap-3 font-bold text-sm border border-[var(--ds-border-success,#36B37E)]">
                <CheckCircle2 className="w-5 h-5" />
                {isRtl ? 'تصريح ساري' : 'Access Verified'}
              </div>
            </div>

            {/* Floating Elements (Static) */}
            <div className="absolute -top-4 left-0 sm:-left-12 z-30 bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] shadow-xl rounded-xl p-4 flex gap-4 items-center">
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

            <div className="absolute bottom-10 -right-4 sm:-right-8 z-30 bg-[#172B4D] text-white shadow-2xl rounded-xl p-4 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2
                  size={20}
                  className="text-[var(--ds-text-success,#36B37E)]"
                />
              </div>
              <div className="text-left rtl:text-right">
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
