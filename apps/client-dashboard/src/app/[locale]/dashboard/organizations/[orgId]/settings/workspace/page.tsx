import { requireAuth } from '@/lib/dashboard-auth';
import { WorkspaceSettingsForm } from '@/components/settings/workspace-form';
import { prisma } from '@gate-access/db';

export default async function WorkspaceSettings() {
  const { org } = await requireAuth();

  const settings = org
    ? await prisma.organization.findUnique({
        where: { id: org.id },
        select: {
          logoUrl: true,
          accentColor: true,
          scanLogRetentionMonths: true,
          visitorHistoryRetentionMonths: true,
          idArtifactRetentionMonths: true,
          incidentRetentionMonths: true,
          retentionLegalHold: true,
        },
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      <WorkspaceSettingsForm
        initialData={
          org
            ? {
                id: org.id,
                name: org.name,
                adminEmail: org.email,
                ...settings,
              }
            : undefined
        }
      />
    </div>
  );
}
