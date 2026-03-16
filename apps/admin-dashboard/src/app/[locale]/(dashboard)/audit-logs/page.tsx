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
import { Badge, Button, Input, cn, Pagination } from '@gate-access/ui';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { AuditLogsTable } from '@/components/monitoring/AuditLogsTable';

export const metadata = { title: 'Compliance Audit Archive' };

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
  const { t } = (await getTranslation(locale, 'admin')) as { t: any; dict: any };

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
          <Button variant="outline" size="sm" asChild className="font-bold gap-2 h-10 px-6 rounded-lg border-[var(--ds-border,#DFE1E6)] hover:bg-[var(--ds-background-neutral-subtle,#F4F5F7)] transition-all">
            <a href={exportUrl} download>
              <Download className="h-4 w-4 text-[var(--ds-text-brand,#0052CC)]" />
              {t('auditLogs.exportCsv')}
            </a>
          </Button>
        }
      />

      {/* Advanced Filters */}
      <div className="bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] rounded-xl p-5 shadow-sm space-y-6">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-5 items-end">
          <div className="space-y-2 lg:col-span-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle,#6B778C)] ltr:ml-1 rtl:mr-1">
              <Building2 className="h-3 w-3" />
              {t('auditLogs.organization')}
            </label>
            <div className="relative group">
              <Building2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtlest,#A5ADBA)] group-focus-within:text-[var(--ds-text-brand,#0052CC)] transition-colors" />
              <Input
                name="org"
                defaultValue={orgFilter}
                placeholder={t('auditLogs.filterByOrg')}
                className="ltr:pl-9 rtl:pr-9 h-11 bg-[var(--ds-background-neutral-subtle,#F4F5F7)] border-none rounded-lg focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle,#6B778C)] ltr:ml-1 rtl:mr-1">
              <FileText className="h-3 w-3" />
              {t('auditLogs.scanUuid', 'Event UUID')}
            </label>
            <div className="relative group">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtlest,#A5ADBA)] group-focus-within:text-[var(--ds-text-brand,#0052CC)] transition-colors" />
              <Input
                name="q"
                defaultValue={uuidFilter}
                placeholder={t('auditLogs.uuidPlaceholder')}
                className="ltr:pl-9 rtl:pr-9 h-11 bg-[var(--ds-background-neutral-subtle,#F4F5F7)] border-none rounded-lg focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle,#6B778C)] ltr:ml-1 rtl:mr-1">
              {t('auditLogs.status')}
            </label>
            <select
              name="status"
              defaultValue={statusFilter}
              className="w-full h-11 rounded-lg border border-[var(--ds-border,#DFE1E6)] bg-white px-4 text-xs font-bold text-[var(--ds-text,#172B4D)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)]"
            >
              <option value="">{t('auditLogs.all')}</option>
              {['SUCCESS', 'DENIED', 'FAILED', 'EXPIRED', 'MAX_USES_REACHED', 'INACTIVE'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle,#6B778C)] ltr:ml-1 rtl:mr-1">
               Audit Window (From/To)
            </label>
            <div className="grid grid-cols-2 gap-2 h-11 p-1 bg-[var(--ds-background-neutral-subtle,#F4F5F7)] rounded-lg border border-[var(--ds-border,#DFE1E6)]">
               <input
                 type="date"
                 name="from"
                 defaultValue={searchParams.from ?? ''}
                 className="bg-transparent border-none text-[11px] font-bold text-[var(--ds-text,#172B4D)] px-2 outline-none"
               />
               <input
                 type="date"
                 name="to"
                 defaultValue={searchParams.to ?? ''}
                 className="bg-transparent border-none text-[11px] font-bold text-[var(--ds-text,#172B4D)] px-2 outline-none"
               />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="h-11 px-8 font-bold shadow-md flex-1">
              <Search className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('auditLogs.search')}
            </Button>
            <Button variant="subtle" className="h-11 w-11 p-0 rounded-lg" asChild>
              <Link href="/audit-logs">
                <X className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] rounded-xl shadow-md overflow-hidden">
        <AuditLogsTable logs={logs as any} locale={locale} t={t} />
      </div>

      {/* Pagination & Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-tighter text-[var(--ds-text-subtlest,#A5ADBA)]">
           <Shield className="h-4 w-4 text-[var(--ds-text-brand,#0052CC)]" />
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

      <div className="pt-6 border-t border-[var(--ds-border,#DFE1E6)] flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest,#A5ADBA)] opacity-60">
         <span className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Immutable Audit Trail Engine
         </span>
         <span>Compliance Level: SOC2/GDPR Ready</span>
      </div>
    </div>
  );
}
