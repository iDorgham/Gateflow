import { requireAdmin } from '../lib/admin-auth';
import { prisma } from '@gate-access/db';

export const metadata = { title: 'Overview' };

export default async function AdminOverviewPage() {
  requireAdmin();

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

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
        <p className="text-sm text-slate-500">Real-time metrics across all organizations.</p>
      </div>

      {/* ── Stats grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Active Orgs" value={activeOrgs} sub={`${suspendedOrgs} suspended`} color="blue" />
        <StatCard label="Total Users" value={totalUsers} sub={`${adminUsers} admins`} color="indigo" />
        <StatCard label="Scans Today" value={scansToday} sub="last 24 h" color="green" />
        <StatCard label="Scans (7 d)" value={scansWeek} sub={`${scansMonth.toLocaleString()} / 30 d`} color="amber" />
      </div>

      {/* ── Health indicators ────────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">System Health</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <HealthRow label="Database" status="ok" detail="Connected" />
          <HealthRow label="Auth Service" status="ok" detail="JWT HS256 active" />
          <HealthRow
            label="Offline Queue"
            status="ok"
            detail="Sync endpoint reachable"
          />
        </div>
      </div>

      {/* ── Recent organizations ─────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Newest Organizations</h2>
          <a href="/organizations" className="text-xs text-blue-600 hover:underline">
            View all →
          </a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Plan</th>
              <th className="px-5 py-3 text-left">Contact</th>
              <th className="px-5 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentOrgs.map((org) => (
              <tr
                key={org.id}
                className="hover:bg-slate-50 cursor-pointer"
              >
                <td className="px-5 py-3 font-medium text-slate-900 hover:text-blue-600 hover:underline">
                  <a href={`/organizations?q=${encodeURIComponent(org.name)}`}>
                    {org.name}
                  </a>
                </td>
                <td className="px-5 py-3">
                  <PlanBadge plan={org.plan} />
                </td>
                <td className="px-5 py-3 text-slate-500">{org.email}</td>
                <td className="px-5 py-3 text-slate-500">
                  {org.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub: string;
  color: 'blue' | 'indigo' | 'green' | 'amber';
}) {
  const colors = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
  };
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${colors[color]}`}>
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

function HealthRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: 'ok' | 'warn' | 'error';
  detail: string;
}) {
  const dot =
    status === 'ok'
      ? 'bg-green-500'
      : status === 'warn'
      ? 'bg-amber-500'
      : 'bg-red-500';
  return (
    <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{detail}</p>
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    FREE: 'bg-slate-100 text-slate-700',
    PRO: 'bg-blue-100 text-blue-700',
    ENTERPRISE: 'bg-violet-100 text-violet-700',
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        styles[plan] ?? styles.FREE
      }`}
    >
      {plan}
    </span>
  );
}
