'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Button,
  Input,
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Badge,
  Skeleton,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  Plus,
  Upload,
  Download,
  Pencil,
  Trash2,
  Building,
  UserPlus,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Columns,
  Eye,
} from 'lucide-react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { buildAnalyticsUrl } from '@/lib/analytics';
import {
  mergeFilters,
  parseResidentsFiltersFromSearchParams,
  residentsFiltersToSearchParams,
  type ResidentsFilters,
} from '@/lib/residents/residents-filters';
import { useUnits, type UnitRow } from '@/lib/residents/use-units';
import { ResidentsFilterBar } from '@/components/dashboard/residents/ResidentsFilterBar';
import { TableCustomizerModal } from '@/components/dashboard/residents/TableCustomizerModal';
import { ViewContactsModal } from '@/components/dashboard/residents/ViewContactsModal';
import {
  getDefaultTableView,
  UNITS_COLUMN_IDS,
  UNITS_PINNED,
  PRESET_VIEWS,
  type TableViewState,
} from '@/lib/residents/table-views';
import { useUserPreferences } from '@/lib/residents/use-user-preferences';

type UnitType =
  | 'STUDIO'
  | 'ONE_BR'
  | 'TWO_BR'
  | 'THREE_BR'
  | 'FOUR_BR'
  | 'VILLA'
  | 'PENTHOUSE'
  | 'COMMERCIAL';

const getUnitTypeLabels = (t: TFunction): Record<UnitType, string> => ({
  STUDIO: t('units.types.STUDIO', 'Studio'),
  ONE_BR: t('units.types.ONE_BR', '1 Bedroom'),
  TWO_BR: t('units.types.TWO_BR', '2 Bedrooms'),
  THREE_BR: t('units.types.THREE_BR', '3 Bedrooms'),
  FOUR_BR: t('units.types.FOUR_BR', '4 Bedrooms'),
  VILLA: t('units.types.VILLA', 'Villa'),
  PENTHOUSE: t('units.types.PENTHOUSE', 'Penthouse'),
  COMMERCIAL: t('units.types.COMMERCIAL', 'Commercial'),
});

const UNIT_QUOTA_DEFAULTS: Record<UnitType, number> = {
  STUDIO: 3,
  ONE_BR: 5,
  TWO_BR: 8,
  THREE_BR: 10,
  FOUR_BR: 12,
  VILLA: 20,
  PENTHOUSE: 20,
  COMMERCIAL: 5,
};

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
}

interface Project {
  id: string;
  name: string;
}

type Unit = UnitRow;

const emptyForm = () => ({
  name: '',
  type: 'STUDIO' as UnitType,
  sizeSqm: null as number | null,
  qrQuota: 3,
  projectId: '',
  contactIds: [] as string[],
});

