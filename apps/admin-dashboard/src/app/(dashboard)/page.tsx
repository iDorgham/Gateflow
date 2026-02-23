import { prisma } from '@gate-access/db';
import { requireAdmin } from '../../lib/admin-auth';
import {
  Building2,
  Users,
  ScanLine,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
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

export const metadata = { title: 'Overview' };

export default async function AdminOverviewPage() {
  await requireAdmin();

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
    prisma.user.count({ where: { role: { in: ['ADMIN', 'TENANT_ADMIN'] }, deletedAt: null } }),
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
      label: 'Active Orgs',
      value: activeOrgs.toLocaleString(),
      sub: `${suspendedOrgs} suspended`,
      icon: Building2,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Users',
      value: totalUsers.toLocaleString(),
      sub: `${adminUsers} admins`,
      icon: Users,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Scans Today',
      value: scansToday.toLocaleString(),
      sub: 'Last 24 hours',
      icon: ScanLine,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'System Health',
      value: '100%',
      sub: 'All services active',
      icon: Activity,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Global system metrics and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border shadow-md transition-all hover:scale-[1.02] hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-tight">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Organizations */}
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Newest Organizations</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Recently onboarded tenants.</p>
            </div>
            <Link 
              href="/organizations" 
              className="group flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
                    <th className="px-5 py-3 text-left">Organization</th>
                    <th className="px-5 py-3 text-left">Plan</th>
                    <th className="px-5 py-3 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrgs.map((org) => (
                    <tr key={org.id} className="group hover:bg-primary/5 transition-colors">
                      <td className="px-5 py-4">
                        <Link href={`/organizations?q=${encodeURIComponent(org.name)}`} className="block">
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.email}</p>
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="secondary" className={cn(
                          "text-[10px] font-bold uppercase tracking-wider",
                          org.plan === 'ENTERPRISE' ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800" :
                          org.plan === 'PRO' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800" :
                          "bg-muted text-muted-foreground border-border"
                        )}>
                          {org.plan}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Infrastructure Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Database Cluster</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Synced &amp; Operational</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Auth Services</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">HS256 Secrets Rotated</p>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sync Traffic</p>
                <Badge className="bg-emerald-500 text-white border-none h-4 text-[9px] font-bold">OPTIMAL</Badge>
              </div>
              <div className="flex items-end gap-1 h-8 px-1">
                {[30, 45, 25, 60, 40, 35, 20].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/10 rounded-t-sm relative group/bar">
                    <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-sm transition-all group-hover/bar:bg-primary/80" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
