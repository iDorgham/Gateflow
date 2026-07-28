import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { getTranslation, Locale } from '@/lib/i18n';
import { WorkspacePageLayout } from '@/components/dashboard/workspace-page-layout';
import { IncidentsClient } from './incidents-client';

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('incidents.title', { defaultValue: 'Incidents' }) };
}

export default async function IncidentsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect(`/${params.locale}/login`);
  if (!hasPermission(claims, 'gates:manage')) {
    redirect(`/${params.locale}/dashboard`);
  }

  const { t } = await getTranslation(params.locale, 'dashboard');

  return (
    <WorkspacePageLayout
      header={
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ds-text)]">
            {t('incidents.title', { defaultValue: 'Incidents' })}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            {t('incidents.description', {
              defaultValue:
                'Security incidents from watchlist matches or manual reports. Filter and update status.',
            })}
          </p>
        </div>
      }
    >
      <IncidentsClient />
    </WorkspacePageLayout>
  );
}
