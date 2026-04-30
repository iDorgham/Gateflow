import { getSessionClaims } from '@/lib/auth-cookies';
import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { prisma } from '@gate-access/db';
import { OrganizationType } from '@gate-access/types';
import { Suspense } from 'react';
import { DashboardLoading } from '@/components/dashboard/dashboard-loading';

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
  const claims = await getSessionClaims();
  if (!claims?.sub) redirect(`/${params.locale}/login`);

  const org = await prisma.organization.findUnique({
    where: { id: claims.orgId },
    select: { type: true },
  });

  if (!org) redirect(`/${params.locale}/dashboard/onboarding`);

  return (
    <DashboardWrapper locale={params.locale}>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardOverview
          locale={params.locale}
          orgId={claims.orgId}
          orgType={org.type}
        />
      </Suspense>
    </DashboardWrapper>
  );
}
