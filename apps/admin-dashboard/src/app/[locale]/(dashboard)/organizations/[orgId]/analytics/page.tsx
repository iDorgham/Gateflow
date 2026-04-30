import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  QrCode,
  Building2,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  cn,
  PageHeader,
} from '@gate-access/ui';
import { ScanTrendChart } from '@/components/analytics/ScanTrendChart';
import { OrgGrowthChart } from '@/components/analytics/OrgGrowthChart';
import { PlanDistributionChart } from '@/components/analytics/PlanDistributionChart';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Organization Analytics' };

export default async function ScopedAnalyticsPage(props: {
  params: Promise<{ locale: Locale; orgId: string }>;
}) {
  const params = await props.params;
  const { locale, orgId } = params;

  await requireAdmin(locale);

  // Verify organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: orgId, deletedAt: null },
    select: { name: true },
  });

  if (!organization) {
    notFound();
  }

  const { t } = await getTranslation(locale, 'admin');

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);

  // ── 14-day daily scan trend (Scoped) ───────────────────────────────────────
  const scanTrendData = await Promise.all(
    Array.from({ length: 14 }, async (_, i) => {
      const day = new Date(now);
      day.setDate(day.getDate() - 13 + i);
      day.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await prisma.scanLog.count({
        where: {
          scannedAt: { gte: day, lte: dayEnd },
          gate: { organizationId: orgId },
        },
      });
      return {
        label: day.toLocaleDateString(locale, {
          month: 'short',
          day: 'numeric',
        }),
        count,
      };
    })
  );

  // ── Status breakdown (30 days, Scoped) ────────────────────────────────────
  const statusGroups = await prisma.scanLog.groupBy({
    by: ['status'],
    where: {
      scannedAt: { gte: thirtyDaysAgo },
      gate: { organizationId: orgId },
    },
    _count: { id: true },
  });
  const statusMap = Object.fromEntries(
    statusGroups.map((s) => [s.status, s._count.id])
  );
  const totalScans30 = statusGroups.reduce((a, b) => a + b._count.id, 0);

  // ── KPI summary (Scoped) ──────────────────────────────────────────────────
  const [totalUsersCount, totalQRCount] = await Promise.all([
    prisma.user.count({
      where: {
        deletedAt: null,
        role: { organizationId: orgId },
      },
    }),
    prisma.qRCode.count({
      where: {
        deletedAt: null,
        organizationId: orgId,
      },
    }),
  ]);

  const statusInfo: Record<string, any> = {
    SUCCESS: {
      label: t('analytics.statusSuccess'),
      color: 'text-emerald-600 bg-emerald-500/10',
      icon: CheckCircle2,
    },
    DENIED: {
      label: t('analytics.statusDenied'),
      color: 'text-red-600 bg-red-500/10',
      icon: XCircle,
    },
    FAILED: {
      label: t('analytics.statusFailed'),
      color: 'text-amber-600 bg-amber-500/10',
      icon: AlertCircle,
    },
    EXPIRED: {
      label: t('analytics.statusExpired'),
      color: 'text-blue-600 bg-blue-500/10',
      icon: Clock,
    },
    MAX_USES_REACHED: {
      label: t('analytics.statusMaxUses'),
      color: 'text-violet-600 bg-violet-500/10',
      icon: AlertCircle,
    },
    INACTIVE: {
      label: t('analytics.statusInactive'),
      color: 'text-slate-600 bg-slate-500/10',
      icon: XCircle,
    },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={organization.name}
        subtitle="Real-time performance and usage monitoring for this organization."
        badge={
          <Badge variant="primary" className="italic font-black">
            ORGANIZATION SCOPE
          </Badge>
        }
      />

      {/* KPI summary row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: t('analytics.users'),
            value: totalUsersCount,
            sub: 'Org Members',
            color: 'text-violet-600',
            bg: 'bg-violet-500/10',
            icon: Users,
          },
          {
            label: t('analytics.qrCodes'),
            value: totalQRCount,
            sub: 'Active QR Keys',
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
            icon: QrCode,
          },
          {
            label: t('analytics.scans30d'),
            value: totalScans30,
            sub: t('analytics.last30Days'),
            color: 'text-amber-600',
            bg: 'bg-amber-500/10',
            icon: BarChart3,
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {kpi.label}
                </p>
                <div className={cn('p-1.5 rounded-lg', kpi.bg, kpi.color)}>
                  <kpi.icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {kpi.value.toLocaleString(locale)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-tight">
                {kpi.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scan trend */}
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Activity Trend (14d)
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <ScanTrendChart data={scanTrendData} />
          </CardContent>
        </Card>

        {/* Status breakdown */}
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-sm font-black uppercase tracking-widest">
              Scan Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {Object.entries(statusInfo).map(([key, info]) => {
              const count = statusMap[key] ?? 0;
              const pct =
                totalScans30 === 0
                  ? 0
                  : Math.round((count / totalScans30) * 100);
              const Icon = info.icon;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'flex items-center gap-2 text-xs font-bold rounded-full px-2.5 py-1',
                        info.color
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      {info.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {count.toLocaleString(locale)}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