interface ResidentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UnitsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const [filters, setFilters] = useState<ResidentsFilters>(() => {
    const parsed = parseResidentsFiltersFromSearchParams(searchParams);
    return mergeFilters(parsed);
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [residents, setResidents] = useState<ResidentUser[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Unit | null>(null);
  const [linkTarget, setLinkTarget] = useState<Unit | null>(null);
  const [linkUserId, setLinkUserId] = useState<string>('');
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [viewContactsFor, setViewContactsFor] = useState<Unit | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('dashboard');

  const { preferences, updatePreferences } = useUserPreferences();
  const savedTableView = (preferences.tableViews?.units ??
    {}) as TableViewState;
  const defaultView = getDefaultTableView(UNITS_COLUMN_IDS, UNITS_PINNED);
  const [tableView, setTableView] = useState<TableViewState>(() => ({
    columnOrder: savedTableView.columnOrder?.length
      ? savedTableView.columnOrder
      : defaultView.columnOrder,
    columnVisibility: Object.keys(savedTableView.columnVisibility ?? {}).length
      ? { ...defaultView.columnVisibility, ...savedTableView.columnVisibility }
      : defaultView.columnVisibility,
  }));

  useEffect(() => {
    const order = savedTableView.columnOrder;
    const vis = savedTableView.columnVisibility;
    if (order?.length) {
      const base = getDefaultTableView(UNITS_COLUMN_IDS, UNITS_PINNED);
      setTableView({
        columnOrder: order,
        columnVisibility: { ...base.columnVisibility, ...vis },
      });
    }
  }, [savedTableView.columnOrder, savedTableView.columnVisibility]);

  const unitColumns = [
    { id: 'name', label: t('units.table.name', 'Unit ID'), canHide: false },
    { id: 'type', label: t('units.table.type', 'Type'), canHide: true },
    { id: 'size', label: t('units.table.size', 'Size'), canHide: true },
    {
      id: 'residents',
      label: t('units.table.residents', 'Residents'),
      canHide: true,
    },
    {
      id: 'linkedResident',
      label: t('units.table.linkedResident', 'Linked Resident'),
      canHide: true,
    },
    {
      id: 'qrQuota',
      label: t('units.table.qrQuota', 'QR Quota'),
      canHide: true,
    },
    {
      id: 'project',
      label: t('units.table.project', 'Project'),
      canHide: true,
    },
    {
      id: 'visitsInRange',
      label: t('units.table.visitsInRange', 'Visits'),
      canHide: true,
    },
    {
      id: 'passesInRange',
      label: t('units.table.passesInRange', 'Passes'),
      canHide: true,
    },
    {
      id: 'lastVisitInRange',
      label: t('units.table.lastVisitInRange', 'Last visit'),
      canHide: true,
    },
    {
      id: 'tagSummary',
      label: t('units.table.tagSummary', 'Tag summary'),
      canHide: true,
    },
    {
      id: 'linkedContactCount',
      label: t('units.table.linkedContactCount', 'Contacts'),
      canHide: true,
    },
    {
      id: 'actions',
      label: t('units.table.actions', 'Actions'),
      canHide: false,
    },
  ];
  const visibleColumns = tableView.columnOrder
    .filter(
      (id) =>
        tableView.columnVisibility[id] !== false &&
        unitColumns.some((c) => c.id === id)
    )
    .map((id) => unitColumns.find((c) => c.id === id)!)
    .filter(Boolean);

  const UNIT_TYPE_LABELS = getUnitTypeLabels(t);
  const { data, isLoading, refetch } = useUnits(filters);
  const units = data?.data ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const pageSize = data?.pageSize ?? 25;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const renderUnitCell = (columnId: string, u: Unit) => {
    if (columnId === 'name')
      return (
        <TableCell key={columnId} className="font-medium">
          <span className="mr-2">{u.name}</span>
          {u.potentialVacancy && (
            <Badge
              variant="outline"
              className="text-xs text-amber-600 border-amber-400"
            >
              {t('units.potentialVacancy', 'Potential vacancy')}
            </Badge>
          )}
        </TableCell>
      );
    if (columnId === 'type')
      return (
        <TableCell key={columnId}>
          <Badge variant="outline" className="text-xs">
            {UNIT_TYPE_LABELS[u.type as UnitType]}
          </Badge>
        </TableCell>
      );
    if (columnId === 'size')
      return (
        <TableCell key={columnId} className="text-sm text-muted-foreground">
          {u.sizeSqm != null ? `${u.sizeSqm} m²` : '—'}
        </TableCell>
      );
    if (columnId === 'residents')
      return (
        <TableCell key={columnId}>
          <span className="text-sm">
            {u.contacts.length === 0 ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              <>
                {u.contacts.map((c) => (
                  <Badge
                    key={c.id}
                    variant="secondary"
                    className="text-xs cursor-pointer mr-1 hover:bg-secondary/80"
                    onClick={() => setViewContactsFor(u)}
                  >
                    {c.firstName} {c.lastName}
                  </Badge>
                ))}
              </>
            )}
          </span>
        </TableCell>
      );
    if (columnId === 'linkedResident')
      return (
        <TableCell key={columnId}>
          <span className="text-sm">
            {u.user ? (
              <span title={u.user.email}>{u.user.name}</span>
            ) : (
              <span className="text-muted-foreground">
                {t('units.noResidentLinked', '—')}
              </span>
            )}
          </span>
        </TableCell>
      );
    if (columnId === 'qrQuota')
      return (
        <TableCell key={columnId} className="font-mono text-sm">
          {u.qrQuota}
        </TableCell>
      );
    if (columnId === 'project')
      return (
        <TableCell key={columnId} className="text-sm text-muted-foreground">
          {u.projectName ?? '—'}
        </TableCell>
      );
    if (columnId === 'visitsInRange')
      return (
        <TableCell key={columnId} className="text-right tabular-nums">
          {u.visitsInRange ?? 0}
        </TableCell>
      );
    if (columnId === 'passesInRange')
      return (
        <TableCell key={columnId} className="text-right tabular-nums">
          {u.passesInRange ?? 0}
        </TableCell>
      );
    if (columnId === 'lastVisitInRange')
      return (
        <TableCell
          key={columnId}
          className="text-right text-sm text-muted-foreground"
        >
          {u.lastVisitInRange
            ? new Date(u.lastVisitInRange).toLocaleDateString(undefined, {
                dateStyle: 'short',
              })
            : '—'}
        </TableCell>
      );
    if (columnId === 'tagSummary')
      return (
        <TableCell key={columnId} className="text-sm text-muted-foreground">
          {u.tagSummary ?? '—'}
        </TableCell>
      );
    if (columnId === 'linkedContactCount')
      return (
        <TableCell key={columnId} className="text-right tabular-nums">
          {u.linkedContactCount ?? 0}
        </TableCell>
      );
    if (columnId === 'actions')
      return (
        <TableCell key={columnId}>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title={t('residents.viewContacts', 'View contacts')}
              onClick={() => setViewContactsFor(u)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title={t('units.linkResident', 'Link Resident')}
              onClick={() => {
                setLinkTarget(u);
                setLinkUserId(u.userId ?? '');
              }}
            >
              <UserPlus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => openEdit(u)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => setDeleteTarget(u)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      );
    return <TableCell key={columnId}>—</TableCell>;
  };

  const reactTableColumns = visibleColumns.map((col) => {
    const def: ColumnDef<Unit> = {
      id: col.id,
      header: () => col.label,
      cell: ({ row }) => renderUnitCell(col.id, row.original),
    };
    return def;
  });

  const unitsTable = useReactTable({
    data: units,
    columns: reactTableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const parsed = parseResidentsFiltersFromSearchParams(searchParams);
    setFilters(mergeFilters(parsed));
  }, [searchParams]);

  const updateFiltersAndUrl = useCallback(
    (updates: Partial<ResidentsFilters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...updates };
        const sp = residentsFiltersToSearchParams(next);
        const query = sp.toString();
        router.replace(
          `/${locale}/dashboard/residents/units${query ? `?${query}` : ''}`,
          { scroll: false }
        );
        return next;
      });
    },
    [locale, router]
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/contacts'),
      fetch('/api/projects'),
      fetch('/api/users?role=RESIDENT'),
    ])
      .then(async ([cRes, pRes, residentsRes]) => {
        const cJson = await cRes.json();
        const pJson = await pRes.json();
        const rJson = await residentsRes.json();
        if (!cancelled && cJson.success) {
          setContacts(
            cJson.data.map((c: Contact) => ({
              id: c.id,
              firstName: c.firstName,
              lastName: c.lastName,
            }))
          );
        }
        if (!cancelled && pJson.projects) setProjects(pJson.projects);
        if (!cancelled && rJson.success) setResidents(rJson.data);
      })
      .catch(() => {
        if (!cancelled)
          toast.error(t('units.errors.loadFailed', 'Failed to load'));
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  }

  function openEdit(unit: Unit) {
    setEditing(unit);
    setForm({
      name: unit.name,
      type: unit.type as UnitType,
      sizeSqm: unit.sizeSqm ?? null,
      qrQuota: unit.qrQuota,
      projectId: unit.projectId ?? '',
      contactIds: unit.contacts.map((c) => c.id),
    });
    setDialogOpen(true);
  }

  function handleTypeChange(type: UnitType) {
    setForm((prev) => ({
      ...prev,
      type,
      qrQuota: UNIT_QUOTA_DEFAULTS[type],
    }));
  }

  function handleContactToggle(contactId: string) {
    setForm((prev) => ({
      ...prev,
      contactIds: prev.contactIds.includes(contactId)
        ? prev.contactIds.filter((id) => id !== contactId)
        : [...prev.contactIds, contactId],
    }));
  }

  function save() {
    if (!form.name.trim()) {
      toast.error(t('units.errors.nameRequired', 'Unit name is required'));
      return;
    }
    startTransition(async () => {
      try {
        const payload = {
          name: form.name,
          type: form.type,
          sizeSqm: form.sizeSqm ?? null,
          qrQuota: form.qrQuota,
          projectId: form.projectId || null,
          contactIds: form.contactIds,
        };
        const res = editing
          ? await fetch(`/api/units/${editing.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          : await fetch('/api/units', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(
          editing
            ? t('units.success.updated', 'Unit updated')
            : t('units.success.created', 'Unit created')
        );
        setDialogOpen(false);
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : t('units.errors.saveFailed', 'Failed to save unit')
        );
      }
    });
  }

  function doLinkResident() {
    if (!linkTarget) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/units/${linkTarget.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: linkUserId || null }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(
          linkUserId
            ? t('units.linkResident', 'Resident linked')
            : t('units.unlinkResident', 'Resident unlinked')
        );
        setLinkTarget(null);
        setLinkUserId('');
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : t('units.errors.saveFailed', 'Failed to save')
        );
      }
    });
  }

  function doDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/units/${deleteTarget.id}`, {
          method: 'DELETE',
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(t('units.success.deleted', 'Unit deleted'));
        setDeleteTarget(null);
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : t('units.errors.deleteFailed', 'Failed to delete unit')
        );
      }
    });
  }

  async function exportCSV() {
    try {
      const sp = new URLSearchParams();
      sp.set('format', 'csv');
      if (filters.from) sp.set('from', filters.from);
      if (filters.to) sp.set('to', filters.to);
      if (filters.search) sp.set('search', filters.search);
      if (filters.unitType) sp.set('unitType', filters.unitType);
      if (filters.projectId) sp.set('projectId', filters.projectId);
      if (filters.gateId) sp.set('gateId', filters.gateId);
      const res = await fetch(`/api/units?${sp.toString()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'units.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t('units.errors.exportFailed', 'Export failed'));
    }
  }

  function importCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').slice(1).filter(Boolean);
      let imported = 0;
      for (const line of lines) {
        const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        const [name, type, qrQuota] = cols;
        if (!name || !type) continue;
        const unitType = type.toUpperCase().replace(' ', '_') as UnitType;
        if (!Object.keys(UNIT_QUOTA_DEFAULTS).includes(unitType)) continue;
        try {
          const res = await fetch('/api/units', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              type: unitType,
              qrQuota: parseInt(qrQuota) || UNIT_QUOTA_DEFAULTS[unitType],
            }),
          });
          const json = await res.json();
          if (res.ok && json.success) imported++;
        } catch {
          /* skip */
        }
      }
      toast.success(
        t('units.success.imported', {
          count: imported,
          defaultValue: `Imported ${imported} units`,
        })
      );
      refetch();
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('units.title', 'Units')}</h1>
          <p className="text-sm text-muted-foreground">
            {t(
              'units.description',
              'Manage residential and commercial units with QR quotas.'
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={buildAnalyticsUrl(locale, { search: filters.search })}>
              <BarChart3 className="h-4 w-4 mr-1" />{' '}
              {t('analytics.openInAnalytics', 'Open in Analytics Dashboard')}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCustomizerOpen(true)}
          >
            <Columns className="h-4 w-4 mr-1" />{' '}
            {t('residents.customizeColumns', 'Customize columns')}
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" />{' '}
            {t('units.exportCsv', 'Export CSV')}
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-1" />{' '}
                {t('units.importCsv', 'Import CSV')}
              </span>
            </Button>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={importCSV}
            />
          </label>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> {t('units.addUnit', 'New Unit')}
          </Button>
        </div>
      </div>

      {filters.contactId && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {t('residents.viewingContact', 'Viewing contact')}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFiltersAndUrl({ contactId: '' })}
          >
            {t('residents.clearContactFilter', 'Clear')}
          </Button>
        </div>
      )}

      <ResidentsFilterBar
        filters={filters}
        onFiltersChange={updateFiltersAndUrl}
      />

      {viewContactsFor && (
        <ViewContactsModal
          open={!!viewContactsFor}
          onOpenChange={(open) => !open && setViewContactsFor(null)}
          unitName={viewContactsFor.name}
          contacts={viewContactsFor.contacts.map((c) => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
          }))}
          locale={locale}
          unitId={viewContactsFor.id}
        />
      )}

      <TableCustomizerModal
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        columns={unitColumns}
        view={tableView}
        onSave={(view) => {
          setTableView(view);
          updatePreferences({ tableViews: { units: view } }).catch(() =>
            toast.error(
              t('residents.saveViewFailed', 'Failed to save column preferences')
            )
          );
        }}
        getPresetVisibility={(preset) => PRESET_VIEWS[preset] ?? {}}
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {unitsTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnId = header.column.id;
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        columnId === 'actions'
                          ? 'w-24'
                          : columnId === 'visitsInRange' ||
                              columnId === 'passesInRange' ||
                              columnId === 'lastVisitInRange' ||
                              columnId === 'linkedContactCount'
                            ? 'text-right'
                            : ''
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {visibleColumns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : units.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Building className="h-8 w-8 opacity-30" />
                    <span className="text-sm">
                      {filters.search
                        ? t('units.noMatch', 'No units match your search')
                        : t(
                            'units.empty',
                            'No units yet. Add your first unit.'
                          )}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              unitsTable.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) =>
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-2">
            <p className="text-sm text-muted-foreground">
              {t('units.paginationSummary', {
                from: (page - 1) * pageSize + 1,
                to: Math.min(page * pageSize, total),
                total,
                defaultValue: `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total}`,
              })}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateFiltersAndUrl({ page: page - 1 })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateFiltersAndUrl({ page: page + 1 })}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      {dialogOpen && (
        <Dialog>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing
                  ? t('units.editUnit', 'Edit Unit')
                  : t('units.addUnit', 'Unit')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="unitName">
                  {t('units.form.name', 'Unit Name / Number')} *
                </Label>
                <Input
                  id="unitName"
                  placeholder={t(
                    'units.form.namePlaceholder',
                    'e.g. Villa 12, Apt 4B'
                  )}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('units.form.type', 'Type')} *</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(UNIT_TYPE_LABELS) as UnitType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={`rounded-lg border p-2 text-xs text-center transition-colors ${
                        form.type === type
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border hover:border-primary/40 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {UNIT_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sizeSqm">
                  {t('units.form.sizeSqm', 'Size (m²)')}
                </Label>
                <Input
                  id="sizeSqm"
                  type="number"
                  min="1"
                  placeholder={t('units.form.sizeSqmPlaceholder', 'Optional')}
                  value={form.sizeSqm ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm({
                      ...form,
                      sizeSqm: v === '' ? null : parseInt(v, 10) || null,
                    });
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="qrQuota">
                  {t('units.form.qrQuota', 'QR Quota')}
                </Label>
                <Input
                  id="qrQuota"
                  type="number"
                  min="1"
                  value={form.qrQuota}
                  onChange={(e) =>
                    setForm({ ...form, qrQuota: parseInt(e.target.value) || 1 })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {t('units.form.quotaDefault', {
                    type: UNIT_TYPE_LABELS[form.type],
                    count: UNIT_QUOTA_DEFAULTS[form.type],
                    defaultValue: `Default for ${UNIT_TYPE_LABELS[form.type]}: ${UNIT_QUOTA_DEFAULTS[form.type]}`,
                  })}
                </p>
              </div>
              {projects.length > 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="projectId">
                    {t('units.form.project', 'Project')}
                  </Label>
                  <Select
                    id="projectId"
                    value={form.projectId}
                    onChange={(e) =>
                      setForm({ ...form, projectId: e.target.value })
                    }
                  >
                    <option value="">
                      {t('sidebar.allProjects', 'No Project')}
                    </option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              {contacts.length > 0 && (
                <div className="space-y-1.5">
                  <Label>
                    {t('units.form.linkedResidents', 'Linked Residents')}
                  </Label>
                  <div className="flex flex-wrap gap-2 rounded-lg border p-3 max-h-32 overflow-y-auto">
                    {contacts.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleContactToggle(c.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                          form.contactIds.includes(c.id)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-transparent hover:border-primary/40'
                        }`}
                      >
                        {c.firstName} {c.lastName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={save} disabled={isPending}>
                {isPending
                  ? t('modal.actions.saving', 'Saving…')
                  : editing
                    ? t('units.success.updated', 'Save changes')
                    : t('common.create', 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Link Resident Dialog */}
      {linkTarget && (
        <Dialog
          open={!!linkTarget}
          onOpenChange={(open) => !open && setLinkTarget(null)}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {t('units.linkResident', 'Link Resident')} — {linkTarget.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="linkResident">
                  {t('units.residentLinked', 'Linked Resident')}
                </Label>
                <Select
                  id="linkResident"
                  value={linkUserId}
                  onChange={(e) => setLinkUserId(e.target.value)}
                >
                  <option value="">
                    {t('units.noResidentLinked', 'No resident linked')}
                  </option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.email})
                    </option>
                  ))}
                </Select>
                {residents.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t(
                      'units.noResidentsAvailable',
                      'No RESIDENT users in this organization. Invite one from Team settings.'
                    )}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLinkTarget(null)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={doLinkResident} disabled={isPending}>
                {isPending
                  ? t('modal.actions.saving', 'Saving…')
                  : t('common.save', 'Save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <Dialog>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {t('units.confirmDelete', {
                  name: deleteTarget.name,
                  defaultValue: 'Delete Unit?',
                })}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t('units.confirmDelete', {
                name: deleteTarget.name,
                defaultValue: `Are you sure you want to delete unit ${deleteTarget.name}? This action cannot be undone.`,
              })}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={doDelete}
                disabled={isPending}
              >
                {isPending
                  ? t('modal.actions.deleting', 'Deleting…')
                  : t('common.delete', 'Delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
