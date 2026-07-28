'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Button,
  Input,
  Label,
  NativeSelect,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  Badge,
  Skeleton,
  EmptyState,
} from '@gateflow/ui';
import { PageHeader } from '@gateflow/components';
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
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
} from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
import { EditPanel } from '@/components/dashboard/EditPanel';
import { cn } from '@/lib/utils';
import {
  getDefaultTableView,
  UNITS_COLUMN_IDS,
  UNITS_PINNED,
  type TableViewState,
} from '@/lib/residents/table-views';
import { useUserPreferences } from '@/lib/residents/use-user-preferences';
import { useOrganizationFeatures } from '@/context/OrganizationFeaturesContext';

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
  lat: null as number | null,
  lng: null as number | null,
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
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [linkTarget, setLinkTarget] = useState<Unit | null>(null);
  const [linkUserId, setLinkUserId] = useState<string>('');
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [viewContactsFor, setViewContactsFor] = useState<Unit | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('dashboard');
  const { terminology } = useOrganizationFeatures();

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
    { id: 'select', label: '', canHide: false },
    { id: 'name', label: t(terminology.unitLabel, 'Unit ID'), canHide: false },
    { id: 'type', label: t('units.table.type', 'Type'), canHide: true },
    { id: 'size', label: t('units.table.size', 'Size'), canHide: true },
    {
      id: 'residents',
      label: t(terminology.contactLabelPlural, 'Residents'),
      canHide: true,
    },
    {
      id: 'linkedResident',
      label: t('units.table.linkedResident', 'Linked Account'),
      canHide: true,
    },
    {
      id: 'qrQuota',
      label: t('units.table.qrQuota', 'QR Quota'),
      canHide: true,
    },
    {
      id: 'project',
      label: t(terminology.projectLabel, 'Project'),
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
      label: t(terminology.contactLabelPlural, 'Contacts'),
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
  const { data, isLoading, isError, error, refetch } = useUnits(filters);
  const units = data?.data ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const pageSize = data?.pageSize ?? 25;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const allUnitsSelected =
    units.length > 0 && units.every((u) => selectedUnitIds.includes(u.id));

  const renderUnitCell = (columnId: string, u: Unit) => {
    if (columnId === 'select')
      return (
        <TableCell
          key={columnId}
          className="w-10 px-6 border-l-2 border-transparent group-hover:border-l-[var(--ds-background-brand-bold)] transition-all"
        >
          <Checkbox
            checked={selectedUnitIds.includes(u.id)}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedUnitIds((prev) =>
                checked ? [...prev, u.id] : prev.filter((id) => id !== u.id)
              );
            }}
            aria-label={t('residents.selectRow', 'Select row')}
          />
        </TableCell>
      );
    if (columnId === 'name')
      return (
        <TableCell key={columnId} className="px-6 py-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-[var(--ds-text)] dark:text-[var(--ds-text-inverse)] leading-tight">
                {u.name}
              </span>
              {u.potentialVacancy && (
                <Badge
                  variant="outline"
                  className="px-1.5 py-0 text-[9px] font-black uppercase tracking-widest border-[var(--ds-border-warning)] text-[var(--ds-text-warning)] bg-[var(--ds-background-warning-subtle)]"
                >
                  {t('units.potentialVacancy', 'Vacancy risk')}
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-[var(--ds-text-subtle)] dark:text-[var(--ds-text-subtlest)] tabular-nums font-medium">
              ID: {u.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </TableCell>
      );
    if (columnId === 'type')
      return (
        <TableCell key={columnId} className="px-6">
          <Badge
            variant="outline"
            className={cn(
              'px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border-none',
              u.type === 'RESIDENTIAL'
                ? 'bg-[var(--ds-background-discovery)] text-[var(--ds-text-discovery)] dark:bg-[var(--ds-background-discovery)]/20'
                : u.type === 'COMMERCIAL'
                  ? 'bg-[var(--ds-background-warning)] text-[var(--ds-text-warning-inverse)] dark:bg-[var(--ds-background-warning)]/20'
                  : u.type === 'INDUSTRIAL'
                    ? 'bg-[var(--ds-border)] text-[var(--ds-text-subtle)] dark:bg-[var(--ds-border)]/20'
                    : 'bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)] dark:bg-[var(--ds-background-brand-subtle)]/20'
            )}
          >
            {UNIT_TYPE_LABELS[u.type as UnitType] ?? u.type}
          </Badge>
        </TableCell>
      );
    if (columnId === 'size')
      return (
        <TableCell
          key={columnId}
          className="px-6 text-[12px] font-bold text-[var(--ds-text-subtle)] dark:text-[var(--ds-text-subtlest)] tabular-nums"
        >
          {u.sizeSqm != null ? (
            `${u.sizeSqm} m²`
          ) : (
            <span className="text-[var(--ds-text-disabled)]">—</span>
          )}
        </TableCell>
      );
    if (columnId === 'residents')
      return (
        <TableCell key={columnId} className="px-6">
          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
            {u.contacts.length === 0 ? (
              <span className="text-[var(--ds-text-disabled)] text-[12px]">
                {t('units.noContacts', {
                  defaultValue: 'No {{label}}',
                  label: t(terminology.contactLabelPlural).toLowerCase(),
                })}
              </span>
            ) : (
              u.contacts.slice(0, 2).map((c) => (
                <Badge
                  key={c.id}
                  variant="secondary"
                  className="px-2 py-0.5 text-[10px] font-bold bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)] border-none hover:bg-[var(--ds-background-neutral-subtle-hovered)]"
                  onClick={() => setViewContactsFor(u)}
                >
                  {c.firstName}
                </Badge>
              ))
            )}
            {u.contacts.length > 2 && (
              <Badge
                variant="outline"
                className="px-2 py-0.5 text-[10px] font-black border-[var(--ds-border)] text-[var(--ds-text-subtle)]"
              >
                +{u.contacts.length - 2}
              </Badge>
            )}
          </div>
        </TableCell>
      );
    if (columnId === 'linkedResident')
      return (
        <TableCell
          key={columnId}
          className="px-6 text-[12px] text-[var(--ds-text-brand)] font-bold"
        >
          {u.user ? (
            <div className="flex items-center gap-1.5 hover:underline cursor-pointer">
              <span title={u.user.email}>{u.user.name}</span>
            </div>
          ) : (
            <span className="text-[var(--ds-text-disabled)]">—</span>
          )}
        </TableCell>
      );
    if (columnId === 'qrQuota')
      return (
        <TableCell
          key={columnId}
          className="px-6 font-mono text-[13px] font-black text-[var(--ds-text)] dark:text-[var(--ds-text-inverse)] tabular-nums"
        >
          {u.qrQuota}
        </TableCell>
      );
    if (columnId === 'project')
      return (
        <TableCell
          key={columnId}
          className="px-6 text-[12px] font-medium text-[var(--ds-text-subtle)]"
        >
          {u.projectName ?? (
            <span className="text-[var(--ds-text-disabled)]">—</span>
          )}
        </TableCell>
      );
    if (columnId === 'visitsInRange' || columnId === 'passesInRange')
      return (
        <TableCell
          key={columnId}
          className="px-6 text-right tabular-nums text-[13px] font-black text-[var(--ds-text)] dark:text-[var(--ds-text-inverse)]"
        >
          {u[columnId] ?? 0}
        </TableCell>
      );
    if (columnId === 'lastVisitInRange')
      return (
        <TableCell
          key={columnId}
          className="px-6 text-right text-[11px] font-bold text-[var(--ds-text-subtle)] uppercase tracking-tighter"
        >
          {u.lastVisitInRange
            ? new Date(u.lastVisitInRange).toLocaleDateString(undefined, {
                dateStyle: 'medium',
              })
            : '—'}
        </TableCell>
      );
    if (columnId === 'tagSummary')
      return (
        <TableCell
          key={columnId}
          className="px-6 text-[11px] font-bold text-[var(--ds-text-subtle)] max-w-[150px] truncate"
        >
          {u.tagSummary ?? <span className="text-[var(--ds-border)]">—</span>}
        </TableCell>
      );
    if (columnId === 'linkedContactCount')
      return (
        <TableCell
          key={columnId}
          className="px-6 text-right tabular-nums text-[13px] font-black text-[var(--ds-text)] dark:text-[var(--ds-text-inverse)]"
        >
          {u.linkedContactCount ?? 0}
        </TableCell>
      );
    if (columnId === 'actions')
      return (
        <TableCell key={columnId} className="px-6">
          <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-[var(--ds-border)] text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] dark:hover:bg-[var(--ds-background-neutral-subtle-hovered)] shadow-sm"
              onClick={() => setViewContactsFor(u)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-[var(--ds-border)] text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] dark:hover:bg-[var(--ds-background-neutral-subtle-hovered)] shadow-sm"
              onClick={() => {
                setLinkTarget(u);
                setLinkUserId(u.userId ?? '');
              }}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-[var(--ds-border)] text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] dark:hover:bg-[var(--ds-background-neutral-subtle-hovered)] shadow-sm"
              onClick={() => openEdit(u)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg border-[var(--ds-background-danger-subtle-hovered)] text-[var(--ds-text-danger)] bg-[var(--ds-background-danger-subtle)] hover:bg-[var(--ds-background-danger-subtle-hovered)] shadow-sm"
              onClick={() => setDeleteTarget(u)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      );
    return (
      <TableCell key={columnId} className="text-[var(--ds-border)]">
        /
      </TableCell>
    );
  };

  const reactTableColumns = visibleColumns.map((col) => ({
    id: col.id,
    header: () =>
      col.id === 'select' ? (
        <Checkbox
          checked={allUnitsSelected}
          onChange={(e) => {
            setSelectedUnitIds(e.target.checked ? units.map((u) => u.id) : []);
          }}
          aria-label={t('residents.selectAll', 'Select all')}
        />
      ) : (
        col.label
      ),
    cell: ({ row }: { row: { original: Unit } }) =>
      renderUnitCell(col.id, row.original),
  }));

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
      lat: unit.lat ?? null,
      lng: unit.lng ?? null,
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
          lat: form.lat ?? null,
          lng: form.lng ?? null,
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

  function exportSelectedCSV() {
    if (selectedUnitIds.length === 0) return;
    const toExport = units.filter((u) => selectedUnitIds.includes(u.id));
    const escape = (v: string) => {
      const s = String(v).replace(/"/g, '""');
      if (/^[=+\-@\t]/.test(s)) return `'${s}'`;
      return `"${s}"`;
    };
    const header = ['Name', 'Type', 'QR Quota', 'Project', 'Residents']
      .map(escape)
      .join(',');
    const rows = toExport.map((u) =>
      [
        u.name,
        u.type,
        String(u.qrQuota),
        u.projectName ?? '',
        u.contacts.map((c) => `${c.firstName} ${c.lastName}`).join('; '),
      ]
        .map((v) => escape(String(v)))
        .join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'units-selected.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function doBulkDelete() {
    if (selectedUnitIds.length === 0) return;
    startTransition(async () => {
      try {
        const res = await fetch('/api/units/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedUnitIds }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(
          t('residents.bulkDeleteSuccess', {
            count: selectedUnitIds.length,
            defaultValue: `Deleted ${selectedUnitIds.length} unit(s)`,
          })
        );
        setBulkDeleteConfirmOpen(false);
        setSelectedUnitIds([]);
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : t('residents.bulkDeleteFailed', 'Bulk delete failed')
        );
      }
    });
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
    <div className="pb-20 animate-in fade-in duration-500">
      <PageHeader
        title={t(terminology.unitLabelPlural, {
          defaultValue: 'Units & Assets',
        })}
        subtitle={t(
          `orgType:${terminology.orgLabel.split(':')[1]?.split('.')[0]}.unitDescription`,
          {
            defaultValue: t(
              'units.description',
              'Manage units, track property quotas, and monitor occupant density.'
            ),
          }
        )}
        badge={
          <div className="bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] font-bold h-6 px-3 rounded-full flex items-center text-xs">
            {total.toLocaleString()} {t(terminology.unitLabelPlural)}
          </div>
        }
        actions={[
          <Button
            key="import"
            variant="outline"
            size="sm"
            className="h-8 border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-semibold hover:bg-[var(--ds-background-neutral-subtle-hovered)] rounded-[var(--ds-border-radius-100)] transition-all flex items-center gap-2 text-xs"
            asChild
          >
            <label className="cursor-pointer flex items-center">
              <Upload className="h-3.5 w-3.5" />
              {t('common.import', 'Import')}
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={importCSV}
              />
            </label>
          </Button>,
          <Button
            key="export"
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="h-8 border-[var(--ds-border)] text-[var(--ds-text-subtle)] font-semibold hover:bg-[var(--ds-background-neutral-subtle-hovered)] rounded-[var(--ds-border-radius-100)] transition-all flex items-center gap-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            {t('common.export', 'Export')}
          </Button>,
          <Button
            key="create"
            onClick={openCreate}
            className="h-8 px-4 bg-[var(--ds-background-brand-bold)] hover:bg-[var(--ds-background-brand-bold-hovered)] text-[var(--ds-text-inverse)] font-semibold rounded-[var(--ds-border-radius-100)] transition-all flex items-center gap-2 text-xs"
          >
            <Plus className="h-4 w-4" />
            {t('units.create', 'Create Unit')}
          </Button>,
        ]}
      />

      <div className="mt-8 space-y-6">
        <div className="bg-[var(--ds-background-default)] border border-[var(--ds-border)] rounded-2xl p-6 shadow-sm">
          <ResidentsFilterBar
            filters={filters}
            onFiltersChange={updateFiltersAndUrl}
            onCustomizerOpen={() => setCustomizerOpen(true)}
            totalCount={total}
            selectedCount={selectedUnitIds.length}
            searchPlaceholder={t('units.searchPlaceholder', 'Search units…')}
          />
        </div>

        <div className="relative overflow-hidden">
          {selectedUnitIds.length > 0 && (
            <div className="flex items-center justify-between gap-4 p-3 bg-[var(--ds-background-neutral-subtle)] border-x border-t border-[var(--ds-border)] rounded-t-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 px-3 py-1 bg-[var(--ds-background-default)] rounded-full border border-[var(--ds-border)] shadow-none">
                <span className="text-[11px] font-black text-[var(--ds-text-subtle)] uppercase tracking-tight">
                  {selectedUnitIds.length} Selected
                </span>
                <div className="w-px h-3 bg-[var(--ds-border)] mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-[var(--ds-text-selected)] hover:bg-[var(--ds-background-brand-subtle)] rounded-full text-[10px] font-bold"
                  onClick={exportSelectedCSV}
                >
                  <Download className="h-3 w-3 mr-1.5" />
                  CSV
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-[var(--ds-text-danger)] hover:bg-[var(--ds-background-danger-subtle)] rounded-full text-[10px] font-bold"
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                >
                  <Trash2 className="h-3 w-3 mr-1.5" />
                  Delete
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-7 px-3 text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] rounded-full"
                onClick={() => setSelectedUnitIds([])}
              >
                Cancel
              </Button>
            </div>
          )}

          <div
            className={cn(
              'bg-[var(--ds-background-default)] border border-[var(--ds-border)] shadow-sm',
              selectedUnitIds.length > 0 ? 'rounded-b-2xl' : 'rounded-2xl'
            )}
          >
            <div className="overflow-x-auto min-h-[500px]">
              <Table>
                <TableHeader className="bg-[var(--ds-background-neutral-subtle)]/10 border-b border-border/50">
                  {unitsTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent border-none"
                    >
                      {headerGroup.headers.map((header) => {
                        const columnId = header.column.id;
                        return (
                          <TableHead
                            key={header.id}
                            className={cn(
                              'h-12 px-6 text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]',
                              columnId === 'visitsInRange' ||
                                columnId === 'passesInRange' ||
                                columnId === 'lastVisitInRange' ||
                                columnId === 'actions'
                                ? 'text-right'
                                : 'text-left'
                            )}
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
                <TableBody className="divide-y divide-[var(--ds-border)] dark:divide-[var(--ds-border)]">
                  {isError ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length}
                        className="h-48 text-center text-danger-bold font-bold"
                      >
                        {error?.message ??
                          t('units.errors.loadFailed', 'Failed to load units')}
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-4"
                          onClick={() => refetch()}
                        >
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {visibleColumns.map((col) => (
                          <TableCell key={col.id} className="px-6 py-4">
                            <Skeleton className="h-4 w-full rounded-md" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : units.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length}
                        className="h-64 text-center"
                      >
                        <EmptyState
                          icon={Building}
                          title="No units discovered"
                          description="Start by creating a new unit or importing via CSV."
                          action={
                            <Button
                              onClick={openCreate}
                              variant="outline"
                              className="border-[var(--ds-border)] font-bold"
                            >
                              Add your first unit
                            </Button>
                          }
                          className="border-0 py-16"
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    unitsTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="group hover:bg-[var(--ds-background-neutral-subtle-hovered)] dark:hover:bg-[var(--ds-background-neutral-subtle)]/10 transition-colors border-none h-14"
                      >
                        {row
                          .getVisibleCells()
                          .map((cell) =>
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-[var(--ds-background-neutral-subtle)]/10 border-t border-[var(--ds-border)]">
              <div className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)] tabular-nums">
                {total.toLocaleString()} units found • Page {page} of{' '}
                {totalPages}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFiltersAndUrl({ page: page - 1 })}
                  disabled={isLoading || page <= 1}
                  className="h-8 w-12 border-[var(--ds-border)] rounded-lg hover:bg-[var(--ds-background-default)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="h-8 px-3 flex items-center bg-[var(--ds-background-default)] rounded-lg border border-[var(--ds-border)] text-[11px] font-bold tabular-nums">
                  {page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFiltersAndUrl({ page: page + 1 })}
                  disabled={isLoading || page >= totalPages}
                  className="h-8 w-12 border-[var(--ds-border)] rounded-lg hover:bg-[var(--ds-background-default)]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TableCustomizerModal
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        columns={unitColumns}
        view={tableView}
        onSave={(v) => {
          setTableView(v);
          updatePreferences({ tableViews: { units: v } }).catch(() => {});
        }}
      />

      <ViewContactsModal
        open={!!viewContactsFor}
        onOpenChange={(open) => !open && setViewContactsFor(null)}
        unit={viewContactsFor}
        locale={locale}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <EditPanel
          title={
            editing
              ? t('units.edit', 'Edit Unit')
              : t('units.create', 'Create Unit')
          }
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={save}
          isSaving={isPending}
        >
          <div className="space-y-6 px-1">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                {t('units.form.name', 'Unit Identifier')}
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. APT-402, Villa 12, Office A"
                className="h-11 rounded-xl bg-[var(--ds-background-neutral-subtle)] border-[var(--ds-border)] focus:bg-[var(--ds-background-default)] dark:bg-[var(--ds-background-neutral-subtle)] dark:border-[var(--ds-border)] transition-all font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                  {t('units.form.type', 'Classification')}
                </Label>
                <NativeSelect
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value as UnitType)}
                  className="h-11 rounded-xl bg-[var(--ds-background-neutral-subtle)] border-[var(--ds-border)] dark:bg-[var(--ds-background-neutral-subtle)] dark:border-[var(--ds-border)] font-bold"
                >
                  {Object.entries(UNIT_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                  {t('units.form.size', 'Area (m²)')}
                </Label>
                <Input
                  type="number"
                  value={form.sizeSqm ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sizeSqm: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    }))
                  }
                  placeholder="0.00"
                  className="h-11 rounded-xl bg-[var(--ds-background-neutral-subtle)] border-[var(--ds-border)] dark:bg-[var(--ds-background-neutral-subtle)] dark:border-[var(--ds-border)] font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                {t('units.form.project', 'Parent Project')}
              </Label>
              <NativeSelect
                value={form.projectId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, projectId: e.target.value }))
                }
                className="h-11 rounded-xl bg-[var(--ds-background-neutral-subtle)] border-[var(--ds-border)] dark:bg-[var(--ds-background-neutral-subtle)] dark:border-[var(--ds-border)] font-bold"
              >
                <option value="">
                  {t('units.form.selectProject', 'Global / No Project')}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                {t('units.form.qrQuota', 'Digital Key Quota')}
              </Label>
              <div className="flex items-center gap-4 bg-[var(--ds-background-neutral-subtle)]/10 p-3 rounded-xl border border-[var(--ds-border)]">
                <Input
                  type="number"
                  value={form.qrQuota}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      qrQuota: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-24 h-10 rounded-lg bg-[var(--ds-background-default)] border-[var(--ds-border)] font-black text-center"
                />
                <p className="text-[12px] text-[var(--ds-text-subtle)] leading-tight flex-1">
                  Total QR keys allowed per unit. Recommended for{' '}
                  {form.type.toLowerCase().replace('_', ' ')} is{' '}
                  {UNIT_QUOTA_DEFAULTS[form.type]}.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                {t('units.form.contacts', 'Resident Access Control List')}
              </Label>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto p-1 bg-[var(--ds-background-neutral-subtle)]/10 rounded-2xl border border-[var(--ds-border)]">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleContactToggle(c.id)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2',
                      form.contactIds.includes(c.id)
                        ? 'bg-[var(--ds-background-default)] border-[var(--ds-background-brand-bold)] shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-[var(--ds-background-neutral-subtle)]'
                    )}
                  >
                    <div
                      className={cn(
                        'h-5 w-5 rounded-md flex items-center justify-center transition-all',
                        form.contactIds.includes(c.id)
                          ? 'bg-[var(--ds-background-brand-bold)]'
                          : 'bg-[var(--ds-border)]'
                      )}
                    >
                      {form.contactIds.includes(c.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        form.contactIds.includes(c.id)
                          ? 'text-[var(--ds-text-brand)]'
                          : 'text-[var(--ds-text-subtle)]'
                      )}
                    >
                      {c.firstName} {c.lastName}
                    </span>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <div className="p-8 text-center bg-[var(--ds-background-neutral-subtle)]/10 rounded-xl m-2">
                    <p className="text-sm font-bold text-[var(--ds-text-subtle)]">
                      No contacts found
                    </p>
                    <p className="text-xs text-[var(--ds-text-subtlest)]">
                      Residents will appear here once added to the system.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </EditPanel>
      </Dialog>

      <Dialog
        open={!!linkTarget}
        onOpenChange={(open) => !open && setLinkTarget(null)}
      >
        <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-[var(--ds-background-default)]">
          <div className="bg-[var(--ds-background-brand-subtle)]/10 p-6 flex flex-col items-center gap-4 text-center border-b border-[var(--ds-background-brand-subtle)] dark:border-[var(--ds-border)]">
            <div className="h-16 w-16 rounded-full bg-[var(--ds-background-default)] flex items-center justify-center shadow-sm">
              <UserPlus className="h-8 w-8 text-[var(--ds-text-brand)]" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-[var(--ds-text-brand)]">
              Link Portal User
            </DialogTitle>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-[11px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)]">
                Assign primary resident account
              </Label>
              <NativeSelect
                value={linkUserId}
                onChange={(e) => setLinkUserId(e.target.value)}
                className="h-12 rounded-xl bg-[var(--ds-background-neutral-subtle)]/10 border-[var(--ds-border)] font-bold"
              >
                <option value="">
                  {t('units.notLinked', 'No User Linked')}
                </option>
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.email})
                  </option>
                ))}
              </NativeSelect>
              <p className="text-[12px] text-[var(--ds-text-subtle)] bg-[var(--ds-background-neutral-subtle)]/10 p-4 rounded-xl leading-relaxed">
                This links a Dashboard/App user account to this unit. The linked
                resident will be able to manage their guests and view logs for
                this property.
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setLinkTarget(null)}
                className="flex-1 h-12 rounded-xl border-[var(--ds-border)] font-bold"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={doLinkResident}
                disabled={isPending}
                className="flex-1 h-12 rounded-xl bg-[var(--ds-background-brand-bold)] hover:bg-[var(--ds-background-brand-bold-hovered)] font-bold text-white shadow-lg"
              >
                {isPending ? (
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Check className="h-5 w-5 mr-2" />
                )}
                {t('common.save', 'Link Account')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-[var(--ds-background-default)]">
          <div className="bg-[var(--ds-background-danger-subtle)]/10 p-6 flex flex-col items-center gap-4 text-center border-b border-[var(--ds-background-danger-subtle)] dark:border-[var(--ds-border)]">
            <div className="h-16 w-16 rounded-full bg-[var(--ds-background-default)] flex items-center justify-center shadow-sm">
              <Trash2 className="h-8 w-8 text-[var(--ds-text-danger)]" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-[var(--ds-text-danger)]">
              Delete Unit?
            </DialogTitle>
          </div>
          <div className="p-8 space-y-6 text-center">
            <p className="text-[15px] font-medium text-[var(--ds-text-subtle)] leading-relaxed">
              Are you sure you want to delete unit{' '}
              <span className="font-black text-[var(--ds-text)]">
                {deleteTarget?.name}
              </span>
              ? This action will unlink all associated contacts and cannot be
              undone.
            </p>
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-12 rounded-xl border-[var(--ds-border)] font-bold"
              >
                {t('common.cancel', 'Keep it')}
              </Button>
              <Button
                variant="destructive"
                onClick={doDelete}
                disabled={isPending}
                className="flex-1 h-12 rounded-xl bg-[var(--ds-background-danger-bold)] hover:bg-[var(--ds-background-danger-bold-hovered)] font-bold text-white shadow-lg"
              >
                {t('common.delete', 'Yes, delete')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
      >
        <DialogContent className="max-w-md rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-[var(--ds-background-default)]">
          <div className="bg-[var(--ds-background-danger-subtle)]/10 p-6 flex flex-col items-center gap-4 text-center border-b border-[var(--ds-background-danger-subtle)] dark:border-[var(--ds-border)]">
            <div className="h-16 w-16 rounded-full bg-[var(--ds-background-default)] flex items-center justify-center shadow-sm">
              <Trash2 className="h-8 w-8 text-[var(--ds-text-danger)]" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-[var(--ds-text-danger)]">
              Bulk Deletion
            </DialogTitle>
          </div>
          <div className="p-8 space-y-6 text-center">
            <p className="text-[15px] font-medium text-[var(--ds-text-subtle)] leading-relaxed">
              You are about to delete{' '}
              <span className="font-black text-[var(--ds-text)]">
                {selectedUnitIds.length}
              </span>{' '}
              units. This action is irreversible.
            </p>
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setBulkDeleteConfirmOpen(false)}
                className="flex-1 h-12 rounded-xl border-[var(--ds-border)] font-bold"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={doBulkDelete}
                disabled={isPending}
                className="flex-1 h-12 rounded-xl bg-[var(--ds-background-danger-bold)] hover:bg-[var(--ds-background-danger-bold-hovered)] font-bold text-white shadow-lg"
              >
                {t('common.delete', 'Delete all selected')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
