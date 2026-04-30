import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { PageHeader, PageContainer } from '@gate-access/ui';
import { EmulationWizard } from '@/components/emulation/emulation-wizard';

export const metadata = { title: 'Traffic Emulation Control' };

export default async function EmulationPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);

  return (
    <PageContainer variant="wide" className="space-y-6">
      <PageHeader
        titleClassName="italic uppercase"
        title="Traffic Emulation Hub"
        subtitle="Gaussian-mode traffic simulation and rush-hour stress testing"
      />

      <div className="mt-8">
        <EmulationWizard />
      </div>
    </PageContainer>
  );
}
