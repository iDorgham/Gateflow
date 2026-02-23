import { requireAdmin } from '../../../lib/admin-auth';
import { prisma } from '@gate-access/db';
import {
  ScrollText,
  Search,
  Building2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Shield,
  Download,
  X,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { Card, CardContent, Badge, Button, Input, cn } from '@gate-access/ui';
import Link from 'next/link';

export const metadata = { title: 'Audit Logs' };

interface SearchParams {
  org?: string;
  status?: string;
  from?: string;
  to?: string;
  q?: string;
  page?: string;
}

const PAGE_SIZE = 40;

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  requireAdmin();

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

  const orgFilter = searchParams.org?.trim() ?? '';
  const statusFilter = searchParams.status ?? '';
  const uuidFilter = searchParams.q?.trim() ?? '';
  const fromDate = searchParams.from ? new Date(searchParams.from) : undefined;
  const toDate = searchParams.to ? new Date(searchParams.to + 'T23:59:59') : undefined;

  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;
  if (uuidFilter) where.scanUuid = { contains: uuidFilter, mode: 'insensitive' };
  if (fromDate || toDate) {
    where.scannedAt = {
      ...(fromDate ? { gte: fromDate } : {}),
      ...(toDate ? { lte: toDate } : {}),
    };
  }
  if (orgFilter) {
    where.qrCode = { organization: { name: { contains: orgFilter, mode: 'insensitive' } } };
  }

  const [total, logs] = await Promise.all([
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
        deviceId: true,
        auditNotes: true,
        auditTrail: true,
        gate: { select: { name: true, location: true } },
        qrCode: {
          select: {
            type: true,
            code: true,
            organization: { select: { id: true, name: true } },
          },
        },
        user: { select: { name: true, email: true, role: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const currentParams = {
    ...(orgFilter ? { org: orgFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(uuidFilter ? { q: uuidFilter } : {}),
    ...(searchParams.from ? { from: searchParams.from } : {}),
    ...(searchParams.to ? { to: searchParams.to } : {}),
  };

  const exportUrl = `/api/admin/audit-logs/export?${new URLSearchParams(currentParams)}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Immutable system-wide audit trail with full event context.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800 px-3 py-1 font-bold">
            {total.toLocaleString()} Records
          </Badge>
          <Button variant="outline" size="sm" asChild className="font-bold gap-1.5">
            <a href={exportUrl} download>
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </a>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form method="GET" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            <div className="space-y-1 lg:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="org" defaultValue={orgFilter} placeholder="Filter by org..." className="pl-9 h-10" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Scan UUID</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="q" defaultValue={uuidFilter} placeholder="UUID..." className="pl-9 h-10" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
              <select
                name="status"
                defaultValue={statusFilter}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">All</option>
                {['SUCCESS', 'DENIED', 'FAILED', 'EXPIRED', 'MAX_USES_REACHED', 'INACTIVE'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">From</label>
              <Input type="date" name="from" defaultValue={searchParams.from ?? ''} className="h-10" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">To</label>
              <Input type="date" name="to" defaultValue={searchParams.to ?? ''} className="h-10" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="h-10 bg-primary font-bold flex-1">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" asChild className="h-10 px-3">
                <Link href="/audit-logs">
                  <X className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Logs */}
      <div className="space-y-2">
        {logs.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ScrollText className="h-8 w-8 opacity-20" />
                <p className="font-medium">No audit events found matching your criteria.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          logs.map((log) => {
            const trail = Array.isArray(log.auditTrail) ? log.auditTrail : [];
            return (
              <Card key={log.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Status icon */}
                    <div className="shrink-0 flex md:flex-col items-center gap-2 md:gap-1">
                      <StatusIcon status={log.status} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        {log.status}
                      </span>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Identity */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Scanner</p>
                        <div className="flex items-center gap-1.5">
                          {log.user ? (
                            <Smartphone className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Monitor className="h-3 w-3 text-muted-foreground" />
                          )}
                          <p className="text-xs font-bold text-foreground">{log.user?.name ?? 'Anonymous'}</p>
                        </div>
                        {log.user?.email && (
                          <p className="text-[10px] text-muted-foreground">{log.user.email}</p>
                        )}
                      </div>

                      {/* Organization & Gate */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Organization / Gate</p>
                        <p className="text-xs font-bold text-foreground">
                          {log.qrCode?.organization?.name ?? '—'}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{log.gate?.name ?? '—'}</p>
                      </div>

                      {/* QR Code */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">QR Credential</p>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[9px] font-bold uppercase h-4 px-1.5">
                            {log.qrCode?.type ?? 'DIRECT'}
                          </Badge>
                        </div>
                        <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
                          {log.qrCode?.code?.slice(0, 16)}…
                        </p>
                      </div>

                      {/* Timestamp & UUID */}
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</p>
                        <p className="text-xs font-bold text-foreground">
                          {log.scannedAt.toLocaleDateString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {log.scannedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                        {log.scanUuid && (
                          <p className="text-[9px] font-mono text-muted-foreground truncate max-w-[150px]" title={log.scanUuid}>
                            {log.scanUuid.slice(0, 16)}…
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Audit trail */}
                  {trail.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Audit Trail ({trail.length} event{trail.length !== 1 ? 's' : ''})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(trail as Array<Record<string, unknown>>).slice(0, 6).map((entry, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-muted/50 border border-border px-2.5 py-1.5 text-[10px] font-mono text-muted-foreground max-w-[300px] truncate"
                            title={JSON.stringify(entry)}
                          >
                            {entry.action as string ?? entry.event as string ?? `Event ${i + 1}`}
                            {entry.ts && (
                              <span className="ml-1.5 text-[9px] opacity-60">
                                {new Date(entry.ts as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        ))}
                        {trail.length > 6 && (
                          <span className="text-[10px] text-muted-foreground self-center">+{trail.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Page {page} <span className="text-border mx-2">/</span> {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              asChild={page > 1}
              className="h-9 font-bold text-[11px] uppercase tracking-wider"
            >
              {page > 1 ? (
                <Link href={`/audit-logs?${new URLSearchParams({ ...currentParams, page: String(page - 1) })}`}>
                  <ChevronLeft className="h-4 w-4 mr-1.5" />
                  Prev
                </Link>
              ) : (
                <span><ChevronLeft className="h-4 w-4 mr-1.5" />Prev</span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              asChild={page < totalPages}
              className="h-9 font-bold text-[11px] uppercase tracking-wider"
            >
              {page < totalPages ? (
                <Link href={`/audit-logs?${new URLSearchParams({ ...currentParams, page: String(page + 1) })}`}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </Link>
              ) : (
                <span>Next<ChevronRight className="h-4 w-4 ml-1.5" /></span>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground px-1">
        <Shield className="h-3 w-3" />
        <p>Audit logs are immutable. All scan events are captured in real-time with full context.</p>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  const map: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
    SUCCESS: { icon: CheckCircle2, color: 'text-emerald-500' },
    DENIED: { icon: XCircle, color: 'text-red-500' },
    FAILED: { icon: AlertCircle, color: 'text-amber-500' },
    EXPIRED: { icon: Clock, color: 'text-blue-500' },
    MAX_USES_REACHED: { icon: AlertCircle, color: 'text-violet-500' },
    INACTIVE: { icon: XCircle, color: 'text-slate-500' },
  };
  const config = map[status] ?? { icon: Clock, color: 'text-muted-foreground' };
  const Icon = config.icon;
  return <Icon className={cn('h-5 w-5 shrink-0', config.color)} />;
}
