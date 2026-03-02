import { getSessionClaims } from '@/lib/auth-cookies';
import { getTranslation, Locale } from '@/lib/i18n';
import { prisma } from '@gate-access/db';
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gate-access/ui';
import { redirect, notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Users, QrCode, DoorOpen, ScrollText, Shield } from 'lucide-react';
import Link from 'next/link';

const SCAN_STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'bg-success/20 text-success',
  FAILED: 'bg-destructive/20 text-destructive',
  EXPIRED: 'bg-warning/20 text-warning',
  MAX_USES_REACHED: 'bg-warning/20 text-warning',
  INACTIVE: 'bg-muted text-muted-foreground',
  DENIED: 'bg-destructive/20 text-destructive',
};

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

  const teamUsers = Array.from(
    new Map(
      project.gates.flatMap((g) =>
        g.gateAssignments.map((a) => [a.user.id, a.user])
      )
    ).values()
  );

  const coverUrl = project.coverUrl;
  const hasValidCover = coverUrl && coverUrl.startsWith('https://');

  return (
    <div className="space-y-0 -mx-4 md:-mx-8 -mt-4 md:-mt-8">
      {/* Hero */}
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

      <div className="p-4 md:p-8 space-y-6">
        {/* Description */}
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

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-card rounded-xl shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{aggregates.contactsCount}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('projectDetail.contacts', 'Contacts')}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card rounded-xl shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-2/20 text-chart-2">
                <DoorOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {aggregates.unitTypes.length}
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('projectDetail.unitTypes', 'Unit types')}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card rounded-xl shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/20 text-success">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{aggregates.qrCount}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('projectDetail.qrCodes', 'QR Codes')}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card rounded-xl shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info/20 text-info">
                <ScrollText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">
                  {aggregates.access30d}
                </p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('projectDetail.access30d', 'Access (30d)')}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  1d: {aggregates.access1d} · 7d: {aggregates.access7d}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gates + Team + Shift placeholder row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gates */}
          <Card className="border border-border bg-card rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold text-foreground">
                {t('projectDetail.gates', 'Gates')}
              </h2>
            </CardHeader>
            <CardContent className="pt-0">
              {project.gates.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('projectDetail.noGates', 'No gates')}
                </p>
              ) : (
                <ul className="space-y-3">
                  {project.gates.map((gate) => (
                    <li
                      key={gate.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2"
                    >
                      <div>
                        <p className="font-medium text-foreground">{gate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('projectDetail.lastAccess', 'Last access')}:{' '}
                          {gate.lastAccessedAt
                            ? new Date(gate.lastAccessedAt).toLocaleString(locale)
                            : '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[10px] ${
                            gate.isActive
                              ? 'bg-success/20 text-success border-success/30'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {gate.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {gate._count.qrCodes} QR
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Team */}
          <Card className="border border-border bg-card rounded-xl shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {t('projectDetail.team', 'Team')}
              </h2>
              <Link
                href={`/${locale}/dashboard/team/gate-assignments?project=${projectId}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                Manage
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {teamUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('projectDetail.noTeam', 'No team assigned')}
                </p>
              ) : (
                <ul className="space-y-2">
                  {teamUsers.map((user) => (
                    <li
                      key={user.id}
                      className="text-sm text-foreground"
                    >
                      <span className="font-medium">{user.name ?? '—'}</span>
                      {user.email && (
                        <span className="text-muted-foreground ml-1">({user.email})</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Shift placeholder */}
          <Card className="border border-border bg-card rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold text-foreground">
                {t('projectDetail.shiftStatus', 'Shift status')}
              </h2>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5 shrink-0" />
                <span>{t('projectDetail.shiftPlaceholder', '—')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gate logs */}
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-foreground">
              {t('projectDetail.gateLogs', 'Recent access logs')}
            </h2>
          </CardHeader>
          <CardContent className="pt-0">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                {t('projectDetail.noLogs', 'No scans yet')}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">Gate</TableHead>
                    <TableHead className="text-muted-foreground">QR Code</TableHead>
                    <TableHead className="text-muted-foreground">Time</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-foreground">
                        {log.gate.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.qrCode.code?.slice(0, 16)}…
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(log.scannedAt).toLocaleString(locale)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] ${
                            SCAN_STATUS_STYLES[log.status] ?? 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {t(`overview.scanStatus.${log.status}`, {
                            defaultValue: log.status.replace(/_/g, ' '),
                          })}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
