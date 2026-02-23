import { requireAdmin } from '../../lib/admin-auth';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';

export const metadata = { title: 'Organizations' };

// ─── Server actions ───────────────────────────────────────────────────────────

async function changePlan(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  const plan = formData.get('plan') as 'FREE' | 'PRO' | 'ENTERPRISE';
  if (!id || !plan) return;
  await prisma.organization.update({ where: { id }, data: { plan } });
  revalidatePath('/organizations');
}

async function suspendOrg(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.organization.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath('/organizations');
}

async function activateOrg(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.organization.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath('/organizations');
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PLANS = ['FREE', 'PRO', 'ENTERPRISE'] as const;

interface SearchParams { q?: string; plan?: string; status?: string }

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  requireAdmin();

  const search = searchParams.q?.trim() ?? '';
  const planFilter = searchParams.plan ?? '';
  const statusFilter = searchParams.status ?? 'all';

  const orgs = await prisma.organization.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(planFilter ? { plan: planFilter as 'FREE' | 'PRO' | 'ENTERPRISE' } : {}),
      ...(statusFilter === 'active'
        ? { deletedAt: null }
        : statusFilter === 'suspended'
        ? { NOT: { deletedAt: null } }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      deletedAt: true,
      createdAt: true,
      _count: { select: { users: true, qrCodes: true, gates: true } },
    },
  });

  // Get scan counts per org for the last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);
  const scansByOrg = await prisma.scanLog.groupBy({
    by: ['gateId'],
    where: { scannedAt: { gte: thirtyDaysAgo } },
    _count: true,
  });

  // Map gateId → orgId via gates
  const gates = await prisma.gate.findMany({
    where: {
      id: {
        in: Array.from(new Set(scansByOrg.map((s) => s.gateId))),
      },
    },
    select: { id: true, organizationId: true },
  });
  const gateOrgMap = new Map(gates.map((g) => [g.id, g.organizationId]));
  const orgScanMap = new Map<string, number>();
  for (const s of scansByOrg) {
    const orgId = gateOrgMap.get(s.gateId);
    if (orgId) orgScanMap.set(orgId, (orgScanMap.get(orgId) ?? 0) + s._count);
  }

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
          <p className="text-sm text-slate-500">{orgs.length} result{orgs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <form method="GET" className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={search}
          placeholder="Search by name…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          name="plan"
          defaultValue={planFilter}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All plans</option>
          {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          name="status"
          defaultValue={statusFilter}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Filter
        </button>
        <a
          href="/organizations"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Clear
        </a>
      </form>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">Organization</th>
              <th className="px-5 py-3 text-left">Plan</th>
              <th className="px-5 py-3 text-right">Users</th>
              <th className="px-5 py-3 text-right">QR Codes</th>
              <th className="px-5 py-3 text-right">Scans (30d)</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orgs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                  No organizations found.
                </td>
              </tr>
            ) : (
              orgs.map((org) => {
                const suspended = org.deletedAt !== null;
                return (
                  <tr key={org.id} className={`hover:bg-slate-50 ${suspended ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{org.name}</p>
                      <p className="text-xs text-slate-400">{org.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <PlanBadge plan={org.plan} />
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700">
                      {org._count.users}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700">
                      {org._count.qrCodes}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-700">
                      {(orgScanMap.get(org.id) ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          suspended
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Change plan */}
                        <form action={changePlan} className="flex items-center gap-1">
                          <input type="hidden" name="id" value={org.id} />
                          <select
                            name="plan"
                            defaultValue={org.plan}
                            className="rounded border border-slate-300 px-1.5 py-1 text-xs"
                          >
                            {PLANS.map((p) => <option key={p}>{p}</option>)}
                          </select>
                          <button
                            type="submit"
                            className="rounded bg-slate-800 px-2 py-1 text-xs text-white hover:bg-slate-700"
                          >
                            Set
                          </button>
                        </form>

                        {/* Suspend / Activate */}
                        {suspended ? (
                          <form action={activateOrg}>
                            <input type="hidden" name="id" value={org.id} />
                            <button
                              type="submit"
                              className="rounded border border-green-300 bg-green-50 px-2 py-1 text-xs text-green-700 hover:bg-green-100"
                            >
                              Activate
                            </button>
                          </form>
                        ) : (
                          <form action={suspendOrg}>
                            <input type="hidden" name="id" value={org.id} />
                            <button
                              type="submit"
                              className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100"
                            >
                              Suspend
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${styles[plan] ?? styles.FREE}`}>
      {plan}
    </span>
  );
}
