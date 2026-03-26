'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Badge,
  Skeleton,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Textarea,
} from '@gate-access/ui';
import { PageHeader } from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Plus,
  Upload,
  Download,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building,
  Check,
  Send,
  Smartphone,
  MessageCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gate-access/ui';
import {
  mergeFilters,
  parseResidentsFiltersFromSearchParams,
  residentsFiltersToSearchParams,
  type ResidentsFilters,
} from '@/lib/residents/residents-filters';
import { useContacts, type ContactRow } from '@/lib/residents/use-contacts';
import { ResidentsFilterBar } from '@/components/dashboard/residents/ResidentsFilterBar';
import { TableCustomizerModal } from '@/components/dashboard/residents/TableCustomizerModal';
import { ViewUnitsModal } from '@/components/dashboard/residents/ViewUnitsModal';
import { EditPanel } from '@/components/dashboard/EditPanel';
import { cn } from '@/lib/utils';
import {
  getDefaultTableView,
  CONTACTS_COLUMN_IDS,
  CONTACTS_PINNED,
  PRESET_VIEWS,
  type TableViewState,
} from '@/lib/residents/table-views';
import { useUserPreferences } from '@/lib/residents/use-user-preferences';

interface Unit {
  id: string;
  name: string;
}

const emptyForm = () => ({
  firstName: '',
  lastName: '',
  birthday: '',
  company: '',
  phone: '',
  email: '',
  avatarUrl: '',
  jobTitle: '',
  companyWebsite: '',
  source: '',
  notes: '',
  unitIds: [] as string[],
});

