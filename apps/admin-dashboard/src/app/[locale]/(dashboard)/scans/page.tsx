import React from 'react';
import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import {
  ScanLine,
  Search,
  Calendar,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Building2,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Shield,
  X,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  cn,
} from '@gate-access/ui';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export const metadata = { title: 'Scan Logs' };

interface SearchParams {
  org?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: string;
}

const PAGE_SIZE = 50;

export default async function AdminScansPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const { t } = await getTranslation(locale, 'admin');

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

  const orgFilter = searchParams.org?.trim() ?? '';
  const statusFilter = searchParams.status ?? '';
  const fromRaw = searchParams.from ? new Date(searchParams.from) : undefined;
  const toRaw = searchParams.to ? new Date(searchParams.to + 'T23:59:59') : undefined;
  const fromDate = fromRaw && !isNaN(fromRaw.getTime()) ? fromRaw : undefined;
  const toDate = toRaw && !isNaN(toRaw.getTime()) ? toRaw : undefined;

  // Build where clause
  const VALID_STATUSES = new Set(['SUCCESS', 'DENIED', 'FAILED', 'EXPIRED', 'MAX_USES_REACHED', 'INACTIVE']);
  const where: Record<string, unknown> = {};
  if (statusFilter && VALID_STATUSES.has(statusFilter)) where.status = statusFilter;
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
            organization: { select: { id: true, name: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('scans.title')}
        subtitle={t('scans.subtitle')}
        badge={<Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800 font-bold text-xs">{t('scans.totalRecords', { count: total })}</Badge>}
      />

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form method="GET" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
            <div className="space-y-1.5 xl:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ltr:ml-1 rtl:mr-1">{t('scans.organization')}</label>
              <div className="relative">
                <Building2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="org"
                  defaultValue={orgFilter}
                  placeholder={t('scans.filterByOrg')}
                  className="ltr:pl-9 rtl:pr-9 h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ltr:ml-1 rtl:mr-1">{t('scans.status')}</label>
              <select
                name="status"
                defaultValue={statusFilter}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">{t('scans.allStatuses')}</option>
                {['SUCCESS', 'DENIED', 'FAILED', 'PENDING'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ltr:ml-1 rtl:mr-1">{t('scans.from')}</label>
              <Input
                type="date"
                name="from"
                defaultValue={searchParams.from ?? ''}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ltr:ml-1 rtl:mr-1">{t('scans.to')}</label>
              <Input
                type="date"
                name="to"
                defaultValue={searchParams.to ?? ''}
                className="h-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex-1">
                <Search className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('scans.search')}
              </Button>
              <Button variant="outline" size="sm" asChild className="h-10 px-3">
                <Link href="/scans">
                  <X className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <Card className="shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
                  <th className="px-6 py-4 text-left rtl:text-right">{t('scans.identityDevice')}</th>
                  <th className="px-6 py-4 text-left rtl:text-right">{t('scans.logistics')}</th>
                  <th className="px-6 py-4 text-left rtl:text-right">{t('scans.credential')}</th>
                  <th className="px-6 py-4 text-left rtl:text-right">{t('scans.status')}</th>
                  <th className="px-6 py-4 text-right rtl:text-left">{t('scans.timestamp')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ScanLine className="h-8 w-8 opacity-20" />
                        <p className="font-medium">{t('scans.noResults')}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  scans.map((scan) => (
                    <tr key={scan.id} className="group hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-110",
                            scan.user ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                          )}>
                            {scan.user ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground leading-none">
                              {scan.user?.name ?? t('scans.anonymousScanner')}
                            </p>
                            <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">
                              ID: {scan.scanUuid?.slice(0, 8) ?? scan.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-foreground font-bold text-xs">
                            {scan.qrCode?.organization?.name ?? t('scans.systemMaster')}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                            <span className="inline-block w-1 h-3 bg-primary/20 rounded-full" />
                            {scan.gate?.name ?? t('scans.adminPortal')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-muted text-foreground border-none font-bold text-[9px] tracking-tight h-5">
                            {scan.qrCode?.type ?? 'DIRECT'}
                          </Badge>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {scan.qrCode?.code?.slice(0, 12)}…
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ScanStatusBadge status={scan.status} />
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                        <p className="text-xs font-bold text-foreground">{scan.scannedAt.toLocaleDateString(locale)}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {scan.scannedAt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {t('scans.pageOf', { current: page, total: totalPages })}
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
                <Link href={`/scans?${new URLSearchParams({ ...searchParams, page: String(page - 1) })}`}>
                  <ChevronLeft className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5 rtl:rotate-180" />
                  {t('scans.prev')}
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="h-4 w-4 ltr:mr-1.5 rtl:ml-1.5 rtl:rotate-180" />
                  {t('scans.prev')}
                </span>
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
                <Link href={`/scans?${new URLSearchParams({ ...searchParams, page: String(page + 1) })}`}>
                  {t('scans.next')}
                  <ChevronRight className="h-4 w-4 ltr:ml-1.5 rtl:mr-1.5 rtl:rotate-180" />
                </Link>
              ) : (
                <span>
                  {t('scans.next')}
                  <ChevronRight className="h-4 w-4 ltr:ml-1.5 rtl:mr-1.5 rtl:rotate-180" />
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground px-1">
        <Shield className="h-3 w-3" />
        <p>{t('scans.auditNotice')}</p>
      </div>
    </div>
  );
}

function ScanStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    SUCCESS: { bg: 'bg-emerald-500', text: 'text-white', icon: CheckCircle2 },
    DENIED: { bg: 'bg-red-500', text: 'text-white', icon: XCircle },
    FAILED: { bg: 'bg-amber-500', text: 'text-white', icon: AlertCircle },
    PENDING: { bg: 'bg-blue-500', text: 'text-white', icon: Clock },
  };

  const current = styles[status] || { bg: 'bg-muted', text: 'text-muted-foreground', icon: Clock };
  const Icon = current.icon;

  return (
    <Badge className={cn(
      "border-none rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase shadow-sm flex items-center gap-1.5",
      current.bg,
      current.text
    )}>
      <Icon className="h-2.5 w-2.5" />
      {status}
    </Badge>
  );
}
