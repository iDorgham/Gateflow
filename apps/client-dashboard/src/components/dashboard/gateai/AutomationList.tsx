'use client';

import * as React from 'react';
import {
  Zap,
  Trash2,
  Loader2,
  AlertCircle,
  Clock,
  FileText,
  Download,
  Calendar,
} from 'lucide-react';
import { cn } from '@gateflow/ui';

type Automation = {
  id: string;
  name: string;
  description?: string;
  type: 'REPORT' | 'EXPORT';
  trigger: string;
  schedule: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
};

export function AutomationList() {
  const [automations, setAutomations] = React.useState<Automation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const fetchAutomations = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/gateai/automations');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load automations');
      setAutomations(data.automations || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this automation?')) return;

    try {
      const prev = [...automations];
      setAutomations(automations.filter((a) => a.id !== id));

      const res = await fetch(`/api/gateai/automations?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        setAutomations(prev);
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete automation');
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[var(--ga-text-muted)]">
        <Loader2 className="animate-spin mb-2" size={24} />
        <span className="text-xs font-mono uppercase tracking-widest">
          Initializing Assistant...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-[var(--ga-navy-border)] shrink-0">
        <Zap size={16} style={{ color: 'var(--ga-orange)' }} />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--ga-text-primary)' }}
        >
          Assistant Automations
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="m-4 p-3 rounded-md bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 shrink-0">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto ga-scroll p-4 space-y-4">
        {automations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-[var(--ga-navy-border)] rounded-xl opacity-60">
            <Clock size={32} className="mb-3 text-[var(--ga-text-muted)]" />
            <p className="text-xs font-medium text-[var(--ga-text-primary)] mb-1">
              No Active Tasks
            </p>
            <p className="text-[10px] text-[var(--ga-text-muted)] max-w-[180px]">
              Use the AI Canvas to schedule your first operational workflow or
              data export.
            </p>
          </div>
        ) : (
          automations.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-[var(--ga-navy-border)] bg-secondary/20 p-4 transition-all hover:border-[var(--ga-orange)]/30 hover:bg-secondary/40"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'p-1.5 rounded-md',
                      item.type === 'REPORT'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-purple-500/10 text-purple-400'
                    )}
                  >
                    {item.type === 'REPORT' ? (
                      <FileText size={14} />
                    ) : (
                      <Download size={14} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--ga-text-primary)] leading-none">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[var(--ga-text-muted)] mt-1">
                      {item.schedule}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-[var(--ga-text-muted)] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[var(--ga-text-muted)]">
                    <Calendar size={10} />
                    <span>
                      Next:{' '}
                      {item.nextRunAt
                        ? new Date(item.nextRunAt).toLocaleDateString()
                        : 'TBD'}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter text-[9px]',
                    item.status === 'ACTIVE'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  )}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-secondary/30 border-t border-[var(--ga-navy-border)] shrink-0">
        <div className="flex items-center gap-2 text-[10px] text-[var(--ga-text-muted)] italic">
          <Clock size={12} />
          <span>Automations run via Upstash Edge Scheduler</span>
        </div>
      </div>
    </div>
  );
}
