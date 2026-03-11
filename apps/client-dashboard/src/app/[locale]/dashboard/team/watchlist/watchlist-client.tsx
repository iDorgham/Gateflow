'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import {
  Button,
  Input,
  Label,
  Badge,
  Textarea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@gate-access/ui';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Trash2,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Loader2,
  Phone,
  CreditCard,
  StickyNote,
} from 'lucide-react';
import { csrfFetch } from '@/lib/csrf';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Entry {
  id: string;
  name: string;
  idNumber: string | null;
  phone: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mb-4">
        <ShieldAlert className="h-8 w-8 text-destructive/60" aria-hidden="true" />
      </div>
      <p className="text-lg font-black uppercase tracking-tight text-foreground">
        {isFiltered ? 'No matches found' : 'Watchlist is empty'}
      </p>
      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
        {isFiltered
          ? 'Try adjusting your search terms.'
          : 'Add people to block them at the gate. Match by name, phone, or ID number.'}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WatchlistClient() {
  const { t } = useTranslation('dashboard');

  // Entries state
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Sheet state (add / edit)
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldPhone, setFieldPhone] = useState('');
  const [fieldIdNumber, setFieldIdNumber] = useState('');
  const [fieldNotes, setFieldNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  // Delete dialog state
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Load entries ────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch('/api/watchlist')
      .then((r) => r.json())
      .then((res: { success: boolean; data?: Entry[] }) => {
        if (res.success && res.data) setEntries(res.data);
      })
      .catch(() => toast.error(t('watchlist.loadError', 'Failed to load watchlist')))
      .finally(() => setLoading(false));
  }, [t]);

  // ── Filtered entries (client-side) ──────────────────────────────────────────

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.phone ?? '').toLowerCase().includes(q) ||
        (e.idNumber ?? '').toLowerCase().includes(q)
    );
  }, [entries, search]);

  // ── Sheet helpers ───────────────────────────────────────────────────────────

  function openAdd() {
    setEditingEntry(null);
    setFieldName('');
    setFieldPhone('');
    setFieldIdNumber('');
    setFieldNotes('');
    setSheetOpen(true);
  }

  function openEdit(entry: Entry) {
    setEditingEntry(entry);
    setFieldName(entry.name);
    setFieldPhone(entry.phone ?? '');
    setFieldIdNumber(entry.idNumber ?? '');
    setFieldNotes(entry.notes ?? '');
    setSheetOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fieldName.trim()) {
      toast.error(t('watchlist.nameRequired', 'Name is required'));
      return;
    }

    startTransition(async () => {
      const body = {
        name: fieldName.trim(),
        phone: fieldPhone.trim() || null,
        idNumber: fieldIdNumber.trim() || null,
        notes: fieldNotes.trim() || null,
      };

      let res: Response;
      if (editingEntry) {
        res = await csrfFetch(`/api/watchlist/${editingEntry.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        });
      } else {
        res = await csrfFetch('/api/watchlist', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }

      const data = (await res.json()) as { success: boolean; data?: Entry; message?: string };

      if (data.success) {
        if (editingEntry) {
          setEntries((prev) =>
            prev.map((en) =>
              en.id === editingEntry.id ? { ...en, ...body } : en
            )
          );
          toast.success(t('watchlist.updated', 'Entry updated'));
        } else {
          if (data.data) setEntries((prev) => [data.data!, ...prev]);
          toast.success(t('watchlist.added', 'Entry added'));
        }
        setSheetOpen(false);
      } else {
        toast.error(data.message ?? t('watchlist.saveError', 'Failed to save'));
      }
    });
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deletingEntry) return;
    setIsDeleting(true);
    try {
      const res = await csrfFetch(`/api/watchlist?id=${encodeURIComponent(deletingEntry.id)}`, {
        method: 'DELETE',
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) {
        setEntries((prev) => prev.filter((e) => e.id !== deletingEntry.id));
        toast.success(t('watchlist.removed', 'Entry removed'));
        setDeletingEntry(null);
        setConfirmText('');
      } else {
        toast.error(data.message ?? t('watchlist.removeError', 'Failed to remove'));
      }
    } finally {
      setIsDeleting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-foreground">
              {t('watchlist.title', 'Watchlist')}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('watchlist.description', 'People on this list will be flagged at scan.')}
            </p>
          </div>
          {!loading && (
            <Badge variant="outline" className="font-black text-sm px-2.5 py-1 border-destructive/30 bg-destructive/5 text-destructive shrink-0">
              {entries.length}
            </Badge>
          )}
        </div>
        <Button
          onClick={openAdd}
          className="w-full sm:w-auto gap-2 rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('watchlist.addEntry', 'Add Entry')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder={t('watchlist.search', 'Search by name, phone, ID…')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-xl"
          aria-label={t('watchlist.search', 'Search watchlist')}
        />
      </div>

      {/* Table / loading / empty */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState isFiltered={!!search.trim()} />
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">Name</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">Phone</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">ID Number</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">Notes</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-[0.2em]">Added</TableHead>
                <TableHead className="text-right font-bold text-[10px] uppercase tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
                <TableRow key={entry.id} className="group hover:bg-muted/30 transition-colors border-b border-border/20 last:border-0">
                  <TableCell>
                    <span className="font-bold text-foreground">{entry.name}</span>
                  </TableCell>
                  <TableCell>
                    {entry.phone ? (
                      <span className="flex items-center gap-1.5 text-sm text-foreground">
                        <Phone className="h-3 w-3 text-muted-foreground/60 shrink-0" aria-hidden="true" />
                        {entry.phone}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40 italic text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.idNumber ? (
                      <span className="flex items-center gap-1.5 text-sm text-foreground">
                        <CreditCard className="h-3 w-3 text-muted-foreground/60 shrink-0" aria-hidden="true" />
                        {entry.idNumber}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40 italic text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {entry.notes ? (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground line-clamp-1 max-w-[160px]">
                        <StickyNote className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {entry.notes}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40 italic text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(entry)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        aria-label={`Edit ${entry.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingEntry(entry);
                          setConfirmText('');
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                        aria-label={`Remove ${entry.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-8 bg-destructive/5 shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2">
              <ShieldAlert className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
            <SheetTitle className="text-xl font-black uppercase tracking-tight">
              {editingEntry ? t('watchlist.editEntry', 'Edit Entry') : t('watchlist.addEntry', 'Add Entry')}
            </SheetTitle>
            <SheetDescription>
              {t('watchlist.sheetDesc', 'Entries are matched against visitor identity at scan time.')}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-8 space-y-5 flex-1">
              <div className="space-y-2">
                <Label htmlFor="wl-name" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  {t('watchlist.name', 'Name')} *
                </Label>
                <Input
                  id="wl-name"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder={t('watchlist.namePlaceholder', 'Full name')}
                  className="h-11 rounded-xl font-bold"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wl-phone" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  {t('watchlist.phone', 'Phone')}
                </Label>
                <Input
                  id="wl-phone"
                  type="tel"
                  value={fieldPhone}
                  onChange={(e) => setFieldPhone(e.target.value)}
                  placeholder={t('watchlist.phonePlaceholder', '+971 50 000 0000')}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wl-id" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  {t('watchlist.idNumber', 'ID / Document Number')}
                </Label>
                <Input
                  id="wl-id"
                  value={fieldIdNumber}
                  onChange={(e) => setFieldIdNumber(e.target.value)}
                  placeholder={t('watchlist.idPlaceholder', 'Passport, Emirates ID…')}
                  className="h-11 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wl-notes" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  {t('watchlist.notes', 'Notes')}
                </Label>
                <Textarea
                  id="wl-notes"
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  placeholder={t('watchlist.notesPlaceholder', 'Reason for watchlist, incident reference…')}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </div>

            <SheetFooter className="p-8 pt-0 border-t border-border">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px]"
              >
                {isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />{t('common.saving', 'Saving…')}</>
                ) : editingEntry ? (
                  t('common.saveChanges', 'Save Changes')
                ) : (
                  t('watchlist.addEntry', 'Add Entry')
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Safe Delete Dialog */}
      <Dialog
        open={!!deletingEntry}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingEntry(null);
            setConfirmText('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl border-destructive/30 bg-background p-0 overflow-hidden">
          <div className="bg-destructive/10 p-6 border-b border-destructive/20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 mb-4 ring-8 ring-destructive/5">
              <Trash2 className="h-8 w-8 text-destructive" />
            </div>
            <DialogTitle className="text-lg font-black text-foreground mb-1">
              Remove from Watchlist
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              This cannot be undone. The entry will be soft-deleted and no longer matched at scan.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2 text-center">
              <Label className="text-sm font-bold text-foreground">
                Type{' '}
                <span className="font-mono bg-destructive/10 text-destructive px-1.5 py-0.5 rounded select-all">
                  {deletingEntry?.name} remove
                </span>{' '}
                to confirm.
              </Label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`${deletingEntry?.name} remove`}
                className="h-12 text-center font-bold rounded-xl border-destructive/30 focus-visible:ring-destructive"
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl font-bold"
                onClick={() => { setDeletingEntry(null); setConfirmText(''); }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-11 rounded-xl font-black"
                disabled={confirmText !== `${deletingEntry?.name} remove` || isDeleting}
                onClick={handleDelete}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Remove'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
