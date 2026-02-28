'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
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
import {
  Plus,
  Upload,
  Download,
  Search,
  Pencil,
  Trash2,
  Building,
  UserPlus,
} from 'lucide-react';

type UnitType =
  | 'STUDIO'
  | 'ONE_BR'
  | 'TWO_BR'
  | 'THREE_BR'
  | 'FOUR_BR'
  | 'VILLA'
  | 'PENTHOUSE'
  | 'COMMERCIAL';

const getUnitTypeLabels = (t: any): Record<UnitType, string> => ({
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

interface LinkedUser {
  id: string;
  name: string;
  email: string;
}

interface Unit {
  id: string;
  name: string;
  type: UnitType;
  qrQuota: number;
  projectId: string | null;
  projectName: string | null;
  contacts: Contact[];
  userId?: string | null;
  user?: LinkedUser | null;
}

const emptyForm = () => ({
  name: '',
  type: 'STUDIO' as UnitType,
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
  const [units, setUnits] = useState<Unit[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [residents, setResidents] = useState<ResidentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Unit | null>(null);
  const [linkTarget, setLinkTarget] = useState<Unit | null>(null);
  const [linkUserId, setLinkUserId] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('dashboard');

  const UNIT_TYPE_LABELS = getUnitTypeLabels(t);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, cRes, pRes, residentsRes] = await Promise.all([
        fetch('/api/units'),
        fetch('/api/contacts'),
        fetch('/api/projects'),
        fetch('/api/users?role=RESIDENT'),
      ]);
      const uJson = await uRes.json();
      const cJson = await cRes.json();
      const pJson = await pRes.json();
      const rJson = await residentsRes.json();
      if (uJson.success) setUnits(uJson.data);
      if (cJson.success)
        setContacts(
          cJson.data.map((c: Contact) => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
          }))
        );
      if (pJson.projects) setProjects(pJson.projects);
      if (rJson.success) setResidents(rJson.data);
    } catch {
      toast.error(t('units.errors.loadFailed', 'Failed to load units'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  }

  function openEdit(unit: Unit) {
    setEditing(unit);
    setForm({
      name: unit.name,
      type: unit.type,
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
        toast.success(editing ? t('units.success.updated', 'Unit updated') : t('units.success.created', 'Unit created'));
        setDialogOpen(false);
        load();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : t('units.errors.saveFailed', 'Failed to save unit'));
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
        load();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : t('units.errors.saveFailed', 'Failed to save'));
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
        load();
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : t('units.errors.deleteFailed', 'Failed to delete unit')
        );
      }
    });
  }

  async function exportCSV() {
    try {
      const res = await fetch('/api/units?format=csv');
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
          await fetch('/api/units', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              type: unitType,
              qrQuota: parseInt(qrQuota) || UNIT_QUOTA_DEFAULTS[unitType],
            }),
          });
          imported++;
        } catch {
          /* skip */
        }
      }
      toast.success(t('units.success.imported', { count: imported, defaultValue: `Imported ${imported} units` }));
      load();
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const filtered = units.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      UNIT_TYPE_LABELS[u.type].toLowerCase().includes(q) ||
      (u.projectName ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('units.title', 'Units')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('units.description', 'Manage residential and commercial units with QR quotas.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" /> {t('units.exportCsv', 'Export CSV')}
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-1" /> {t('units.importCsv', 'Import CSV')}
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

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('units.searchPlaceholder', 'Search units…')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('units.table.name', 'Unit Name')}</TableHead>
              <TableHead>{t('units.table.type', 'Type')}</TableHead>
              <TableHead>{t('units.table.residents', 'Residents')}</TableHead>
              <TableHead>{t('units.table.linkedResident', 'Linked Resident')}</TableHead>
              <TableHead>{t('units.table.qrQuota', 'QR Quota')}</TableHead>
              <TableHead>{t('units.table.project', 'Project')}</TableHead>
              <TableHead className="w-24">{t('units.table.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Building className="h-8 w-8 opacity-30" />
                    <span className="text-sm">
                      {search
                        ? t('units.noMatch', 'No units match your search')
                        : t('units.empty', 'No units yet. Add your first unit.')}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {UNIT_TYPE_LABELS[u.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {u.contacts.length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        u.contacts
                          .map((c) => `${c.firstName} ${c.lastName}`)
                          .join(', ')
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {u.user ? (
                        <span title={u.user.email}>{u.user.name}</span>
                      ) : (
                        <span className="text-muted-foreground">{t('units.noResidentLinked', '—')}</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {u.qrQuota}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {u.projectName ?? '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      {dialogOpen && (
        <Dialog>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? t('units.editUnit', 'Edit Unit') : t('units.addUnit', 'Unit')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="unitName">{t('units.form.name', 'Unit Name / Number')} *</Label>
                <Input
                  id="unitName"
                  placeholder={t('units.form.namePlaceholder', 'e.g. Villa 12, Apt 4B')}
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
                <Label htmlFor="qrQuota">{t('units.form.qrQuota', 'QR Quota')}</Label>
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
                  {t('units.form.quotaDefault', { type: UNIT_TYPE_LABELS[form.type], count: UNIT_QUOTA_DEFAULTS[form.type], defaultValue: `Default for ${UNIT_TYPE_LABELS[form.type]}: ${UNIT_QUOTA_DEFAULTS[form.type]}` })}
                </p>
              </div>
              {projects.length > 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="projectId">{t('units.form.project', 'Project')}</Label>
                  <Select
                    id="projectId"
                    value={form.projectId}
                    onChange={(e) =>
                      setForm({ ...form, projectId: e.target.value })
                    }
                  >
                    <option value="">{t('sidebar.allProjects', 'No Project')}</option>
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
                  <Label>{t('units.form.linkedResidents', 'Linked Residents')}</Label>
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
        <Dialog open={!!linkTarget} onOpenChange={(open) => !open && setLinkTarget(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{t('units.linkResident', 'Link Resident')} — {linkTarget.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="linkResident">{t('units.residentLinked', 'Linked Resident')}</Label>
                <Select
                  id="linkResident"
                  value={linkUserId}
                  onChange={(e) => setLinkUserId(e.target.value)}
                >
                  <option value="">{t('units.noResidentLinked', 'No resident linked')}</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.email})
                    </option>
                  ))}
                </Select>
                {residents.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t('units.noResidentsAvailable', 'No RESIDENT users in this organization. Invite one from Team settings.')}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLinkTarget(null)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={doLinkResident} disabled={isPending}>
                {isPending ? t('modal.actions.saving', 'Saving…') : t('common.save', 'Save')}
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
              <DialogTitle>{t('units.confirmDelete', { name: deleteTarget.name, defaultValue: 'Delete Unit?' })}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t('units.confirmDelete', { name: deleteTarget.name, defaultValue: `Are you sure you want to delete unit ${deleteTarget.name}? This action cannot be undone.` })}
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
                {isPending ? t('modal.actions.deleting', 'Deleting…') : t('common.delete', 'Delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
