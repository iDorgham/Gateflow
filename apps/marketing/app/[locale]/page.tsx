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
import { Button } from '@gate-access/ui';

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
      <section className="border-y border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-20 lg:mb-24">
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              {t('problems.title')}
            </h2>
            <p className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {t('features.title')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      <section className="overflow-hidden bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="relative isolate grid items-center gap-16 overflow-hidden rounded-2xl border border-border bg-card p-8 lg:grid-cols-2 lg:p-16">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent)]" />

            <div>
              <h2 className="mb-8 text-3xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl">
                {t('cta.headline')}
              </h2>
              <p className="mb-10 max-w-md text-lg text-muted-foreground">
                {t('cta.subHeadline')}
              </p>
              <I18nLink locale={locale} href="/contact">
                <Button variant="brand" size="lg" className="px-8">
                  {t('hero.primaryCta')}
                </Button>
              </I18nLink>
            </div>

            <div className="relative">
              <div className="rounded-xl border border-border bg-background/80 p-8 shadow-2xl backdrop-blur-sm lg:p-12">
                <div className="mb-6 text-primary">
                  <Zap className="w-12 h-12" />
                </div>
                <h3 className="mb-6 text-2xl font-bold text-foreground">
                  Ready to upgrade your community security?
                </h3>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-3/4 bg-primary" />
                </div>
                <div className="mt-4 flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
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
    brand: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    information: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-8 transition-all hover:border-border/80 hover:shadow-xl">
      <div
        className={`mb-8 flex h-14 w-14 items-center justify-center rounded-lg transition-transform group-hover:-translate-y-1 ${colorMap[color]}`}
      >
        <div>{icon}</div>
      </div>
      <h3 className="mb-3 text-[18px] font-bold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="flex-grow text-[14px] leading-relaxed text-muted-foreground">
        {desc}
      </p>
    </div>
  );
}
