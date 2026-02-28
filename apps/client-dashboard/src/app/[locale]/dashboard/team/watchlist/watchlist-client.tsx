'use client';

import { useState, useEffect, useTransition } from 'react';
import { Button, Input, Label } from '@gate-access/ui';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus } from 'lucide-react';

interface Entry {
  id: string;
  name: string;
  idNumber: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
}

export function WatchlistClient() {
  const { t } = useTranslation('dashboard');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch('/api/watchlist')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setEntries(res.data);
      })
      .catch(() => toast.error(t('watchlist.loadError', 'Failed to load watchlist')))
      .finally(() => setLoading(false));
  }, [t]);

  function addEntry() {
    if (!name.trim()) {
      toast.error(t('watchlist.nameRequired', 'Name is required'));
      return;
    }
    startTransition(async () => {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || undefined,
          idNumber: idNumber.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEntries((prev) => [data.data, ...prev]);
        setName('');
        setPhone('');
        setIdNumber('');
        setNotes('');
        toast.success(t('watchlist.added', 'Entry added'));
      } else {
        toast.error(data.message || t('watchlist.addError', 'Failed to add'));
      }
    });
  }

  function removeEntry(id: string) {
    startTransition(async () => {
      const res = await fetch(`/api/watchlist?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
        toast.success(t('watchlist.removed', 'Entry removed'));
      } else {
        toast.error(data.message || t('watchlist.removeError', 'Failed to remove'));
      }
    });
  }

  if (loading) {
    return <p className="text-sm text-slate-500">{t('watchlist.loading', 'Loading…')}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h2 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('watchlist.addEntry', 'Add entry')}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="wl-name">{t('watchlist.name', 'Name')} *</Label>
            <Input
              id="wl-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('watchlist.namePlaceholder', 'Full name')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wl-phone">{t('watchlist.phone', 'Phone')}</Label>
            <Input
              id="wl-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('watchlist.phonePlaceholder', 'Phone number')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wl-id">{t('watchlist.idNumber', 'ID number')}</Label>
            <Input
              id="wl-id"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder={t('watchlist.idPlaceholder', 'ID or document number')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="wl-notes">{t('watchlist.notes', 'Notes')}</Label>
            <Input
              id="wl-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('watchlist.notesPlaceholder', 'Optional notes')}
            />
          </div>
        </div>
        <Button className="mt-3" onClick={addEntry} disabled={isPending}>
          <Plus className="mr-2 h-4 w-4" />
          {t('watchlist.add', 'Add')}
        </Button>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {t('watchlist.entries', 'Entries')} ({entries.length})
        </h2>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-500">{t('watchlist.empty', 'No entries yet. Add someone to block them at scan.')}</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <span className="font-medium">{e.name}</span>
                  {(e.phone || e.idNumber) && (
                    <span className="ml-2 text-sm text-slate-500">
                      {[e.phone, e.idNumber].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  {e.notes && <p className="text-xs text-slate-400 mt-0.5">{e.notes}</p>}
                </div>
                <Button variant="outline" size="sm" onClick={() => removeEntry(e.id)} disabled={isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
