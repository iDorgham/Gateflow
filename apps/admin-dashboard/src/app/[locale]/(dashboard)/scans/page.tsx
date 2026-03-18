import React from 'react';
import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import {
  Search,
  Building2,
  Shield,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  Badge,
  Button,
  Input,
  Pagination,
  DatePicker,
} from '@gate-access/ui';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { GlobalScansTable } from '@/components/monitoring/GlobalScansTable';

export const metadata = { title: 'Security Audit Logs' };

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
  const { t } = (await getTranslation(locale, 'admin')) as { t: any; dict: any };

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <PageHeader
        title={t('scans.title')}
        subtitle={t('scans.subtitle')}
        badge={
          <Badge variant="success" className="h-6 px-3 shadow-sm">
             {total.toLocaleString(locale)} Records
          </Badge>
        }
      />

      {/* Filters Container */}
      <div className="bg-[var(--ds-background-default,#FFFFFF)] dark:bg-[#1D2125] border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] rounded-sm p-4 shadow-sm space-y-4">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-end">
          <div className="space-y-1.5 lg:col-span-2">
            <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-subtle,#6B778C)] ltr:ml-1 rtl:mr-1">
              <Building2 className="h-3 w-3" />
              {t('scans.organization')}
            </label>
            <div className="relative group">
              <Building2 className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--ds-text-subtlest,#A5ADBA)] group-focus-within:text-[var(--ds-text-brand,#0052CC)] transition-colors" />
              <Input
                name="org"
                defaultValue={orgFilter}
                placeholder={t('scans.filterByOrg')}
                className="ltr:pl-9 rtl:pr-9 h-8 bg-[var(--ds-background-neutral-subtle,#F4F5F7)] dark:bg-[#2C333A] border-[#DFE1E6] dark:border-[#343A46] focus:bg-white dark:focus:bg-[#1D2125] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-subtle,#6B778C)] ltr:ml-1 rtl:mr-1">
              {t('scans.status')}
            </label>
            <select
              name="status"
              defaultValue={statusFilter}
              className="w-full h-8 rounded-sm border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] bg-white dark:bg-[#1D2125] px-3 text-xs font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)]"
            >
              <option value="">{t('scans.allStatuses', 'All Scan Outcomes')}</option>
              {['SUCCESS', 'DENIED', 'FAILED', 'EXPIRED'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2 xl:col-span-1">
            <DatePicker
              label="From Date"
              name="from"
              defaultValue={searchParams.from ?? ''}
              className="w-full"
            />
          </div>

          <div className="lg:col-span-2 xl:col-span-1">
            <DatePicker
              label="To Date"
              name="to"
              defaultValue={searchParams.to ?? ''}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" className="h-8 px-6 font-bold flex-1 rounded-sm">
              <Search className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('scans.search')}
            </Button>
            <Button variant="subtle" className="h-8 w-8 p-0" asChild>
              <Link href="/scans">
                <X className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-[var(--ds-background-default,#FFFFFF)] dark:bg-[#1D2125] border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] rounded-sm shadow-md overflow-hidden">
        <GlobalScansTable scans={scans as any} locale={locale} />
      </div>

      {/* Pagination & Audit Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-tighter text-[var(--ds-text-subtlest,#A5ADBA)]">
          <Shield className="h-4 w-4 text-[var(--ds-text-success,#00875A)]" />
          <p>{t('scans.auditNotice')}</p>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={undefined} // Server-side usage via URL
          getHref={(p) => `/scans?${new URLSearchParams({ ...searchParams, page: String(p) }).toString()}`}
          className="w-auto"
        />
      </div>

      <div className="pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ds-text-subtlest,#A5ADBA)]">
         <span>Platform Access Monitoring Engine v2.0</span>
         <span className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3 animate-pulse" />
            Live Sync: Active
         </span>
      </div>
    </div>
  );
}
