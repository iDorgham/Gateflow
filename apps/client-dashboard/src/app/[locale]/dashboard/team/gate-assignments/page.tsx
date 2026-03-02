import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { getTranslation, Locale } from '@/lib/i18n';
import { GateAssignmentsClient } from './gate-assignments-client';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('gateAssignments.title', { defaultValue: 'Gate assignments' }) };
}

export default async function GateAssignmentsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { project?: string };
}) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect(`/${params.locale}/login`);
  if (!hasPermission(claims, 'gates:manage')) {
    redirect(`/${params.locale}/dashboard`);
  }

  const { t } = await getTranslation(params.locale, 'dashboard');
  const projectId = searchParams?.project ?? undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('gateAssignments.title', { defaultValue: 'Gate assignments' })}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('gateAssignments.description', { defaultValue: 'Assign team members to specific gates so they can scan only at those gates.' })}
        </p>
      </div>
      <GateAssignmentsClient projectId={projectId} />
    </div>
  );
}
