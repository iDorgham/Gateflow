import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { PageHeader, PageContainer, Badge } from '@gate-access/ui';

import { OpsHubClient } from '@/components/monitoring/OpsHubClient';

export const metadata = { title: 'Operational Ops Hub' };

export default async function OpsHubPage(props: {
  params: Promise<{ locale: Locale; orgId?: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  return (
    <PageContainer variant="wide" className="space-y-6">
      <PageHeader
        titleClassName="italic uppercase"
        title="Operational Ops Hub"
        subtitle="Real-time visibility into platform-wide emulation and seeding activities"
        badge={
          orgId ? <Badge variant="primary">ORG: {orgId}</Badge> : undefined
        }
      />

      <OpsHubClient locale={locale} organizationId={orgId} />
    </PageContainer>
  );
}
