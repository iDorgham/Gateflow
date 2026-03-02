import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect, notFound } from 'next/navigation';
import { Locale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; projectId: string };
}) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) return { title: 'Project | GateFlow' };

  const project = await prisma.project.findFirst({
    where: { id: params.projectId, organizationId: claims.orgId, deletedAt: null },
    select: { name: true },
  });
  return { title: project ? `${project.name} | GateFlow` : 'Project | GateFlow' };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: Locale; projectId: string };
}) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const { projectId } = params;
  const orgId = claims.orgId;

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [project, scans1d, scans7d, scans30d, recentLogs] = await Promise.all([
    prisma.project.findFirst({
      where: { id: projectId, organizationId: orgId, deletedAt: null },
      include: {
        gates: {
          where: { deletedAt: null },
          include: {
            _count: { select: { scanLogs: true, qrCodes: true } },
            gateAssignments: {
              where: { deletedAt: null },
              include: { user: { select: { id: true, name: true, email: true } } },
            },
          },
        },
        units: {
          where: { deletedAt: null },
          include: { contacts: { select: { contactId: true } } },
        },
        qrCodes: { where: { deletedAt: null }, select: { id: true } },
      },
    }),
    prisma.scanLog.count({
      where: { gate: { projectId, organizationId: orgId }, scannedAt: { gte: oneDayAgo } },
    }),
    prisma.scanLog.count({
      where: { gate: { projectId, organizationId: orgId }, scannedAt: { gte: sevenDaysAgo } },
    }),
    prisma.scanLog.count({
      where: { gate: { projectId, organizationId: orgId }, scannedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.scanLog.findMany({
      where: { gate: { projectId, organizationId: orgId } },
      orderBy: { scannedAt: 'desc' },
      take: 20,
      include: {
        gate: { select: { id: true, name: true } },
        qrCode: { select: { id: true, code: true } },
      },
    }),
  ]);

  if (!project) notFound();

  const uniqueContacts = new Set(
    project.units.flatMap((u) => u.contacts.map((c) => c.contactId))
  );
  const unitTypes = [...new Set(project.units.map((u) => u.type))];

  const aggregates = {
    contactsCount: uniqueContacts.size,
    unitTypes,
    qrCount: project.qrCodes.length,
    access1d: scans1d,
    access7d: scans7d,
    access30d: scans30d,
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
      <p className="text-sm text-muted-foreground">Phase 1 data layer — minimal UI</p>
      <pre className="rounded-lg bg-muted/30 p-4 text-xs overflow-auto max-h-96">
        {JSON.stringify(
          {
            project: { id: project.id, name: project.name, location: project.location },
            gatesCount: project.gates.length,
            unitsCount: project.units.length,
            aggregates,
            recentLogsCount: recentLogs.length,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
