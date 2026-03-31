import type { Metadata } from 'next';
import { LegalLayout } from '../../../../components/sections/legal-layout';
import { Shield, Lock } from 'lucide-react';
import type { Locale } from '../../../../i18n-config';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import { absoluteMarketingTitle } from '../../../../lib/metadata-title';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'legal');
  return {
    title: absoluteMarketingTitle(t('security.title')),
  };
}

export default async function SecurityPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'legal');

  return (
    <LegalLayout
      title={t('security.title')}
      lastUpdated={`${t('layout.lastUpdated')} ${t('security.lastUpdatedValue')}`}
    >
      <section className="mb-12">
        <p className="text-xl leading-relaxed">{t('security.intro')}</p>
      </section>

      <div className="grid sm:grid-cols-2 gap-8 mb-12 not-prose">
        <div className="p-6 rounded-2xl border bg-card">
          <Lock className="text-primary mb-4" />
          <h3 className="font-bold text-lg mb-2">
            {t('security.cards.aes.title')}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t('security.cards.aes.desc')}
          </p>
        </div>
        <div className="p-6 rounded-2xl border bg-card">
          <Shield className="text-primary mb-4" />
          <h3 className="font-bold text-lg mb-2">
            {t('security.cards.hmac.title')}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t('security.cards.hmac.desc')}
          </p>
        </div>
      </div>

      <section>
        <h2>{t('security.s1.title')}</h2>
        <ul>
          <li>
            <strong>{t('security.s1.l1_strong')}</strong>
            {t('security.s1.l1_text')}
          </li>
          <li>
            <strong>{t('security.s1.l2_strong')}</strong>
            {t('security.s1.l2_text')}
          </li>
          <li>
            <strong>{t('security.s1.l3_strong')}</strong>
            {t('security.s1.l3_text')}
          </li>
        </ul>
      </section>

      <section>
        <h2>{t('security.s2.title')}</h2>
        <p>{t('security.s2.p')}</p>
      </section>

      <section>
        <h2>{t('security.s3.title')}</h2>
        <p>{t('security.s3.p')}</p>
      </section>
    </LegalLayout>
  );
}
