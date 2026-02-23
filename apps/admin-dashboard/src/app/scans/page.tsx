import { requireAdmin } from '../../lib/admin-auth';
import { prisma } from '@gate-access/db';

export const metadata = { title: 'Scan Logs' };

interface SearchParams {
  org?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: string;
}

const PAGE_SIZE = 50;

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-700',
  DENIED: 'bg-red-100 text-red-700',
  FAILED: 'bg-orange-100 text-orange-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
};

export default async function AdminScansPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  requireAdmin();

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

  const orgFilter = searchParams.org?.trim() ?? '';
  const statusFilter = searchParams.status ?? '';
  const fromDate = searchParams.from ? new Date(searchParams.from) : undefined;
  const toDate = searchParams.to ? new Date(searchParams.to + 'T23:59:59') : undefined;

  // Build where clause
  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;
  if (fromDate || toDate) {
    where.scannedAt = {
      ...(fromDate ? { gte: fromDate } : {}),
      ...(toDate ? { lte: toDate } : {}),
    };
  }

  // Org filter: match via the QR code's organization
  if (orgFilter) {
    where.qrCode = { organization: { name: { contains: orgFilter, mode: 'insensitive' } } };
  }

  const [total, scans] = await Promise.all([
    prisma.scanLog.count({ where }),
    prisma.scanLog.findMany({
      where,
      orderBy: { scannedAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        scanUuid: true,
        status: true,
        scannedAt: true,
        gate: { select: { name: true } },
        qrCode: {
          select: {
            type: true,
            code: true,
            organization: { select: { name: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scan Logs</h1>
        <p className="text-sm text-slate-500">{total.toLocaleString()} total records</p>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <form method="GET" className="flex flex-wrap gap-3">
        <input
          name="org"
          defaultValue={orgFilter}
          placeholder="Filter by org name…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          name="status"
          defaultValue={statusFilter}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          {['SUCCESS', 'DENIED', 'FAILED', 'PENDING'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="date"
          name="from"
          defaultValue={searchParams.from ?? ''}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <input
          type="date"
          name="to"
          defaultValue={searchParams.to ?? ''}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Filter
        </button>
        <a
          href="/scans"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Clear
        </a>
      </form>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-medium text-slate-500">
            <tr>
              <th className="px-5 py-3 text-left">Scan UUID</th>
              <th className="px-5 py-3 text-left">Organization</th>
              <th className="px-5 py-3 text-left">Gate</th>
              <th className="px-5 py-3 text-left">QR Label</th>
              <th className="px-5 py-3 text-left">Scanned By</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {scans.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                  No scan logs found.
                </td>
              </tr>
            ) : (
              scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">
                    {scan.scanUuid?.slice(0, 16) ?? scan.id.slice(0, 16)}…
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {scan.qrCode?.organization?.name ?? <span className="text-slate-400 italic">—</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {scan.gate?.name ?? <span className="text-slate-400 italic">—</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    <span className="font-medium">{scan.qrCode?.type ?? '—'}</span>
                    <span className="ml-1 font-mono text-xs text-slate-400">
                      {scan.qrCode?.code?.slice(0, 12)}…
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {scan.user ? (
                      <div>
                        <p className="text-slate-700">{scan.user.name}</p>
                        <p className="text-xs text-slate-400">{scan.user.email}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">Scanner</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[scan.status] ?? 'bg-slate-100 text-slate-600'}`}
                    >
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {scan.scannedAt.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500">
            Page {page} of {totalPages} · {total.toLocaleString()} total
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/scans?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                ← Previous
              </a>
            )}
            {page < totalPages && (
              <a
                href={`/scans?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                Next →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
