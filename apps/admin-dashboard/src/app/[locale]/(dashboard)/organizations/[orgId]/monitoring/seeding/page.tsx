import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { PageHeader } from '@gateflow/components';
import { SeedingClient } from '@/components/monitoring/SeedingClient';

export const metadata = { title: 'Advanced Seeding Control' };

export default async function SeedingPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);

  return (
    <div className="space-y-6">
      <PageHeader
        titleClassName="italic uppercase"
        title="Advanced Seeding Control"
        subtitle="Large-scale organizational hierarchy generation and tenant setup"
      />

      <SeedingClient />
    </div>
  );
}
