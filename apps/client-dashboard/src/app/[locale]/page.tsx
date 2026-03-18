import { getSessionClaims } from '@/lib/auth-cookies';
import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('overview.title', { defaultValue: 'Dashboard' }) };
}

export default async function Home({ params }: { params: { locale: Locale } }) {
  const claims = await getSessionClaims();
  if (!claims) redirect('/login');
  if (!claims.orgId) redirect('/dashboard/onboarding');

  return (
    <DashboardWrapper locale={params.locale}>
      <DashboardOverview locale={params.locale} orgId={claims.orgId} />
    </DashboardWrapper>
  );
}
