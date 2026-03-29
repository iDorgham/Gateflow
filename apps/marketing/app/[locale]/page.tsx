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
import { Shield, Zap, Smartphone, BarChart3 } from 'lucide-react';
import { I18nLink } from '../../components/i18n-link';

export default async function HomePage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'landing');

  return (
    <div className="flex flex-col w-full">
      <Hero locale={locale} />
      <TrustBar locale={locale} />
      <StatsSection locale={locale} />

      {/* Problem/Solution Section */}
      <section className="py-24 bg-[var(--ds-background-subtle,#F4F5F7)] border-y border-[var(--ds-border,#DFE1E6)]">
        <div className="container px-[var(--ds-grid-margin-xs,1rem)] md:px-[var(--ds-grid-margin-md,2rem)] lg:px-[var(--ds-grid-margin-lg,4rem)] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 lg:mb-24">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ds-text-brand,#0052CC)] mb-4">
              {t('problems.title')}
            </h2>
            <p className="text-3xl lg:text-5xl font-bold tracking-tight text-[var(--ds-text,#172B4D)] leading-tight">
              {t('features.title')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[var(--ds-grid-gutter,1.5rem)]">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title={t('features.items.qr.title')}
              desc={t('features.items.qr.description')}
              color="brand"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title={t('features.items.offline.title')}
              desc={t('features.items.offline.description')}
              color="success"
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title={t('features.items.portal.title')}
              desc={t('features.items.portal.description')}
              color="information"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title={t('features.items.analytics.title')}
              desc={t('features.items.analytics.description')}
              color="warning"
            />
          </div>
        </div>
      </section>

      <HowItWorksSection locale={locale} />
      <ProductScreenshots locale={locale} />
      <ComparisonSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <SecurityGrid locale={locale} />

      {/* Visual Momentum Section */}
      <section className="py-24 bg-[var(--ds-background-default,#FFFFFF)] overflow-hidden">
        <div className="container px-[var(--ds-grid-margin-xs,1rem)] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center bg-[#172B4D] rounded-xl p-8 lg:p-16 text-white overflow-hidden relative isolate">
            <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_top_right,var(--ds-background-brand-bold,#0052CC),transparent)]" />

            <div>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-8 leading-tight">
                {t('cta.headline')}
              </h2>
              <p className="text-white/70 text-lg mb-10 max-w-md">
                {t('cta.subHeadline')}
              </p>
              <I18nLink locale={locale} href="/contact">
                <button className="h-12 px-8 bg-[#0052CC] text-white rounded-xl font-bold">
                  {t('hero.primaryCta')}
                </button>
              </I18nLink>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 lg:p-12 shadow-2xl">
                <div className="text-[var(--ds-text-brand,#579DFF)] mb-6">
                  <Zap className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Ready to upgrade your community security?
                </h3>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--ds-background-brand-bold,#0052CC)] w-3/4" />
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-white/70 uppercase tracking-widest">
                  <span>Configuration</span>
                  <span>90% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BottomCTA locale={locale} />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color = 'brand',
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color?: 'brand' | 'success' | 'information' | 'warning';
}) {
  const colorMap = {
    brand:
      'var(--ds-background-brand-subtle,#DEEBFF) text-[var(--ds-text-brand,#0052CC)]',
    success:
      'var(--ds-background-success-subtle,#E3FCEF) text-[var(--ds-text-success,#006644)]',
    information:
      'var(--ds-background-information-subtle,#EBF1FF) text-[var(--ds-text-information,#0052CC)]',
    warning:
      'var(--ds-background-warning-subtle,#FFF0B3) text-[var(--ds-text-warning,#827013)]',
  };

  return (
    <div className="bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] p-8 rounded-lg hover:border-[var(--ds-border-bold,#A5ADBA)] hover:shadow-[0_8px_24px_rgba(9,30,66,0.12)] transition-all group flex flex-col h-full">
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-lg mb-8 transition-transform group-hover:-translate-y-1`}
        style={{ backgroundColor: colorMap[color].split(' ')[0] }}
      >
        <div className={colorMap[color].split(' ')[1]}>{icon}</div>
      </div>
      <h3 className="text-[18px] font-bold text-[var(--ds-text,#172B4D)] mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-[var(--ds-text-subtle,#42526E)] text-[14px] leading-relaxed flex-grow">
        {desc}
      </p>
    </div>
  );
}
