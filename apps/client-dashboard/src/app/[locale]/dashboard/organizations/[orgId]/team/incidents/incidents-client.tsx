'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@gate-access/ui';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Incident {
  id: string;
  gateId: string;
  gate: { id: string; name: string };
  user: { id: string; name: string; email: string } | null;
  reason: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export function IncidentsClient() {
  const { t } = useTranslation('dashboard');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isPending, setIsPending] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/incidents?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) setIncidents(res.data);
      })
      .catch(() => toast.error(t('incidents.loadError', 'Failed to load incidents')))
      .finally(() => setLoading(false));
  }, [statusFilter, t]);

  useEffect(() => {
    load();
  }, [load]);

  function updateStatus(id: string, status: string) {
    setIsPending(id);
    fetch('/api/incidents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
          toast.success(t('incidents.updated', 'Status updated'));
        } else toast.error(data.message || t('incidents.updateError', 'Update failed'));
      })
      .finally(() => setIsPending(null));
  }

  if (loading && incidents.length === 0) {
    return <p className="text-sm text-slate-500">{t('incidents.loading', 'Loading…')}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-600 dark:text-slate-400">{t('incidents.filterByStatus', 'Status')}:</span>
        {['', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED'].map((s) => (
          <Button
            key={s || 'all'}
            variant={statusFilter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s || t('incidents.all', 'All')}
          </Button>
        ))}
      </div>

      {incidents.length === 0 ? (
        <p className="text-sm text-slate-500">{t('incidents.empty', 'No incidents.')}</p>
      ) : (
        <ul className="divide-y divide-slate-200 dark:divide-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          {incidents.map((i) => (
            <li key={i.id} className="px-4 py-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="font-medium">{i.gate.name}</span>
                  <span className="ml-2 text-xs text-slate-500">{i.reason}</span>
                  {i.user && <p className="text-xs text-slate-400">{i.user.name}</p>}
                  <p className="text-xs text-slate-400">{new Date(i.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  {i.status === 'UNDER_REVIEW' && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(i.id, 'RESOLVED')} disabled={isPending === i.id}>
                        {t('incidents.resolve', 'Resolve')}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(i.id, 'ESCALATED')} disabled={isPending === i.id}>
                        {t('incidents.escalate', 'Escalate')}
                      </Button>
                    </>
                  )}
                  {i.status !== 'UNDER_REVIEW' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(i.id, 'UNDER_REVIEW')} disabled={isPending === i.id}>
                      {t('incidents.reopen', 'Reopen')}
                    </Button>
                  )}
                </div>
              </div>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700">{i.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
