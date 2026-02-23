import { ErrorContent } from '../../../components/sections/error-content';
import type { Locale } from '../../../i18n-config';
import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }): Promise<Metadata> {
  const { t } = await getTranslation(locale, 'errors');
  return {
    title: `${t('403.headline')} | GateFlow`,
  };
}

export default function ForbiddenPage({ params: { locale } }: { params: { locale: Locale } }) {
  return <ErrorContent locale={locale} code="403" />;
}
