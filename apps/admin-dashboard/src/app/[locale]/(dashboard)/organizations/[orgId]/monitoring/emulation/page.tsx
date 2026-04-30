import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { PageHeader, PageContainer, Badge } from '@gate-access/ui';

import { EmulationWizard } from '@/components/emulation/emulation-wizard';

export const metadata = { title: 'Traffic Emulation Control' };

export default async function EmulationPage(props: {
  params: Promise<{ locale: Locale; orgId?: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  return (
    <PageContainer variant="wide" className="space-y-6">
      <PageHeader
        titleClassName="italic uppercase"
        title="Traffic Emulation Hub"
        subtitle="Gaussian-mode traffic simulation and rush-hour stress testing"
        badge={
          orgId ? <Badge variant="primary">ORG: {orgId}</Badge> : undefined
        }
      />

      <div className="mt-8">
        <EmulationWizard organizationId={orgId} />
      </div>
    </PageContainer>
  );
}
