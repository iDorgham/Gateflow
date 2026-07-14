import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { Calendar } from 'lucide-react';
import { templatedMarketingTitle } from '../../../../lib/metadata-title';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: templatedMarketingTitle(t('events.hero.headline') as string),
    description: t('events.description') as string,
  };
}

export default async function EventsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');

  return (
    <SolutionLayout
      locale={locale}
      title={t('events.hero.headline') as string}
      subtitle={t('events.subtitle') as string}
      description={t('events.hero.sub') as string}
      icon={<Calendar />}
      ctaText={t('cta') as string}
      secondaryCtaText={t('events.seePricing') as string}
      painPoints={t('events.painPoints', { returnObjects: true }) as string[]}
      features={t('events.bulletPoints', { returnObjects: true }) as string[]}
      benefits={[
        {
          title: t('events.benefits.items.speed.title') as string,
          desc: t('events.benefits.items.speed.description') as string,
        },
        {
          title: t('events.benefits.items.fraud.title') as string,
          desc: t('events.benefits.items.fraud.description') as string,
        },
        {
          title: t('events.benefits.items.reports.title') as string,
          desc: t('events.benefits.items.reports.description') as string,
        },
      ]}
      quote={{
        text: t('events.quote.text') as string,
        author: t('events.quote.author') as string,
        role: t('events.quote.role') as string,
      }}
      intent="pilot"
      surfacePrefix="solutions_events"
    />
  );
}
