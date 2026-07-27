import { getSessionClaims } from '@/lib/auth-cookies';
import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { prisma } from '@gate-access/db';
import { OrganizationType } from '@gate-access/types';
import { Suspense } from 'react';
import { DashboardLoading } from '@/components/dashboard/dashboard-loading';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const params = await props.params;
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('overview.title', { defaultValue: 'Dashboard' }) };
}

export default async function OrgDashboardOverviewPage(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.sub) redirect(`/${params.locale}/login`);

  const orgId = params.orgId || claims.orgId;

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { type: true },
  });

  if (!org) redirect(`/${params.locale}/dashboard/onboarding`);

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardOverview
        locale={params.locale}
        orgId={orgId}
        orgType={org.type as OrganizationType}
      />
    </Suspense>
  );
}
