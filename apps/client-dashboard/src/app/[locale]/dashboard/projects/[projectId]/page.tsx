import { getSessionClaims } from '@/lib/auth-cookies';
import { getTranslation, Locale } from '@/lib/i18n';
import { prisma } from '@gate-access/db';
import { Card, CardContent, CardHeader } from '@gate-access/ui';
import { redirect, notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

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
  const { t } = await getTranslation(locale, 'dashboard');

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
  // Phase 3 will render aggregates + recentLogs (KPIs, gate logs)
  void { aggregates, recentLogs };

  const coverUrl = project.coverUrl;
  const hasValidCover = coverUrl && coverUrl.startsWith('https://');

  return (
    <div className="space-y-0 -mx-4 md:-mx-8 -mt-4 md:-mt-8">
      {/* Hero — full-width, distinct from settings tab cards */}
      <section className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden">
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
            className="absolute inset-0 bg-gradient-to-br from-primary/15 via-muted/50 to-primary/10"
            aria-hidden
          />
        )}
        {/* Overlay for text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground drop-shadow-sm">
            {project.name}
          </h1>
          {project.location && (
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-sm font-medium">{project.location}</span>
            </div>
          )}
        </div>
      </section>

      {/* Content — padded, below hero */}
      <div className="p-4 md:p-8 space-y-6">
        {/* Description — Card, distinct from settings form UI */}
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-foreground">
              {t('projectDetail.about', 'About')}
            </h2>
          </CardHeader>
          <CardContent className="pt-0">
            {project.description ? (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {t('projectDetail.noDescription', 'No description yet.')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
