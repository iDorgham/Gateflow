import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { Anchor } from 'lucide-react';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: `${t('clubs.hero.headline')}`,
    description: t('clubs.description'),
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
      title={t('clubs.hero.headline')}
      subtitle={t('clubs.subtitle')}
      description={t('clubs.hero.sub')}
      icon={<Anchor />}
      ctaText={t('cta')}
      secondaryCtaText={t('clubs.seePricing')}
      painPoints={t('clubs.painPoints', { returnObjects: true }) as string[]}
      features={t('clubs.bulletPoints', { returnObjects: true }) as string[]}
      benefits={[
        {
          title: t('clubs.benefits.items.vip.title'),
          desc: t('clubs.benefits.items.vip.description'),
        },
        {
          title: t('clubs.benefits.items.discreet.title'),
          desc: t('clubs.benefits.items.discreet.description'),
        },
        {
          title: t('clubs.benefits.items.revocation.title'),
          desc: t('clubs.benefits.items.revocation.description'),
        },
      ]}
      quote={{
        text: t('clubs.quote.text'),
        author: t('clubs.quote.author'),
        role: t('clubs.quote.role'),
      }}
    />
  );
}
