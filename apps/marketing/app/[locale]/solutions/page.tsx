import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';
import type { Locale } from '../../../i18n-config';
import { templatedMarketingTitle } from '../../../lib/metadata-title';
import {
  Building2,
  GraduationCap,
  Calendar,
  Anchor,
  ShieldCheck,
  Zap,
  Smartphone,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@gate-access/ui';
import { IntentLink } from '../../../components/intent-link';
import { IntentLandingTracker } from '../../../components/intent-landing-tracker';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'navigation');
  const { t: ts } = await getTranslation(locale, 'solutions');
  return {
    title: templatedMarketingTitle(
      t('header.dropdowns.solutions.compounds.label')
    ), // Fallback generic title
    description: ts('index.hero.subHeadline'),
  };
}

export default async function SolutionsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');

  const verticals = [
    {
      id: 'compounds',
      title: t('compounds.title'),
      desc: t('compounds.description'),
      icon: Building2,
      features: t('compounds.bulletPoints', {
        returnObjects: true,
      }) as string[],
      color: 'bg-primary text-primary-foreground',
    },
    {
      id: 'schools',
      title: t('schools.title'),
      desc: t('schools.description'),
      icon: GraduationCap,
      features: t('schools.bulletPoints', { returnObjects: true }) as string[],
      color: 'bg-emerald-500 text-white',
    },
    {
      id: 'events',
      title: t('events.title'),
      desc: t('events.description'),
      icon: Calendar,
      features: t('events.bulletPoints', { returnObjects: true }) as string[],
      color: 'bg-amber-500 text-amber-950',
    },
    {
      id: 'clubs',
      title: t('clubs.title'),
      desc: t('clubs.description'),
      icon: Anchor,
      features: t('clubs.bulletPoints', { returnObjects: true }) as string[],
      color: 'bg-sky-500 text-white',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24">
      <IntentLandingTracker
        locale={locale}
        surface="solutions_page"
        intent="consult"
      />
      {/* Hero */}
      <section className="pt-20 pb-16 text-center container px-6">
        <h1 className="text-4xl lg:text-7xl font-black tracking-tight mb-6 uppercase">
          {t('index.hero.headline')}
        </h1>
        <h2 className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('index.hero.subHeadline')}
        </h2>
      </section>

      {/* Grid */}
      <section className="container grid gap-16 px-6">
        {verticals.map((v, i) => (
          <div
            key={v.id}
            id={v.id}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div className={i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl ${v.color}`}
              >
                <v.icon size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black mb-6">
                {v.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {v.desc}
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-10">
                {v.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 font-bold text-sm"
                  >
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    {f}
                  </div>
                ))}
              </div>

              <IntentLink
                locale={locale}
                href="/contact"
                intent="pilot"
                surface={`solutions_${v.id}_cta`}
              >
                <Button size="lg" className="rounded-xl h-14 px-8 font-bold">
                  {t('ui.configureFor')} {v.title}
                </Button>
              </IntentLink>
            </div>

            <div
              className={`relative aspect-square overflow-hidden rounded-[2.5rem] border bg-muted lg:aspect-video ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}
            >
              {/* Visual representation placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/30">
                <v.icon className="w-32 h-32 opacity-10" />
              </div>

              {/* Overlay labels */}
              <div className="absolute inset-x-8 bottom-8 p-6 bg-background/80 backdrop-blur rounded-2xl border shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">
                    {t('ui.liveOperations')}
                  </span>
                  <span className="text-xs font-bold text-emerald-500 animate-pulse">
                    ● {t('ui.systemOnline')}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.45)]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Shared Features Summary */}
      <section className="container px-6 mt-32">
        <div className="relative overflow-hidden rounded-[3rem] border border-border bg-card p-12 lg:p-20">
          <div className="relative z-10 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h3 className="mb-4 text-3xl font-black text-foreground">
                {t('ui.coreInfrastructure.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('ui.coreInfrastructure.description')}
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
              <FeatureHorizontal
                icon={ShieldCheck}
                title={t('ui.coreInfrastructure.features.security.title')}
                desc={t('ui.coreInfrastructure.features.security.description')}
              />
              <FeatureHorizontal
                icon={Zap}
                title={t('ui.coreInfrastructure.features.sync.title')}
                desc={t('ui.coreInfrastructure.features.sync.description')}
              />
              <FeatureHorizontal
                icon={Smartphone}
                title={t('ui.coreInfrastructure.features.mobile.title')}
                desc={t('ui.coreInfrastructure.features.mobile.description')}
              />
              <FeatureHorizontal
                icon={ShieldCheck}
                title={t('ui.coreInfrastructure.features.whitelabel.title')}
                desc={t(
                  'ui.coreInfrastructure.features.whitelabel.description'
                )}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureHorizontal({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="h-fit rounded-lg bg-primary/10 p-2 text-primary">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="mb-1 text-lg font-bold text-foreground">{title}</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
