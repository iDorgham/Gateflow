'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
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
import { Plus, Upload, Download, Search, Pencil, Trash2, Users, ChartLine } from 'lucide-react';
import { buildAnalyticsUrl } from '@/lib/analytics';

interface Unit {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  birthday: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  avatarUrl?: string | null;
  units: Unit[];
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
  const locale = (params?.locale as string) || 'en';
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation('dashboard');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q != null) setSearch(q);
  }, [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, uRes] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/units'),
      ]);
      const cJson = await cRes.json();
      const uJson = await uRes.json();
      if (cJson.success) setContacts(cJson.data);
      if (uJson.success) setUnits(uJson.data.map((u: { id: string; name: string }) => ({ id: u.id, name: u.name })));
    } catch {
      toast.error(t('contacts.errors.loadFailed', 'Failed to load contacts'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  }

  function openEdit(contact: Contact) {
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
          ? await fetch(`/api/contacts/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          : await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        toast.success(editing ? t('contacts.success.updated', 'Contact updated') : t('contacts.success.created', 'Contact created'));
        setDialogOpen(false);
        load();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : t('contacts.errors.saveFailed', 'Failed to save contact'));
      }
    });
  }

  function confirmDelete(contact: Contact) {
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
        load();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : t('contacts.errors.deleteFailed', 'Failed to delete contact'));
      }
    });
  }

  async function exportCSV() {
    try {
      const res = await fetch('/api/contacts?format=csv');
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
      const lines = text.split('\n').slice(1).filter(Boolean);
      let imported = 0;
      for (const line of lines) {
        const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        const [firstName, lastName, birthday, company, phone, email] = cols;
        if (!firstName || !lastName) continue;
        try {
          await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, birthday: birthday || null, company: company || null, phone: phone || null, email: email || null }),
          });
          imported++;
        } catch { /* skip */ }
      }
      toast.success(t('contacts.success.imported', { count: imported, defaultValue: `Imported ${imported} contacts` }));
      load();
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.company ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('contacts.title', 'Contacts')}</h1>
          <p className="text-sm text-muted-foreground">{t('contacts.description', 'Manage resident and visitor contacts for your organization.')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={buildAnalyticsUrl(locale, { search })}>
              <ChartLine className="h-4 w-4 mr-1" /> {t('analytics.openInAnalytics', 'Open in Analytics Dashboard')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1" /> {t('contacts.exportCsv', 'Export CSV')}
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span><Upload className="h-4 w-4 mr-1" /> {t('contacts.importCsv', 'Import CSV')}</span>
            </Button>
            <input type="file" accept=".csv" className="hidden" onChange={importCSV} />
          </label>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> {t('contacts.addContact', 'Add Contact')}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('contacts.searchPlaceholder', 'Search contacts…')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">{t('contacts.table.avatar', '')}</TableHead>
              <TableHead>{t('contacts.table.firstName', 'First Name')}</TableHead>
              <TableHead>{t('contacts.table.lastName', 'Last Name')}</TableHead>
              <TableHead>{t('contacts.table.birthday', 'Birthday')}</TableHead>
              <TableHead>{t('contacts.table.company', 'Company')}</TableHead>
              <TableHead>{t('contacts.table.phone', 'Phone')}</TableHead>
              <TableHead>{t('contacts.table.email', 'Email')}</TableHead>
              <TableHead>{t('contacts.table.units', 'Units')}</TableHead>
              <TableHead className="w-24">{t('contacts.table.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="h-8 w-8 opacity-30" />
                    <span className="text-sm">{search ? t('contacts.noMatch', 'No contacts match your search') : t('contacts.empty', 'No contacts yet. Add your first contact.')}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="w-14">
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
                  <TableCell className="font-medium">{c.firstName}</TableCell>
                  <TableCell>{c.lastName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.birthday ?? '—'}</TableCell>
                  <TableCell className="text-sm">{c.company ?? '—'}</TableCell>
                  <TableCell className="text-sm font-mono">{c.phone ?? '—'}</TableCell>
                  <TableCell className="text-sm">{c.email ?? '—'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.units.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        c.units.map((u) => (
                          <Badge key={u.id} variant="secondary" className="text-xs">{u.name}</Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => confirmDelete(c)}>
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
              <DialogTitle>{editing ? t('contacts.editContact', 'Edit Contact') : t('contacts.addContact', 'Add Contact')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">{t('contacts.form.firstName', 'First Name')} *</Label>
                  <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">{t('contacts.form.lastName', 'Last Name')} *</Label>
                  <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="birthday">{t('contacts.form.birthday', 'Birthday')}</Label>
                  <Input id="birthday" type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">{t('contacts.form.company', 'Company')}</Label>
                  <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">{t('contacts.form.phone', 'Phone')}</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">{t('contacts.form.email', 'Email')}</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
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
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel', 'Cancel')}</Button>
              <Button onClick={save} disabled={isPending}>
                {isPending ? t('modal.actions.saving', 'Saving…') : editing ? t('contacts.success.updated', 'Save changes') : t('common.create', 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <Dialog>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{t('contacts.confirmDelete', { name: `${deleteTarget.firstName} ${deleteTarget.lastName}`, defaultValue: 'Delete Contact?' })}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t('contacts.confirmDelete', { name: `${deleteTarget.firstName} ${deleteTarget.lastName}`, defaultValue: `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.` })}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>{t('common.cancel', 'Cancel')}</Button>
              <Button variant="destructive" onClick={doDelete} disabled={isPending}>
                {isPending ? t('modal.actions.deleting', 'Deleting…') : t('common.delete', 'Delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
