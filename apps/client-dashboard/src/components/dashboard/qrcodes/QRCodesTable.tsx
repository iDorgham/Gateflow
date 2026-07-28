'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { cn, DynamicTable, type Column } from '@gateflow/ui';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import type { QRCodeRow } from '@/lib/qrcodes/use-qrcodes';
import dynamic from 'next/dynamic';
const QRDetailDrawer = dynamic(
  () => import('./QRDetailDrawer').then((m) => ({ default: m.QRDetailDrawer })),
  { ssr: false }
);

const STATUS_BADGE: Record<string, { className?: string }> = {
  ACTIVE: {
    className:
      'bg-[var(--ds-background-success-subtle)] text-[var(--ds-text-success)]',
  },
  INACTIVE: {
    className:
      'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)]',
  },
  EXPIRED: {
    className:
      'bg-[var(--ds-background-warning-subtle)] text-[var(--ds-text-warning-inverse)]',
  },
  MAX_USES_REACHED: {
    className: 'bg-primary/10 text-primary border border-primary/20',
  },
  REVOKED: {
    className:
      'bg-[var(--ds-background-danger-subtle)] text-[var(--ds-text-danger)]',
  },
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
  const [drawerQR, setDrawerQR] = useState<QRCodeRow | null>(null);

  const columns = useMemo<Column<QRCodeRow>[]>(
    () => [
      {
        key: 'code',
        label: t('qrcodes.code', 'QR Identifier'),
        isSortable: true,
        render: (item) => {
          const code = item.code;
          const display =
            code.length > 12 ? `${code.slice(0, 8)}…${code.slice(-4)}` : code;
          return (
            <div className="flex flex-col">
              <Link
                href={`/${locale}/dashboard/qrcodes?q=${encodeURIComponent(code)}`}
                className="font-mono text-xs font-black text-primary hover:underline tracking-tight"
                title={code}
              >
                {display}
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-black text-[var(--ds-text-subtle)] uppercase tracking-widest opacity-60">
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
            <span className="text-[13px] font-black text-[var(--ds-text)] truncate max-w-[150px]">
              {item.guestName ?? '—'}
            </span>
            {item.guestEmail && (
              <span className="text-[10px] font-bold text-[var(--ds-text-subtle)] lowercase opacity-70 truncate max-w-[150px]">
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
        render: (item) =>
          item.projectName ? (
            <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-tight whitespace-nowrap border border-primary/20">
              {item.projectName}
            </span>
          ) : (
            <span className="text-[var(--ds-text-subtle)]">—</span>
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
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider',
                  config.className
                )}
              >
                <div
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    status === 'ACTIVE'
                      ? 'bg-[var(--ds-icon-success)] animate-pulse'
                      : 'bg-[var(--ds-icon-subtle)]'
                  )}
                />
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
            <span className="text-[13px] font-semibold text-[var(--ds-text)]">
              {new Date(item.createdAt).toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
                year: '2-digit',
              })}
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
            <span className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-md bg-[var(--ds-background-neutral-subtle)] px-1.5 text-[11px] font-black text-[var(--ds-text)] shadow-inner">
              {item.scansCount}
            </span>
          </div>
        ),
      },
    ],
    [locale, t]
  );

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--ds-border-danger)] bg-[var(--ds-background-danger-subtle)] p-8 text-center animate-in zoom-in duration-300">
        <p className="text-sm font-black text-[var(--ds-text-danger)] uppercase tracking-widest">
          {error.message}
        </p>
        <button
          onClick={onRefresh}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2 text-sm font-bold text-[var(--ds-text-danger)] shadow-sm hover:bg-[var(--ds-background-neutral-subtle-hovered)]"
        >
          <RefreshCw className="h-4 w-4" />
          {t('common.retry', 'Retry Operation')}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[var(--ds-background-default)] rounded-2xl border border-[var(--ds-border)] overflow-hidden shadow-sm transition-all duration-300">
        <DynamicTable
          columns={columns}
          items={data}
          isLoading={isLoading}
          sortKey={sortBy}
          sortOrder={sortOrder}
          onSort={(key) =>
            onSortChange(
              key,
              sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc'
            )
          }
          isSelectable
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onRowClick={(item) => setDrawerQR(item)}
          density="compact"
        />
      </div>
      <QRDetailDrawer
        qr={drawerQR}
        locale={locale}
        onClose={() => setDrawerQR(null)}
      />
    </>
  );
}
