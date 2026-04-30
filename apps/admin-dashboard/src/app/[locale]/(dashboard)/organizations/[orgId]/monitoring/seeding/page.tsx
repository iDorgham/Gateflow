import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { PageHeader, PageContainer, Badge } from '@gate-access/ui';

import { SeedingClient } from '@/components/monitoring/SeedingClient';

export const metadata = { title: 'Advanced Seeding Control' };

export default async function SeedingPage(props: {
  params: Promise<{ locale: Locale; orgId?: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  return (
    <PageContainer variant="wide" className="space-y-6">
      <PageHeader
        titleClassName="italic uppercase"
        title="Advanced Seeding Control"
        subtitle="Large-scale organizational hierarchy generation and tenant setup"
        badge={
          orgId ? <Badge variant="primary">ORG: {orgId}</Badge> : undefined
        }
      />

      <SeedingClient locale={locale} orgId={orgId} />
    </PageContainer>
  );
}
