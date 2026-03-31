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
    title: templatedMarketingTitle(t('compounds.hero.headline')),
    description: t('compounds.description'),
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
      title={t('compounds.hero.headline')}
      subtitle={t('compounds.subtitle')}
      description={t('compounds.hero.sub')}
      icon={<Building2 />}
      ctaText={t('cta')}
      secondaryCtaText={t('compounds.seePricing')}
      painPoints={
        t('compounds.painPoints', { returnObjects: true }) as string[]
      }
      features={
        t('compounds.bulletPoints', { returnObjects: true }) as string[]
      }
      benefits={[
        {
          title: t('compounds.benefits.items.residents.title'),
          desc: t('compounds.benefits.items.residents.description'),
        },
        {
          title: t('compounds.benefits.items.trades.title'),
          desc: t('compounds.benefits.items.trades.description'),
        },
        {
          title: t('compounds.benefits.items.complaints.title'),
          desc: t('compounds.benefits.items.complaints.description'),
        },
      ]}
      quote={{
        text: t('compounds.quote.text'),
        author: t('compounds.quote.author'),
        role: t('compounds.quote.role'),
      }}
    />
  );
}
