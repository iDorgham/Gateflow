import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { PageHeader } from '@/components/page-header';
import { MonitoringClient } from '@/components/monitoring/MonitoringClient';

export const metadata = { title: 'Monitoring' };

export default async function MonitoringPage({ params: { locale } }: { params: { locale: Locale } }) {
  await requireAdmin();

  // Fetch webhook failure data server-side (static data for initial render)
  const [recentFailedDeliveries, totalWebhookFailed] = await Promise.all([
    prisma.webhookDelivery.findMany({
      where: { status: 'FAILED' },
      orderBy: { lastAttemptAt: 'desc' },
      take: 5,
      select: {
        id: true,
        event: true,
        attemptCount: true,
        lastAttemptAt: true,
        webhook: { select: { url: true, organization: { select: { name: true } } } },
      },
    }),
    prisma.webhookDelivery.count({ where: { status: 'FAILED' } }),
  ]);

  const webhookFailures = recentFailedDeliveries.map((d) => ({
    id: d.id,
    event: d.event,
    url: d.webhook.url,
    orgName: d.webhook.organization.name,
    attemptCount: d.attemptCount,
    lastAttemptAt: d.lastAttemptAt?.toISOString() ?? null,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Server Health"
        subtitle="Live platform monitoring — refreshes every 30s"
      />
      <MonitoringClient
        webhookFailures={webhookFailures}
        totalWebhookFailed={totalWebhookFailed}
        locale={locale}
      />
    </div>
  );
}
