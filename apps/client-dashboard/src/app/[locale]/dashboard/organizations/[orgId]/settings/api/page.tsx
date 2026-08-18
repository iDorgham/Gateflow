import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gateflow/ui';
import { ApiKeyTable } from '@/components/settings/api/api-key-table';
import { WebhookTable } from '@/components/settings/api/webhook-table';
import { Key, Webhook } from 'lucide-react';
import {
  SETTINGS_TAB_TRIGGER,
  SETTINGS_TABS_LIST,
} from '@/components/settings/settings-section-header';

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
      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className={SETTINGS_TABS_LIST}>
          <TabsTrigger value="api-keys" className={SETTINGS_TAB_TRIGGER}>
            <Key className="h-4 w-4" strokeWidth={1.5} />
            API Keys
            {apiKeyRows.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {apiKeyRows.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="webhooks" className={SETTINGS_TAB_TRIGGER}>
            <Webhook className="h-4 w-4" strokeWidth={1.5} />
            Webhooks
            {webhookRows.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
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
