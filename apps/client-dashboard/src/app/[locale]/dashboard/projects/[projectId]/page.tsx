import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { Locale } from '@/lib/i18n';
import { prisma } from '@gate-access/db';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { ProjectDetailContent } from '@/components/dashboard/project-detail/ProjectDetailContent';

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
  const contacts = Array.from(new Map(allContacts.map((c) => [c.id, c])).values());

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
  );

  const canManageGates = hasPermission(claims, 'gates:manage');
  const coverUrl = project.coverUrl;
  const hasValidCover = coverUrl && coverUrl.startsWith('https://');

  return (
    <div className="space-y-0 -mx-4 md:-mx-8 -mt-4 md:-mt-8">
      {/* Hero Header */}
      <section className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
        {hasValidCover ? (
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#0052CC] via-[#0747A6] to-[#00214E]"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#091E42]/80 via-transparent to-transparent"
          aria-hidden
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              {project.logoUrl && (
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-4 border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
                  <Image
                    src={project.logoUrl}
                    alt={`${project.name} logo`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-md tracking-tight">
                  {project.name}
                </h1>
                {project.location && (
                  <div className="mt-2 flex items-center gap-2 text-white/80">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="text-sm font-semibold uppercase tracking-wider">{project.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page Content with Breadcrumbs */}
      <div className="px-8 -mt-6 relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-[#1D2125]/90 backdrop-blur-sm border border-[#DFE1E6] dark:border-[#343A46] rounded-full shadow-sm text-[11px] font-bold uppercase tracking-widest text-[#42526E] dark:text-[#97A0AF]">
            <Link href={`/${locale}/dashboard`} className="hover:text-[#0052CC] transition-colors">Dashboard</Link>
            <span className="text-[#A5ADBA]">/</span>
            <Link href={`/${locale}/dashboard/projects`} className="hover:text-[#0052CC] transition-colors">Projects</Link>
            <span className="text-[#A5ADBA]">/</span>
            <span className="text-[#172B4D] dark:text-white">{project.name}</span>
          </div>
        </div>

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
    </div>
  );
}
