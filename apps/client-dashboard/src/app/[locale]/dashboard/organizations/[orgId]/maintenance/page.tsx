import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';
import { PageHeader } from '@gateflow/components';
import { MaintenanceClient } from './maintenance-client';
import {
  WorkOrderWithRelations,
  BUILT_IN_ROLES,
  OrganizationType,
  getOrganizationFeatures,
} from '@gate-access/types';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('maintenance.title', { defaultValue: 'Maintenance Hub' }) };
}

export default async function MaintenancePage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const { t } = await getTranslation(params.locale, 'dashboard');
  const orgId = claims.orgId;

  const workOrders = await prisma.workOrder.findMany({
    where: { organizationId: orgId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      reporter: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      assignee: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      gate: { select: { id: true, name: true } },
      unit: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
    take: 20,
  });

  const isResident = claims.roleName === 'RESIDENT';

  const features = getOrganizationFeatures(
    (claims.orgType as OrganizationType) || OrganizationType.REAL_ESTATE
  );
  const { terminology } = features;

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isResident
            ? t('maintenance.resident_title', {
                defaultValue: 'My Maintenance Requests',
              })
            : t('maintenance.title', { defaultValue: 'Maintenance Hub' })
        }
        subtitle={
          isResident
            ? t('maintenance.resident_description', {
                defaultValue: t(
                  `orgType:${terminology.orgLabel.split(':')[1]?.split('.')[0]}.maintenanceDescriptionResident`,
                  {
                    defaultValue: `Report and track maintenance issues for your ${t(terminology.unitLabel).toLowerCase()} and property.`,
                  }
                ),
              })
            : t('maintenance.description', {
                defaultValue: t(
                  `orgType:${terminology.orgLabel.split(':')[1]?.split('.')[0]}.maintenanceDescription`,
                  {
                    defaultValue: `Manage and track facility maintenance requests across gates, ${t(terminology.unitLabelPlural).toLowerCase()}, and ${t(terminology.projectLabel).toLowerCase()}.`,
                  }
                ),
              })
        }
      />

      <MaintenanceClient
        initialData={workOrders as any as WorkOrderWithRelations[]}
        role={
          claims.roleName === 'RESIDENT'
            ? BUILT_IN_ROLES.RESIDENT
            : claims.roleName === 'ORG_ADMIN'
              ? BUILT_IN_ROLES.ORG_ADMIN
              : BUILT_IN_ROLES.SUPER_ADMIN
        }
      />
    </div>
  );
}
