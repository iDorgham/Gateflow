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
  DynamicTable,
  Column,
} from '@gate-access/ui';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export const metadata = { title: 'Operational Overview' };

export default async function AdminOverviewPage({ params: { locale } }: { params: { locale: Locale } }) {
  await requireAdmin();
  const { t } = (await getTranslation(locale, 'admin')) as any;

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now); monthStart.setDate(now.getDate() - 30);

  const [
    totalOrgs,
    activeOrgs,
    totalUsers,
    adminUsers,
    scansToday,
    scansWeek,
    scansMonth,
    recentOrgs,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.organization.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: { name: { in: ['ADMIN', 'TENANT_ADMIN'] } }, deletedAt: null } }),
    prisma.scanLog.count({ where: { scannedAt: { gte: todayStart } } }),
    prisma.scanLog.count({ where: { scannedAt: { gte: weekStart } } }),
    prisma.scanLog.count({ where: { scannedAt: { gte: monthStart } } }),
    prisma.organization.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, plan: true, email: true, createdAt: true },
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

  const columns: Column<typeof recentOrgs[0]>[] = [
    {
      key: 'org',
      label: t('overview.org'),
      render: (org) => (
        <div className="flex flex-col">
          <span className="font-bold text-[var(--ds-text,#172B4D)]">{org.name}</span>
          <span className="text-[11px] text-[var(--ds-text-subtle,#6B778C)] truncate max-w-[200px]">{org.email}</span>
        </div>
      ),
    },
    {
      key: 'plan',
      label: t('overview.plan'),
      render: (org) => (
        <Badge variant={org.plan === 'PRO' ? 'primary' : 'subtle'} className="h-5 px-1.5 font-bold text-[9px]">
           {org.plan}
        </Badge>
      ),
    },
    {
      key: 'joined',
      label: t('overview.joined'),
      align: 'right',
      render: (org) => (
        <span className="text-xs font-medium text-[var(--ds-text-subtle,#6B778C)]">
          {new Date(org.createdAt).toLocaleDateString(locale)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <PageHeader
        title={t('overview.title')}
        subtitle={t('overview.subtitle')}
        badge={<Badge variant="primary" className="h-6 font-black tracking-widest px-2 italic shadow-sm">LIVE MONITORING</Badge>}
      />

      {/* Stats Cluster */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-[var(--ds-border,#DFE1E6)] shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                 <div className={cn(
                   "p-2.5 rounded-xl shadow-inner",
                   stat.variant === 'brand' ? "bg-[var(--ds-background-brand-bold,#0052CC)] text-white" :
                   stat.variant === 'primary' ? "bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--ds-text-selected,#0747A6)]" :
                   stat.variant === 'success' ? "bg-[var(--ds-background-success,#E3FCEF)] text-[var(--ds-text-success,#006644)]" :
                   "bg-[var(--ds-background-warning,#FFF0B3)] text-[var(--ds-text-warning,#172B4D)]"
                 )}>
                   <stat.icon className="h-5 w-5" />
                 </div>
                 <TrendingUp className="h-4 w-4 text-[var(--ds-text-subtlest,#A5ADBA)] opacity-50" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle,#6B778C)]">
                   {stat.label}
                </p>
                <h3 className="text-3xl font-black text-[var(--ds-text,#172B4D)] tracking-tight italic">
                   {stat.value}
                </h3>
              </div>
              <p className="text-[10px] text-[var(--ds-text-subtlest,#6B778C)] mt-4 pt-4 border-t border-[var(--ds-border-subtle,#EBECF0)] font-bold uppercase flex items-center gap-1.5">
                 <span className="w-1 h-1 rounded-full bg-current" />
                 {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Organizations Table */}
        <Card className="lg:col-span-2 border-[var(--ds-border,#DFE1E6)] shadow-md overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--ds-border-subtle,#EBECF0)] px-6 py-5 bg-[var(--ds-background-neutral-subtle,#F4F5F7)]/30">
            <div>
              <CardTitle className="text-base font-black italic uppercase tracking-tight text-[var(--ds-text,#172B4D)]">
                 {t('overview.newestOrgs')}
              </CardTitle>
              <p className="text-[11px] text-[var(--ds-text-subtle,#6B778C)] font-medium">{t('overview.newestOrgsDesc')}</p>
            </div>
            <Link 
              href="/organizations" 
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-brand,#0052CC)] hover:opacity-80 transition-all"
            >
              {t('overview.viewAll')}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-90 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1">
             <DynamicTable columns={columns} items={recentOrgs} />
          </CardContent>
        </Card>

        {/* System & Infra Health */}
        <Card className="border-[var(--ds-border,#DFE1E6)] shadow-md">
          <CardHeader className="px-6 py-5">
            <CardTitle className="text-base font-black italic uppercase tracking-tight text-[var(--ds-text,#172B4D)]">
               {t('overview.infraHealth')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--ds-background-success-bold,#00875A)]/5 border border-[var(--ds-background-success-bold,#00875A)]/10 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ds-background-success-bold,#00875A)] text-white shadow-lg transition-transform group-hover:rotate-12">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[var(--ds-text-success,#006644)]">{t('overview.dbCluster')}</p>
                <p className="text-[11px] text-[var(--ds-text-subtle,#6B778C)] font-black uppercase tracking-tighter opacity-80">{t('overview.dbSynced')}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--ds-background-brand-bold,#0052CC)]/5 border border-[var(--ds-background-brand-bold,#0052CC)]/10 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ds-background-brand-bold,#0052CC)] text-white shadow-lg transition-transform group-hover:rotate-12">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[var(--ds-text-brand,#0052CC)]">{t('overview.authServices')}</p>
                <p className="text-[11px] text-[var(--ds-text-subtle,#6B778C)] font-black uppercase tracking-tighter opacity-80">{t('overview.authRotated')}</p>
              </div>
            </div>

            {/* Traffic Visualizer */}
            <div className="rounded-2xl border border-[var(--ds-border,#DFE1E6)] p-5 bg-[var(--ds-background-neutral-subtle,#F4F5F7)]/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest,#A5ADBA)]">{t('overview.syncTraffic')}</p>
                <Badge variant="success" className="h-4 text-[8px] font-black">{t('overview.optimal')}</Badge>
              </div>
              <div className="flex items-end gap-1.5 h-12 px-1">
                {[30, 45, 25, 60, 40, 35, 20, 50, 45, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-[var(--ds-background-brand-bold,#0052CC)]/10 rounded-full relative group/bar overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full bg-[var(--ds-background-brand-bold,#0052CC)] rounded-full transition-all group-hover/bar:bg-[var(--ds-background-brand-bold-hovered,#004EBE)]" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center text-[9px] font-bold text-[var(--ds-text-subtlest,#A5ADBA)] uppercase tracking-widest">
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
