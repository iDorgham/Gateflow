import type { Metadata } from 'next';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import type { Locale } from '../../../../i18n-config';
import { SolutionLayout } from '../../../../components/sections/solution-layout';
import { GraduationCap } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'solutions');
  return {
    title: `${t('schools.title')} | GateFlow`,
    description: t('schools.description'),
  };
}

export default async function SchoolsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'solutions');

  return (
    <SolutionLayout
      locale={locale}
      title={t('schools.title')}
      subtitle={t('schools.subtitle')}
      description={t('schools.description')}
      icon={<GraduationCap />}
      ctaText={`${t('ui.configureFor')} ${t('schools.title')}`}
      features={t('schools.bulletPoints', { returnObjects: true }) as unknown as string[]}
      benefits={[
        { title: t('schools.benefits.items.pickup.title'), desc: t('schools.benefits.items.pickup.description') },
        { title: t('schools.benefits.items.audit.title'), desc: t('schools.benefits.items.audit.description') },
        { title: t('schools.benefits.items.offline.title'), desc: t('schools.benefits.items.offline.description') },
      ]}
    />
  );
}
