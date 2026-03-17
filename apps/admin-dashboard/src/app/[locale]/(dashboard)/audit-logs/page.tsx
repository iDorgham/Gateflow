import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import {
  Search,
  Building2,
  Shield,
  Download,
  X,
  History,
  FileText,
} from 'lucide-react';
import { Badge, Button, Input, Pagination, NativeSelect } from '@gate-access/ui';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { AuditLogsTable } from '@/components/monitoring/AuditLogsTable';

export const metadata = { title: 'Compliance Audit Archive' };

interface AuditLog {
  id: string;
  scanUuid: string | null;
  status: string;
  scannedAt: Date;
  auditTrail: Record<string, unknown>[];
  gate: { name: string } | null;
  qrCode: {
    type: string;
    code: string;
    organization: { id: string; name: string } | null;
  } | null;
  user: { name: string; email: string } | null;
}

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
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const { t } = (await getTranslation(locale, 'admin')) as { t: (key: string, options?: Record<string, unknown> | string) => string };

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

  const orgFilter = searchParams.org?.trim() ?? '';
  const statusFilter = searchParams.status ?? '';
  const uuidFilter = searchParams.q?.trim() ?? '';
  const fromRaw = searchParams.from ? new Date(searchParams.from) : undefined;
  const toRaw = searchParams.to ? new Date(searchParams.to + 'T23:59:59') : undefined;
  const fromDate = fromRaw && !isNaN(fromRaw.getTime()) ? fromRaw : undefined;
  const toDate = toRaw && !isNaN(toRaw.getTime()) ? toRaw : undefined;

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
    // skip-organization-check (Global Admin Audit)
    prisma.scanLog.count({ where }),
    // skip-organization-check (Global Admin Audit)
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <PageHeader
        title={t('auditLogs.title')}
        subtitle={t('auditLogs.subtitle')}
        badge={
          <Badge variant="primary" className="h-6 px-3 shadow-sm font-black italic">
             {total.toLocaleString(locale)} ENTRIES
          </Badge>
        }
        actions={
          <Button variant="outline" size="sm" asChild className="font-bold gap-2 h-10 px-6 rounded-lg border-ds-border hover:bg-ds-background-neutral-subtle transition-all">
            <a href={exportUrl} download>
              <Download className="h-4 w-4 text-ds-text-brand" />
              {t('auditLogs.exportCsv')}
            </a>
          </Button>
        }
      />

      {/* Advanced Filters */}
      <div className="bg-ds-background-default border border-ds-border rounded-xl p-5 shadow-sm space-y-6">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-5 items-end">
          <div className="space-y-2 lg:col-span-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-ds-text-subtle ltr:ml-1 rtl:mr-1">
              <Building2 className="h-3 w-3" />
              {t('auditLogs.organization')}
            </label>
            <div className="relative group">
              <Building2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-brand transition-colors" />
              <Input
                name="org"
                defaultValue={orgFilter}
                placeholder={t('auditLogs.filterByOrg')}
                className="ltr:pl-9 rtl:pr-9 h-10 bg-ds-background-neutral-subtle border-ds-border rounded-full focus:bg-ds-background-default transition-all shadow-none"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-ds-text-subtle ltr:ml-1 rtl:mr-1">
              <FileText className="h-3 w-3" />
              {t('auditLogs.scanUuid', 'Event UUID')}
            </label>
            <div className="relative group">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-brand transition-colors" />
              <Input
                name="q"
                defaultValue={uuidFilter}
                placeholder={t('auditLogs.uuidPlaceholder')}
                className="ltr:pl-9 rtl:pr-9 h-10 bg-ds-background-neutral-subtle border-ds-border rounded-full focus:bg-ds-background-default transition-all shadow-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle ltr:ml-1 rtl:mr-1">
              {t('auditLogs.status')}
            </label>
            <NativeSelect
              name="status"
              defaultValue={statusFilter}
              className="w-full h-10 rounded-full border border-ds-border bg-ds-background-default px-4 text-xs font-bold text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-border-focused"
            >
              <option value="">{t('auditLogs.all')}</option>
              {['SUCCESS', 'DENIED', 'FAILED', 'EXPIRED', 'MAX_USES_REACHED', 'INACTIVE'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle ltr:ml-1 rtl:mr-1">
               Audit Window (From/To)
            </label>
            <div className="grid grid-cols-2 gap-2 h-10 p-1 bg-ds-background-neutral-subtle rounded-full border border-ds-border">
               <input
                 type="date"
                 name="from"
                 defaultValue={searchParams.from ?? ''}
                 className="bg-transparent border-none text-[10px] font-bold text-ds-text px-3 outline-none uppercase"
               />
               <input
                 type="date"
                 name="to"
                 defaultValue={searchParams.to ?? ''}
                 className="bg-transparent border-none text-[10px] font-bold text-ds-text px-3 outline-none uppercase"
               />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="h-10 px-8 font-bold shadow-sm flex-1 rounded-full">
              <Search className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('auditLogs.search')}
            </Button>
            <Button variant="subtle" className="h-10 w-11 p-0 rounded-full" asChild>
              <Link href="/audit-logs">
                <X className="h-4 w-4 text-ds-text-subtlest" />
              </Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-ds-background-default border border-ds-border rounded-xl shadow-md overflow-hidden">
        <AuditLogsTable logs={logs as AuditLog[]} locale={locale} />
      </div>

      {/* Pagination & Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-tighter text-ds-text-subtlest">
           <Shield className="h-4 w-4 text-ds-text-brand" />
           <p>{t('auditLogs.auditNotice')}</p>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={undefined}
          getHref={(p) => `/audit-logs?${new URLSearchParams({ ...currentParams, page: String(p) }).toString()}`}
          className="w-auto"
        />
      </div>

      <div className="pt-6 border-t border-ds-border flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest opacity-60">
         <span className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Immutable Audit Trail Engine
         </span>
         <span>Compliance Level: SOC2/GDPR Ready</span>
      </div>
    </div>
  );
}
