import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { IntegrationCards } from '@/components/settings/integrations/integration-cards';
import type { IntegrationConfig } from '@/components/settings/integrations/integration-cards';

export default async function IntegrationsSettings() {
  const { org } = await requireAuth();
  if (!org) return null;

  const orgRow = await prisma.organization.findUnique({
    where: { id: org.id },
    select: { integrationConfig: true, domain: true },
  });

  const integrationConfig = (orgRow?.integrationConfig ?? {}) as unknown as IntegrationConfig;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black uppercase tracking-tight">Integrations</h1>
        <p className="text-sm text-muted-foreground">
          Connect third-party marketing platforms and configure your custom domain.
        </p>
      </div>

      <IntegrationCards
        initialConfig={integrationConfig}
        domain={orgRow?.domain ?? null}
      />
    </div>
  );
}
