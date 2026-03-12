import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { Calendar } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: `${t('events.hero.headline')} | GateFlow`,
    description: t('events.description'),
  };
}

export default async function EventsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'solutions');

  return (
    <SolutionLayout
      locale={locale}
      title={t('events.hero.headline')}
      subtitle={t('events.subtitle')}
      description={t('events.hero.sub')}
      icon={<Calendar />}
      ctaText={t('cta')}
      secondaryCtaText={t('events.seePricing')}
      painPoints={t('events.painPoints', { returnObjects: true }) as string[]}
      features={t('events.bulletPoints', { returnObjects: true }) as string[]}
      benefits={[
        { title: t('events.benefits.items.speed.title'), desc: t('events.benefits.items.speed.description') },
        { title: t('events.benefits.items.fraud.title'), desc: t('events.benefits.items.fraud.description') },
        { title: t('events.benefits.items.reports.title'), desc: t('events.benefits.items.reports.description') },
      ]}
      quote={{
        text: t('events.quote.text'),
        author: t('events.quote.author'),
        role: t('events.quote.role'),
      }}
    />
  );
}
