import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { Anchor } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: `${t('clubs.title')} | GateFlow`,
    description: t('clubs.description'),
  };
}

export default async function ClubsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'solutions');

  return (
    <SolutionLayout
      locale={locale}
      title={t('clubs.title')}
      subtitle={t('clubs.subtitle')}
      description={t('clubs.description')}
      icon={<Anchor />}
      ctaText={`${t('ui.configureFor')} ${t('clubs.title')}`}
      features={t('clubs.bulletPoints', { returnObjects: true }) as unknown as string[]}
      benefits={[
        { title: t('clubs.benefits.items.vip.title'), desc: t('clubs.benefits.items.vip.description') },
        { title: t('clubs.benefits.items.discreet.title'), desc: t('clubs.benefits.items.discreet.description') },
        { title: t('clubs.benefits.items.revocation.title'), desc: t('clubs.benefits.items.revocation.description') },
      ]}
    />
  );
}
