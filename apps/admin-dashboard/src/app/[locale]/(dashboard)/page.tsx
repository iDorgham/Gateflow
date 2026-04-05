import { prisma } from '@gate-access/db';
import { requireAdmin } from '../../../lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '../../../lib/i18n/i18n-config';
import {
  Building2,
  Users,
  ScanLine,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from '@gate-access/ui';
import Link from 'next/link';
import { PageHeader } from '@gate-access/ui';
import { DashboardRecentOrgsTable } from './DashboardRecentOrgsTable';

export const metadata = { title: 'Operational Overview' };

export default async function AdminOverviewPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now);
  monthStart.setDate(now.getDate() - 30);

  const [
    totalOrgs,
    activeOrgs,
    totalUsers,
    adminUsers,
    scansToday,
    recentOrgs,
  ] = await Promise.all([
    // skip-organization-check (Global Admin Overview)
    prisma.organization.count(),
    // skip-organization-check (Global Admin Overview)
    prisma.organization.count({ where: { deletedAt: null } }),
    // skip-organization-check (Global Admin Overview)
    prisma.user.count({ where: { deletedAt: null } }),
    // skip-organization-check (Global Admin Overview)
    prisma.user.count({
      where: {
        role: { name: { in: ['ADMIN', 'TENANT_ADMIN'] } },
        deletedAt: null,
      },
    }),
    // skip-organization-check (Global Admin Overview)
    prisma.scanLog.count({ where: { scannedAt: { gte: todayStart } } }),
    // skip-organization-check (Global Admin Overview)
    prisma.organization.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        plan: true,
        email: true,
        createdAt: true,
      },
    }),
  ]);

  const suspendedOrgs = totalOrgs - activeOrgs;

  const stats = [
    {
      label: t('overview.activeOrgs'),
      value: activeOrgs.toLocaleString(locale),
      sub: t('overview.suspendedOrgs', { count: suspendedOrgs }),
      icon: Building2,
      variant: 'brand',
    },
    {
      label: t('overview.totalUsers'),
      value: totalUsers.toLocaleString(locale),
      sub: t('overview.adminUsers', { count: adminUsers }),
      icon: Users,
      variant: 'primary',
    },
    {
      label: t('overview.scansToday'),
      value: scansToday.toLocaleString(locale),
      sub: t('overview.scansLast24h'),
      icon: ScanLine,
      variant: 'success',
    },
    {
      label: t('overview.systemHealth'),
      value: '100%',
      sub: t('overview.allServicesActive'),
      icon: Activity,
      variant: 'warning',
    },
  ];

  type RecentOrg = {
    id: string;
    name: string;
    email: string | null;
    plan: string | null;
    createdAt: Date;
  };

  const recentOrgsSafe = recentOrgs.map((o: RecentOrg) => ({
    ...o,
    createdAt: new Date(o.createdAt).toISOString(),
  }));

  const recentOrgsLabels = {
    org: t('overview.org'),
    plan: t('overview.plan'),
    joined: t('overview.joined'),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <PageHeader
        titleClassName="italic uppercase"
        title={t('overview.title')}
        subtitle={t('overview.subtitle')}
        badge={
          <Badge
            variant="primary"
            className="bg-ds-background-selected text-ds-text-selected border-ds-border-selected/30 font-bold text-xs px-2.5 py-1"
          >
            LIVE MONITORING
          </Badge>
        }
      />

      {/* Stats Cluster */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-ds-border bg-ds-background-neutral-subtle/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div
                  className={cn(
                    'p-3.5 rounded-2xl shadow-lg ring-4 ring-background transition-transform group-hover:rotate-6',
                    stat.variant === 'brand'
                      ? 'bg-ds-background-brand-bold text-ds-text-inverse'
                      : stat.variant === 'primary'
                        ? 'bg-ds-background-selected text-ds-text-selected'
                        : stat.variant === 'success'
                          ? 'bg-ds-background-success text-ds-text-success'
                          : 'bg-ds-background-warning text-ds-text-warning'
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ds-background-neutral-subtle opacity-40 group-hover:opacity-100 transition-opacity">
                  <TrendingUp className="h-4 w-4 text-ds-text-subtlest" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest group-hover:text-primary transition-colors">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-ds-text tracking-tighter italic">
                    {stat.value}
                  </h3>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-ds-border-subtle/50 flex items-center justify-between">
                <p className="text-[10px] text-ds-text-subtlest font-black uppercase tracking-widest flex items-center gap-2">
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      stat.variant === 'brand'
                        ? 'bg-primary'
                        : stat.variant === 'success'
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                    )}
                  />
                  {stat.sub}
                </p>
                <ArrowUpRight className="h-3.5 w-3.5 text-ds-text-subtlest opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Organizations Table */}
        <Card className="lg:col-span-2 border-ds-border shadow-md overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-ds-border/50 px-6 py-5 bg-ds-background-neutral-subtle/30">
            <div>
              <CardTitle className="text-base font-black italic uppercase tracking-tight text-ds-text">
                {t('overview.newestOrgs')}
              </CardTitle>
              <p className="text-[11px] text-ds-text-subtle font-medium">
                {t('overview.newestOrgsDesc')}
              </p>
            </div>
            <Link
              href="/organizations"
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-ds-text-brand hover:opacity-80 transition-all"
            >
              {t('overview.viewAll')}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-90 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <DashboardRecentOrgsTable
              recentOrgs={recentOrgsSafe}
              locale={locale}
              labels={recentOrgsLabels}
            />
          </CardContent>
        </Card>

        {/* System & Infra Health */}
        <Card className="border-ds-border shadow-md">
          <CardHeader className="px-6 py-5">
            <CardTitle className="text-base font-black italic uppercase tracking-tight text-ds-text">
              {t('overview.infraHealth')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-ds-background-success-bold/5 border border-ds-background-success-bold/10 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ds-background-success-bold text-ds-text-inverse shadow-lg transition-transform group-hover:rotate-12">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-ds-text-success">
                  {t('overview.dbCluster')}
                </p>
                <p className="text-[11px] text-ds-text-subtle font-black uppercase tracking-tighter opacity-80">
                  {t('overview.dbSynced')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-ds-background-brand-bold/5 border border-ds-background-brand-bold/10 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ds-background-brand-bold text-ds-text-inverse shadow-lg transition-transform group-hover:rotate-12">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-ds-text-brand">
                  {t('overview.authServices')}
                </p>
                <p className="text-[11px] text-ds-text-subtle font-black uppercase tracking-tighter opacity-80">
                  {t('overview.authRotated')}
                </p>
              </div>
            </div>

            {/* Traffic Visualizer */}
            <div className="rounded-2xl border border-ds-border p-5 bg-ds-background-neutral-subtle/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest">
                  {t('overview.syncTraffic')}
                </p>
                <Badge variant="success" className="h-4 text-[8px] font-black">
                  {t('overview.optimal')}
                </Badge>
              </div>
              <div className="flex items-end gap-1.5 h-12 px-1">
                {[30, 45, 25, 60, 40, 35, 20, 50, 45, 30].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-ds-background-brand-bold/10 rounded-full relative group/bar overflow-hidden"
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full bg-ds-background-brand-bold rounded-full transition-all group-hover/bar:bg-ds-background-brand-bold-hovered"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center text-[9px] font-bold text-ds-text-subtlest uppercase tracking-widest">
                <span>Latency: 12ms</span>
                <span>Throughput: High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
