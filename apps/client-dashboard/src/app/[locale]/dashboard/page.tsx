import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('overview.title', { defaultValue: 'Dashboard' }) };
}

export default async function DashboardPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  redirect(`/${params.locale}/`);
}
