'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  cn,
  DynamicTable,
  type Column
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { 
  QrCode, 
  Building, 
  DoorOpen 
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  SUCCESS: 'bg-[#E3FCEF] text-[#006644] dark:bg-[#E3FCEF]/10 dark:text-[#E3FCEF]',
  FAILED: 'bg-[#FFEBE6] text-[#BF2600] dark:bg-[#FFEBE6]/10 dark:text-[#FF8F73]',
  EXPIRED: 'bg-[#FFF0B3] text-[#172B4D] dark:bg-[#FFF0B3]/10 dark:text-[#FFF0B3]',
  MAX_USES_REACHED: 'bg-[#DEEBFF] text-[#0747A6] dark:bg-[#DEEBFF]/10 dark:text-[#DEEBFF]',
  INACTIVE: 'bg-[#F4F5F7] text-[#42526E] dark:bg-[#F4F5F7]/10 dark:text-[#A5ADBA]',
  DENIED: 'bg-[#FFEBE6] text-[#BF2600] dark:bg-[#FFEBE6]/10 dark:text-[#FF8F73]',
};

export interface ScanLog {
  id: string;
  scannedAt: Date;
  status: string;
  qrCode: {
    code: string | null;
    type: string | null;
    project: { id: string; name: string } | null;
  } | null;
  gate: { name: string } | null;
  user: { name: string | null; email: string | null } | null;
}

export interface ScansTableProps {
  data: ScanLog[];
  isLoading?: boolean;
  locale: string;
  sortCol: string;
  sortDir: 'asc' | 'desc';
  showProjectColumn: boolean;
  buildUrl: (overrides: Record<string, string | undefined>) => string;
}

export function ScansTable({
  data,
  isLoading,
  locale,
  sortCol,
  sortDir,
  showProjectColumn,
  buildUrl,
}: ScansTableProps) {
  const { t } = useTranslation('dashboard');
  const router = useRouter();

  const handleSort = (key: string) => {
    const newDir = sortCol === key && sortDir === 'desc' ? 'asc' : 'desc';
    router.push(buildUrl({ sort: `${key}:${newDir}`, page: '1' }));
  };

  const columns = useMemo<Column<ScanLog>[]>(() => {
    const cols: Column<ScanLog>[] = [
      {
        key: 'scannedAt',
        label: t('scans.table.dateTime', 'Timestamp'),
        isSortable: true,
        render: (item) => (
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8]">
              {new Date(item.scannedAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-[10px] font-black text-[var(--ds-text-subtle,#6B778C)] uppercase tracking-tighter">
               {new Date(item.scannedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </span>
          </div>
        ),
      },
      {
        key: 'qrCode',
        label: t('scans.table.qrCode', 'QR Identifier'),
        render: (item) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[var(--ds-background-neutral-subtle,#F4F5F7)] dark:bg-[#2C333A] flex items-center justify-center shrink-0">
               <QrCode className="h-4 w-4 text-[var(--ds-text-subtle,#6B778C)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-black text-[var(--ds-text-link,#0052CC)] dark:text-[#4C9AFF] tracking-wider">
                {item.qrCode?.code?.slice(0, 12)}...
              </span>
              {item.qrCode?.type && (
                <span className="text-[10px] font-bold text-[var(--ds-text-subtle,#6B778C)] uppercase tracking-widest leading-tight opacity-70">
                  {item.qrCode.type}
                </span>
              )}
            </div>
          </div>
        ),
      },
    ];

    if (showProjectColumn) {
      cols.push({
        key: 'project',
        label: t('scans.table.project', 'Property'),
        render: (item) => (
          item.qrCode?.project?.name ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ds-background-brand-subtle,#DEEBFF)] dark:bg-[#DEEBFF]/10 px-3 py-1 text-[11px] font-black text-[var(--ds-text-brand,#0052CC)] dark:text-[#DEEBFF] uppercase tracking-widest">
              <Building className="h-3 w-3" />
              {item.qrCode.project.name}
            </span>
          ) : <span className="text-[var(--ds-text-subtlest,#A5ADBA)]">—</span>
        ),
      });
    }

    cols.push(
      {
        key: 'gate',
        label: t('scans.table.gate', 'Entry Point'),
        isSortable: true,
        render: (item) => (
          <div className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-[var(--ds-text-subtle,#6B778C)] opacity-50" />
            <span className="text-[13px] font-bold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8]">
              {item.gate?.name ?? <span className="text-[var(--ds-text-subtlest,#A5ADBA)]">—</span>}
            </span>
          </div>
        ),
      },
      {
        key: 'operator',
        label: t('scans.table.operator', 'Security Guard'),
        render: (item) => item.user ? (
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-[var(--ds-background-neutral,#EBECF0)] dark:bg-[#343A46] flex items-center justify-center text-[10px] font-black text-[var(--ds-text-subtle,#6B778C)]">
                {item.user.name?.split(' ').map(n => n[0]).join('')}
             </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8]">{item.user.name}</span>
              <span className="text-[10px] font-bold text-[var(--ds-text-subtle,#6B778C)] lowercase">{item.user.email}</span>
            </div>
          </div>
        ) : <span className="text-[var(--ds-text-subtlest,#A5ADBA)]">—</span>,
      },
      {
        key: 'status',
        label: t('scans.table.status', 'Validation'),
        isSortable: true,
        align: 'right',
        render: (item) => (
          <div className="flex justify-end">
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm', 
              STATUS_COLORS[item.status] ?? 'bg-[var(--ds-background-neutral-subtle,#F4F5F7)] text-[var(--ds-text-subtle,#42526E)]'
            )}>
              <div className={cn("h-1.5 w-1.5 rounded-full", item.status === 'SUCCESS' ? "bg-emerald-500" : "bg-rose-500")} />
              {t(`scans.status.${item.status}`, { defaultValue: item.status.replace(/_/g, ' ') })}
            </span>
          </div>
        ),
      }
    );

    return cols;
  }, [locale, t, showProjectColumn]);

  return (
    <div className="bg-white dark:bg-[#1D2125] rounded-2xl border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] overflow-hidden shadow-sm">
      <DynamicTable
        columns={columns}
        items={data}
        isLoading={isLoading}
        sortKey={sortCol}
        sortOrder={sortDir}
        onSort={handleSort}
      />
    </div>
  );
}