export default function ContactsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const [filters, setFilters] = useState<ResidentsFilters>(() => {
    const parsed = parseResidentsFiltersFromSearchParams(searchParams);
    return mergeFilters(parsed);
  });
  const [units, setUnits] = useState<Unit[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ContactRow | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<ContactRow | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [viewUnitsFor, setViewUnitsFor] = useState<ContactRow | null>(null);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [bulkTagId, setBulkTagId] = useState('');
  const [inviteTarget, setInviteTarget] = useState<ContactRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('dashboard');

  const { preferences, updatePreferences } = useUserPreferences();
  const savedTableView = (preferences.tableViews?.contacts ??
    {}) as TableViewState;
  const defaultView = getDefaultTableView(CONTACTS_COLUMN_IDS, CONTACTS_PINNED);
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
      const base = getDefaultTableView(CONTACTS_COLUMN_IDS, CONTACTS_PINNED);
      setTableView({
        columnOrder: order,
        columnVisibility: { ...base.columnVisibility, ...vis },
      });
    }
  }, [savedTableView.columnOrder, savedTableView.columnVisibility]);

  const [tagOptions, setTagOptions] = useState<
    { id: string; name: string; color: string | null }[]
  >([]);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/tags')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.success && json.data) setTagOptions(json.data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const queryClient = useQueryClient();

  const addTagMutation = useMutation({
    mutationFn: async ({
      contactId,
      tagId,
    }: {
      contactId: string;
      tagId: string;
    }) => {
      const res = await fetch(`/api/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagIds: [tagId] }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || 'Failed to add tag');
    },
    onMutate: async ({ contactId, tagId }) => {
      const tag = tagOptions.find((t) => t.id === tagId);
      if (!tag) return undefined;
      await queryClient.cancelQueries({ queryKey: ['contacts', filters] });
      const previous = queryClient.getQueryData<{
        success: boolean;
        data: ContactRow[];
        total?: number;
        page?: number;
        pageSize?: number;
      }>(['contacts', filters]);
      if (!previous?.data) return { previous };
      queryClient.setQueryData(['contacts', filters], {
        ...previous,
        data: previous.data.map((c) =>
          c.id === contactId
            ? {
                ...c,
                tags: [
                  ...(c.tags ?? []),
                  { id: tag.id, name: tag.name, color: tag.color },
                ],
              }
            : c
        ),
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(['contacts', filters], ctx.previous);
      toast.error(t('residents.tagUpdateFailed', 'Failed to update tags'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: async ({
      contactId,
      tagId,
    }: {
      contactId: string;
      tagId: string;
    }) => {
      const res = await fetch(`/api/contacts/${contactId}/tags`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || 'Failed to remove tag');
    },
    onMutate: async ({ contactId, tagId }) => {
      await queryClient.cancelQueries({ queryKey: ['contacts', filters] });
      const previous = queryClient.getQueryData<{
        success: boolean;
        data: ContactRow[];
        total?: number;
        page?: number;
        pageSize?: number;
      }>(['contacts', filters]);
      if (!previous?.data) return { previous };
      queryClient.setQueryData(['contacts', filters], {
        ...previous,
        data: previous.data.map((c) =>
          c.id === contactId
            ? { ...c, tags: (c.tags ?? []).filter((t) => t.id !== tagId) }
            : c
        ),
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(['contacts', filters], ctx.previous);
      toast.error(t('residents.tagUpdateFailed', 'Failed to update tags'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const contactColumns = [
    { id: 'select', label: '', canHide: false },
    { id: 'avatar', label: t('contacts.table.avatar', ''), canHide: false },
    {
      id: 'firstName',
      label: t('contacts.table.firstName', 'First Name'),
      canHide: false,
    },
    {
      id: 'lastName',
      label: t('contacts.table.lastName', 'Last Name'),
      canHide: false,
    },
    {
      id: 'birthday',
      label: t('contacts.table.birthday', 'Birthday'),
      canHide: true,
    },
    {
      id: 'company',
      label: t('contacts.table.company', 'Company'),
      canHide: true,
    },
    { id: 'phone', label: t('contacts.table.phone', 'Phone'), canHide: true },
    { id: 'email', label: t('contacts.table.email', 'Email'), canHide: true },
    { id: 'tags', label: t('contacts.table.tags', 'Tags'), canHide: true },
    { id: 'units', label: t('contacts.table.units', 'Units'), canHide: true },
    {
      id: 'invitation',
      label: t('crm.invitations.status', 'Invite'),
      canHide: true,
    },
    {
      id: 'visitsInRange',
      label: t('contacts.table.visitsInRange', 'Visits'),
      canHide: true,
    },
    {
      id: 'passesInRange',
      label: t('contacts.table.passesInRange', 'Passes'),
      canHide: true,
    },
    {
      id: 'lastVisitInRange',
      label: t('contacts.table.lastVisitInRange', 'Last visit'),
      canHide: true,
    },
    {
      id: 'actions',
      label: t('contacts.table.actions', 'Actions'),
      canHide: false,
    },
  ];
  const visibleColumns = tableView.columnOrder
    .filter(
      (id) =>
        tableView.columnVisibility[id] !== false &&
        contactColumns.some((c) => c.id === id)
    )
    .map((id) => contactColumns.find((c) => c.id === id)!)
    .filter(Boolean);
  const renderContactCell = (columnId: string, c: ContactRow) => {
    if (columnId === 'select')
      return (
        <TableCell key={columnId} className="w-10">
          <Checkbox
            checked={selectedContactIds.includes(c.id)}
            onChange={(e) => toggleContactSelection(c.id, e.target.checked)}
            aria-label={t('residents.selectRow', 'Select row')}
          />
        </TableCell>
      );
    if (columnId === 'avatar')
      return (
        <TableCell key={columnId} className="w-14">
          <Avatar className="h-8 w-8 rounded-full ring-2 ring-[var(--ds-surface-raised)]">
            {c.avatarUrl ? (
              <AvatarImage
                src={c.avatarUrl}
                alt={`${c.firstName} ${c.lastName}`}
              />
            ) : null}
            <AvatarFallback className="text-[10px] bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)] font-bold">
              {c.firstName.charAt(0)}
              {c.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </TableCell>
      );
    if (columnId === 'firstName')
      return (
        <TableCell
          key={columnId}
          className="font-semibold text-[var(--ds-text)]"
        >
          {c.firstName}
        </TableCell>
      );
    if (columnId === 'lastName')
      return (
        <TableCell key={columnId} className="text-[var(--ds-text-subtle)]">
          {c.lastName}
        </TableCell>
      );
    if (columnId === 'birthday')
      return (
        <TableCell
          key={columnId}
          className="text-[12px] text-[var(--ds-text-subtle)]"
        >
          {c.birthday ?? <span className="text-[var(--ds-border)]">/</span>}
        </TableCell>
      );
    if (columnId === 'company')
      return (
        <TableCell
          key={columnId}
          className="text-[12px] text-[var(--ds-text-subtle)]"
        >
          {c.company ?? <span className="text-[var(--ds-border)]">—</span>}
        </TableCell>
      );
    if (columnId === 'phone')
      return (
        <TableCell
          key={columnId}
          className="text-[12px] font-mono text-[var(--ds-text-subtle)]"
        >
          {c.phone ?? <span className="text-[var(--ds-border)]">—</span>}
        </TableCell>
      );
    if (columnId === 'email')
      return (
        <TableCell
          key={columnId}
          className="text-[12px] text-[var(--ds-text-brand)] hover:underline cursor-pointer"
        >
          {c.email ?? <span className="text-[var(--ds-border)]">—</span>}
        </TableCell>
      );
    if (columnId === 'tags')
      return (
        <TableCell key={columnId}>
          <div className="flex flex-wrap gap-1 items-center">
            {(c.tags ?? []).length > 0 &&
              (c.tags ?? []).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] font-bold bg-[var(--ds-background-neutral-subtle-hovered)] text-[var(--ds-text-subtle)] border-none hover:bg-[var(--ds-background-neutral-pressed)]"
                  style={
                    tag.color
                      ? {
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          border: `1px solid ${tag.color}40`,
                        }
                      : undefined
                  }
                  onClick={() =>
                    removeTagMutation.mutate({ contactId: c.id, tagId: tag.id })
                  }
                >
                  {tag.name}
                </Badge>
              ))}
            <NativeSelect
              value=""
              onChange={(e) => {
                const tagId = e.target.value;
                if (tagId) addTagMutation.mutate({ contactId: c.id, tagId });
                e.target.value = '';
              }}
              className="h-6 w-[80px] text-[10px] bg-transparent border-none shadow-none focus:ring-0 text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] rounded"
            >
              <option value="">+ Tag</option>
              {tagOptions
                .filter((t) => !(c.tags ?? []).some((a) => a.id === t.id))
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </NativeSelect>
          </div>
        </TableCell>
      );
    if (columnId === 'units')
      return (
        <TableCell key={columnId}>
          <div className="flex flex-wrap gap-1">
            {c.units.length === 0 ? (
              <span className="text-[var(--ds-border)]">—</span>
            ) : (
              c.units.map((u) => (
                <Badge
                  key={u.id}
                  variant="outline"
                  className="px-1.5 py-0 text-[10px] font-bold bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)] border-none cursor-pointer"
                  onClick={() => setViewUnitsFor(c)}
                >
                  {u.name}
                </Badge>
              ))
            )}
          </div>
        </TableCell>
      );
    if (columnId === 'visitsInRange' || columnId === 'passesInRange')
      return (
        <TableCell
          key={columnId}
          className="text-right tabular-nums text-[12px] font-semibold text-[var(--ds-text)]"
        >
          {c[columnId] ?? 0}
        </TableCell>
      );
    if (columnId === 'lastVisitInRange')
      return (
        <TableCell
          key={columnId}
          className="text-right text-[11px] text-[var(--ds-text-subtle)]"
        >
          {c.lastVisitInRange
            ? new Date(c.lastVisitInRange).toLocaleDateString(undefined, {
                dateStyle: 'short',
              })
            : '—'}
        </TableCell>
      );
    if (columnId === 'invitation')
      return (
        <TableCell key={columnId}>
          {c.invitationStatus ? (
            <div className="flex flex-col gap-1">
              <Badge
                variant="outline"
                className={cn(
                  'px-1.5 py-0 text-[9px] font-black uppercase tracking-tighter border-none self-start',
                  c.invitationStatus === 'SENT'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : c.invitationStatus === 'FAILED'
                      ? 'bg-red-500/10 text-red-600'
                      : 'bg-amber-500/10 text-amber-600'
                )}
              >
                {c.invitationStatus}
              </Badge>
              {c.lastInvitationAt && (
                <span className="text-[9px] text-[var(--ds-text-subtle)] opacity-60">
                  {new Date(c.lastInvitationAt).toLocaleDateString(undefined, {
                    dateStyle: 'short',
                  })}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[var(--ds-border)]">—</span>
          )}
        </TableCell>
      );
    if (columnId === 'actions')
      return (
        <TableCell key={columnId}>
          <div className="flex items-center gap-0.5 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[var(--ds-text-brand)] hover:bg-[var(--ds-background-brand-subtle)]"
              onClick={() => setInviteTarget(c)}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)]"
              onClick={() => setViewUnitsFor(c)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)]"
              onClick={() => openEdit(c)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[var(--ds-text-danger)] hover:bg-[var(--ds-background-danger-subtle-hovered)] hover:text-[var(--ds-text-danger)]"
              onClick={() => confirmDelete(c)}
            >
              <Trash2 className="h-3.5 w-3.5" />
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

  const { data, isLoading, refetch } = useContacts(filters);
  const contacts = data?.data ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const pageSize = data?.pageSize ?? 25;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const allSelected =
    contacts.length > 0 &&
    contacts.every((c) => selectedContactIds.includes(c.id));

  const reactTableColumns = visibleColumns.map((col) => {
    const def: ColumnDef<ContactRow> = {
      id: col.id,
      header: () =>
        col.id === 'select' ? (
          <Checkbox
            checked={allSelected}
            onChange={(e) => toggleSelectAll(e.target.checked)}
            aria-label={t('residents.selectAll', 'Select all')}
          />
        ) : (
          col.label
        ),
      cell: ({ row }) => renderContactCell(col.id, row.original),
    };
    return def;
  });
  const contactsTable = useReactTable({
    data: contacts,
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
          `/${locale}/dashboard/residents/contacts${query ? `?${query}` : ''}`,
          { scroll: false }
        );
        return next;
      });
    },
    [locale, router]
  );

  useEffect(() => {
    let cancelled = false;
    fetch('/api/units')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.success && json.data) {
          setUnits(
            json.data.map((u: { id: string; name: string }) => ({
              id: u.id,
              name: u.name,
            }))
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  }

  function openEdit(contact: ContactRow) {
    setEditing(contact);
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      birthday: contact.birthday ?? '',
      company: contact.company ?? '',
      phone: contact.phone ?? '',
      email: contact.email ?? '',
      avatarUrl: contact.avatarUrl ?? '',
      jobTitle: contact.jobTitle ?? '',
      companyWebsite: contact.companyWebsite ?? '',
      source: (contact.source as string | null) ?? '',
      notes: contact.notes ?? '',
      unitIds: contact.units.map((u) => u.id),
    });
    setDialogOpen(true);
  }

  function handleUnitToggle(unitId: string) {
    setForm((prev) => ({
      ...prev,
      unitIds: prev.unitIds.includes(unitId)
        ? prev.unitIds.filter((id) => id !== unitId)
        : [...prev.unitIds, unitId],
    }));
  }

  function save() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error(
        t('contacts.errors.required', 'First name and last name are required')
      );
      return;
    }
    startTransition(async () => {
      try {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          birthday: form.birthday || null,
          company: form.company || null,
          phone: form.phone || null,
          email: form.email || null,
          avatarUrl: form.avatarUrl || null,
          jobTitle: form.jobTitle || null,
          companyWebsite: form.companyWebsite || null,
          source: form.source || null,
          notes: form.notes || null,
          unitIds: form.unitIds,
        };
        const res = editing
          ? await fetch(`/api/contacts/${editing.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            })
          : await fetch('/api/contacts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(
          editing
            ? t('contacts.success.updated', 'Contact updated')
            : t('contacts.success.created', 'Contact created')
        );
        setDialogOpen(false);
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : t('contacts.errors.saveFailed', 'Failed to save contact')
        );
      }
    });
  }

  function confirmDelete(contact: ContactRow) {
    setDeleteTarget(contact);
  }

  function doDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/contacts/${deleteTarget.id}`, {
          method: 'DELETE',
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(t('contacts.success.deleted', 'Contact deleted'));
        setDeleteTarget(null);
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : t('contacts.errors.deleteFailed', 'Failed to delete contact')
        );
      }
    });
  }

  function toggleContactSelection(contactId: string, checked: boolean) {
    setSelectedContactIds((prev) =>
      checked
        ? Array.from(new Set([...prev, contactId]))
        : prev.filter((id) => id !== contactId)
    );
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedContactIds(checked ? contacts.map((c) => c.id) : []);
  }

  async function applyBulkTagAction(action: 'add' | 'remove') {
    if (!bulkTagId || selectedContactIds.length === 0) return;
    try {
      const res = await fetch('/api/contacts/tags/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactIds: selectedContactIds,
          tagIds: [bulkTagId],
          action,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || 'Bulk tag update failed');
      toast.success(
        action === 'add'
          ? t('residents.bulkTagAdded', 'Tag added to selected contacts')
          : t('residents.bulkTagRemoved', 'Tag removed from selected contacts')
      );
      await refetch();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : t('residents.bulkTagFailed', 'Bulk tag update failed')
      );
    }
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
      const res = await fetch(`/api/contacts?${sp.toString()}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t('contacts.errors.exportFailed', 'Export failed'));
    }
  }

  function exportSelectedCSV() {
    if (selectedContactIds.length === 0) return;
    const toExport = contacts.filter((c) => selectedContactIds.includes(c.id));
    const escape = (v: string) => {
      const s = String(v).replace(/"/g, '""');
      if (/^[=+\-@\t]/.test(s)) return `'${s}'`;
      return `"${s}"`;
    };
    const header = [
      'First Name',
      'Last Name',
      'Birthday',
      'Company',
      'Phone',
      'Email',
      'Units',
    ]
      .map(escape)
      .join(',');
    const rows = toExport.map((c) =>
      [
        c.firstName,
        c.lastName,
        c.birthday ?? '',
        c.company ?? '',
        c.phone ?? '',
        c.email ?? '',
        c.units.map((u) => u.name).join('; '),
      ]
        .map((v) => escape(String(v)))
        .join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts-selected.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function doBulkDelete() {
    if (selectedContactIds.length === 0) return;
    startTransition(async () => {
      try {
        const res = await fetch('/api/contacts/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedContactIds }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(
          t('residents.bulkDeleteSuccess', {
            count: selectedContactIds.length,
            defaultValue: `Deleted ${selectedContactIds.length} contact(s)`,
          })
        );
        setBulkDeleteConfirmOpen(false);
        setSelectedContactIds([]);
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
        const [firstName, lastName, birthday, company, phone, email] = cols;
        if (!firstName || !lastName) continue;
        try {
          const res = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName,
              lastName,
              birthday: birthday || null,
              company: company || null,
              phone: phone || null,
              email: email || null,
            }),
          });
          const json = await res.json();
          if (res.ok && json.success) imported++;
        } catch {
          /* skip */
        }
      }
      toast.success(
        t('contacts.success.imported', {
          count: imported,
          defaultValue: `Imported ${imported} contacts`,
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
        title={t('contacts.title', { defaultValue: 'Residents' })}
        subtitle={t('contacts.description', {
          defaultValue:
            'Manage residents, occupants, and visitors for your organisation.',
        })}
        badge={
          <div className="bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] font-bold h-6 px-3 rounded-full flex items-center text-xs">
            {total.toLocaleString()} {t('residents.total', 'Contacts')}
          </div>
        }
        actions={[
          <div key="actions-group" className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-[var(--ds-border,#DFE1E6)] text-[var(--ds-text-subtle,#42526E)] font-semibold hover:bg-[var(--ds-background-neutral-subtle-hovered,#EBECF0)] rounded-[var(--ds-border-radius-100,#3px)] transition-all flex items-center gap-2 text-xs"
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
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="h-8 border-[var(--ds-border,#DFE1E6)] text-[var(--ds-text-subtle,#42526E)] font-semibold hover:bg-[var(--ds-background-neutral-subtle-hovered,#EBECF0)] rounded-[var(--ds-border-radius-100,#3px)] transition-all flex items-center gap-2 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              {t('common.export', 'Export')}
            </Button>
            <Button
              key="create"
              onClick={openCreate}
              className="h-8 px-4 bg-[var(--ds-background-brand-bold,#0052CC)] hover:bg-[var(--ds-background-brand-bold-hovered,#004EBE)] text-[var(--ds-text-inverse,#FFFFFF)] font-semibold rounded-[var(--ds-border-radius-100,#3px)] transition-all flex items-center gap-2 text-xs"
            >
              <Plus className="h-4 w-4" />
              {t('contacts.create', 'Create Resident')}
            </Button>
          </div>,
        ]}
      />

      <div className="mt-8 space-y-4">
        <ResidentsFilterBar
          filters={filters}
          onFiltersChange={updateFiltersAndUrl}
          onCustomizerOpen={() => setCustomizerOpen(true)}
          totalCount={total}
          selectedCount={selectedContactIds.length}
          tags={tagOptions}
        />

        {/* Bulk Actions Toolbar */}
        {selectedContactIds.length > 0 && (
          <div className="flex items-center justify-between gap-4 p-3 bg-[var(--ds-background-neutral-subtle,#F4F5F7)] border-x border-t border-[var(--ds-border,#DFE1E6)] rounded-t-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-[var(--ds-background-default,#FFFFFF)] rounded-full border border-[var(--ds-border,#DFE1E6)] shadow-none">
                <span className="text-[11px] font-black text-[var(--ds-text-subtle,#6B778C)] uppercase tracking-tight">
                  {selectedContactIds.length} Selected
                </span>
                <div className="w-px h-3 bg-[var(--ds-border,#DFE1E6)] mx-1" />
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
                  className="h-7 px-2.5 text-[var(--ds-text-danger,#BF2600)] hover:bg-[var(--ds-background-danger-subtle,#FFEBE6)] rounded-full text-[10px] font-bold"
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                >
                  <Trash2 className="h-3 w-3 mr-1.5" />
                  Delete
                </Button>
              </div>

              <div className="flex items-center gap-1.5 ml-2">
                <NativeSelect
                  value={bulkTagId}
                  onChange={(e) => setBulkTagId(e.target.value)}
                  className="h-7 w-[130px] text-[10px] border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-input,#F4F5F7)] focus:bg-[var(--ds-background-default,#FFFFFF)] font-semibold rounded-full"
                >
                  <option value="">
                    {t('residents.selectTag', 'Apply Tag…')}
                  </option>
                  {tagOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </NativeSelect>
                <Button
                  size="sm"
                  className="h-7 w-7 p-0 bg-[var(--ds-background-brand-bold)] hover:bg-[var(--ds-background-brand-bold-hovered)] text-white rounded-full"
                  onClick={() => applyBulkTagAction('add')}
                  disabled={!bulkTagId}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-[10px] font-black uppercase tracking-widest text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] rounded-full"
              onClick={() => setSelectedContactIds([])}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Data Table Container */}
        <div className="bg-[var(--ds-background-default)] dark:bg-[var(--ds-background-default)] rounded-2xl border border-[var(--ds-border)] dark:border-[var(--ds-border)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-h-[500px]">
            <Table>
              <TableHeader className="bg-[var(--ds-background-neutral-subtle)] dark:bg-[var(--ds-background-neutral-subtle)]/20 border-b border-[var(--ds-border)] dark:border-[var(--ds-border)]">
                {contactsTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent border-none h-12"
                  >
                    {headerGroup.headers.map((header) => {
                      const columnId = header.column.id;
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            'px-6 text-[var(--ds-text-subtle)] dark:text-[var(--ds-text-subtle)] text-[11px] font-black uppercase tracking-widest',
                            (columnId === 'visitsInRange' ||
                              columnId === 'passesInRange' ||
                              columnId === 'lastVisitInRange' ||
                              columnId === 'actions') &&
                              'text-right'
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
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i} className="h-16">
                      {visibleColumns.map((col) => (
                        <TableCell key={col.id} className="px-6">
                          <Skeleton className="h-4 w-full rounded-md opacity-20" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length}
                      className="h-[400px] text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-6 py-20 animate-in fade-in zoom-in duration-500">
                        <div className="h-20 w-20 rounded-3xl bg-[var(--ds-background-neutral-subtle)] dark:bg-[var(--ds-background-neutral-subtle)] flex items-center justify-center shadow-inner">
                          <Users className="h-10 w-10 text-[var(--ds-text-subtle)] opacity-20" />
                        </div>
                        <div className="space-y-2 max-w-sm">
                          <h3 className="text-xl font-bold text-[var(--ds-text)] dark:text-[var(--ds-text-inverse)]">
                            {t('residents.empty', 'No residents found')}
                          </h3>
                          <p className="text-sm text-[var(--ds-text-subtle)] dark:text-[var(--ds-text-subtle)] leading-relaxed">
                            {filters.search
                              ? t(
                                  'contacts.noMatch',
                                  'Try adjusting your search filters or check your spelling.'
                                )
                              : t(
                                  'contacts.emptyDesc',
                                  'Start building your community database by adding your first resident profile.'
                                )}
                          </p>
                        </div>
                        <Button
                          onClick={openCreate}
                          className="bg-[var(--ds-background-brand-bold)] hover:bg-[var(--ds-background-brand-bold-hovered)] text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-[var(--ds-background-brand-bold)]/20 transition-all active:scale-95"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t('contacts.create', 'Add Resident')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  contactsTable.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-[var(--ds-background-neutral-subtle)] dark:hover:bg-[var(--ds-background-neutral-subtle)]/10 transition-colors group h-16 border-b border-[var(--ds-border)] dark:border-[var(--ds-border)]"
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

          {/* Pagination Toolbar */}
          <div className="px-6 py-4 bg-[var(--ds-background-neutral-subtle)] dark:bg-[var(--ds-background-neutral-subtle)]/10 flex items-center justify-between border-t border-[var(--ds-border)] dark:border-[var(--ds-border)]">
            <div className="flex items-center gap-4 text-[var(--ds-text-subtle)] dark:text-[var(--ds-text-subtle)] text-[11px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--ds-background-default)] dark:bg-[var(--ds-background-default)] rounded-lg border border-[var(--ds-border)] dark:border-[var(--ds-border)] shadow-sm">
                <span className="text-[var(--ds-text-brand)]">{page}</span>
                <span className="opacity-30">/</span>
                <span>{totalPages}</span>
              </div>
              <span className="opacity-30">·</span>
              <span className="tabular-nums">
                {t('contacts.paginationSummary', {
                  from: (page - 1) * pageSize + 1,
                  to: Math.min(page * pageSize, total),
                  total,
                  defaultValue: `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total} Profiles`,
                })}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 border-[var(--ds-border)] dark:border-[var(--ds-border)] text-[var(--ds-text-subtle)] dark:text-[var(--ds-text-subtle)] bg-[var(--ds-background-default)] dark:bg-[var(--ds-background-default)] font-bold rounded-lg shadow-sm disabled:opacity-30 transition-all active:scale-95"
                disabled={page <= 1 || isLoading}
                onClick={() => updateFiltersAndUrl({ page: page - 1 })}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t('common.prev', 'Back')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 border-[var(--ds-border)] dark:border-[var(--ds-border)] text-[var(--ds-text-subtle)] dark:text-[var(--ds-text-subtle)] bg-[var(--ds-background-default)] dark:bg-[var(--ds-background-default)] font-bold rounded-lg shadow-sm disabled:opacity-30 transition-all active:scale-95"
                disabled={page >= totalPages || isLoading}
                onClick={() => updateFiltersAndUrl({ page: page + 1 })}
              >
                {t('common.next', 'Next')}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {dialogOpen && (
        <EditPanel
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={
            editing
              ? t('contacts.edit', 'Edit Resident Profile')
              : t('contacts.new', 'Add Resident Profile')
          }
          onSave={save}
          isSaving={isPending}
          saveLabel={
            editing
              ? t('common.save', 'Save Changes')
              : t('common.create', 'Create Resident')
          }
          headerExtra={
            editing && (
              <Badge
                variant="outline"
                className="mr-2 border-primary/20 bg-primary/5 text-primary lowercase font-medium"
              >
                ID: {editing.id.slice(0, 8)}
              </Badge>
            )
          }
        >
          <div className="space-y-10 py-2">
            {/* Identity Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <div className="h-4 w-1 bg-primary rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70">
                  {t('contacts.form.identity', 'Identity & Contact')}
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/5 shadow-md border border-border transition-all duration-300 group-hover:scale-105">
                      <AvatarImage
                        src={form.avatarUrl}
                        alt=""
                        className="object-cover"
                      />
                      <AvatarFallback className="text-2xl font-black bg-muted text-muted-foreground/40">
                        {form.firstName.slice(0, 1)}
                        {form.lastName.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2 w-full max-w-[140px]">
                    <Label
                      htmlFor="avatarUrl"
                      className="text-[10px] uppercase font-bold text-center block text-muted-foreground tracking-widest"
                    >
                      {t('contacts.form.photo', 'Photo URL')}
                    </Label>
                    <Input
                      id="avatarUrl"
                      value={form.avatarUrl}
                      onChange={(e) =>
                        setForm({ ...form, avatarUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="h-8 text-[10px] text-center rounded-lg border-primary/10 bg-muted/30 focus:bg-background transition-colors"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="firstName"
                        className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                      >
                        {t('contacts.form.firstName', 'First Name')} *
                      </Label>
                      <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        className="rounded-xl border-border bg-background focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="lastName"
                        className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                      >
                        {t('contacts.form.lastName', 'Last Name')} *
                      </Label>
                      <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        className="rounded-xl border-border bg-background focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                      >
                        {t('contacts.form.email', 'Email Address')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="rounded-xl border-border bg-background font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                      >
                        {t('contacts.form.phone', 'Phone Number')}
                      </Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="rounded-xl border-border bg-background font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-[200px]">
                    <Label
                      htmlFor="birthday"
                      className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                    >
                      {t('contacts.form.birthday', 'Birthdate')}
                    </Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={form.birthday}
                      onChange={(e) =>
                        setForm({ ...form, birthday: e.target.value })
                      }
                      className="rounded-xl border-border bg-background"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Work & Source Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <div className="h-4 w-1 bg-blue-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70">
                  {t('contacts.form.professional', 'Work & Source')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="jobTitle"
                    className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                  >
                    {t('contacts.form.jobTitle', 'Job Title')}
                  </Label>
                  <Input
                    id="jobTitle"
                    value={form.jobTitle}
                    onChange={(e) =>
                      setForm({ ...form, jobTitle: e.target.value })
                    }
                    className="rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company"
                    className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                  >
                    {t('contacts.form.company', 'Company')}
                  </Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className="rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="companyWebsite"
                    className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                  >
                    {t('contacts.form.companyWebsite', 'Company Website')}
                  </Label>
                  <Input
                    id="companyWebsite"
                    value={form.companyWebsite}
                    onChange={(e) =>
                      setForm({ ...form, companyWebsite: e.target.value })
                    }
                    placeholder="https://..."
                    className="rounded-xl font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="source"
                    className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1"
                  >
                    {t('contacts.form.source', 'Resident Source')}
                  </Label>
                  <NativeSelect
                    id="source"
                    value={form.source}
                    onChange={(e) =>
                      setForm({ ...form, source: e.target.value })
                    }
                    className="rounded-xl h-10 font-medium"
                  >
                    <option value="">
                      {t('contacts.form.sourcePlaceholder', 'Select source')}
                    </option>
                    <option value="MANUAL">Manual Entry</option>
                    <option value="IMPORT">CSV Import</option>
                    <option value="QR_SCAN">QR Scan On-site</option>
                    <option value="REFERRAL">Member Referral</option>
                    <option value="CAMPAIGN">Marketing Campaign</option>
                    <option value="OTHER">Other</option>
                  </NativeSelect>
                </div>
              </div>
            </section>

            {/* Units & Tags Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <div className="h-4 w-1 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70">
                  {t('contacts.form.groups', 'Units & Assets')}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 ml-1">
                    {t('contacts.form.linkedUnits', 'Linked Property Units')}
                  </Label>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold uppercase tracking-tighter bg-muted/40"
                  >
                    {form.unitIds.length}{' '}
                    {t('contacts.form.selected', 'Selected')}
                  </Badge>
                </div>

                <div className="rounded-2xl border border-border bg-muted/10 p-5">
                  {units.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground italic">
                        {t(
                          'contacts.form.noUnits',
                          'No units available in this workspace.'
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
                      {units.map((u) => {
                        const isSelected = form.unitIds.includes(u.id);
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => handleUnitToggle(u.id)}
                            className={cn(
                              'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold border transition-all duration-200 text-left',
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]'
                                : 'bg-card text-foreground border-border hover:border-primary/30 hover:bg-muted/50'
                            )}
                          >
                            <Building
                              className={cn(
                                'h-3.5 w-3.5 shrink-0',
                                isSelected
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground/50'
                              )}
                            />
                            <span className="truncate flex-1">{u.name}</span>
                            {isSelected && (
                              <Check className="h-3 w-3 shrink-0 ml-auto" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-4 text-[10px] text-muted-foreground italic leading-relaxed">
                    {t(
                      'contacts.form.unitTip',
                      'Select one or more units to associate this resident with specific properties in your database.'
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Notes Section */}
            <section className="space-y-4 pb-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <div className="h-4 w-1 bg-amber-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70">
                  {t('contacts.form.extra', 'Notes & Narrative')}
                </h3>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes" className="sr-only">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={t(
                    'contacts.form.notesPlaceholder',
                    'Enter internal private notes or resident history here…'
                  )}
                  rows={4}
                  className="rounded-2xl border-border bg-background focus:ring-4 focus:ring-primary/10 transition-all text-sm leading-relaxed p-4"
                />
              </div>
            </section>
          </div>
        </EditPanel>
      )}

      {customizerOpen && (
        <TableCustomizerModal
          open={customizerOpen}
          onOpenChange={setCustomizerOpen}
          columns={contactColumns.map((c) => ({
            id: c.id,
            label: c.label as string,
            canHide: c.canHide !== false,
          }))}
          view={tableView}
          onSave={(v) => {
            setTableView(v);
            updatePreferences({
              tableViews: { ...preferences.tableViews, contacts: v },
            });
            setCustomizerOpen(false);
          }}
          presetNames={Object.keys(PRESET_VIEWS)}
          getPresetVisibility={(name) => PRESET_VIEWS[name] || {}}
        />
      )}

      {viewUnitsFor && (
        <ViewUnitsModal
          open={!!viewUnitsFor}
          onOpenChange={(open) => !open && setViewUnitsFor(null)}
          contactName={`${viewUnitsFor.firstName} ${viewUnitsFor.lastName}`}
          units={viewUnitsFor.units.map((u) => ({ id: u.id, name: u.name }))}
          locale={locale}
          contactId={viewUnitsFor.id}
        />
      )}

      {deleteTarget && (
        <Dialog>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {t('contacts.confirmDelete', {
                  name: `${deleteTarget.firstName} ${deleteTarget.lastName}`,
                  defaultValue: 'Delete Contact?',
                })}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t('contacts.confirmDeleteDescription', {
                name: `${deleteTarget.firstName} ${deleteTarget.lastName}`,
                defaultValue: `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`,
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

      {bulkDeleteConfirmOpen && (
        <Dialog
          open={bulkDeleteConfirmOpen}
          onOpenChange={setBulkDeleteConfirmOpen}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {t(
                  'residents.deleteSelectedConfirmTitle',
                  'Delete selected contacts?'
                )}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t('residents.deleteSelectedConfirm', {
                count: selectedContactIds.length,
                defaultValue: `Are you sure you want to delete ${selectedContactIds.length} contact(s)? This action cannot be undone.`,
              })}
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBulkDeleteConfirmOpen(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={doBulkDelete}
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

      {inviteTarget && (
        <Dialog
          open={!!inviteTarget}
          onOpenChange={(open) => !open && setInviteTarget(null)}
        >
          <DialogContent className="max-w-md bg-[var(--ds-surface-overlay)] border-[var(--ds-border)] rounded-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Send className="h-5 w-5 text-[var(--ds-text-brand)]" />
                {t('crm.invitations.sendInvite', 'Send Invitation')}
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-[var(--ds-background-neutral-subtle)] rounded-xl border border-[var(--ds-border)]">
                <Avatar className="h-12 w-12 ring-2 ring-[var(--ds-surface-raised)]">
                  <AvatarImage src={inviteTarget.avatarUrl ?? undefined} />
                  <AvatarFallback className="font-bold">
                    {inviteTarget.firstName.charAt(0)}
                    {inviteTarget.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-[var(--ds-text)]">
                    {inviteTarget.firstName} {inviteTarget.lastName}
                  </h4>
                  <p className="text-xs text-[var(--ds-text-subtle)] font-mono">
                    {inviteTarget.phone || inviteTarget.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className={cn(
                    'h-24 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all group',
                    'hover:border-[var(--ds-border-brand)] hover:bg-[var(--ds-background-brand-subtle)]'
                  )}
                  onClick={async () => {
                    startTransition(async () => {
                      try {
                        const res = await fetch(
                          `/api/contacts/${inviteTarget.id}/invite`,
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              provider: 'WHATSAPP',
                              locale,
                            }),
                          }
                        );
                        const json = await res.json();
                        if (!res.ok)
                          throw new Error(json.error || 'Failed to send');

                        if (json.deepLink) {
                          window.open(json.deepLink, '_blank');
                        }

                        toast.success(
                          t('crm.invitations.success.sent', {
                            provider: 'WhatsApp',
                            defaultValue: 'Invite prepared for WhatsApp',
                          })
                        );
                        setInviteTarget(null);
                        refetch();
                      } catch (err) {
                        toast.error(
                          err instanceof Error
                            ? err.message
                            : 'Error sending invite'
                        );
                      }
                    });
                  }}
                >
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-bold">
                    {t('crm.invitations.whatsapp', 'WhatsApp')}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className={cn(
                    'h-24 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-all group',
                    'hover:border-[var(--ds-border-brand)] hover:bg-[var(--ds-background-brand-subtle)]'
                  )}
                  onClick={async () => {
                    startTransition(async () => {
                      try {
                        const res = await fetch(
                          `/api/contacts/${inviteTarget.id}/invite`,
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ provider: 'SMS', locale }),
                          }
                        );
                        const json = await res.json();
                        if (!res.ok)
                          throw new Error(json.error || 'Failed to send');

                        toast.success(
                          t('crm.invitations.success.sent', {
                            provider: 'SMS',
                            defaultValue: 'Invite sent via SMS',
                          })
                        );
                        setInviteTarget(null);
                        refetch();
                      } catch (err) {
                        toast.error(
                          err instanceof Error
                            ? err.message
                            : 'Error sending invite'
                        );
                      }
                    });
                  }}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-bold">
                    {t('crm.invitations.sms', 'SMS Text')}
                  </span>
                </Button>
              </div>

              <p className="text-[10px] text-[var(--ds-text-subtle)] text-center px-4 leading-relaxed italic opacity-70">
                {t('crm.invitations.template.invite', {
                  name: inviteTarget.firstName,
                  orgName: 'the gate',
                  link: 'QR_LINK',
                  defaultValue:
                    'The system will generate a secure QR access link and send it via the selected channel.',
                })}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
