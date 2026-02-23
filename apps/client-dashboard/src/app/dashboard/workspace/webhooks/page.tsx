import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { WebhooksClient } from './webhook-client';
import type { WebhookRow } from './webhook-client';

export const metadata = { title: 'Webhooks' };

export default async function WebhooksPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const webhooks = await prisma.webhook.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      url: true,
      events: true,
      isActive: true,
      createdAt: true,
      deliveries: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          event: true,
          status: true,
          statusCode: true,
          attemptCount: true,
          lastAttemptAt: true,
          createdAt: true,
        },
      },
    },
  });

  // Serialize Date objects to ISO strings for the client component
  const rows: WebhookRow[] = webhooks.map((wh) => ({
    id: wh.id,
    url: wh.url,
    events: wh.events as WebhookRow['events'],
    isActive: wh.isActive,
    createdAt: wh.createdAt.toISOString(),
    deliveries: wh.deliveries.map((d) => ({
      id: d.id,
      event: d.event,
      status: d.status as WebhookRow['deliveries'][number]['status'],
      statusCode: d.statusCode,
      attemptCount: d.attemptCount,
      lastAttemptAt: d.lastAttemptAt?.toISOString() ?? null,
      createdAt: d.createdAt.toISOString(),
    })),
  }));

  return (
    <WebhooksClient initialWebhooks={rows} />
  );
}
