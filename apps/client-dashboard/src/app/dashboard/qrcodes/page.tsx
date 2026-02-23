import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@gate-access/ui';
import { QRCodeActions } from './qr-actions';
import { QrCode, Plus, Upload, TrendingUp } from 'lucide-react';

export const metadata = { title: 'QR Codes' };

const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  SINGLE: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  RECURRING: { bg: 'bg-violet-50 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-400' },
  PERMANENT: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
};

const STATUS_STYLES = {
  expired: { bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  active: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  inactive: { bg: 'bg-slate-50 dark:bg-slate-700', text: 'text-slate-500 dark:text-slate-400' },
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type SearchParams = { q?: string; type?: string; status?: string };

export default async function QRCodesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const qFilter = searchParams.q?.trim() || undefined;
  const typeFilter = searchParams.type || undefined;
  const now = new Date();
  const projectId = await getValidatedProjectId(claims.orgId);
  const isAllProjects = projectId === null;

  const codes = await prisma.qRCode.findMany({
    where: {
      organizationId: claims.orgId,
      ...(projectId ? { projectId } : {}),
      deletedAt: null,
      ...(qFilter ? { code: { contains: qFilter, mode: 'insensitive' } } : {}),
      ...(typeFilter && ['SINGLE', 'RECURRING', 'PERMANENT'].includes(typeFilter)
        ? { type: typeFilter as 'SINGLE' | 'RECURRING' | 'PERMANENT' }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      gate: { select: { name: true } },
      project: { select: { name: true } },
    },
  });

  const activeCount = codes.filter((c) => c.isActive && !(c.expiresAt && c.expiresAt < now)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">QR Codes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeCount} active &middot; {codes.length} total
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/dashboard/qrcodes/create">
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Create QR Code
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/qrcodes/bulk">
              <Upload className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Bulk Create
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <form
        method="GET"
        role="search"
        aria-label="Filter QR codes"
        className="flex flex-wrap items-center gap-3"
      >
        <input
          name="q"
          defaultValue={qFilter}
          placeholder="Search by code…"
          aria-label="Search QR codes"
          className="h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 max-w-full"
        />
        <select
          name="type"
          defaultValue={typeFilter ?? ''}
          aria-label="Filter by type"
          className="h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All types</option>
          <option value="SINGLE">Single use</option>
          <option value="RECURRING">Recurring</option>
          <option value="PERMANENT">Permanent</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Filter
        </button>
        {(qFilter || typeFilter) && (
          <Link
            href="/dashboard/qrcodes"
            className="h-10 inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-600 px-4 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <CardTitle className="text-base">All QR Codes</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {codes.length === 0 ? (
            /* ── Empty state ──────────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30">
                <QrCode className="h-8 w-8 text-blue-500" aria-hidden="true" />
              </div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                {qFilter || typeFilter ? 'No QR codes match your filters' : 'No QR codes yet'}
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-400">
                {qFilter || typeFilter
                  ? 'Try clearing your filters to see all QR codes.'
                  : 'Create your first QR code to start controlling gate access.'}
              </p>
              {qFilter || typeFilter ? (
                <Button variant="outline" asChild className="mt-5">
                  <Link href="/dashboard/qrcodes">Clear filters</Link>
                </Button>
              ) : (
                <div className="mt-5 flex gap-2">
                  <Button asChild>
                    <Link href="/dashboard/qrcodes/create">
                      <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      Create QR Code
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/qrcodes/bulk">Bulk create</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="QR Codes">
                <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    <th className="px-5 py-3" scope="col">Code</th>
                    <th className="px-5 py-3" scope="col">Type</th>
                    {isAllProjects && <th className="px-5 py-3" scope="col">Project</th>}
                    <th className="px-5 py-3" scope="col">Gate</th>
                    <th className="px-5 py-3" scope="col">Uses</th>
                    <th className="px-5 py-3" scope="col">Expires</th>
                    <th className="px-5 py-3" scope="col">Status</th>
                    <th className="px-5 py-3 text-right" scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {codes.map((qr) => {
                    const isExpired = qr.expiresAt != null && qr.expiresAt < now;
                    const usagePct =
                      qr.maxUses && qr.maxUses > 0
                        ? Math.min(100, Math.round((qr.currentUses / qr.maxUses) * 100))
                        : null;
                    const typeStyle = TYPE_STYLES[qr.type] ?? { bg: 'bg-slate-50 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400' };
                    const statusStyle = isExpired
                      ? STATUS_STYLES.expired
                      : qr.isActive
                      ? STATUS_STYLES.active
                      : STATUS_STYLES.inactive;

                    return (
                      <tr key={qr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors">
                        {/* Code */}
                        <td className="px-5 py-3.5">
                          <span
                            className="font-mono text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 cursor-default"
                            title={qr.code}
                          >
                            {qr.code.slice(0, 26)}…
                          </span>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-3.5">
                          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', typeStyle.bg, typeStyle.text)}>
                            {qr.type}
                          </span>
                        </td>

                        {/* Project (only shown in All Projects mode) */}
                        {isAllProjects && (
                          <td className="px-5 py-3.5">
                            {qr.project ? (
                              <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                {qr.project.name}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-xs">—</span>
                            )}
                          </td>
                        )}

                        {/* Gate */}
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                          {qr.gate?.name ?? (
                            <span className="text-slate-400 italic">Any gate</span>
                          )}
                        </td>

                        {/* Uses */}
                        <td className="px-5 py-3.5">
                          {qr.maxUses != null ? (
                            <div>
                              <span className={cn('text-sm', usagePct != null && usagePct >= 90 ? 'text-red-600 font-medium' : 'text-slate-600 dark:text-slate-300')}>
                                {qr.currentUses}/{qr.maxUses}
                              </span>
                              {usagePct != null && (
                                <div
                                  className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
                                  role="progressbar"
                                  aria-valuenow={usagePct}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                  aria-label={`${usagePct}% used`}
                                >
                                  <div
                                    className={cn('h-full rounded-full transition-all', usagePct >= 90 ? 'bg-red-500' : 'bg-blue-500')}
                                    style={{ width: `${usagePct}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400" title="Unlimited uses">∞</span>
                          )}
                        </td>

                        {/* Expires */}
                        <td className="px-5 py-3.5">
                          {qr.expiresAt ? (
                            <time
                              dateTime={qr.expiresAt.toISOString()}
                              className={cn('text-sm', isExpired ? 'font-medium text-red-600' : 'text-slate-600 dark:text-slate-300')}
                            >
                              {new Date(qr.expiresAt).toLocaleDateString()}
                            </time>
                          ) : (
                            <span className="text-slate-400">Never</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusStyle.bg, statusStyle.text)}>
                            {isExpired ? 'Expired' : qr.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <QRCodeActions qrId={qr.id} isActive={qr.isActive} code={qr.code} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
