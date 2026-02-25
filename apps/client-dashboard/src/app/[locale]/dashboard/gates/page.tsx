import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { getTranslation, Locale } from '@/lib/i18n';
import { AutoRefresh, GatesList } from './gate-client';
import type { GateWithStats } from './gate-client';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const { t } = await getTranslation(params.locale, 'dashboard');
  return { title: t('gates.title', { defaultValue: 'Gates' }) };
}

export default async function GatesPage({ params }: { params: { locale: Locale } }) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const { t } = await getTranslation(params.locale, 'dashboard');
  const orgId = claims.orgId;
  const projectId = await getValidatedProjectId(orgId);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const gateFilter = projectId
    ? { organizationId: orgId, projectId, deletedAt: null as null }
    : { organizationId: orgId, deletedAt: null as null };

  const [gates, scansTodayGroups] = await Promise.all([
    prisma.gate.findMany({
      where: gateFilter,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { qrCodes: true, scanLogs: true } },
        project: { select: { name: true } },
      },
    }),
    prisma.scanLog.groupBy({
      by: ['gateId'],
      where: {
        gate: { organizationId: orgId },
        scannedAt: { gte: todayStart },
      },
      _count: true,
    }),
  ]);

  const scansTodayMap = new Map(scansTodayGroups.map((g) => [g.gateId, g._count]));

  const isAllProjects = projectId === null;

  const gatesWithStats: GateWithStats[] = gates.map((gate) => ({
    id: gate.id,
    name: gate.name,
    location: gate.location,
    isActive: gate.isActive,
    lastAccessedAt: gate.lastAccessedAt,
    scansToday: scansTodayMap.get(gate.id) ?? 0,
    isActiveToday: gate.lastAccessedAt != null && gate.lastAccessedAt >= todayStart,
    _count: gate._count,
    projectName: gate.project?.name ?? null,
  }));

  return (
    <div className="space-y-6">
      {/* Auto-refresh — fires router.refresh() every 30 s */}
      <AutoRefresh />

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('gates.title', { defaultValue: 'Gates' })}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('gates.description', { defaultValue: 'Manage physical and logical access points for your organisation.' })}
        </p>
      </div>

      {/* Gate list (client component for modals + state) */}
      <GatesList gates={gatesWithStats} orgId={orgId} isAllProjects={isAllProjects} />
    </div>
  );
}
