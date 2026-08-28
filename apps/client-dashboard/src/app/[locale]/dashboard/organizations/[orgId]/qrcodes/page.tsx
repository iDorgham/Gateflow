'use client';

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useTransition,
} from 'react';
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
  cn,
  Pagination,
} from '@gateflow/ui';
import { PageHeader } from '@gateflow/components';
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
  Activity,
  SlidersHorizontal,
  AlignJustify,
  AlignCenter,
  Rows,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useQRCodes } from '@/lib/qrcodes/use-qrcodes';
import { QRCodesTable } from '@/components/dashboard/qrcodes/QRCodesTable';
import { FilterBar } from '@/components/dashboard/filter-bar';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';
import {
  useUserPreferences,
  type TableDensity,
} from '@/lib/residents/use-user-preferences';
import {
  type TableViewState,
  QR_COLUMN_IDS,
  QR_PINNED,
  getDefaultTableView,
} from '@/lib/residents/table-views';
import {
  TableCustomizerModal,
  type TableColumnConfig,
} from '@/components/dashboard/residents/TableCustomizerModal';
import { SavedViewManager } from '@/components/crm/SavedViewManager';

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
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { preferences, updatePreferences } = useUserPreferences();
  const savedTableView = (preferences.tableViews?.qrcodes ??
    {}) as TableViewState;
  const defaultView = useMemo(
    () => getDefaultTableView(QR_COLUMN_IDS, QR_PINNED),
    []
  );

  const [tableView, setTableView] = useState<TableViewState>(() => ({
    columnOrder: savedTableView.columnOrder?.length
      ? savedTableView.columnOrder
      : defaultView.columnOrder,
    columnVisibility: Object.keys(savedTableView.columnVisibility ?? {}).length
      ? { ...defaultView.columnVisibility, ...savedTableView.columnVisibility }
      : defaultView.columnVisibility,
    density: savedTableView.density || 'default',
  }));

  const [activeView, setActiveView] = useState<string | undefined>(
    savedTableView.activeView
  );

  useEffect(() => {
    if (savedTableView.columnOrder?.length || savedTableView.density) {
      const base = getDefaultTableView(QR_COLUMN_IDS, QR_PINNED);
      setTableView({
        columnOrder: savedTableView.columnOrder?.length
          ? savedTableView.columnOrder
          : base.columnOrder,
        columnVisibility: {
          ...base.columnVisibility,
          ...savedTableView.columnVisibility,
        },
        density: savedTableView.density || 'default',
      });
    }
  }, [
    savedTableView.columnOrder,
    savedTableView.columnVisibility,
    savedTableView.density,
  ]);

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

  const handleDensityChange = useCallback(
    async (newDensity: TableDensity) => {
      setTableView((prev) => ({ ...prev, density: newDensity }));
      try {
        await updatePreferences({
          tableViews: {
            qrcodes: { ...savedTableView, density: newDensity },
          },
        });
      } catch {
        try {
          localStorage.setItem('gateflow:qrcodes:density', newDensity);
        } catch {}
      }
    },
    [savedTableView, updatePreferences]
  );

  const qrColumnConfigs = useMemo<TableColumnConfig[]>(
    () => [
      { id: 'code', label: t('qrcodes.code', 'QR Identifier'), canHide: false },
      {
        id: 'guestName',
        label: t('qrcodes.guestName', 'QR Holder'),
        canHide: true,
      },
      {
        id: 'guestPhone',
        label: t('qrcodes.guestPhone', 'Phone Number'),
        canHide: true,
      },
      {
        id: 'guestEmail',
        label: t('qrcodes.guestEmail', 'Email Address'),
        canHide: true,
      },
      { id: 'type', label: t('qrcodes.type', 'Access Type'), canHide: true },
      {
        id: 'projectName',
        label: t('qrcodes.project', 'Property'),
        canHide: true,
      },
      { id: 'gateName', label: t('qrcodes.gate', 'Entry Gate'), canHide: true },
      {
        id: 'status',
        label: t('qrcodes.table.status', 'Access Status'),
        canHide: true,
      },
      {
        id: 'createdAt',
        label: t('qrcodes.createdAt', 'Issued Date'),
        canHide: true,
      },
      {
        id: 'expiresAt',
        label: t('qrcodes.expiresAt', 'Expiry Date'),
        canHide: true,
      },
      {
        id: 'scansCount',
        label: t('qrcodes.scansCount', 'Usage Count'),
        canHide: true,
      },
      {
        id: 'lastScanAt',
        label: t('qrcodes.lastScanAt', 'Last Scan Time'),
        canHide: true,
      },
    ],
    [t]
  );

  const handleSaveCustomizer = useCallback(
    async (newView: TableViewState) => {
      const updated = { ...tableView, ...newView };
      setTableView(updated);
      try {
        await updatePreferences({
          tableViews: {
            qrcodes: {
              ...savedTableView,
              columnOrder: newView.columnOrder,
              columnVisibility: newView.columnVisibility,
            },
          },
        });
        toast.success(t('crm.tables.viewsUpdated', 'Table columns updated'));
      } catch {
        try {
          localStorage.setItem(
            'gateflow:qrcodes:tableView',
            JSON.stringify(newView)
          );
        } catch {}
      }
    },
    [tableView, savedTableView, updatePreferences, t]
  );

  const handleViewSelect = useCallback(
    (viewId: string | undefined) => {
      setActiveView(viewId);
      if (viewId && savedTableView.savedViews?.[viewId]) {
        const v = savedTableView.savedViews[viewId];
        setTableView((prev) => ({
          ...prev,
          columnOrder: v.columnOrder ?? prev.columnOrder,
          columnVisibility: v.columnVisibility ?? prev.columnVisibility,
        }));
      }
    },
    [savedTableView.savedViews]
  );

  const handleViewSave = useCallback(
    async (name: string) => {
      const viewId = `view_${Date.now()}`;
      const currentSaved = savedTableView.savedViews ?? {};
      const newSaved = {
        ...currentSaved,
        [viewId]: {
          name,
          columnOrder: tableView.columnOrder,
          columnVisibility: tableView.columnVisibility,
        },
      };
      try {
        await updatePreferences({
          tableViews: {
            qrcodes: {
              ...savedTableView,
              savedViews: newSaved,
              activeView: viewId,
            },
          },
        });
        setActiveView(viewId);
        toast.success(t('crm.tables.viewSaved', 'View saved'));
      } catch {
        toast.error(t('crm.tables.viewSaveFailed', 'Failed to save view'));
      }
    },
    [savedTableView, tableView, updatePreferences, t]
  );

  const handleViewDelete = useCallback(
    async (viewId: string) => {
      const currentSaved = { ...(savedTableView.savedViews ?? {}) };
      delete currentSaved[viewId];
      try {
        await updatePreferences({
          tableViews: {
            qrcodes: {
              ...savedTableView,
              savedViews: currentSaved,
              activeView: activeView === viewId ? undefined : activeView,
            },
          },
        });
        if (activeView === viewId) setActiveView(undefined);
        toast.success(t('crm.tables.viewDeleted', 'View deleted'));
      } catch {
        toast.error(t('crm.tables.viewDeleteFailed', 'Failed to delete view'));
      }
    },
    [savedTableView, activeView, updatePreferences, t]
  );

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

    const toDelete = new Set(selectedIds);
    const snapshot = queryClient.getQueriesData<{
      data: unknown[];
      total?: number;
    }>({ queryKey: ['qrcodes'] });
    queryClient.setQueriesData<{ data: unknown[]; total?: number }>(
      { queryKey: ['qrcodes'] },
      (old) => {
        if (!old?.data) return old;
        const filtered = old.data.filter(
          (qr) => !toDelete.has((qr as { id: string }).id)
        );
        return {
          ...old,
          data: filtered,
          total: Math.max(
            0,
            (old.total ?? 0) - (old.data.length - filtered.length)
          ),
        };
      }
    );

    startTransition(async () => {
      try {
        const res = await csrfFetch('/api/qrcodes/bulk-delete', {
          method: 'POST',
          body: JSON.stringify({ ids: selectedIds }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message ?? 'Bulk delete failed');
        }
        toast.success(
          t('qrcodes.bulkDeleted', {
            defaultValue: 'Deleted {{count}} QR codes',
            count: json.deletedCount ?? 0,
          })
        );
        setSelectedIds([]);
        setDeleteOpen(false);
        refetch();
      } catch (e) {
        snapshot.forEach(([key, value]) =>
          queryClient.setQueryData(key, value)
        );
        toast.error(e instanceof Error ? e.message : 'Bulk delete failed');
      }
    });
  }, [selectedIds, refetch, t, queryClient]);

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      <PageHeader
        title={t('qrcodes.title', 'QR Codes')}
        subtitle={t(
          'qrcodes.description',
          'Manage and monitor digital access keys for residents and visitors.'
        )}
        breadcrumbs={[
          { label: 'Dashboard', href: `/${locale}/dashboard` },
          { label: 'QR Codes' },
        ]}
        homeHref={`/${locale}/dashboard`}
        actions={[
          <Button
            key="export"
            variant="outline"
            onClick={() => triggerDownload(buildExportUrl())}
            className="border-[var(--ds-border)] text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-subtle)] font-bold text-xs shadow-sm h-9"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('common.exportCsv', 'Export')}
          </Button>,
          <Link key="bulk" href={`/${locale}/dashboard/qrcodes/bulk`}>
            <Button
              variant="outline"
              className="border-[var(--ds-border)] text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-subtle)] font-bold text-xs shadow-sm h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('qrcodes.bulkCreate', 'Bulk Generation')}
            </Button>
          </Link>,
          <Link key="create" href={`/${locale}/dashboard/qrcodes/create`}>
            <Button className="bg-[var(--ds-background-brand-bold)] hover:bg-[var(--ds-background-brand-bold-hovered)] text-[var(--ds-text-inverse)] font-black text-xs shadow-md h-9">
              <Plus className="h-4 w-4 mr-2" />
              {t('qrcodes.create', 'Issue New Pass')}
            </Button>
          </Link>,
        ]}
      />

      <div className="mt-8 space-y-6">
        <div className="bg-[var(--ds-background-default)] rounded-2xl border border-[var(--ds-border)] p-5 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-icon-subtle)]" />
              <Input
                type="text"
                placeholder={t(
                  'qrcodes.searchPlaceholder',
                  'Search holder, email, code…'
                )}
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="pl-9 h-10 text-xs font-semibold bg-[var(--ds-background-input)] border-[var(--ds-border)] focus:border-[var(--ds-border-brand)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[var(--ds-text-subtle)] flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {t('qrcodes.issuedRange', 'Issued Window')}
              </label>
              <div className="flex items-center gap-1.5 bg-[var(--ds-background-input)] border border-[var(--ds-border)] rounded-md px-2 py-1">
                <Input
                  type="date"
                  value={createdFrom}
                  onChange={(e) => {
                    setPage(1);
                    setCreatedFrom(e.target.value);
                  }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text)] focus:ring-0"
                />
                <span className="text-[var(--ds-text-subtlest)] font-black">
                  /
                </span>
                <Input
                  type="date"
                  value={createdTo}
                  onChange={(e) => {
                    setPage(1);
                    setCreatedTo(e.target.value);
                  }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text)] focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[var(--ds-text-subtle)] flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {t('qrcodes.expiryRange', 'Expiry Window')}
              </label>
              <div className="flex items-center gap-1.5 bg-[var(--ds-background-input)] border border-[var(--ds-border)] rounded-md px-2 py-1">
                <Input
                  type="date"
                  value={expiresFrom}
                  onChange={(e) => {
                    setPage(1);
                    setExpiresFrom(e.target.value);
                  }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text)] focus:ring-0"
                />
                <span className="text-[var(--ds-text-subtlest)] font-black">
                  /
                </span>
                <Input
                  type="date"
                  value={expiresTo}
                  onChange={(e) => {
                    setPage(1);
                    setExpiresTo(e.target.value);
                  }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text)] focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[var(--ds-text-subtle)] flex items-center gap-1.5">
                <Activity className="h-3 w-3" />
                {t('qrcodes.lastScanRange', 'Last Access Activity')}
              </label>
              <div className="flex items-center gap-1.5 bg-[var(--ds-background-input)] border border-[var(--ds-border)] rounded-md px-2 py-1">
                <Input
                  type="date"
                  value={lastScanFrom}
                  onChange={(e) => {
                    setPage(1);
                    setLastScanFrom(e.target.value);
                  }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text)] focus:ring-0"
                />
                <span className="text-[var(--ds-text-subtlest)] font-black">
                  /
                </span>
                <Input
                  type="date"
                  value={lastScanTo}
                  onChange={(e) => {
                    setPage(1);
                    setLastScanTo(e.target.value);
                  }}
                  className="h-8 bg-transparent border-none text-[11px] font-semibold text-[var(--ds-text)] focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--ds-border)]">
            <div className="flex flex-wrap items-center gap-3">
              {selectedIds.length > 0 ? (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                  <span className="text-[11px] font-bold uppercase tracking-tight text-[var(--ds-text-subtle)] mr-1">
                    Selection:
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteOpen(true)}
                    className="h-7 bg-[var(--ds-background-danger-subtle)] hover:bg-[var(--ds-background-danger-subtle-hovered)] text-[var(--ds-text-danger)] border-none font-bold shadow-none rounded-full px-3 text-[10px]"
                  >
                    <Trash2 className="h-3 w-3 mr-1.5" />
                    {t('common.deleteSelected', {
                      defaultValue: 'Delete {{count}}',
                      count: selectedIds.length,
                    })}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerDownload(buildExportUrl(selectedIds))}
                    className="h-7 border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-bold rounded-full px-3 bg-[var(--ds-background-default)] hover:bg-[var(--ds-background-neutral-subtle)] text-[10px]"
                  >
                    <Download className="h-3 w-3 mr-1.5" />
                    {t('common.exportSelected', 'Export')}
                  </Button>
                  <div className="w-px h-3.5 bg-[var(--ds-border)] mx-1" />
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-[var(--ds-background-neutral-subtle)] p-1 rounded-md border border-[var(--ds-border)]">
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-[var(--ds-background-default)] rounded shadow-none">
                    <span className="text-[10px] font-bold text-[var(--ds-text-subtlest)] uppercase tracking-tight">
                      {t('common.sort', 'Order')}
                    </span>
                    <NativeSelect
                      value={sortBy}
                      onChange={(e) => {
                        setPage(1);
                        setSortBy(e.target.value as SortBy);
                      }}
                      className="h-6 text-[11px] font-semibold border-none bg-transparent focus:ring-0 min-w-[100px]"
                    >
                      <option value="createdAt">
                        {t('qrcodes.createdAt', 'Date Created')}
                      </option>
                      <option value="expiresAt">
                        {t('qrcodes.expiresAt', 'Expiry Date')}
                      </option>
                      <option value="code">
                        {t('qrcodes.code', 'QR Code ID')}
                      </option>
                      <option value="type">
                        {t('qrcodes.type', 'Access Type')}
                      </option>
                      <option value="scansCount">
                        {t('qrcodes.scansCount', 'Usage Count')}
                      </option>
                      <option value="gateName">
                        {t('qrcodes.gate', 'Entry Gate')}
                      </option>
                    </NativeSelect>
                    <NativeSelect
                      value={sortOrder}
                      onChange={(e) => {
                        setPage(1);
                        setSortOrder(e.target.value as 'asc' | 'desc');
                      }}
                      className="h-6 text-[10px] font-bold border-none bg-transparent focus:ring-0"
                    >
                      <option value="desc">DESC</option>
                      <option value="asc">ASC</option>
                    </NativeSelect>
                  </div>
                </div>
              )}

              {/* Density Controls */}
              <div className="flex items-center gap-0.5 bg-[var(--ds-background-neutral-subtle)] p-0.5 rounded-lg border border-[var(--ds-border)]">
                <button
                  type="button"
                  onClick={() => handleDensityChange('compact')}
                  title={t('crm.tables.compact', 'Compact')}
                  className={cn(
                    'p-1.5 rounded text-[10px] font-bold transition-colors',
                    tableView.density === 'compact'
                      ? 'bg-[var(--ds-background-default)] text-[var(--ds-text)] shadow-sm'
                      : 'text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)]'
                  )}
                >
                  <AlignJustify className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDensityChange('default')}
                  title={t('crm.tables.default', 'Default')}
                  className={cn(
                    'p-1.5 rounded text-[10px] font-bold transition-colors',
                    tableView.density === 'default'
                      ? 'bg-[var(--ds-background-default)] text-[var(--ds-text)] shadow-sm'
                      : 'text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)]'
                  )}
                >
                  <Rows className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDensityChange('comfortable')}
                  title={t('crm.tables.comfortable', 'Comfortable')}
                  className={cn(
                    'p-1.5 rounded text-[10px] font-bold transition-colors',
                    tableView.density === 'comfortable'
                      ? 'bg-[var(--ds-background-default)] text-[var(--ds-text)] shadow-sm'
                      : 'text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)]'
                  )}
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Saved Views Manager & Column Customizer */}
              <SavedViewManager
                activeView={activeView}
                savedViews={savedTableView.savedViews}
                onViewSelect={handleViewSelect}
                onViewSave={handleViewSave}
                onViewDelete={handleViewDelete}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomizerOpen(true)}
                className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-[var(--ds-border)] text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden md:inline">
                  {t('crm.tables.customizeColumns', 'Columns')}
                </span>
              </Button>

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
                className="h-7 text-[var(--ds-text-link)] hover:bg-[var(--ds-background-selected)] text-[11px] font-bold uppercase tracking-tight rounded-full px-3"
              >
                <X className="h-3 w-3 mr-1.5" />
                Clear Filters
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                Results:{' '}
                <span className="text-[var(--ds-text)] tabular-nums">
                  {total.toLocaleString()}
                </span>
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
          density={tableView.density}
          columnOrder={tableView.columnOrder}
          columnVisibility={tableView.columnVisibility}
        />
      </div>

      <TableCustomizerModal
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        columns={qrColumnConfigs}
        view={tableView}
        onSave={handleSaveCustomizer}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-[var(--ds-background-default)]">
          <div className="bg-[var(--ds-background-danger-subtle)] p-5 flex flex-col items-center gap-3 text-center">
            <div className="h-14 w-14 rounded-full bg-[var(--ds-background-default)] flex items-center justify-center shadow-sm">
              <Trash2 className="h-6 w-6 text-[var(--ds-text-danger)]" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-[var(--ds-text-danger)] uppercase">
              Confirm Bulk Deletion
            </DialogTitle>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm font-medium text-[var(--ds-text-subtle)] leading-relaxed text-center">
              {t(
                'qrcodes.confirmBulkDeleteBody',
                'You are about to deactivate and soft-delete {{count}} QR codes. This action will be logged and is irreversible for the end-users.',
                { count: selectedIds.length }
              )}
            </p>
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={isPending}
                className="flex-1 h-10 rounded-[var(--ds-border-radius-100)] border-[var(--ds-border)] font-semibold text-[var(--ds-text-subtle)]"
              >
                {t('common.cancel', 'No, keep them')}
              </Button>
              <Button
                variant="destructive"
                onClick={deleteSelected}
                disabled={isPending}
                className="flex-1 h-10 rounded-[var(--ds-border-radius-100)] bg-[var(--ds-background-danger-bold)] hover:bg-[var(--ds-background-danger-bold-hovered)] font-semibold text-[var(--ds-text-inverse)]"
              >
                {isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {t('common.delete', 'Yes, delete all')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
