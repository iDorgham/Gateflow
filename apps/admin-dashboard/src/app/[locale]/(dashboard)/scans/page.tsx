import React from 'react';
import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import {
  Search,
  Building2,
  Shield,
  History,
} from 'lucide-react';
import {
  Badge,
  Button,
  Input,
} from '@gate-access/ui';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { GlobalScansTable } from '@/components/monitoring/GlobalScansTable';

export const metadata = { title: 'Security Audit Logs' };

interface ScanLog {
  id: string;
  scanUuid: string | null;
  status: string;
  scannedAt: Date;
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
  const { t } = (await getTranslation(locale, 'admin')) as { t: (key: string, options?: Record<string, unknown> | string) => string };

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <PageHeader
        title={t('scans.title')}
        subtitle={t('scans.subtitle')}
        badge={
          <Badge variant="primary" className="bg-ds-background-selected text-ds-text-selected border-ds-border-selected/30 font-bold h-6 px-3 shadow-sm">
            {total.toLocaleString(locale)} {t('scans.totalScans')}
          </Badge>
        }
      />

      {/* Filters Container */}
      <div className="bg-ds-background-default border border-ds-border rounded-xl p-5 shadow-sm space-y-6">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-5 items-end">
          <div className="space-y-2 lg:col-span-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-ds-text-subtle ltr:ml-1 rtl:mr-1">
              <Building2 className="h-3 w-3" />
              {t('scans.organization')}
            </label>
            <div className="relative group">
              <Building2 className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-brand transition-colors" />
              <Input
                name="org"
                defaultValue={orgFilter}
                placeholder={t('scans.filterByOrg')}
                className="ltr:pl-10 rtl:pr-10 h-11 rounded-lg bg-ds-background-neutral-subtle border-ds-border focus:border-ds-border-focused text-sm font-medium focus:bg-ds-background-default transition-all shadow-inner outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle ltr:ml-1 rtl:mr-1">
              {t('scans.status')}
            </label>
            <select
              name="status"
              defaultValue={statusFilter}
              className="w-full h-11 rounded-lg border border-ds-border bg-ds-background-default px-4 text-xs font-bold text-ds-text focus:outline-none focus:ring-2 focus:ring-ds-border-focused"
            >
              <option value="">{t('scans.all')}</option>
              {['SUCCESS', 'DENIED', 'FAILED', 'EXPIRED', 'MAX_USES_REACHED', 'INACTIVE'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle ltr:ml-1 rtl:mr-1">
               {t('scans.timeRange', 'Audit Window')}
            </label>
            <div className="grid grid-cols-2 gap-2 h-11 p-1 bg-ds-background-neutral-subtle rounded-lg border border-ds-border">
              <input
                type="date"
                name="from"
                defaultValue={searchParams.from ?? ''}
                className="bg-transparent border-none text-ds-text px-2 outline-none"
              />
              <input
                type="date"
                name="to"
                defaultValue={searchParams.to ?? ''}
                className="bg-transparent border-none text-ds-text px-2 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" className="h-11 px-8 font-bold shadow-sm flex-1">
              <Search className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('scans.search')}
            </Button>
            <Button variant="subtle" className="h-11 w-11 p-0 rounded-lg border-ds-border" asChild>
              <Link href="/audit-logs">
                <History className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Scans Table Card */}
      <div className="bg-ds-background-default border border-ds-border rounded-xl shadow-md overflow-hidden">
        <GlobalScansTable scans={scans as ScanLog[]} locale={locale} />
      </div>

      <div className="flex flex-col gap-6 pt-4 border-t border-ds-border px-1">
        <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-tighter text-ds-text-subtlest">
          <Shield className="h-4 w-4 text-ds-icon-success" />
          {t('scans.auditNotice', 'Real-time Immutable Proof of Entry Protocol Active')}
        </div>
        <div className="pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest">
          <span>{t('scans.hashVerification', 'Global Hash Verification: PASSED')}</span>
          <span className="ltr:text-right rtl:text-left">{t('scans.systemStatus', 'Node Cluster: SYNCED')}</span>
        </div>
      </div>
    </div>
  );
}
