import Link from 'next/link';
import { prisma } from '@gate-access/db';
import { getTranslation, Locale } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@gateflow/ui';
import { AnimatedKpiGrid } from './animated-kpi-grid';
import { OrganizationType, getOrganizationFeatures } from '@gate-access/types';
import {
  QrCode,
  ScanLine,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  Wrench,
  GraduationCap,
  Ticket,
  GlassWater,
} from 'lucide-react';
import { DashboardEmptyState } from './dashboard-empty-state';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> =
  {
    SUCCESS: {
      bg: 'bg-[var(--ds-background-success-subtle)]',
      text: 'text-[var(--ds-text-success)]',
      dot: 'bg-[var(--ds-background-success-bold)]',
    },
    FAILED: {
      bg: 'bg-[var(--ds-background-danger-subtle)]',
      text: 'text-[var(--ds-text-danger)]',
      dot: 'bg-[var(--ds-background-danger-bold)]',
    },
    EXPIRED: {
      bg: 'bg-[var(--ds-background-warning-subtle)]',
      text: 'text-[var(--ds-text-warning)]',
      dot: 'bg-[var(--ds-background-warning-bold)]',
    },
    MAX_USES_REACHED: {
      bg: 'bg-[var(--ds-background-information-subtle)]',
      text: 'text-[var(--ds-text-information)]',
      dot: 'bg-[var(--ds-background-information-bold)]',
    },
    INACTIVE: {
      bg: 'bg-[var(--ds-background-neutral-subtle)]',
      text: 'text-[var(--ds-text-subtlest)]',
      dot: 'bg-[var(--ds-icon-subtle)]',
    },
    DENIED: {
      bg: 'bg-[var(--ds-background-danger-subtle)]',
      text: 'text-[var(--ds-text-danger)]',
      dot: 'bg-[var(--ds-background-danger-bold)]',
    },
  };

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export async function DashboardOverview({
  locale,
  orgId,
  orgType = OrganizationType.REAL_ESTATE,
}: {
  locale: Locale;
  orgId: string;
  orgType?: OrganizationType;
}) {
  const { t } = await getTranslation(locale, 'dashboard');
  const features = getOrganizationFeatures(orgType);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Common data for all orgs
  const [
    totalQRs,
    scansToday,
    activeGates,
    teamSize,
    recentScans,
    topGatesData,
    maintenanceStats,
  ] = (await Promise.all([
    prisma.qRCode.count({
      where: { organizationId: orgId, isActive: true, deletedAt: null },
    }),
    prisma.scanLog.count({
      where: {
        qrCode: { organizationId: orgId, deletedAt: null },
        scannedAt: { gte: todayStart },
      },
    }),
    prisma.gate.count({
      where: { organizationId: orgId, isActive: true, deletedAt: null },
    }),
    prisma.user.count({ where: { organizationId: orgId, deletedAt: null } }),
    prisma.scanLog.findMany({
      where: { qrCode: { organizationId: orgId, deletedAt: null } },
      orderBy: { scannedAt: 'desc' },
      take: 8,
      include: {
        qrCode: { select: { code: true, type: true } },
        gate: { select: { name: true } },
      },
    }),
    // Top gates data
    prisma.scanLog.groupBy({
      by: ['gateId'],
      where: { qrCode: { organizationId: orgId, deletedAt: null } },
      _count: { _all: true },
      // '_all' isn't a valid orderBy key in this Prisma version's generated
      // types (only '_count: { _all: true }' selection is). Order by gateId
      // instead — equivalent since it's the non-null group-by key.
      orderBy: { _count: { gateId: 'desc' } },
      take: 5,
    }),
    // Maintenance stats
    prisma.workOrder.groupBy({
      by: ['status'],
      where: { organizationId: orgId, deletedAt: null },
      _count: { _all: true },
    }),
  ])) as [number, number, number, number, any[], any[], any[]];

  const gateIds = (topGatesData as any[]).map((g) => g.gateId).filter(Boolean);
  const gateNames = await prisma.gate.findMany({
    where: {
      id: { in: gateIds },
      organizationId: orgId,
      deletedAt: null,
    },
    select: { id: true, name: true },
  });

  const topGates = (topGatesData as any[]).map((g) => ({
    name: gateNames.find((gn) => gn.id === g.gateId)?.name || 'Unknown',
    scans: g._count._all,
  }));

  // Conditional data based on features
  let residentsCount = 0;
  let maintenanceCount = 0;

  if (
    features.sidebar.visibleCapabilities.includes('contacts') ||
    features.sidebar.visibleCapabilities.includes('units')
  ) {
    residentsCount = await prisma.unit.count({
      where: { organizationId: orgId, userId: { not: null }, deletedAt: null },
    });
  }

  if (features.flags.maintenanceModule) {
    maintenanceCount = await prisma.workOrder.count({
      where: {
        organizationId: orgId,
        status: { notIn: ['RESOLVED', 'CLOSED', 'CANCELLED'] },
        deletedAt: null,
      },
    });
  }

  const KPI_REGISTRY: Record<string, any> = {
    'total-scans': {
      title: t('overview.scansToday', { defaultValue: 'Scans Today' }),
      value: scansToday,
      sub: t('overview.sub.scansToday', { defaultValue: 'Last 24 hours' }),
      icon: <ScanLine className="h-4 w-4 text-success" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/scans`,
      iconBg: 'bg-success/10',
      valueColor: 'text-success',
    },
    'active-qr': {
      title: t('overview.activeQRs', { defaultValue: 'Active QR Codes' }),
      value: totalQRs,
      sub: t('overview.sub.activeQRs', { defaultValue: 'Across all gates' }),
      icon: <QrCode className="h-4 w-4 text-primary" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/qrcodes`,
      iconBg: 'bg-primary/10',
      valueColor: 'text-primary',
    },
    'active-gates': {
      title: t('overview.activeGates', { defaultValue: 'Active Gates' }),
      value: activeGates,
      sub: t('overview.sub.activeGates', {
        defaultValue: 'Currently operational',
      }),
      icon: <Shield className="h-4 w-4 text-chart-2" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/gates`,
      iconBg: 'bg-chart-2/10',
      valueColor: 'text-chart-2',
    },
    'team-members': {
      title: t('overview.teamMembers', { defaultValue: 'Team Members' }),
      value: teamSize,
      sub: t('overview.sub.teamMembers', {
        defaultValue: 'In your organization',
      }),
      icon: <Users className="h-4 w-4 text-warning" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/team`,
      iconBg: 'bg-warning/10',
      valueColor: 'text-warning',
    },
    'active-residents': {
      title: t(features.terminology.contactLabelPlural, {
        defaultValue: 'Residents',
      }),
      value: residentsCount,
      sub: t('overview.sub.activeResidents', {
        defaultValue: 'With linked units',
      }),
      icon: <Users className="h-4 w-4 text-indigo-500" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/residents/contacts`,
      iconBg: 'bg-indigo-500/10',
      valueColor: 'text-indigo-500',
    },
    'active-students': {
      title: t('orgType.school.contactLabelPlural', {
        defaultValue: 'Students',
      }),
      value: residentsCount,
      sub: t('overview.sub.activeStudents', { defaultValue: 'Enrolled' }),
      icon: <Users className="h-4 w-4 text-indigo-500" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/residents/contacts`,
      iconBg: 'bg-indigo-500/10',
      valueColor: 'text-indigo-500',
    },
    'open-maintenance': {
      title: t('overview.openMaintenance', { defaultValue: 'Open Requests' }),
      value: maintenanceCount,
      sub: t('overview.sub.openMaintenance', {
        defaultValue: 'Pending action',
      }),
      icon: <Wrench className="h-4 w-4 text-orange-500" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/maintenance`,
      iconBg: 'bg-orange-500/10',
      valueColor: 'text-orange-500',
    },
    'security-incidents': {
      title: t('overview.securityIncidents', { defaultValue: 'Incidents' }),
      value: 0, // Mock for now
      sub: t('overview.sub.securityIncidents', {
        defaultValue: 'Requires attention',
      }),
      icon: <Shield className="h-4 w-4 text-red-500" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/team/incidents`,
      iconBg: 'bg-red-500/10',
      valueColor: 'text-red-500',
    },
    'current-capacity': {
      title: t('overview.currentCapacity', {
        defaultValue: 'Current Capacity',
      }),
      value: 0, // Mock for now
      sub: t('overview.sub.currentCapacity', {
        defaultValue: 'Live occupancy',
      }),
      icon: <Users className="h-4 w-4 text-pink-500" aria-hidden="true" />,
      href: `/dashboard/organizations/${orgId}/analytics`,
      iconBg: 'bg-pink-500/10',
      valueColor: 'text-pink-500',
    },
  };

  const STAT_CARDS = features.dashboard.kpiIds
    .map((id) => KPI_REGISTRY[id])
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t(features.terminology.orgLabel, { defaultValue: 'Dashboard' })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(locale, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href={`/dashboard/organizations/${orgId}/qrcodes/create`}>
            <Plus className="me-1.5 h-4 w-4" aria-hidden="true" />
            {t('overview.createQr', { defaultValue: 'Create QR Code' })}
          </Link>
        </Button>
      </div>

      <AnimatedKpiGrid cards={STAT_CARDS} />

      <div className="grid gap-6">
        {features.dashboard.chartIds.map((chartId) => {
          if (chartId === 'recent-activity') {
            return (
              <Card
                key={chartId}
                className="border border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-surface-raised,#FFFFFF)] bg-background shadow-[0_1px_1px_rgba(9,30,66,0.08),0_0_1px_rgba(9,30,66,0.08)]"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        className="h-4 w-4 text-slate-400"
                        aria-hidden="true"
                      />
                      <CardTitle className="text-base">
                        {t('overview.recentActivity', {
                          defaultValue: 'Recent Scan Activity',
                        })}
                      </CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/organizations/${orgId}/scans`}
                        className="text-primary hover:text-primary/80"
                      >
                        {t('overview.viewAll', { defaultValue: 'View all' })}
                        <ArrowRight
                          className="ms-1 h-3.5 w-3.5 rtl:rotate-180"
                          aria-hidden="true"
                        />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {recentScans.length === 0 ? (
                    <DashboardEmptyState
                      orgType={orgType}
                      orgId={orgId}
                      t={t}
                    />
                  ) : (
                    <div
                      className="divide-y divide-border"
                      role="list"
                      aria-label="Recent scans"
                    >
                      {recentScans.map((scan) => {
                        const style =
                          STATUS_COLORS[scan.status] ?? STATUS_COLORS.INACTIVE;
                        return (
                          <div
                            key={scan.id}
                            role="listitem"
                            className="flex items-center justify-between gap-3 py-3 text-sm"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={cn(
                                  'h-2 w-2 shrink-0 rounded-full',
                                  style.dot
                                )}
                                aria-hidden="true"
                              />
                              <span
                                className={cn(
                                  'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                                  style.bg,
                                  style.text
                                )}
                              >
                                {t(`overview.scanStatus.${scan.status}`, {
                                  defaultValue: scan.status.replace(/_/g, ' '),
                                })}
                              </span>
                              <span
                                className="truncate font-mono text-xs text-muted-foreground"
                                title={scan.qrCode?.code}
                              >
                                {scan.qrCode?.code?.slice(0, 18)}…
                              </span>
                              {scan.gate?.name && (
                                <span className="hidden truncate text-muted-foreground sm:block">
                                  @ {scan.gate.name}
                                </span>
                              )}
                            </div>
                            <time
                              className="shrink-0 text-xs text-muted-foreground"
                              dateTime={new Date(scan.scannedAt).toISOString()}
                            >
                              {new Date(scan.scannedAt).toLocaleTimeString(
                                locale,
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </time>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          }

          if (chartId === 'scans-by-gate' && topGates.length > 0) {
            return (
              <Card
                key={chartId}
                className="border border-[var(--ds-border)] bg-background"
              >
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('analytics.topGates', { defaultValue: 'Top Gates' })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topGates.map((gate) => (
                      <div key={gate.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">{gate.name}</span>
                          <span className="text-muted-foreground">
                            {gate.scans} scans
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${Math.min(100, (gate.scans / (topGates[0]?.scans || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }

          if (chartId === 'maintenance-status' && maintenanceStats.length > 0) {
            return (
              <Card
                key={chartId}
                className="border border-[var(--ds-border)] bg-background"
              >
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('maintenance.statusTitle', {
                      defaultValue: 'Maintenance Requests',
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {maintenanceStats.map((stat) => (
                      <div
                        key={stat.status}
                        className="rounded-lg border bg-muted/30 p-3"
                      >
                        <div className="text-xs font-medium text-muted-foreground uppercase">
                          {t(`maintenance.status.${stat.status}`, {
                            defaultValue: stat.status,
                          })}
                        </div>
                        <div className="mt-1 text-2xl font-bold">
                          {stat._count._all}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }

          // Fallback for missing charts in this phase
          return null;
        })}

        {/* If no charts defined, show recent scans as default */}
        {features.dashboard.chartIds.length === 0 && (
          <Card className="border border-[var(--ds-border)] bg-background">
            <CardContent className="pt-6">
              <DashboardEmptyState orgType={orgType} orgId={orgId} t={t} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
