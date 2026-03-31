import { ErrorContent } from '../../../components/sections/error-content';
import type { Locale } from '../../../i18n-config';
import type { Metadata } from 'next';
import { getTranslation } from '../../../lib/i18n/get-translation';
import { absoluteMarketingTitle } from '../../../lib/metadata-title';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const { t } = await getTranslation(locale, 'errors');
  return {
    title: absoluteMarketingTitle(t('403.headline')),
  };
}

export default async function ForbiddenPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  return <ErrorContent locale={locale} code="403" />;
}
