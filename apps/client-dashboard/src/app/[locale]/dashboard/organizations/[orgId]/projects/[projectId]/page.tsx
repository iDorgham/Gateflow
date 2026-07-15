import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { Locale } from '@/lib/i18n';
import { prisma } from '@gate-access/db';
import { redirect, notFound } from 'next/navigation';
import { ProjectDetailContent } from '@/components/dashboard/project-detail/ProjectDetailContent';
import { ProjectHero } from '@/components/projects/ProjectHero';
import { ProjectKpiCards } from '@/components/projects/ProjectKpiCards';

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale; projectId: string }>;
  }
) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.orgId) return { title: 'Project | GateFlow' };

  const project = await prisma.project.findFirst({
    where: { id: params.projectId, organizationId: claims.orgId, deletedAt: null },
    select: { name: true },
  });
  return { title: project ? `${project.name} | GateFlow` : 'Project | GateFlow' };
}

export default async function ProjectDetailPage(
  props: {
    params: Promise<{ locale: Locale; projectId: string }>;
  }
) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const { projectId, locale } = params;
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
          include: { 
            contacts: { 
              include: { 
                contact: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    avatarUrl: true,
                  }
                }
              }
            } 
          },
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

  const allContacts = project.units.flatMap((u) => 
    u.contacts.map((c) => ({
      ...c.contact,
      name: `${c.contact.firstName} ${c.contact.lastName}`,
    }))
  );
  const contacts = Array.from(new Map(allContacts.map((c) => [c.id, c])).values()) as {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
  }[];

  const units = project.units.map(u => ({
    id: u.id,
    name: u.name,
    type: u.type,
    building: u.building,
    contactsCount: u.contacts.length,
  }));

  const aggregates = {
    contactsCount: contacts.length,
    qrCount: project.qrCodes.length,
    access1d: scans1d,
    access7d: scans7d,
    access30d: scans30d,
  };

  const teamUsers = Array.from(
    new Map(
      project.gates.flatMap((g) =>
        g.gateAssignments.map((a) => [a.user.id, a.user])
      )
    ).values()
  ) as { id: string; name: string | null; email: string }[];

  const canManageGates = hasPermission(claims, 'gates:manage');

  return (
    <div className="space-y-8">
      {/* Project Command Center Hero */}
      <ProjectHero project={project} />

      {/* Primary KPI Metrics */}
      <ProjectKpiCards 
        metrics={{
          contactsCount: contacts.length,
          unitsCount: units.length,
          activeQrs: project.qrCodes.length,
          scanVolume: scans7d,
          scanGrowth: 0, // Fallback for now, can be calculated or fetched from new helper
        }} 
      />

      <ProjectDetailContent
        project={{
          id: project.id,
          name: project.name,
          description: project.description,
          location: project.location,
          logoUrl: project.logoUrl,
          coverUrl: project.coverUrl,
          website: project.website,
          externalUrl: project.externalUrl,
          galleryJson: project.galleryJson as string[] | null,
          gateMode: project.gateMode,
        }}
        gates={project.gates}
        units={units}
        contacts={contacts}
        aggregates={{
            ...aggregates,
            unitTypes: Array.from(new Set(units.map(u => u.type))),
        }}
        teamUsers={teamUsers}
        recentLogs={recentLogs}
        locale={locale}
        canManageGates={canManageGates}
      />
    </div>
  );
}
