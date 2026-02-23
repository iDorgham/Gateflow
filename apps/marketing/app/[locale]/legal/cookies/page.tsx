import type { Metadata } from 'next';
import { LegalLayout } from '../../../../components/sections/legal-layout';
import type { Locale } from '../../../../i18n-config';
import { getTranslation } from '../../../../lib/i18n/get-translation';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'legal');
  return {
    title: `${t('cookies.title')} | GateFlow`,
  };
}

export default async function CookiesPage({ params: { locale } }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(locale, 'legal');

  return (
    <LegalLayout title={t('cookies.title')} lastUpdated={`${t('layout.lastUpdated')} ${t('cookies.lastUpdatedValue')}`}>
      <section>
        <h2>{t('cookies.s1.title')}</h2>
        <p>{t('cookies.s1.p')}</p>
      </section>

      <section>
        <h2>{t('cookies.s2.title')}</h2>
        <p>{t('cookies.s2.p')}</p>
        <ul>
          <li><strong>{t('cookies.s2.l1_strong')}</strong>{t('cookies.s2.l1_text')}</li>
          <li><strong>{t('cookies.s2.l2_strong')}</strong>{t('cookies.s2.l2_text')}</li>
          <li><strong>{t('cookies.s2.l3_strong')}</strong>{t('cookies.s2.l3_text')}</li>
        </ul>
      </section>

      <section>
        <h2>{t('cookies.s3.title')}</h2>
        <p>{t('cookies.s3.p_start')}<a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>{t('cookies.s3.p_end')}</p>
      </section>

      <section>
        <h2>{t('cookies.s4.title')}</h2>
        <p>{t('cookies.s4.p')}</p>
      </section>
    </LegalLayout>
  );
}
