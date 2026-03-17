'use client';

import { useEffect, useMemo, useState, useCallback, useTransition } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  Input,
  NativeSelect,
  PageHeader,
  cn,
  Pagination,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { 
  Download, 
  Plus, 
  RefreshCw, 
  Trash2, 
  X,
  Search,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useQRCodes } from '@/lib/qrcodes/use-qrcodes';
import { QRCodesTable } from '@/components/dashboard/qrcodes/QRCodesTable';
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
      pageSize: 25,
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
  const effectivePageSize = data?.pageSize ?? 25;
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
    <div className="pb-20 animate-in fade-in duration-500">
      <PageHeader
        title={t('qrcodes.title', 'QR Codes')}
        subtitle={t('qrcodes.description', 'Manage and monitor digital access keys for residents and visitors.')}
        breadcrumbs={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: 'QR Codes' }
        ]}
        homeHref={`/${locale}/dashboard`}
        actions={[
          <Button 
            key="export"
            variant="outline" 
            onClick={() => triggerDownload(buildExportUrl())} 
            className="h-8 px-3 border-[var(--ds-border,#DFE1E6)] text-[var(--ds-text-subtle,#42526E)] font-semibold hover:bg-[var(--ds-background-neutral-subtle-hovered,#EBECF0)] rounded-[var(--ds-border-radius-100,#3px)] transition-all flex items-center gap-2 group text-xs"
          >
            <Download className="h-3.5 w-3.5 text-[var(--ds-icon-subtle,#6B778C)] group-hover:text-[var(--ds-icon-brand,#0052CC)] transition-colors" />
            {t('common.export', 'Export')}
          </Button>,
          <Link key="create" href={`/${locale}/dashboard/qrcodes/create`}>
            <Button className="h-8 px-4 bg-[var(--ds-background-brand-bold,#0052CC)] hover:bg-[var(--ds-background-brand-bold-hovered,#004EBE)] text-[var(--ds-text-inverse,#FFFFFF)] font-semibold rounded-[var(--ds-border-radius-100,#3px)] transition-all flex items-center gap-2 text-xs">
              <Plus className="h-4 w-4" />
              {t('qrcodes.create', 'Create QR Code')}
            </Button>
          </Link>
        ]}
      />

      <div className="mt-8 space-y-6">
        {/* Advanced Filter Bar */}
        <div className="bg-[var(--ds-background-default,#FFFFFF)] dark:bg-[#1D2125] border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] rounded-xl p-5 shadow-none space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[280px] relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtle,#6B778C)] pointer-events-none group-focus-within:text-[var(--ds-text-brand,#0052CC)] transition-colors" />
              <FilterBar.Search
                placeholder={t('qrcodes.searchPlaceholder', 'Search by code, holder name, or property…')}
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="w-full h-9 pl-9 bg-[var(--ds-background-input,#F4F5F7)] dark:bg-[#2C333A] border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] focus:bg-[var(--ds-background-default,#FFFFFF)] dark:focus:bg-[#1D2125] transition-all rounded-[3px] text-sm font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-9 w-9 p-0 border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] rounded-[3px] hover:bg-[var(--ds-background-neutral-subtle-hovered,#EBECF0)] dark:hover:bg-[#2C333A]"
              >
                <RefreshCw className={cn('h-3.5 w-3.5 text-[#6B778C]', isLoading && 'animate-spin')} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {/* Creation Date Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight text-[var(--ds-text-subtle,#6B778C)] dark:text-[#97A0AF] ml-0.5">
                <Calendar className="h-3 w-3" />
                {t('qrcodes.filters.createdAt', 'Creation Period')}
              </label>
              <div className="flex items-center gap-2 bg-[var(--ds-background-input,#F4F5F7)] dark:bg-[#091E42]/10 p-1 rounded-[3px] border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46]">
                <Input
                  type="date"
                  value={createdFrom}
                  onChange={(e) => { setPage(1); setCreatedFrom(e.target.value); }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text,#172B4D)] dark:text-white focus:ring-0"
                />
                <span className="text-[var(--ds-text-subtlest,#A5ADBA)] font-black">/</span>
                <Input
                  type="date"
                  value={createdTo}
                  onChange={(e) => { setPage(1); setCreatedTo(e.target.value); }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text,#172B4D)] dark:text-white focus:ring-0"
                />
              </div>
            </div>

            {/* Expiry Date Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight dark:text-[#97A0AF] ml-0.5 text-[var(--ds-text-warning,#B35800)]">
                <Clock className="h-3 w-3" />
                {t('qrcodes.filters.expiresAt', 'Expiry Window')}
              </label>
              <div className="flex items-center gap-2 bg-[var(--ds-background-input,#F4F5F7)] dark:bg-[#091E42]/10 p-1 rounded-[3px] border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46]">
                <Input
                  type="date"
                  value={expiresFrom}
                  onChange={(e) => { setPage(1); setExpiresFrom(e.target.value); }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text,#172B4D)] dark:text-white focus:ring-0"
                />
                <span className="text-[var(--ds-text-subtlest,#A5ADBA)] font-black">/</span>
                <Input
                  type="date"
                  value={expiresTo}
                  onChange={(e) => { setPage(1); setExpiresTo(e.target.value); }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text,#172B4D)] dark:text-white focus:ring-0"
                />
              </div>
            </div>

            {/* Usage Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight dark:text-[#97A0AF] ml-0.5 text-[var(--ds-text-success,#006644)]">
                <Activity className="h-3 w-3" />
                {t('qrcodes.filters.lastScanAt', 'Last Usage')}
              </label>
              <div className="flex items-center gap-2 bg-[var(--ds-background-input,#F4F5F7)] dark:bg-[#091E42]/10 p-1 rounded-[3px] border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46]">
                <Input
                  type="date"
                  value={lastScanFrom}
                  onChange={(e) => { setPage(1); setLastScanFrom(e.target.value); }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text,#172B4D)] dark:text-white focus:ring-0"
                />
                <span className="text-[var(--ds-text-subtlest,#A5ADBA)] font-black">/</span>
                <Input
                  type="date"
                  value={lastScanTo}
                  onChange={(e) => { setPage(1); setLastScanTo(e.target.value); }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text,#172B4D)] dark:text-white focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46]">
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 ? (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                   <span className="text-[11px] font-bold uppercase tracking-tight text-[var(--ds-text-subtle,#6B778C)] mr-1">Selection:</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteOpen(true)}
                    className="h-7 bg-[var(--ds-background-danger-subtle,#FFEBE6)] hover:bg-[var(--ds-background-danger-subtle-hovered,#FFD5CC)] dark:bg-[#44130C] dark:hover:bg-[#601A12] text-[var(--ds-text-danger,#BF2600)] dark:text-[#FF8F73] border-none font-bold shadow-none rounded-full px-3 text-[10px]"
                  >
                    <Trash2 className="h-3 w-3 mr-1.5" />
                    {t('common.deleteSelected', { defaultValue: 'Delete {{count}}', count: selectedIds.length })}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerDownload(buildExportUrl(selectedIds))}
                    className="h-7 border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] text-[var(--ds-text-subtle,#42526E)] dark:text-[#A5ADBA] font-bold rounded-full px-3 bg-[var(--ds-background-default,#FFFFFF)] dark:bg-[#2C333A] hover:bg-[var(--ds-background-neutral-subtle,#FAFBFC)] text-[10px]"
                  >
                    <Download className="h-3 w-3 mr-1.5" />
                    {t('common.exportSelected', 'Export')}
                  </Button>
                  <div className="w-px h-3.5 bg-[var(--ds-border,#DFE1E6)] mx-1" />
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-[var(--ds-background-neutral-subtle,#F4F5F7)] dark:bg-[#2C333A] p-1 rounded-md border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46]">
                   <div className="flex items-center gap-2 px-2 py-0.5 bg-[var(--ds-background-default,#FFFFFF)] dark:bg-[#1D2125] rounded shadow-none">
                      <span className="text-[10px] font-bold text-[var(--ds-text-subtlest,#A5ADBA)] uppercase tracking-tight">{t('common.sort', 'Order')}</span>
                      <NativeSelect
                        value={sortBy}
                        onChange={(e) => { setPage(1); setSortBy(e.target.value as SortBy); }}
                        className="h-6 text-[11px] font-semibold border-none bg-transparent focus:ring-0 min-w-[100px]"
                      >
                        <option value="createdAt">{t('qrcodes.createdAt', 'Date Created')}</option>
                        <option value="expiresAt">{t('qrcodes.expiresAt', 'Expiry Date')}</option>
                        <option value="code">{t('qrcodes.code', 'QR Code ID')}</option>
                        <option value="type">{t('qrcodes.type', 'Access Type')}</option>
                        <option value="scansCount">{t('qrcodes.scansCount', 'Usage Count')}</option>
                        <option value="gateName">{t('qrcodes.gate', 'Entry Gate')}</option>
                      </NativeSelect>
                      <NativeSelect
                        value={sortOrder}
                        onChange={(e) => { setPage(1); setSortOrder(e.target.value as 'asc' | 'desc'); }}
                        className="h-6 text-[10px] font-bold border-none bg-transparent focus:ring-0"
                      >
                        <option value="desc">DESC</option>
                        <option value="asc">ASC</option>
                      </NativeSelect>
                   </div>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPage(1); setSearch(''); setSortBy('createdAt'); setSortOrder('desc');
                  setCreatedFrom(''); setCreatedTo(''); setExpiresFrom(''); setExpiresTo('');
                  setLastScanFrom(''); setLastScanTo(''); setSelectedIds([]);
                }}
                className="h-7 text-[var(--ds-text-link,#0052CC)] hover:bg-[var(--ds-background-selected,#DEEBFF)] text-[11px] font-bold uppercase tracking-tight rounded-full px-3"
              >
                <X className="h-3 w-3 mr-1.5" />
                Clear Filters
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle,#6B778C)]">
                 Results: <span className="text-[var(--ds-text,#172B4D)] dark:text-white tabular-nums">{total.toLocaleString()}</span>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
                className="w-auto"
              />
            </div>
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
          onSelectionChange={(ids) => setSelectedIds(ids as string[])}
        />
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-[var(--ds-background-default,#FFFFFF)]">
          <div className="bg-[var(--ds-background-danger-subtle,#FFEBE6)] p-5 flex flex-col items-center gap-3 text-center">
             <div className="h-14 w-14 rounded-full bg-[var(--ds-background-default,#FFFFFF)] flex items-center justify-center shadow-sm">
                <Trash2 className="h-6 w-6 text-[var(--ds-text-danger,#BF2600)]" />
             </div>
             <DialogTitle className="text-xl font-bold tracking-tight text-[var(--ds-text-danger,#BF2600)] uppercase">
                Confirm Bulk Deletion
             </DialogTitle>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm font-medium text-[var(--ds-text-subtle,#42526E)] dark:text-[#A5ADBA] leading-relaxed text-center">
              {t('qrcodes.confirmBulkDeleteBody', 'You are about to deactivate and soft-delete {{count}} QR codes. This action will be logged and is irreversible for the end-users.', { count: selectedIds.length })}
            </p>
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDeleteOpen(false)} 
                disabled={isPending}
                className="flex-1 h-10 rounded-[var(--ds-border-radius-100,#3px)] border-[var(--ds-border,#DFE1E6)] font-semibold text-[var(--ds-text-subtle,#42526E)]"
              >
                {t('common.cancel', 'No, keep them')}
              </Button>
              <Button 
                variant="destructive" 
                onClick={deleteSelected} 
                disabled={isPending}
                className="flex-1 h-10 rounded-[var(--ds-border-radius-100,#3px)] bg-[var(--ds-background-danger-bold,#DE350B)] hover:bg-[var(--ds-background-danger-bold-hovered,#BF2600)] font-semibold text-[var(--ds-text-inverse,#FFFFFF)]"
              >
                {isPending ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                {t('common.delete', 'Yes, delete all')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
