import type { Metadata } from 'next';
import { LegalLayout } from '../../../../components/sections/legal-layout';
import type { Locale } from '../../../../i18n-config';
import { getTranslation } from '../../../../lib/i18n/get-translation';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'legal');
  return {
    title: `${t('terms.title')} | GateFlow`,
  };
}

export default async function TermsPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'legal');

  return (
    <LegalLayout title={t('terms.title')} lastUpdated={`${t('layout.lastUpdated')} ${t('terms.lastUpdatedValue')}`}>
      <section>
        <h2>{t('terms.s1.title')}</h2>
        <p>{t('terms.s1.p')}</p>
      </section>

      <section>
        <h2>{t('terms.s2.title')}</h2>
        <p>{t('terms.s2.p')}</p>
      </section>

      <section>
        <h2>{t('terms.s3.title')}</h2>
        <ul>
          <li>{t('terms.s3.l1')}</li>
          <li>{t('terms.s3.l2')}</li>
          <li>{t('terms.s3.l3')}</li>
        </ul>
      </section>

      <section>
        <h2>{t('terms.s4.title')}</h2>
        <p>{t('terms.s4.p')}</p>
      </section>

      <section>
        <h2>{t('terms.s5.title')}</h2>
        <p>{t('terms.s5.p')}</p>
      </section>

      <section>
        <h2>{t('terms.s6.title')}</h2>
        <p>{t('terms.s6.p')}</p>
      </section>
    </LegalLayout>
  );
}
