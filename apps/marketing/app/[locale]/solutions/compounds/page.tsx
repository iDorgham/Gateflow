import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { Building2 } from 'lucide-react';
import { templatedMarketingTitle } from '../../../../lib/metadata-title';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: templatedMarketingTitle(t('compounds.hero.headline') as string),
    description: t('compounds.description') as string,
  };
}

export default async function CompoundsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');

  return (
    <SolutionLayout
      locale={locale}
      title={t('compounds.hero.headline') as string}
      subtitle={t('compounds.subtitle') as string}
      description={t('compounds.hero.sub') as string}
      icon={<Building2 />}
      ctaText={t('cta') as string}
      secondaryCtaText={t('compounds.seePricing') as string}
      painPoints={
        t('compounds.painPoints', { returnObjects: true }) as string[]
      }
      features={
        t('compounds.bulletPoints', { returnObjects: true }) as string[]
      }
      benefits={[
        {
          title: t('compounds.benefits.items.residents.title') as string,
          desc: t('compounds.benefits.items.residents.description') as string,
        },
        {
          title: t('compounds.benefits.items.trades.title') as string,
          desc: t('compounds.benefits.items.trades.description') as string,
        },
        {
          title: t('compounds.benefits.items.complaints.title') as string,
          desc: t('compounds.benefits.items.complaints.description') as string,
        },
      ]}
      quote={{
        text: t('compounds.quote.text') as string,
        author: t('compounds.quote.author') as string,
        role: t('compounds.quote.role') as string,
      }}
      intent="migration"
      surfacePrefix="solutions_compounds"
    />
  );
}
