import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { Calendar } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: `${t('events.title')} | GateFlow`,
    description: t('events.description'),
  };
}

export default async function EventsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'solutions');

  return (
    <SolutionLayout
      locale={locale}
      title={t('events.title')}
      subtitle={t('events.subtitle')}
      description={t('events.description')}
      icon={<Calendar />}
      ctaText={`${t('ui.configureFor')} ${t('events.title')}`}
      features={t('events.bulletPoints', { returnObjects: true }) as unknown as string[]}
      benefits={[
        { title: t('events.benefits.items.speed.title'), desc: t('events.benefits.items.speed.description') },
        { title: t('events.benefits.items.fraud.title'), desc: t('events.benefits.items.fraud.description') },
        { title: t('events.benefits.items.reports.title'), desc: t('events.benefits.items.reports.description') },
      ]}
    />
  );
}
