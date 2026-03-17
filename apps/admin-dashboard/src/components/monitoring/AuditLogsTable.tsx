'use client';

import { useMemo } from 'react';
import {
  cn,
  DynamicTable,
  Column,
  Badge,
} from '@gate-access/ui';
import {
  Smartphone,
  Monitor,
  History,
} from 'lucide-react';

interface AuditLog {
  id: string;
  scanUuid: string | null;
  status: string;
  scannedAt: Date;
  auditTrail: Record<string, unknown>[];
  gate: { name: string } | null;
  qrCode: {
    type: string;
    code: string;
    organization: { id: string; name: string } | null;
  } | null;
  user: { name: string; email: string } | null;
}

interface AuditLogsTableProps {
  logs: AuditLog[];
  locale: string;
}

export function AuditLogsTable({ logs, locale }: AuditLogsTableProps) {
  const columns = useMemo<Column<AuditLog>[]>(() => [
    {
      key: 'status',
      label: 'Outcome',
      render: (log) => {
        const variants: Record<string, "success" | "danger" | "warning" | "default"> = {
          SUCCESS: 'success',
          DENIED: 'danger',
          FAILED: 'danger',
          EXPIRED: 'warning',
          MAX_USES_REACHED: 'warning',
          INACTIVE: 'default',
        };
        return (
          <Badge variant={variants[log.status] || 'default'} className="h-6 px-2">
            {log.status}
          </Badge>
        );
      },
    },
    {
      key: 'identity',
      label: 'Scanner / Device',
      render: (log) => (
        <div className="flex items-center gap-3">
          <div className={cn(
             "h-8 w-8 rounded-lg flex items-center justify-center shadow-sm",
             log.user ? "bg-ds-background-brand-bold text-ds-text-inverse" : "bg-ds-background-neutral-subtle text-ds-text-subtle"
          )}>
            {log.user ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
          </div>
          <div className="flex flex-col min-w-0">
             <span className="font-bold text-ds-text truncate text-xs leading-none">
                {log.user?.name ?? 'Internal System'}
             </span>
             <span className="text-[9px] font-mono text-ds-text-subtle uppercase mt-1">
                UUID: {log.scanUuid?.slice(0, 8) ?? log.id.slice(0, 8)}
             </span>
          </div>
        </div>
      ),
    },
    {
      key: 'context',
      label: 'Context',
      render: (log) => (
        <div className="flex flex-col gap-0.5">
           <span className="text-[10px] font-black uppercase tracking-tight text-ds-text">
              {log.qrCode?.organization?.name ?? 'System Master'}
           </span>
           <span className="text-[10px] text-ds-text-subtlest font-medium">
              at {log.gate?.name ?? 'Cloud Portal'}
           </span>
        </div>
      ),
    },
    {
      key: 'credential',
      label: 'Credential',
      render: (log) => (
        <div className="flex flex-col gap-1">
           <Badge variant="subtle" className="text-[9px] h-4 w-fit px-1.5 font-black">
              {log.qrCode?.type ?? 'DIRECT'}
           </Badge>
           <span className="text-[9px] font-mono text-ds-text-subtlest">
              {log.qrCode?.code?.slice(0, 12)}…
           </span>
        </div>
      ),
    },
    {
       key: 'trail',
       label: 'Audit Trail',
       render: (log) => {
          const trail = Array.isArray(log.auditTrail) ? log.auditTrail : [];
          if (trail.length === 0) return <span className="text-[10px] text-ds-text-subtlest">—</span>;
          return (
             <div className="flex items-center gap-2">
                 <div className="flex -space-x-1.5 overflow-hidden">
                    {trail.slice(0, 3).map((_, i) => (
                       <div key={i} className="h-4 w-4 rounded-full border border-ds-background-default bg-ds-background-neutral flex items-center justify-center shadow-sm">
                          <History className="h-2 w-2 text-ds-icon-subtle" />
                       </div>
                    ))}
                 </div>
                 <span className="text-[10px] font-medium text-ds-text-subtle whitespace-nowrap">
                    {trail.length} events
                 </span>
              </div>
          );
       }
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      align: 'right',
      render: (log) => {
        const date = new Date(log.scannedAt);
        return (
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-ds-text">
              {date.toLocaleDateString(locale)}
            </span>
            <span className="text-[10px] font-medium text-ds-text-subtlest uppercase tabular-nums">
              {date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        );
      },
    },
  ], [locale]);

  return (
    <DynamicTable
      columns={columns}
      items={logs}
      emptyState={
        <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
          <div className="h-20 w-20 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center">
             <History className="h-10 w-10 text-ds-text-subtlest" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ds-text">Archive Empty</h3>
            <p className="text-sm text-ds-text-subtle">No historical audit logs match your current filter parameters.</p>
          </div>
        </div>
      }
    />
  );
}
