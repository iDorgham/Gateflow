'use client';

import { useEffect, useMemo, useState, useCallback, useTransition } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  NativeSelect,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Download, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useQRCodes } from '@/lib/qrcodes/use-qrcodes';
import { QRCodesTable } from '@/components/dashboard/qrcodes/QRCodesTable';
import { PageHeader } from '@/components/dashboard/page-header';
import { FilterBar } from '@/components/dashboard/filter-bar';
import { toast } from 'sonner';

type SortBy =
  | 'createdAt'
  | 'expiresAt'
  | 'code'
  | 'type'
  | 'scansCount'
  | 'gateName'
  | 'projectName';

export default function QRCodesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const { t } = useTranslation('dashboard');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [expiresFrom, setExpiresFrom] = useState('');
  const [expiresTo, setExpiresTo] = useState('');
  const [lastScanFrom, setLastScanFrom] = useState('');
  const [lastScanTo, setLastScanTo] = useState('');

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  const filters = useMemo(
    () => ({
      page,
      pageSize,
      sortBy,
      sortOrder,
      search: debouncedSearch || undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      expiresFrom: expiresFrom || undefined,
      expiresTo: expiresTo || undefined,
      lastScanFrom: lastScanFrom || undefined,
      lastScanTo: lastScanTo || undefined,
    }),
    [
      page,
      pageSize,
      sortBy,
      sortOrder,
      debouncedSearch,
      createdFrom,
      createdTo,
      expiresFrom,
      expiresTo,
      lastScanFrom,
      lastScanTo,
    ]
  );
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, error, refetch } = useQRCodes(filters);
  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const effectivePageSize = data?.pageSize ?? pageSize;
  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize));

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const buildExportUrl = useCallback(
    (ids?: string[]) => {
      const sp = new URLSearchParams();
      sp.set('sortBy', sortBy);
      sp.set('sortOrder', sortOrder);
      if (filters.search) sp.set('search', filters.search);
      if (filters.createdFrom) sp.set('createdFrom', filters.createdFrom);
      if (filters.createdTo) sp.set('createdTo', filters.createdTo);
      if (filters.expiresFrom) sp.set('expiresFrom', filters.expiresFrom);
      if (filters.expiresTo) sp.set('expiresTo', filters.expiresTo);
      if (filters.lastScanFrom) sp.set('lastScanFrom', filters.lastScanFrom);
      if (filters.lastScanTo) sp.set('lastScanTo', filters.lastScanTo);
      if (ids?.length) sp.set('ids', ids.join(','));
      return `/api/qrcodes/export?${sp.toString()}`;
    },
    [filters, sortBy, sortOrder]
  );

  const triggerDownload = useCallback((url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.rel = 'noopener noreferrer';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;

    // Optimistic: snapshot current cache and remove selected rows immediately
    const toDelete = new Set(selectedIds);
    const snapshot = queryClient.getQueriesData<{ data: unknown[]; total?: number }>({ queryKey: ['qrcodes'] });
    queryClient.setQueriesData<{ data: unknown[]; total?: number }>(
      { queryKey: ['qrcodes'] },
      (old) => {
        if (!old?.data) return old;
        const filtered = old.data.filter((qr) => !toDelete.has((qr as { id: string }).id));
        return { ...old, data: filtered, total: Math.max(0, (old.total ?? 0) - (old.data.length - filtered.length)) };
      }
    );

    startTransition(async () => {
      try {
        const res = await fetch('/api/qrcodes/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message ?? 'Bulk delete failed');
        }
        toast.success(
          t('qrcodes.bulkDeleted', { defaultValue: 'Deleted {{count}} QR codes', count: json.deletedCount ?? 0 })
        );
        setSelectedIds([]);
        setDeleteOpen(false);
        refetch(); // sync with server truth
      } catch (e) {
        // Rollback optimistic update on error
        snapshot.forEach(([key, value]) => queryClient.setQueryData(key, value));
        toast.error(e instanceof Error ? e.message : 'Bulk delete failed');
      }
    });
  }, [selectedIds, refetch, t, queryClient]);

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={t('qrcodes.title', 'QR Codes')}
        subtitle={t('qrcodes.description', 'Manage and track access QR codes.')}
        actions={
          <Link href={`/${locale}/dashboard/qrcodes/create`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('qrcodes.create', 'Create QR Code')}
            </Button>
          </Link>
        }
      />

      {/* Filter bar: search + date ranges */}
      <div className="flex flex-col gap-3">
        <FilterBar>
          <FilterBar.Search
            placeholder={t('qrcodes.searchPlaceholder', 'Search codes...')}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            aria-label={t('qrcodes.search', 'Search')}
            containerClassName="max-w-sm"
          />
        </FilterBar>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-border bg-card px-3 py-2 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t('common.sort', 'Sort')}
            </span>
            <NativeSelect
              value={sortBy}
              onChange={(e) => {
                setPage(1);
                setSortBy(e.target.value as SortBy);
              }}
              className="h-9 text-xs"
            >
              <option value="createdAt">{t('qrcodes.createdAt', 'Created')}</option>
              <option value="expiresAt">{t('qrcodes.expiresAt', 'Expires')}</option>
              <option value="code">{t('qrcodes.code', 'Code')}</option>
              <option value="type">{t('qrcodes.type', 'Type')}</option>
              <option value="scansCount">{t('qrcodes.scansCount', 'Scans')}</option>
              <option value="gateName">{t('qrcodes.gate', 'Gate')}</option>
              <option value="projectName">{t('qrcodes.project', 'Project')}</option>
            </NativeSelect>
            <NativeSelect
              value={sortOrder}
              onChange={(e) => {
                setPage(1);
                setSortOrder(e.target.value as 'asc' | 'desc');
              }}
              className="h-9 text-xs"
            >
              <option value="desc">{t('common.desc', 'Desc')}</option>
              <option value="asc">{t('common.asc', 'Asc')}</option>
            </NativeSelect>
          </div>
          <div className="rounded-xl border border-border bg-card px-3 py-2 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t('common.pageSize', 'Page size')}
            </span>
            <NativeSelect
              value={String(pageSize)}
              onChange={(e) => {
                const next = parseInt(e.target.value, 10) || 25;
                setPage(1);
                setPageSize(next);
              }}
              className="h-9 text-xs"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </NativeSelect>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-3 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t('qrcodes.filters.createdAt', 'Created at')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={createdFrom}
                onChange={(e) => {
                  setPage(1);
                  setCreatedFrom(e.target.value);
                }}
              />
              <Input
                type="date"
                value={createdTo}
                onChange={(e) => {
                  setPage(1);
                  setCreatedTo(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t('qrcodes.filters.expiresAt', 'Expires at')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={expiresFrom}
                onChange={(e) => {
                  setPage(1);
                  setExpiresFrom(e.target.value);
                }}
              />
              <Input
                type="date"
                value={expiresTo}
                onChange={(e) => {
                  setPage(1);
                  setExpiresTo(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {t('qrcodes.filters.lastScanAt', 'Last scan')}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={lastScanFrom}
                onChange={(e) => {
                  setPage(1);
                  setLastScanFrom(e.target.value);
                }}
              />
              <Input
                type="date"
                value={lastScanTo}
                onChange={(e) => {
                  setPage(1);
                  setLastScanTo(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            {t('common.refresh', 'Refresh')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerDownload(buildExportUrl())}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('common.export', 'Export')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerDownload(buildExportUrl(selectedIds))}
            disabled={isLoading || selectedIds.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('common.exportSelected', { defaultValue: 'Export selected ({{count}})', count: selectedIds.length })}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            disabled={isLoading || selectedIds.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('common.deleteSelected', { defaultValue: 'Delete selected ({{count}})', count: selectedIds.length })}
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={isLoading || currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-xs text-muted-foreground tabular-nums">
              {t('common.page', 'Page')} {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={isLoading || currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPage(1);
              setSearch('');
              setSortBy('createdAt');
              setSortOrder('desc');
              setCreatedFrom('');
              setCreatedTo('');
              setExpiresFrom('');
              setExpiresTo('');
              setLastScanFrom('');
              setLastScanTo('');
              setSelectedIds([]);
            }}
          >
            {t('common.clear', 'Clear')}
          </Button>
        </div>
      </div>

      <QRCodesTable
        data={rows}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRefresh={handleRefresh}
        locale={locale}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(nextBy, nextOrder) => {
          setPage(1);
          setSortBy(nextBy as SortBy);
          setSortOrder(nextOrder);
        }}
        selectedIds={selectedIds}
        onToggleRow={(id, checked) => {
          setSelectedIds((prev) =>
            checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)
          );
        }}
        onToggleAllOnPage={(checked, idsOnPage) => {
          setSelectedIds((prev) => {
            if (checked) return Array.from(new Set([...prev, ...idsOnPage]));
            const set = new Set(idsOnPage);
            return prev.filter((id) => !set.has(id));
          });
        }}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('qrcodes.confirmBulkDeleteTitle', { defaultValue: 'Delete {{count}} QR codes?', count: selectedIds.length })}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t('qrcodes.confirmBulkDeleteBody', 'This will soft-delete the selected QR codes. This action is logged for audit.')}
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isPending}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button variant="destructive" onClick={deleteSelected} disabled={isPending}>
              {isPending ? t('common.deleting', 'Deleting...') : t('common.delete', 'Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
