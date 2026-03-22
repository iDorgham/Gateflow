'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { ScansTable, type ScanLog } from '@/components/dashboard/scans/ScansTable';
import { Pagination } from '@gate-access/ui';

interface ScansTableWithPaginationProps {
  data: ScanLog[];
  locale: string;
  sortCol: string;
  sortDir: 'asc' | 'desc';
  showProjectColumn: boolean;
  page: number;
  totalPages: number;
  rangeText: string;
}

export function ScansTableWithPagination({
  data,
  locale,
  sortCol,
  sortDir,
  showProjectColumn,
  page,
  totalPages,
  rangeText
}: ScansTableWithPaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) p.set(k, v);
      else p.delete(k);
    });
    const s = p.toString();
    return `${pathname}${s ? '?' + s : ''}`;
  }

  return (
    <div className="space-y-6">
      <ScansTable
        data={data}
        locale={locale}
        sortCol={sortCol}
        sortDir={sortDir}
        showProjectColumn={showProjectColumn}
        buildUrl={buildUrl}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest">
            <span className="tabular-nums">
              {rangeText}
            </span>
          </div>
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={() => {}}
            getHref={(p) => buildUrl({ page: String(p) })}
            className="w-auto"
          />
        </div>
      )}
    </div>
  );
}
