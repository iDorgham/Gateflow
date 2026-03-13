import type { Metadata } from 'next';
import * as React from 'react';
import { getTranslation } from '../../../lib/i18n/get-translation';
import type { Locale } from '../../../i18n-config';
import { Check, X, Shield, Zap, Building2, Smartphone, BarChart3, Globe } from 'lucide-react';
import { Button } from '@gate-access/ui';
import { I18nLink } from '../../../components/i18n-link';
import { cn } from '../../../lib/utils';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'navigation');
  return {
    title: t('header.dropdowns.pricing.label'),
    description: 'Compare GateFlow plans and find the perfect access control solution for your needs.',
  };
}

const PLANS = (t: any) => [
  {
    id: 'starter',
    name: t('tiers.starter.name'),
    priceStr: t('tiers.starter.price.monthly'),
    periodStr: t('tiers.starter.price.period'),
    desc: t('tiers.starter.description'),
    features: t('tiers.starter.features', { returnObjects: true }) as string[],
    notIncluded: t('tiers.starter.notIncluded', { returnObjects: true }) as string[],
    featured: false,
    cta: t('tiers.starter.cta')
  },
  {
    id: 'pro',
    name: t('tiers.pro.name'),
    priceStr: t('tiers.pro.price.monthly'),
    periodStr: t('tiers.pro.price.period'),
    desc: t('tiers.pro.description'),
    features: t('tiers.pro.features', { returnObjects: true }) as string[],
    notIncluded: t('tiers.pro.notIncluded', { returnObjects: true }) as string[],
    featured: true,
    badge: t('tiers.pro.badge'),
    cta: t('tiers.pro.cta')
  },
  {
    id: 'enterprise',
    name: t('tiers.enterprise.name'),
    priceStr: t('tiers.enterprise.price.custom'),
    periodStr: '',
    desc: t('tiers.enterprise.description'),
    features: t('tiers.enterprise.features', { returnObjects: true }) as string[],
    notIncluded: t('tiers.enterprise.notIncluded', { returnObjects: true }) as string[],
    featured: false,
    cta: t('tiers.enterprise.cta')
  },
];

const PRICING_FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is GateFlow free to start?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The Starter plan is permanently free — not a trial. It supports 1 gate and up to 500 scans per month with no credit card required.' },
    },
    {
      '@type': 'Question',
      name: 'Can I upgrade or downgrade my plan at any time?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Upgrades take effect immediately. Downgrades take effect at the end of the current billing cycle.' },
    },
    {
      '@type': 'Question',
      name: 'What happens if I exceed my scan limit on the Starter plan?',
      acceptedAnswer: { '@type': 'Answer', text: "On Starter (500 scans/month), scanning continues but you'll see a warning in the dashboard. We don't hard-block access — but you'll be prompted to upgrade. Pro and Enterprise have no scan limits." },
    },
    {
      '@type': 'Question',
      name: 'Do you offer annual billing discounts?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — annual plans include a 17% discount compared to monthly billing. Contact us to switch to annual.' },
    },
    {
      '@type': 'Question',
      name: 'Is there a contract or long-term commitment required?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Monthly plans can be cancelled at any time. Enterprise contracts are available for organizations that need SLAs and custom terms.' },
    },
  ],
};

export default async function PricingPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'pricing');
  const plans = PLANS(t);

  return (
    <div className="flex flex-col w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_FAQ_JSON_LD) }}
      />
      {/* Header */}
      <section className="pt-20 pb-16 text-center container px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
          <Globe size={14} />
          <span>{t('ui.transparentPricing')}</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">
          {t('hero.headline')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.subHeadline')}
        </p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5"><Check className="text-success h-4 w-4" /> {t('ui.currencyInfo')}</span>
            <span className="flex items-center gap-1.5"><Check className="text-success h-4 w-4" /> {t('ui.fawryAccepted')}</span>
            <span className="flex items-center gap-1.5"><Check className="text-success h-4 w-4" /> {t('ui.cancelAnytime')}</span>
        </div>
      </section>

      {/* Plans */}
      <section className="container px-6 grid md:grid-cols-3 gap-8 mb-24">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={cn(
               "relative p-8 rounded-[2rem] border transition-all duration-300 flex flex-col",
               plan.featured 
                 ? "bg-slate-900 text-white border-slate-800 shadow-2xl scale-105 z-10" 
                 : "bg-background border-border hover:border-primary/50"
            )}
          >
            {plan.featured && (
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {plan.badge || t('ui.recommended')}
               </div>
            )}

            <div className="mb-8">
               <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
               <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black">{plan.priceStr}</span>
                  <span className="text-muted-foreground font-medium">{plan.periodStr}</span>
               </div>
               <p className={cn("text-sm", plan.featured ? "text-slate-400" : "text-muted-foreground")}>
                  {plan.desc}
               </p>
            </div>

            <div className="space-y-4 mb-8 flex-1">
               {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-3 text-sm">
                     <Check className="text-primary h-5 w-5 shrink-0" />
                     <span className="font-medium">{f}</span>
                  </div>
               ))}
               {plan.notIncluded.map(f => (
                  <div key={f} className="flex items-start gap-3 text-sm opacity-40">
                     <X className="h-5 w-5 shrink-0" />
                     <span className="font-medium">{f}</span>
                  </div>
               ))}
            </div>

            <Button 
               size="lg" 
               className={cn("w-full h-14 rounded-xl font-bold text-base", plan.featured ? "bg-white text-black hover:bg-slate-100" : "")}
               asChild
            >
               <I18nLink locale={locale} href="/contact">
                  {plan.cta}
               </I18nLink>
            </Button>
          </div>
        ))}
      </section>

      {/* Comparison Grid Mini */}
      <section className="bg-muted/30 py-24 border-y">
         <div className="container px-6">
            <h2 className="text-3xl font-black text-center mb-16">{t('comparisonMini.title')}</h2>
            <div className="grid md:grid-cols-3 gap-12">
               <Feature icon={<Shield />} title={t('comparisonMini.features.signedQr.title')} desc={t('comparisonMini.features.signedQr.description')} />
               <Feature icon={<Smartphone />} title={t('comparisonMini.features.offlineFirst.title')} desc={t('comparisonMini.features.offlineFirst.description')} />
               <Feature icon={<BarChart3 />} title={t('comparisonMini.features.liveAnalytics.title')} desc={t('comparisonMini.features.liveAnalytics.description')} />
               <Feature icon={<Building2 />} title={t('comparisonMini.features.multiGate.title')} desc={t('comparisonMini.features.multiGate.description')} />
               <Feature icon={<Zap />} title={t('comparisonMini.features.webhookSync.title')} desc={t('comparisonMini.features.webhookSync.description')} />
               <Feature icon={<Globe />} title={t('comparisonMini.features.arabicSupport.title')} desc={t('comparisonMini.features.arabicSupport.description')} />
            </div>
         </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: any) {
   return (
      <div className="flex gap-4">
         <div className="bg-primary/10 text-primary p-3 rounded-xl h-fit">
            {React.cloneElement(icon, { size: 24 })}
         </div>
         <div>
            <h4 className="font-bold mb-1 text-lg">{title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
         </div>
      </div>
   )
}
