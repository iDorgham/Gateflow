'use client';

import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  PlayCircle,
  Wrench,
  XCircle,
} from 'lucide-react';
import { MaintenanceStatus } from '@gate-access/types';
import { cn } from '@gateflow/ui';
import { useBreakpoint } from '@/hooks/use-breakpoint';

export interface MaintenanceRequestItem {
  id: string;
  title: string;
  status: MaintenanceStatus;
  createdAt: string;
  category: string;
}

const statusConfig: Record<
  MaintenanceStatus,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  [MaintenanceStatus.OPEN]: {
    label: 'Open',
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  [MaintenanceStatus.ASSIGNED]: {
    label: 'Assigned',
    icon: Clock,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  [MaintenanceStatus.IN_PROGRESS]: {
    label: 'In Progress',
    icon: PlayCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  [MaintenanceStatus.PENDING_PARTS]: {
    label: 'Pending Parts',
    icon: AlertCircle,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  [MaintenanceStatus.RESOLVED]: {
    label: 'Resolved',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  [MaintenanceStatus.CLOSED]: {
    label: 'Closed',
    icon: CheckCircle2,
    color: 'text-slate-500',
    bg: 'bg-slate-100',
  },
  [MaintenanceStatus.CANCELLED]: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
};

export function MaintenanceHub({
  requests,
}: {
  requests: MaintenanceRequestItem[];
}) {
  const { isLg } = useBreakpoint();
  const [selectedId, setSelectedId] = React.useState<string | null>(
    requests[0]?.id ?? null
  );

  if (!requests.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <Wrench className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          No active requests
        </h3>
      </div>
    );
  }

  if (!isLg) {
    return (
      <div className="space-y-3">
        {requests.map((request) => {
          const cfg = statusConfig[request.status];
          const StatusIcon = cfg.icon;
          return (
            <div
              key={request.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div
                className={cn(
                  'h-12 w-12 shrink-0 rounded-xl flex items-center justify-center',
                  cfg.bg
                )}
              >
                <StatusIcon className={cn('h-6 w-6', cfg.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900">
                  {request.title}
                </p>
                <p className="text-xs text-slate-500">{request.category}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const selected = requests.find((r) => r.id === selectedId) ?? requests[0];
  const selectedCfg = statusConfig[selected.status];
  const SelectedIcon = selectedCfg.icon;

  return (
    <div className="grid min-h-[520px] grid-cols-[380px_1fr] gap-4">
      <aside className="overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3">
        <div className="space-y-2">
          {requests.map((request) => {
            const cfg = statusConfig[request.status];
            const Icon = cfg.icon;
            const active = request.id === selected.id;
            return (
              <button
                key={request.id}
                type="button"
                onClick={() => setSelectedId(request.id)}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition',
                  active
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon className={cn('h-4 w-4', cfg.color)} />
                  <span
                    className={cn('text-[10px] font-bold uppercase', cfg.color)}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="truncate font-semibold text-slate-900">
                  {request.title}
                </p>
                <p className="text-xs text-slate-500">{request.category}</p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={cn(
              'h-12 w-12 rounded-xl flex items-center justify-center',
              selectedCfg.bg
            )}
          >
            <SelectedIcon className={cn('h-6 w-6', selectedCfg.color)} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {selected.title}
            </h3>
            <p className="text-sm text-slate-500">{selected.category}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            Status:{' '}
            <span className="font-semibold text-slate-900">
              {selectedCfg.label}
            </span>
          </p>
          <p>
            Created:{' '}
            <span className="font-semibold text-slate-900">
              {new Date(selected.createdAt).toLocaleString()}
            </span>
          </p>
          <p>
            Detail view is optimized for desktop split-layout and keeps list
            context visible.
          </p>
        </div>
      </section>
    </div>
  );
}
