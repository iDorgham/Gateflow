import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';
import type { Locale } from '../../../i18n-config';
import { Zap, Shield, Smartphone, Globe, Cpu, Cloud, Lock, BarChart3 } from 'lucide-react';
import { Button } from '@gate-access/ui';
import { I18nLink } from '../../../components/i18n-link';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'product');
  return {
    title: t('hero.headline'),
    description: t('hero.subHeadline'),
  };
}

export default async function FeaturesPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'product');

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="pt-20 pb-16 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6">
          {t('hero.headline')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.subHeadline')}
        </p>
      </section>

      {/* Feature Grid */}
      <section className="container px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        <FeatureDetail 
           icon={<Smartphone />}
           title={t('features.items.scanner.title')}
           desc={t('features.items.scanner.description')}
        />
        <FeatureDetail 
           icon={<Shield />}
           title={t('features.items.hmac.title')}
           desc={t('features.items.hmac.description')}
        />
        <FeatureDetail 
           icon={<Cloud />}
           title={t('features.items.offline.title')}
           desc={t('features.items.offline.description')}
        />
        <FeatureDetail 
           icon={<Lock />}
           title={t('features.items.hardware.title')}
           desc={t('features.items.hardware.description')}
        />
        <FeatureDetail 
           icon={<BarChart3 />}
           title={t('features.items.audit.title')}
           desc={t('features.items.audit.description')}
        />
        <FeatureDetail 
           icon={<Zap />}
           title={t('features.items.api.title')}
           desc={t('features.items.api.description')}
        />
      </section>

      {/* Technical Deep Dive */}
      <section className="bg-muted/30 py-24 border-y">
         <div className="container px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <h2 className="text-4xl font-black tracking-tight">{t('deepDives.title')}</h2>
                  <div className="space-y-6">
                     <TechItem icon={<Cpu />} title={t('deepDives.items.edge.title')} desc={t('deepDives.items.edge.description')} />
                     <TechItem icon={<Cloud />} title={t('deepDives.items.cloud.title')} desc={t('deepDives.items.cloud.description')} />
                     <TechItem icon={<Globe />} title={t('deepDives.items.region.title')} desc={t('deepDives.items.region.description')} />
                  </div>
               </div>
               <div className="relative">
                  <div className="bg-slate-900 rounded-3xl p-8 text-white font-mono text-sm shadow-2xl ltr:text-left rtl:text-left rtl:dir-ltr">
                     <div className="flex gap-1.5 mb-6">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                     </div>
                     <div className="space-y-2 opacity-80">
                        <p className="text-primary font-bold">{t('deepDives.code.verifying')}</p>
                        <p>const isValid = await verifyHMAC(qrData, secret);</p>
                        <p>if (isValid) {'{'}</p>
                        <p className="pl-4 text-success">{t('deepDives.code.authorized')}</p>
                        <p className="pl-4">timestamp: Date.now(),</p>
                        <p className="pl-4 text-indigo-400">{t('deepDives.code.queued')}</p>
                        <p>{'}'}</p>
                        <p className="mt-6 text-slate-500">{t('deepDives.code.processed')}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      
      {/* Bottom Features CTA */}
      <section className="container px-6 pt-24 text-center">
         <h2 className="text-3xl font-black mb-8">{t('cta.headline')}</h2>
         <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-xl h-14" asChild>
               <I18nLink locale={locale} href="/contact">{t('cta.buttonDemo')}</I18nLink>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl h-14" asChild>
               <I18nLink locale={locale} href="/pricing">{t('cta.buttonPricing')}</I18nLink>
            </Button>
         </div>
      </section>
    </div>
  );
}

function FeatureDetail({ icon, title, desc }: any) {
   return (
      <div className="p-8 bg-card border rounded-2xl hover:border-primary transition-colors group">
         <div className="bg-primary/5 text-primary p-3 rounded-xl w-fit mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
         </div>
         <h3 className="text-xl font-bold mb-3">{title}</h3>
         <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
      </div>
   )
}

function TechItem({ icon, title, desc }: any) {
   return (
      <div className="flex gap-4">
         <div className="text-primary mt-1">{icon}</div>
         <div>
            <h4 className="font-bold mb-1">{title}</h4>
            <p className="text-muted-foreground text-sm">{desc}</p>
         </div>
      </div>
   )
}
