import { getSessionClaims } from '@/lib/auth-cookies';
import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('overview.title', { defaultValue: 'Dashboard' }) };
}

export default async function DashboardPage({ params }: { params: { locale: Locale } }) {
  redirect(`/${params.locale}/`);
}
