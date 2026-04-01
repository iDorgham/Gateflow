import * as React from 'react';
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
import { IntentLandingTracker } from '../../components/intent-landing-tracker';
import { MidCtaSection } from '../../components/sections/mid-cta-section';
import { FeaturesSection } from '../../components/sections/features-section';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const { t } = await getTranslation(locale, 'landing');

  const features = [
    {
      icon: 'shield',
      title: t('features.items.qr.title'),
      desc: t('features.items.qr.description'),
      color: 'brand' as const,
    },
    {
      icon: 'zap',
      title: t('features.items.offline.title'),
      desc: t('features.items.offline.description'),
      color: 'success' as const,
    },
    {
      icon: 'smartphone',
      title: t('features.items.portal.title'),
      desc: t('features.items.portal.description'),
      color: 'information' as const,
    },
    {
      icon: 'chart',
      title: t('features.items.analytics.title'),
      desc: t('features.items.analytics.description'),
      color: 'warning' as const,
    },
  ];

  return (
    <div className="flex flex-col w-full overflow-clip bg-ds-surface selection:bg-ds-background-brand-bold selection:text-white">
      <IntentLandingTracker locale={locale} surface="home_page" intent="demo" />

      {/* Hero — full viewport, py handled internally */}
      <Hero locale={locale} />

      {/* Trust / Social Proof */}
      <TrustBar locale={locale} />

      {/* Stats — always-dark inverted band */}
      <StatsSection locale={locale} />

      {/* Features / Problem-Solution */}
      <FeaturesSection
        sectionTitle={t('problems.title')}
        featuresTitle={t('features.title')}
        features={features}
      />

      {/* How It Works */}
      <HowItWorksSection locale={locale} />

      {/* Product Screenshots */}
      <ProductScreenshots locale={locale} />

      {/* Comparison */}
      <ComparisonSection locale={locale} />

      {/* Testimonials */}
      <TestimonialsSection locale={locale} />

      {/* Security Grid */}
      <SecurityGrid locale={locale} />

      {/* Mid-page CTA */}
      <MidCtaSection
        locale={locale}
        headline={t('cta.headline')}
        subHeadline={t('cta.subHeadline')}
        ctaLabel={t('hero.primaryCta')}
      />

      {/* Bottom CTA */}
      <BottomCTA locale={locale} />

      <CookieConsent locale={locale} />
    </div>
  );
}
