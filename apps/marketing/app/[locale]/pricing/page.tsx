import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';
import type { Locale } from '../../../i18n-config';
import { Button } from '@gate-access/ui';
import { CheckCircle2, Zap, Shield, Globe } from 'lucide-react';
import { templatedMarketingTitle } from '../../../lib/metadata-title';
import { IntentLink } from '../../../components/intent-link';
import { IntentLandingTracker } from '../../../components/intent-landing-tracker';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const castLocale = locale as Locale;
  const { t } = await getTranslation(castLocale, 'navigation');
  return {
    title: templatedMarketingTitle(t('header.dropdowns.pricing.label')),
  };
}

export default async function PricingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const castLocale = locale as Locale;
  const { t } = await getTranslation(castLocale, 'pricing');

  const plans = [
    {
      name: t('tiers.starter.name'),
      price: t('tiers.starter.price.monthly'),
      description: t('tiers.starter.description'),
      features: t('tiers.starter.features', {
        returnObjects: true,
      }) as string[],
      cta: t('tiers.starter.cta'),
      variant: 'outline' as const,
      intent: 'demo' as const,
      surface: 'pricing_starter_cta',
    },
    {
      name: t('tiers.pro.name'),
      price: t('tiers.pro.price.monthly'),
      description: t('tiers.pro.description'),
      features: t('tiers.pro.features', { returnObjects: true }) as string[],
      cta: t('tiers.pro.cta'),
      variant: 'brand' as const,
      highlight: true,
      intent: 'pilot' as const,
      surface: 'pricing_pro_cta',
    },
    {
      name: t('tiers.enterprise.name'),
      price: t('tiers.enterprise.price.custom'),
      description: t('tiers.enterprise.description'),
      features: t('tiers.enterprise.features', {
        returnObjects: true,
      }) as string[],
      cta: t('tiers.enterprise.cta'),
      variant: 'outline' as const,
      intent: 'consult' as const,
      surface: 'pricing_enterprise_cta',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24">
      <IntentLandingTracker
        locale={castLocale}
        surface="pricing_page"
        intent="pilot"
      />
      {/* Hero */}
      <section className="pt-20 pb-16 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6">
          {t('hero.headline')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.subHeadline')}
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-8 rounded-[2rem] border flex flex-col h-full bg-card transition-all hover:shadow-xl ${plan.highlight ? 'ring-2 ring-primary border-primary scale-105 z-10' : ''}`}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {plan.description}
              </p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-black">{plan.price}</span>
              {plan.price !== 'Custom' && (
                <span className="text-muted-foreground text-sm">/mo</span>
              )}
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 text-sm font-medium"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <IntentLink
              locale={castLocale}
              href="/contact"
              intent={plan.intent}
              surface={plan.surface}
            >
              <Button
                variant={plan.variant}
                className="w-full h-12 rounded-xl text-sm font-bold"
              >
                {plan.cta}
              </Button>
            </IntentLink>
          </div>
        ))}
      </section>

      {/* Trust Grid */}
      <section className="bg-muted/30 py-24 border-y">
        <div className="container px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Shield size={24} />
              </div>
              <h4 className="font-bold">{t('trust.security.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('trust.security.description')}
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Globe size={24} />
              </div>
              <h4 className="font-bold">{t('trust.support.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('trust.support.description')}
              </p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Zap size={24} />
              </div>
              <h4 className="font-bold">{t('trust.uptime.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('trust.uptime.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
