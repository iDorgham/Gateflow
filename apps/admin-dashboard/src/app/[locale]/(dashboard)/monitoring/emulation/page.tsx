import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { PageHeader, Badge } from '@gate-access/ui';
import { EmulationWizard } from '@/components/emulation/emulation-wizard';
import { Zap } from 'lucide-react';

export const metadata = { title: 'Traffic Emulation' };

export default async function EmulationPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'dashboard');

  return (
    <div className="space-y-6">
      <PageHeader
        titleClassName="italic uppercase"
        title={t('emulation.title')}
        subtitle={t('emulation.subtitle')}
        badge={
          <Badge
            variant="warning"
            className="bg-ds-background-warning text-ds-text-warning border-ds-border-warning/30 font-bold text-xs px-2.5 py-1 flex items-center gap-1.5"
          >
            <Zap className="h-3 w-3" />
            ADVANCED SEEDING
          </Badge>
        }
      />

      <EmulationWizard />
    </div>
  );
}
