'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Badge,
  cn,
  DynamicTable,
  type Column
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { 
  RefreshCw, 
  Search 
} from 'lucide-react';
import type { QRCodeRow } from '@/lib/qrcodes/use-qrcodes';

const STATUS_BADGE: Record<string, { className?: string }> = {
  ACTIVE: { className: 'bg-[var(--ds-background-success-subtle,#E3FCEF)] text-[var(--ds-text-success,#006644)] border-none' },
  INACTIVE: { className: 'bg-[var(--ds-background-neutral-subtle,#F4F5F7)] text-[var(--ds-text-subtle,#42526E)] border-none' },
  EXPIRED: { className: 'bg-[var(--ds-background-warning-subtle,#FFF0B3)] text-[var(--ds-text-warning-inverse,#172B4D)] border-none' },
  MAX_USES_REACHED: { className: 'bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--ds-text-selected,#0747A6)] border-none' },
  REVOKED: { className: 'bg-[var(--ds-background-danger-subtle,#FFEBE6)] text-[var(--ds-text-danger,#BF2600)] border-none' },
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  EXPIRED: 'Expired',
  MAX_USES_REACHED: 'Max Uses',
  REVOKED: 'Revoked',
};

interface QRCodesTableProps {
  data: QRCodeRow[];
  isLoading: boolean;
  isFetching?: boolean;
  error: Error | null;
  onRefresh: () => void;
  locale: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (nextSortBy: string, nextSortOrder: 'asc' | 'desc') => void;
  selectedIds: string[];
  onToggleRow?: (id: string, checked: boolean) => void;
  onSelectionChange?: (ids: (string | number)[]) => void;
}

export function QRCodesTable({
  data,
  isLoading,
  error,
  onRefresh,
  locale,
  sortBy,
  sortOrder,
  onSortChange,
  selectedIds,
  onSelectionChange,
}: QRCodesTableProps) {
  const { t } = useTranslation('dashboard');

  const columns = useMemo<Column<QRCodeRow>[]>(() => [
    {
      key: 'code',
      label: t('qrcodes.code', 'QR Identifier'),
      isSortable: true,
      render: (item) => {
        const code = item.code;
        const display = code.length > 12 ? `${code.slice(0, 8)}…${code.slice(-4)}` : code;
        return (
          <div className="flex flex-col">
            <Link
              href={`/${locale}/dashboard/qrcodes?q=${encodeURIComponent(code)}`}
              className="font-mono text-xs font-black text-[var(--ds-text-link,#0052CC)] hover:underline tracking-tight"
              title={code}
            >
              {display}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className="text-[10px] font-black text-[var(--ds-text-subtle,#6B778C)] uppercase tracking-widest opacity-60">
                 {t(`qrcodes.types.${item.type}`, item.type)}
               </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'guestName',
      label: t('qrcodes.guestName', 'QR Holder'),
      isSortable: true,
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-black text-[var(--ds-text,#172B4D)] truncate max-w-[150px]">
            {item.guestName ?? '—'}
          </span>
          {item.guestEmail && (
            <span className="text-[10px] font-bold text-[var(--ds-text-subtle,#6B778C)] lowercase opacity-70 truncate max-w-[150px]">
              {item.guestEmail}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'projectName',
      label: t('qrcodes.project', 'Property'),
      isSortable: true,
      render: (item) => (
        item.projectName ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ds-background-brand-subtle,#DEEBFF)] px-2 py-0.5 text-[10px] font-black text-[var(--ds-text-brand,#0052CC)] uppercase tracking-widest whitespace-nowrap">
            {item.projectName}
          </span>
        ) : <span className="text-[var(--ds-text-subtle,#6B778C)]">—</span>
      ),
    },
    {
      key: 'status',
      label: t('qrcodes.table.status', 'Access Health'),
      isSortable: true,
      render: (item) => {
        const status = item.status;
        const config = STATUS_BADGE[status] ?? STATUS_BADGE.INACTIVE;
        return (
          <div className="flex items-center">
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em]',
              config.className
            )}>
              <div className={cn("h-1.5 w-1.5 rounded-full", status === 'ACTIVE' ? "bg-emerald-500 animate-pulse" : "bg-zinc-400")} />
              {STATUS_LABEL[status] ?? status}
            </span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: t('qrcodes.createdAt', 'Issued'),
      isSortable: true,
      render: (item) => (
        <div className="flex flex-col tabular-nums">
          <span className="text-[13px] font-bold text-[var(--ds-text,#172B4D)]">
            {new Date(item.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      key: 'scansCount',
      label: t('qrcodes.scansCount', 'Usage'),
      isSortable: true,
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2 tabular-nums">
          <span className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-md bg-[var(--ds-background-neutral-subtle,#F4F5F7)] px-1.5 text-[11px] font-black text-[var(--ds-text,#172B4D)] shadow-inner">
            {item.scansCount}
          </span>
        </div>
      ),
    },
  ], [locale, t]);

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--ds-border-danger,#FF5630)] bg-[var(--ds-background-danger-subtle,#FFEBE6)] p-8 text-center animate-in zoom-in duration-300">
        <p className="text-sm font-black text-[var(--ds-text-danger,#DE350B)] uppercase tracking-widest">{error.message}</p>
        <button
          onClick={onRefresh}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[var(--ds-text-danger,#DE350B)] shadow-sm hover:bg-[#F4F5F7]"
        >
          <RefreshCw className="h-4 w-4" />
          {t('common.retry', 'Retry Operation')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--ds-background-default,#FFFFFF)] rounded-2xl border border-[var(--ds-border,#DFE1E6)] overflow-hidden shadow-sm transition-all duration-300">
      <DynamicTable
        columns={columns}
        items={data}
        isLoading={isLoading}
        sortKey={sortBy}
        sortOrder={sortOrder}
        onSort={(key) => onSortChange(key, sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc')}
        isSelectable
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}
