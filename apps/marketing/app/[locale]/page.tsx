import dynamic from 'next/dynamic';
import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';
import { Hero } from '../../components/sections/hero';
import { TrustBar } from '../../components/sections/trust-bar';
import { StatsSection } from '../../components/sections/stats-section';
import { FeaturesSection } from '../../components/sections/features-section';
import { IntentLandingTracker } from '../../components/intent-landing-tracker';

// Lazy-load below-the-fold interactive sections with SSR support
const HowItWorksSection = dynamic(
  () =>
    import('../../components/sections/how-it-works').then(
      (m) => m.HowItWorksSection
    ),
  { ssr: true }
);

const ProductScreenshots = dynamic(
  () =>
    import('../../components/sections/product-screenshots').then(
      (m) => m.ProductScreenshots
    ),
  { ssr: true }
);

const ComparisonSection = dynamic(
  () =>
    import('../../components/sections/comparison').then(
      (m) => m.ComparisonSection
    ),
  { ssr: true }
);

const TestimonialsSection = dynamic(
  () =>
    import('../../components/sections/testimonials').then(
      (m) => m.TestimonialsSection
    ),
  { ssr: true }
);

const SecurityGrid = dynamic(
  () =>
    import('../../components/sections/security-grid').then(
      (m) => m.SecurityGrid
    ),
  { ssr: true }
);

const MidCtaSection = dynamic(
  () =>
    import('../../components/sections/mid-cta-section').then(
      (m) => m.MidCtaSection
    ),
  { ssr: true }
);

const BottomCTA = dynamic(
  () => import('../../components/sections/bottom-cta').then((m) => m.BottomCTA),
  { ssr: true }
);

const CookieConsent = dynamic(() =>
  import('../../components/cookie-consent').then((m) => m.CookieConsent)
);

/**
 * Renders the localized landing page for the requested locale.
 *
 * @param params - Route parameters containing the page locale
 * @returns The localized landing page
 */
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
    <div className="flex flex-col w-full overflow-clip bg-background selection:bg-ds-background-brand-bold selection:text-white">
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
      <ProductScreenshots _locale={locale} />

      {/* Comparison */}
      <ComparisonSection _locale={locale} />

      {/* Testimonials */}
      <TestimonialsSection locale={locale} />

      {/* Security Grid */}
      <SecurityGrid _locale={locale} />

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
