import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { getTranslation, Locale } from '@/lib/i18n';
import { IncidentsClient } from './incidents-client';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('incidents.title', { defaultValue: 'Incidents' }) };
}

export default async function IncidentsPage({ params }: { params: { locale: Locale } }) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect(`/${params.locale}/login`);
  if (!hasPermission(claims, 'gates:manage')) {
    redirect(`/${params.locale}/dashboard`);
  }

  const { t } = await getTranslation(params.locale, 'dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('incidents.title', { defaultValue: 'Incidents' })}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('incidents.description', { defaultValue: 'Security incidents from watchlist matches or manual reports. Filter and update status.' })}
        </p>
      </div>
      <IncidentsClient />
    </div>
  );
}
