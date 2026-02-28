'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Button,
  Input,
  Label,
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
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { Plus, Upload, Download, Pencil, Trash2, Users, BarChart3, ChevronLeft, ChevronRight, Columns } from 'lucide-react';
import { buildAnalyticsUrl } from '@/lib/analytics';
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
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [viewUnitsFor, setViewUnitsFor] = useState<ContactRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('dashboard');

  const { preferences, updatePreferences } = useUserPreferences();
  const savedTableView = (preferences.tableViews?.contacts ?? {}) as TableViewState;
  const defaultView = getDefaultTableView(CONTACTS_COLUMN_IDS, CONTACTS_PINNED);
  const [tableView, setTableView] = useState<TableViewState>(() => ({
    columnOrder: savedTableView.columnOrder?.length ? savedTableView.columnOrder : defaultView.columnOrder,
    columnVisibility: Object.keys(savedTableView.columnVisibility ?? {}).length
      ? { ...defaultView.columnVisibility, ...savedTableView.columnVisibility }
      : defaultView.columnVisibility,
  }));

  useEffect(() => {
    const order = savedTableView.columnOrder;
    const vis = savedTableView.columnVisibility;
    if (order?.length) {
      setTableView((prev) => ({
        columnOrder: order,
        columnVisibility: { ...defaultView.columnVisibility, ...vis },
      }));
    }
  }, [preferences.tableViews?.contacts]);

  const [tagOptions, setTagOptions] = useState<{ id: string; name: string; color: string | null }[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/tags')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.success && json.data) setTagOptions(json.data);
      });
    return () => { cancelled = true; };
  }, []);

  const contactColumns = [
    { id: 'avatar', label: t('contacts.table.avatar', ''), canHide: false },
    { id: 'firstName', label: t('contacts.table.firstName', 'First Name'), canHide: false },
    { id: 'lastName', label: t('contacts.table.lastName', 'Last Name'), canHide: false },
    { id: 'birthday', label: t('contacts.table.birthday', 'Birthday'), canHide: true },
    { id: 'company', label: t('contacts.table.company', 'Company'), canHide: true },
    { id: 'phone', label: t('contacts.table.phone', 'Phone'), canHide: true },
    { id: 'email', label: t('contacts.table.email', 'Email'), canHide: true },
    { id: 'tags', label: t('contacts.table.tags', 'Tags'), canHide: true },
    { id: 'units', label: t('contacts.table.units', 'Units'), canHide: true },
    { id: 'visitsInRange', label: t('contacts.table.visitsInRange', 'Visits'), canHide: true },
    { id: 'lastVisitInRange', label: t('contacts.table.lastVisitInRange', 'Last visit'), canHide: true },
    { id: 'actions', label: t('contacts.table.actions', 'Actions'), canHide: false },
  ];
  const visibleColumns = tableView.columnOrder
    .filter((id) => tableView.columnVisibility[id] !== false && contactColumns.some((c) => c.id === id))
    .map((id) => contactColumns.find((c) => c.id === id)!)
    .filter(Boolean);

  const { data, isLoading, refetch } = useContacts(filters);
  const contacts = data?.data ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const pageSize = data?.pageSize ?? 25;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const parsed = parseResidentsFiltersFromSearchParams(searchParams);
    setFilters((prev) => ({ ...prev, ...parsed }));
  }, [searchParams]);

  const updateFiltersAndUrl = useCallback(
    (updates: Partial<ResidentsFilters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...updates };
        const sp = residentsFiltersToSearchParams(next);
        const query = sp.toString();
        router.replace(`/${locale}/dashboard/residents/contacts${query ? `?${query}` : ''}`, { scroll: false });
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
          setUnits(json.data.map((u: { id: string; name: string }) => ({ id: u.id, name: u.name })));
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
      toast.error(t('contacts.errors.required', 'First name and last name are required'));
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
          editing ? t('contacts.success.updated', 'Contact updated') : t('contacts.success.created', 'Contact created')
        );
        setDialogOpen(false);
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : t('contacts.errors.saveFailed', 'Failed to save contact')
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
        const res = await fetch(`/api/contacts/${deleteTarget.id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(t('contacts.success.deleted', 'Contact deleted'));
        setDeleteTarget(null);
        refetch();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : t('contacts.errors.deleteFailed', 'Failed to delete contact')
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

  function importCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const lines = text
        .split('\n')
        .slice(1)
        .filter(Boolean);
      let imported = 0;
      for (const line of lines) {
        const cols = line
          .split(',')
          .map((c) => c.replace(/^"|"$/g, '').trim());
        const [firstName, lastName, birthday, company, phone, email] = cols;
        if (!firstName || !lastName) continue;
        try {
          await fetch('/api/contacts', {
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
          imported++;
        } catch {
          /* skip */
        }
      }
      toast.success(
        t('contacts.success.imported', { count: imported, defaultValue: `Imported ${imported} contacts` })
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
          <h1 className="text-2xl font-bold">{t('contacts.title', 'Contacts')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('contacts.description', 'Manage resident and visitor contacts for your organization.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={buildAnalyticsUrl(locale, { search: filters.search })}>
              <BarChart3 className="h-4 w-4 mr-1" /> {t('analytics.openInAnalytics', 'Open in Analytics Dashboard')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" /> {t('contacts.exportCsv', 'Export CSV')}
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-1" /> {t('contacts.importCsv', 'Import CSV')}
              </span>
            </Button>
            <input type="file" accept=".csv" className="hidden" onChange={importCSV} />
          </label>
          <Button variant="outline" size="sm" onClick={() => setCustomizerOpen(true)}>
            <Columns className="h-4 w-4 mr-1" /> {t('residents.customizeColumns', 'Customize columns')}
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> {t('contacts.addContact', 'Add Contact')}
          </Button>
        </div>
      </div>

      {filters.unitId && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {t('residents.viewingUnit', 'Viewing unit')}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateFiltersAndUrl({ unitId: '' })}
          >
            {t('residents.clearUnitFilter', 'Clear')}
          </Button>
        </div>
      )}

      <ResidentsFilterBar filters={filters} onFiltersChange={updateFiltersAndUrl} tags={tagOptions} />

      <TableCustomizerModal
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        columns={contactColumns}
        view={tableView}
        onSave={(view) => {
          setTableView(view);
          updatePreferences({ tableViews: { contacts: view } }).catch(() =>
            toast.error(t('residents.saveViewFailed', 'Failed to save column preferences'))
          );
        }}
        getPresetVisibility={(preset) => PRESET_VIEWS[preset] ?? {}}
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableHead
                  key={col.id}
                  className={
                    col.id === 'avatar' ? 'w-14' : col.id === 'actions' ? 'w-24' : col.id === 'visitsInRange' || col.id === 'lastVisitInRange' ? 'text-right' : ''
                  }
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
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
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="h-8 w-8 opacity-30" />
                    <span className="text-sm">
                      {filters.search
                        ? t('contacts.noMatch', 'No contacts match your search')
                        : t('contacts.empty', 'No contacts yet. Add your first contact.')}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((c) => (
                <TableRow key={c.id}>
                  {visibleColumns.map((col) => {
                    if (col.id === 'avatar')
                      return (
                        <TableCell key={col.id} className="w-14">
                          <Avatar className="h-9 w-9">
                            {c.avatarUrl ? (
                              <AvatarImage src={c.avatarUrl} alt={`${c.firstName} ${c.lastName}`} />
                            ) : null}
                            <AvatarFallback className="text-xs bg-muted">
                              {c.firstName.charAt(0)}
                              {c.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                      );
                    if (col.id === 'firstName') return <TableCell key={col.id} className="font-medium">{c.firstName}</TableCell>;
                    if (col.id === 'lastName') return <TableCell key={col.id}>{c.lastName}</TableCell>;
                    if (col.id === 'birthday') return <TableCell key={col.id} className="text-sm text-muted-foreground">{c.birthday ?? '—'}</TableCell>;
                    if (col.id === 'company') return <TableCell key={col.id} className="text-sm">{c.company ?? '—'}</TableCell>;
                    if (col.id === 'phone') return <TableCell key={col.id} className="text-sm font-mono">{c.phone ?? '—'}</TableCell>;
                    if (col.id === 'email') return <TableCell key={col.id} className="text-sm">{c.email ?? '—'}</TableCell>;
                    if (col.id === 'tags')
                      return (
                        <TableCell key={col.id}>
                          <div className="flex flex-wrap gap-1">
                            {(c.tags ?? []).length === 0 ? (
                              <span className="text-xs text-muted-foreground">—</span>
                            ) : (
                              (c.tags ?? []).map((tag) => (
                                <Badge key={tag.id} variant="secondary" className="text-xs" style={tag.color ? { backgroundColor: tag.color, color: '#fff', border: 'none' } : undefined}>
                                  {tag.name}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                      );
                    if (col.id === 'units')
                      return (
                        <TableCell key={col.id}>
                          <div className="flex flex-wrap gap-1 items-center">
                            {c.units.length === 0 ? (
                              <span className="text-xs text-muted-foreground">—</span>
                            ) : (
                              c.units.map((u) => (
                                <Badge
                                  key={u.id}
                                  variant="secondary"
                                  className="text-xs cursor-pointer hover:bg-secondary/80"
                                  onClick={() => setViewUnitsFor(c)}
                                >
                                  {u.name}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                      );
                    if (col.id === 'visitsInRange') return <TableCell key={col.id} className="text-right tabular-nums">{c.visitsInRange ?? 0}</TableCell>;
                    if (col.id === 'lastVisitInRange')
                      return (
                        <TableCell key={col.id} className="text-right text-sm text-muted-foreground">
                          {c.lastVisitInRange
                            ? new Date(c.lastVisitInRange).toLocaleDateString(undefined, { dateStyle: 'short' })
                            : '—'}
                        </TableCell>
                      );
                    if (col.id === 'actions')
                      return (
                        <TableCell key={col.id}>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => confirmDelete(c)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      );
                    return <TableCell key={col.id}>—</TableCell>;
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-2">
            <p className="text-sm text-muted-foreground">
              {t('contacts.paginationSummary', {
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

      {dialogOpen && (
        <Dialog>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? t('contacts.editContact', 'Edit Contact') : t('contacts.addContact', 'Add Contact')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">{t('contacts.form.firstName', 'First Name')} *</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">{t('contacts.form.lastName', 'Last Name')} *</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="birthday">{t('contacts.form.birthday', 'Birthday')}</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={form.birthday}
                    onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">{t('contacts.form.company', 'Company')}</Label>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">{t('contacts.form.phone', 'Phone')}</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">{t('contacts.form.email', 'Email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              {units.length > 0 && (
                <div className="space-y-1.5">
                  <Label>{t('contacts.form.linkedUnits', 'Linked Units')}</Label>
                  <div className="flex flex-wrap gap-2 rounded-lg border p-3 max-h-32 overflow-y-auto">
                    {units.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleUnitToggle(u.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                          form.unitIds.includes(u.id)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-transparent hover:border-primary/40'
                        }`}
                      >
                        {u.name}
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
                    ? t('contacts.success.updated', 'Save changes')
                    : t('common.create', 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <Button variant="destructive" onClick={doDelete} disabled={isPending}>
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
