import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';
import type { Locale } from '../../../i18n-config';
import { Building2, GraduationCap, Calendar, Anchor, ShieldCheck, Zap, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@gate-access/ui';
import { I18nLink } from '../../../components/i18n-link';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'navigation');
  const { t: ts } = await getTranslation(locale, 'solutions');
  return {
    title: t('header.dropdowns.solutions.compounds.label'), // Fallback generic title
    description: ts('index.hero.subHeadline'),
  };
}

export default async function SolutionsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'solutions');

  const verticals = [
    {
      id: 'compounds',
      title: t('compounds.title'),
      desc: t('compounds.description'),
      icon: <Building2 />,
      features: t('compounds.bulletPoints', { returnObjects: true }) as string[],
      color: 'bg-indigo-500',
    },
    {
      id: 'schools',
      title: t('schools.title'),
      desc: t('schools.description'),
      icon: <GraduationCap />,
      features: t('schools.bulletPoints', { returnObjects: true }) as string[],
      color: 'bg-teal-500',
    },
    {
      id: 'events',
      title: t('events.title'),
      desc: t('events.description'),
      icon: <Calendar />,
      features: t('events.bulletPoints', { returnObjects: true }) as string[],
      color: 'bg-orange-500',
    },
    {
      id: 'clubs',
      title: t('clubs.title'),
      desc: t('clubs.description'),
      icon: <Anchor />,
      features: t('clubs.bulletPoints', { returnObjects: true }) as string[],
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Hero */}
      <section className="pt-20 pb-16 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6 uppercase">
          {t('index.hero.headline')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('index.hero.subHeadline')}
        </p>
      </section>

      {/* Grid */}
      <section className="container px-6 grid gap-16">
        {verticals.map((v, i) => (
          <div 
            key={v.id} 
            id={v.id}
            className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
          >
            <div className={i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
              <div className={`h-16 w-16 rounded-2xl ${v.color} text-white flex items-center justify-center mb-6 shadow-xl`}>
                {v.icon}
              </div>
              <h2 className="text-3xl lg:text-5xl font-black mb-6">{v.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {v.desc}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                 {v.features.map(f => (
                    <div key={f} className="flex items-center gap-2 font-bold text-sm">
                       <CheckCircle2 className="text-primary h-5 w-5" />
                       {f}
                    </div>
                 ))}
              </div>

              <Button size="lg" className="rounded-xl h-14 px-8 font-bold" asChild>
                <I18nLink locale={locale} href="/contact">{t('ui.configureFor')} {v.title}</I18nLink>
              </Button>
            </div>

            <div className={`relative aspect-square lg:aspect-video rounded-[2.5rem] bg-muted overflow-hidden border ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
               {/* Visual representation placeholder */}
               <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                  <v.icon.type className="w-32 h-32 opacity-10" />
               </div>
               
               {/* Overlay labels */}
               <div className="absolute inset-x-8 bottom-8 p-6 bg-background/80 backdrop-blur rounded-2xl border shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-black uppercase tracking-widest text-primary">{t('ui.liveOperations')}</span>
                     <span className="text-xs font-bold text-success animate-pulse">● {t('ui.systemOnline')}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </section>

      {/* Shared Features Summary */}
      <section className="container px-6 mt-32">
         <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-3 gap-12">
               <div className="lg:col-span-1">
                  <h3 className="text-3xl font-black mb-4">{t('ui.coreInfrastructure.title')}</h3>
                  <p className="text-slate-400">{t('ui.coreInfrastructure.description')}</p>
               </div>
               <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                  <FeatureHorizontal icon={<ShieldCheck />} title={t('ui.coreInfrastructure.features.security.title')} desc={t('ui.coreInfrastructure.features.security.description')} />
                  <FeatureHorizontal icon={<Zap />} title={t('ui.coreInfrastructure.features.sync.title')} desc={t('ui.coreInfrastructure.features.sync.description')} />
                  <FeatureHorizontal icon={<Smartphone />} title={t('ui.coreInfrastructure.features.mobile.title')} desc={t('ui.coreInfrastructure.features.mobile.description')} />
                  <FeatureHorizontal icon={<ShieldCheck />} title={t('ui.coreInfrastructure.features.whitelabel.title')} desc={t('ui.coreInfrastructure.features.whitelabel.description')} />
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

function FeatureHorizontal({ icon, title, desc }: any) {
   return (
      <div className="flex gap-4">
         <div className="bg-white/10 p-2 rounded-lg h-fit text-primary">{icon}</div>
         <div>
            <h4 className="font-bold text-lg mb-1">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
         </div>
      </div>
   )
}
