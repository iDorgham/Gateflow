import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { Anchor } from 'lucide-react';
import { templatedMarketingTitle } from '../../../../lib/metadata-title';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: templatedMarketingTitle(t('clubs.hero.headline') as string),
    description: t('clubs.description') as string,
  };
}

export default async function ClubsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');

  return (
    <SolutionLayout
      locale={locale}
      title={t('clubs.hero.headline') as string}
      subtitle={t('clubs.subtitle') as string}
      description={t('clubs.hero.sub') as string}
      icon={<Anchor />}
      ctaText={t('cta') as string}
      secondaryCtaText={t('clubs.seePricing') as string}
      painPoints={t('clubs.painPoints', { returnObjects: true }) as string[]}
      features={t('clubs.bulletPoints', { returnObjects: true }) as string[]}
      benefits={[
        {
          title: t('clubs.benefits.items.vip.title') as string,
          desc: t('clubs.benefits.items.vip.description') as string,
        },
        {
          title: t('clubs.benefits.items.discreet.title') as string,
          desc: t('clubs.benefits.items.discreet.description') as string,
        },
        {
          title: t('clubs.benefits.items.revocation.title') as string,
          desc: t('clubs.benefits.items.revocation.description') as string,
        },
      ]}
      quote={{
        text: t('clubs.quote.text') as string,
        author: t('clubs.quote.author') as string,
        role: t('clubs.quote.role') as string,
      }}
      intent="demo"
      surfacePrefix="solutions_clubs"
    />
  );
}
