import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { GraduationCap } from 'lucide-react';
import { templatedMarketingTitle } from '../../../../lib/metadata-title';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: templatedMarketingTitle(t('schools.hero.headline') as string),
    description: t('schools.description') as string,
  };
}

export default async function SchoolsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');

  return (
    <SolutionLayout
      locale={locale}
      title={t('schools.hero.headline') as string}
      subtitle={t('schools.subtitle') as string}
      description={t('schools.hero.sub') as string}
      icon={<GraduationCap />}
      ctaText={t('cta') as string}
      secondaryCtaText={t('schools.seePricing') as string}
      painPoints={t('schools.painPoints', { returnObjects: true }) as string[]}
      features={t('schools.bulletPoints', { returnObjects: true }) as string[]}
      benefits={[
        {
          title: t('schools.benefits.items.pickup.title') as string,
          desc: t('schools.benefits.items.pickup.description') as string,
        },
        {
          title: t('schools.benefits.items.audit.title') as string,
          desc: t('schools.benefits.items.audit.description') as string,
        },
        {
          title: t('schools.benefits.items.offline.title') as string,
          desc: t('schools.benefits.items.offline.description') as string,
        },
      ]}
      quote={{
        text: t('schools.quote.text') as string,
        author: t('schools.quote.author') as string,
        role: t('schools.quote.role') as string,
      }}
      intent="consult"
      surfacePrefix="solutions_schools"
    />
  );
}
