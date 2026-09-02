import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { Activity } from 'lucide-react';
import { AICostPanel } from '@/components/observability/AICostPanel';
import { IntegrationHealthPanel } from '@/components/observability/IntegrationHealthPanel';

export const metadata = {
  title: 'Observability | Integration Health & AI Cost',
};

export default async function ObservabilityPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);

  return (
    <div className="p-1 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Activity className="h-8 w-8 text-ds-icon-brand" />
            Platform Observability
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Integration health & global AI cost analytics
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <AICostPanel />
        <IntegrationHealthPanel />
      </div>
    </div>
  );
}
