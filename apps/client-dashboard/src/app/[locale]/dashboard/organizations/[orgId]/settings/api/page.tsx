import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gate-access/ui';
import { ApiKeyTable } from '@/components/settings/api/api-key-table';
import { WebhookTable } from '@/components/settings/api/webhook-table';
import { Key, Webhook } from 'lucide-react';

export default async function APISettings() {
  const { org } = await requireAuth();
  if (!org) return null;

  const [apiKeys, webhooks] = await Promise.all([
    prisma.apiKey.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.webhook.findMany({
      where: { organizationId: org.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { status: true },
        },
      },
    }),
  ]);

  const apiKeyRows = apiKeys.map((k) => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.keyPrefix,
    scopes: k.scopes as string[],
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
    expiresAt: k.expiresAt?.toISOString() ?? null,
    createdAt: k.createdAt.toISOString(),
  }));

  const webhookRows = webhooks.map((w) => ({
    id: w.id,
    url: w.url,
    events: w.events as string[],
    isActive: w.isActive,
    createdAt: w.createdAt.toISOString(),
    deliveries: w.deliveries.map((d) => ({ status: d.status as string })),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black uppercase tracking-tight">API & Webhooks</h1>
        <p className="text-sm text-muted-foreground">
          Manage programmatic access keys and real-time event delivery endpoints.
        </p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-fit h-auto">
          <TabsTrigger
            value="api-keys"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <Key className="h-4 w-4" />
            API Keys
            {apiKeyRows.length > 0 && (
              <span className="ml-1 text-[10px] font-black bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
                {apiKeyRows.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="webhooks"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <Webhook className="h-4 w-4" />
            Webhooks
            {webhookRows.length > 0 && (
              <span className="ml-1 text-[10px] font-black bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
                {webhookRows.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <ApiKeyTable apiKeys={apiKeyRows} />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookTable webhooks={webhookRows} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
