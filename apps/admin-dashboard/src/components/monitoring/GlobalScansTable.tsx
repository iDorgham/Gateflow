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
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface ScanLog {
  id: string;
  scanUuid: string | null;
  status: string;
  scannedAt: Date;
  gate: { name: string } | null;
  qrCode: {
    type: string;
    code: string;
    organization: { id: string; name: string } | null;
  } | null;
  user: { name: string; email: string } | null;
}

interface GlobalScansTableProps {
  scans: ScanLog[];
  locale: string;
  t: (key: string, options?: any) => string;
}

function ScanStatusBadge({ status, t }: { status: string; t: any }) {
  const styles: Record<string, { variant: "success" | "danger" | "warning" | "default"; icon: any }> = {
    SUCCESS: { variant: 'success', icon: CheckCircle2 },
    DENIED: { variant: 'danger', icon: XCircle },
    FAILED: { variant: 'danger', icon: AlertCircle },
    EXPIRED: { variant: 'warning', icon: Clock },
    MAX_USES_REACHED: { variant: 'warning', icon: Clock },
    INACTIVE: { variant: 'default', icon: Clock },
  };

  const current = styles[status] || { variant: 'default', icon: Clock };
  const Icon = current.icon;

  return (
    <Badge variant={current.variant} className="h-6 flex items-center gap-1.5 px-2">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

export function GlobalScansTable({ scans, locale, t }: GlobalScansTableProps) {
  const columns = useMemo<Column<ScanLog>[]>(() => [
    {
      key: 'identity',
      label: 'Identity / Device',
      render: (scan) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-all group-hover:bg-[var(--ds-background-brand-bold,#0052CC)] group-hover:text-white',
            scan.user ? 'bg-[var(--ds-background-neutral-subtle,#F4F5F7)] text-[var(--ds-text,#172B4D)]' : 'bg-[var(--ds-background-neutral,#DFE1E6)] text-[var(--ds-text-subtle,#6B778C)]'
          )}>
            {scan.user ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[var(--ds-text,#172B4D)] truncate leading-tight">
              {scan.user?.name ?? 'Anonymous Scanner'}
            </span>
            <span className="text-[10px] font-mono text-[var(--ds-text-subtle,#6B778C)] uppercase mt-0.5">
              ID: {scan.scanUuid?.slice(0, 8) ?? scan.id.slice(0, 8)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'logistics',
      label: 'Platform Context',
      render: (scan) => (
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[var(--ds-text,#172B4D)] truncate max-w-[150px] uppercase tracking-tight">
            {scan.qrCode?.organization?.name ?? 'System Admin'}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-[var(--ds-text-subtle,#6B778C)] font-medium">
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-background-brand-bold,#0052CC)]/20" />
             {scan.gate?.name ?? 'Admin Portal'}
          </div>
        </div>
      ),
    },
    {
      key: 'credential',
      label: 'Credential',
      render: (scan) => (
        <div className="flex items-center gap-2">
          <Badge variant="subtle" className="text-[9px] h-5 tracking-tight px-1.5">
            {scan.qrCode?.type ?? 'DIRECT'}
          </Badge>
          <span className="text-[10px] font-mono text-[var(--ds-text-subtlest,#A5ADBA)]">
            {scan.qrCode?.code?.slice(0, 10)}…
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Result',
      render: (scan) => <ScanStatusBadge status={scan.status} t={t} />,
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      align: 'right',
      render: (scan) => {
        const date = new Date(scan.scannedAt);
        return (
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-[var(--ds-text,#172B4D)]">
              {date.toLocaleDateString(locale)}
            </span>
            <span className="text-[10px] font-medium text-[var(--ds-text-subtle,#6B778C)]">
              {date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
  ], [locale, t]);

  return (
    <DynamicTable
      columns={columns}
      items={scans}
      emptyState={
        <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
          <div className="h-20 w-20 rounded-full bg-[var(--ds-background-neutral-subtle,#F4F5F7)] flex items-center justify-center">
            <Smartphone className="h-10 w-10 text-[var(--ds-text-subtlest,#6B778C)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--ds-text,#172B4D)]">No Scan History</h3>
            <p className="text-sm text-[var(--ds-text-subtle,#6B778C)]">No scan attempts have been recorded for the selected criteria.</p>
          </div>
        </div>
      }
    />
  );
}
