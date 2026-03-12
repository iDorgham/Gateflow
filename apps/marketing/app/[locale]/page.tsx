import { getTranslation } from '../../lib/i18n/get-translation';
import type { Locale } from '../../i18n-config';
import { Hero } from '../../components/sections/hero';
import { TrustBar } from '../../components/sections/trust-bar';
import { SecurityGrid } from '../../components/sections/security-grid';
import { BottomCTA } from '../../components/sections/bottom-cta';
import { StatsSection } from '../../components/sections/stats-section';
import { SocialProof } from '../../components/sections/social-proof';
import { HowItWorksSection } from '../../components/sections/how-it-works';
import { ProductScreenshots } from '../../components/sections/product-screenshots';
import { TestimonialsSection } from '../../components/sections/testimonials';
import { ComparisonSection } from '../../components/sections/comparison';
import { Shield, Zap, Smartphone, BarChart3 } from 'lucide-react';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const { t } = await getTranslation(locale, 'landing');

  return (
    <div className="flex flex-col w-full">
      <Hero locale={locale} />
      <TrustBar locale={locale} />
      <StatsSection locale={locale} />
      <SocialProof locale={locale} />
      <HowItWorksSection locale={locale} />
      <ProductScreenshots locale={locale} />

      {/* Problem/Solution Section */}
      <section className="py-24 bg-muted/20">
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary mb-4">
              {t('problems.title')}
            </h2>
            <p className="text-4xl lg:text-5xl font-black tracking-tight mb-6">
              {t('features.title')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title={t('features.items.qr.title')}
              desc={t('features.items.qr.description')}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title={t('features.items.offline.title')}
              desc={t('features.items.offline.description')}
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title={t('features.items.portal.title')}
              desc={t('features.items.portal.description')}
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title={t('features.items.analytics.title')}
              desc={t('features.items.analytics.description')}
            />
          </div>
        </div>
      </section>

      <TestimonialsSection locale={locale} />
      <ComparisonSection locale={locale} />
      <SecurityGrid locale={locale} />

      {/* Use Cases Grid */}
      <section className="py-24 bg-accent dark:bg-accent/50 text-accent-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full -z-0 pointer-events-none" />

        <div className="container px-6 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-8 leading-none">
                {t('cta.headline')}
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md">
                {t('cta.subHeadline')}
              </p>
            </div>

            <div className="bg-card dark:bg-card/50 backdrop-blur border rounded-3xl p-8 lg:p-12 shadow-2xl group hover:border-primary/50 transition-colors">
              <div className="text-primary mb-6">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {t('cta.subHeadline')}
              </h3>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 group-hover:w-full transition-all duration-1000" />
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
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-card border p-8 rounded-2xl hover:shadow-xl transition-all group">
      <div className="text-primary mb-6 group-hover:scale-110 transition-transform origin-left">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
