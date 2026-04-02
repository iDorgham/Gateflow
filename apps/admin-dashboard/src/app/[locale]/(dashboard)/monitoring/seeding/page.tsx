import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import type { Locale } from '@/lib/i18n/i18n-config';
import { PageHeader, Badge } from '@gate-access/ui';
import { Database } from 'lucide-react';
import { SeedingHub } from '@/components/emulation/seeding-hub';

export const metadata = { title: 'Seeding Hub' };

export default async function SeedingPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  return (
    <div className="space-y-6">
      <PageHeader
        titleClassName="italic uppercase"
        title={t('monitoring.title')}
        subtitle={t('monitoring.subtitle')}
        badge={
          <Badge
            variant="primary"
            className="bg-ds-background-selected text-ds-text-selected border-ds-border-selected/30 font-bold text-xs px-2.5 py-1 flex items-center gap-1.5"
          >
            <Database className="h-3 w-3" />
            SEEDING
          </Badge>
        }
      />

      <SeedingHub />
    </div>
  );
}
