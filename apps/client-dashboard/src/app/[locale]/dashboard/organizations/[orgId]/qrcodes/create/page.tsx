import { PageHeader } from '@gateflow/components';
import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { CreateQRClient } from './create-qr-client';
import type { Locale } from '@/lib/i18n-config';

export default async function CreateQRCodePage(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const { locale, orgId } = await props.params;
  const { org } = await requireAuth();
  if (!org) return null;

  const projectId = await getValidatedProjectId(org.id);

  const [gates, currentProject, contacts] = await Promise.all([
    prisma.gate.findMany({
      where: { organizationId: org.id, deletedAt: null, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    projectId
      ? prisma.project.findFirst({
          where: { id: projectId, organizationId: org.id, deletedAt: null },
          select: { id: true, name: true },
        })
      : Promise.resolve(null),
    prisma.contact.findMany({
      where: { organizationId: org.id, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        units: {
          select: { unit: { select: { id: true, name: true } } },
        },
      },
      orderBy: { firstName: 'asc' },
    }),
  ]);

  // Flatten the ContactUnit junction to the shape CreateQRClient expects
  const formattedContacts = contacts.map((c) => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    units: c.units.map((cu) => ({ id: cu.unit.id, name: cu.unit.name })),
  }));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Create QR Code"
        subtitle="Generate a signed access pass for your gates."
        showHome={false}
        className="mb-0"
        breadcrumbs={[
          {
            label: 'QR Codes',
            href: `/${locale}/dashboard/organizations/${orgId}/qrcodes`,
          },
          { label: 'Create', active: true },
        ]}
      />

      <CreateQRClient
        organizationId={org.id}
        gates={gates}
        currentProject={currentProject}
        contacts={formattedContacts}
      />
    </div>
  );
}
