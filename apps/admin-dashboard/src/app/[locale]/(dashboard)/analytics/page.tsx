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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, cn } from '@gate-access/ui';

export const metadata = { title: 'Analytics' };

export default async function AnalyticsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  await requireAdmin();
  const { t } = await getTranslation(locale, 'admin');

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);

  // ── Build 14-day daily scan counts ──────────────────────────────────────────
  const dailyCounts = await Promise.all(
    Array.from({ length: 14 }, async (_, i) => {
      const day = new Date(now);
      day.setDate(day.getDate() - 13 + i);
      day.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      const count = await prisma.scanLog.count({
        where: { scannedAt: { gte: day, lte: dayEnd } },
      });
      return {
        label: day.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        count,
      };
    })
  );

  // ── Status breakdown (30 days) ────────────────────────────────────────────
  const statusGroups = await prisma.scanLog.groupBy({
    by: ['status'],
    where: { scannedAt: { gte: thirtyDaysAgo } },
    _count: { id: true },
  });
  const statusMap = Object.fromEntries(statusGroups.map((s) => [s.status, s._count.id]));
  const totalScans30 = statusGroups.reduce((a, b) => a + b._count.id, 0);

  // ── Top orgs by scan volume (7 days) ────────────────────────────────────
  const recentGateScans = await prisma.scanLog.groupBy({
    by: ['gateId'],
    where: { scannedAt: { gte: sevenDaysAgo } },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 50,
  });
  const gateIds = recentGateScans.map((g) => g.gateId);
  const gateOrgs = await prisma.gate.findMany({
    where: { id: { in: gateIds } },
    select: { id: true, organizationId: true, organization: { select: { name: true } } },
  });
  const orgScanAgg = new Map<string, { name: string; count: number }>();
  for (const gs of recentGateScans) {
    const gate = gateOrgs.find((g) => g.id === gs.gateId);
    if (!gate) continue;
    const existing = orgScanAgg.get(gate.organizationId);
    if (existing) {
      existing.count += gs._count.id;
    } else {
      orgScanAgg.set(gate.organizationId, {
        name: gate.organization.name,
        count: gs._count.id,
      });
    }
  }
  const topOrgs = Array.from(orgScanAgg.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const maxOrgCount = topOrgs[0]?.count ?? 1;

  // ── Plan distribution ────────────────────────────────────────────────────
  const planGroups = await prisma.organization.groupBy({
    by: ['plan'],
    where: { deletedAt: null },
    _count: { id: true },
  });
  const planMap = Object.fromEntries(planGroups.map((p) => [p.plan, p._count.id]));
  const totalOrgs = planGroups.reduce((a, b) => a + b._count.id, 0) || 1;

  // ── QR type distribution ──────────────────────────────────────────────────
  const qrTypeGroups = await prisma.qRCode.groupBy({
    by: ['type'],
    where: { deletedAt: null },
    _count: { id: true },
  });
  const qrTypeMap = Object.fromEntries(qrTypeGroups.map((q) => [q.type, q._count.id]));
  const totalQR = qrTypeGroups.reduce((a, b) => a + b._count.id, 0) || 1;

  // ── KPI summary ───────────────────────────────────────────────────────────
  const [totalOrgsCount, totalUsersCount, totalQRCount] = await Promise.all([
    prisma.organization.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.qRCode.count({ where: { deletedAt: null } }),
  ]);

  const maxDaily = Math.max(...dailyCounts.map((d) => d.count), 1);

  const statusInfo: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    SUCCESS: { label: t('analytics.statusSuccess'), color: 'text-emerald-600 bg-emerald-500/10', icon: CheckCircle2 },
    DENIED: { label: t('analytics.statusDenied'), color: 'text-red-600 bg-red-500/10', icon: XCircle },
    FAILED: { label: t('analytics.statusFailed'), color: 'text-amber-600 bg-amber-500/10', icon: AlertCircle },
    EXPIRED: { label: t('analytics.statusExpired'), color: 'text-blue-600 bg-blue-500/10', icon: Clock },
    MAX_USES_REACHED: { label: t('analytics.statusMaxUses'), color: 'text-violet-600 bg-violet-500/10', icon: AlertCircle },
    INACTIVE: { label: t('analytics.statusInactive'), color: 'text-slate-600 bg-slate-500/10', icon: XCircle },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('analytics.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('analytics.subtitle')}</p>
      </div>

      {/* KPI summary row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t('analytics.organizations'), value: totalOrgsCount, sub: t('analytics.activeTenants'), color: 'text-blue-600', bg: 'bg-blue-500/10', icon: Building2 },
          { label: t('analytics.users'), value: totalUsersCount, sub: t('analytics.allRoles'), color: 'text-violet-600', bg: 'bg-violet-500/10', icon: Building2 },
          { label: t('analytics.qrCodes'), value: totalQRCount, sub: t('analytics.activeCodes'), color: 'text-emerald-600', bg: 'bg-emerald-500/10', icon: QrCode },
          { label: t('analytics.scans30d'), value: totalScans30, sub: t('analytics.last30Days'), color: 'text-amber-600', bg: 'bg-amber-500/10', icon: BarChart3 },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                <div className={cn('p-1.5 rounded-lg', kpi.bg, kpi.color)}>
                  <kpi.icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value.toLocaleString(locale)}</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-tight">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scan trend chart (14 days) */}
      <Card className="shadow-md">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {t('analytics.scanVolume14d')}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{t('analytics.scanVolumeDesc')}</p>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold text-[10px]">
              {t('analytics.total', { count: dailyCounts.reduce((a, b) => a + b.count, 0) })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="flex items-end gap-1.5 h-40">
            {dailyCounts.map((day, i) => {
              const heightPct = maxDaily === 0 ? 0 : (day.count / maxDaily) * 100;
              const isToday = i === 13;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar">
                  <span className="text-[9px] font-bold text-primary opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                    {day.count}
                  </span>
                  <div className="w-full bg-muted/50 rounded-t-sm flex-1 relative overflow-hidden">
                    <div
                      className={cn(
                        'absolute bottom-0 left-0 w-full rounded-t-sm transition-all',
                        isToday ? 'bg-primary' : 'bg-primary/40 group-hover/bar:bg-primary/70'
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-2 px-0.5">
            <p className="text-[9px] text-muted-foreground font-medium">{dailyCounts[0]?.label}</p>
            <p className="text-[9px] text-muted-foreground font-medium">{t('analytics.today')}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status breakdown */}
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-lg font-bold">{t('analytics.scanStatusBreakdown')}</CardTitle>
            <p className="text-xs text-muted-foreground">{t('analytics.scanStatusDesc', { count: totalScans30 })}</p>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {Object.entries(statusInfo).map(([key, info]) => {
              const count = statusMap[key] ?? 0;
              const pct = totalScans30 === 0 ? 0 : Math.round((count / totalScans30) * 100);
              const Icon = info.icon;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className={cn('flex items-center gap-2 text-xs font-bold rounded-full px-2.5 py-1', info.color)}>
                      <Icon className="h-3 w-3" />
                      {info.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{count.toLocaleString(locale)}</span>
                      <span className="text-[10px] font-medium text-muted-foreground w-8 text-right ltr:text-right rtl:text-left">{pct}%</span>
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

        {/* Top orgs */}
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-lg font-bold">{t('analytics.topOrgsActivity')}</CardTitle>
            <p className="text-xs text-muted-foreground">{t('analytics.topOrgsDesc')}</p>
          </CardHeader>
          <CardContent className="pt-5 space-y-3">
            {topOrgs.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">{t('analytics.noScanActivity')}</p>
            ) : (
              topOrgs.map((org, i) => {
                const pct = Math.round((org.count / maxOrgCount) * 100);
                return (
                  <div key={org.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-black text-muted-foreground w-4 shrink-0 ltr:text-left rtl:text-right">#{i + 1}</span>
                        <p className="text-xs font-bold text-foreground truncate">{org.name}</p>
                      </div>
                      <span className="text-xs font-bold text-foreground shrink-0 ltr:ml-2 rtl:mr-2">
                        {org.count.toLocaleString(locale)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: `hsl(${217 + i * 15}, 91%, 60%)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan distribution */}
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-lg font-bold">{t('analytics.planDistribution')}</CardTitle>
            <p className="text-xs text-muted-foreground">{t('analytics.planDistributionDesc')}</p>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {[
              { plan: 'FREE', color: 'bg-muted', label: 'bg-muted text-muted-foreground' },
              { plan: 'PRO', color: 'bg-blue-500', label: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
            ].map(({ plan, color, label }) => {
              const count = planMap[plan] ?? 0;
              const pct = Math.round((count / totalOrgs) * 100);
              return (
                <div key={plan} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={cn('text-[10px] font-black uppercase tracking-wider', label)}>
                      {plan}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{t('analytics.orgsCount', { count })}</span>
                      <span className="text-[10px] font-medium text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* QR type distribution */}
        <Card className="shadow-md">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-lg font-bold">{t('analytics.qrCodeTypes')}</CardTitle>
            <p className="text-xs text-muted-foreground">{t('analytics.qrCodeTypesDesc')}</p>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {[
              { type: 'SINGLE', color: 'bg-emerald-500', desc: t('analytics.qrSingleDesc') },
              { type: 'RECURRING', color: 'bg-blue-500', desc: t('analytics.qrRecurringDesc') },
              { type: 'PERMANENT', color: 'bg-violet-500', desc: t('analytics.qrPermanentDesc') },
            ].map(({ type, color, desc }) => {
              const count = qrTypeMap[type] ?? 0;
              const pct = Math.round((count / totalQR) * 100);
              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">{type}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{count.toLocaleString(locale)}</span>
                      <span className="text-[10px] font-medium text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
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
