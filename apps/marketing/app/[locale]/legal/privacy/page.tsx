import type { Metadata } from 'next';
import { LegalLayout } from '../../../../components/sections/legal-layout';
import type { Locale } from '../../../../i18n-config';
import { getTranslation } from '../../../../lib/i18n/get-translation';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'legal');
  return {
    title: `${t('privacy.title')}`,
  };
}

export default async function PrivacyPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'legal');

  return (
    <LegalLayout
      title={t('privacy.title')}
      lastUpdated={`${t('layout.lastUpdated')} ${t('privacy.lastUpdatedValue')}`}
    >
      <section>
        <h2>{t('privacy.s1.title')}</h2>
        <p>{t('privacy.s1.p')}</p>
      </section>

      <section>
        <h2>{t('privacy.s2.title')}</h2>
        <h3>{t('privacy.s2.h3_1')}</h3>
        <p>{t('privacy.s2.p1')}</p>

        <h3>{t('privacy.s2.h3_2')}</h3>
        <p>{t('privacy.s2.p2')}</p>
      </section>

      <section>
        <h2>{t('privacy.s3.title')}</h2>
        <ul>
          <li>{t('privacy.s3.l1')}</li>
          <li>{t('privacy.s3.l2')}</li>
          <li>{t('privacy.s3.l3')}</li>
          <li>{t('privacy.s3.l4')}</li>
        </ul>
      </section>

      <section>
        <h2>{t('privacy.s4.title')}</h2>
        <p>{t('privacy.s4.p')}</p>
      </section>

      <section>
        <h2>{t('privacy.s5.title')}</h2>
        <p>{t('privacy.s5.p')}</p>
      </section>

      <section>
        <h2>{t('privacy.s6.title')}</h2>
        <p>{t('privacy.s6.p')}</p>
      </section>
    </LegalLayout>
  );
}
