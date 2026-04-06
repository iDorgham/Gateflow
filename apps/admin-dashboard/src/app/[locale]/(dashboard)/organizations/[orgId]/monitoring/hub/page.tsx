import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { PageHeader } from '@gateflow/components';
import { OpsHubClient } from '@/components/monitoring/OpsHubClient';

export const metadata = { title: 'Operational Ops Hub' };

export default async function OpsHubPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);

  return (
    <div className="space-y-6">
      <PageHeader
        titleClassName="italic uppercase"
        title="Operational Ops Hub"
        subtitle="Real-time visibility into platform-wide emulation and seeding activities"
      />

      <OpsHubClient locale={locale} />
    </div>
  );
}
