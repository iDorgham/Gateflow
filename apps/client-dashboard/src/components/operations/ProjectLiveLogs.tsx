'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Skeleton,
} from '@gateflow/ui';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Shield, MapPin, Search } from 'lucide-react';

interface ScanLog {
  id: string;
  scannedAt: string;
  status: string;
  gate: {
    name: string;
  };
  qrCode: {
    guestName?: string;
    code: string;
  };
}

const SCAN_STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'bg-ds-background-success-subtle text-ds-text-success border-none',
  FAILED: 'bg-ds-background-danger-subtle text-ds-text-danger border-none',
  EXPIRED:
    'bg-ds-background-warning-subtle text-ds-text-warning border-none shadow-sm',
  MAX_USES_REACHED:
    'bg-ds-background-selected text-ds-text-selected border-none',
  INACTIVE: 'bg-ds-background-neutral-subtle text-ds-text-subtle border-none',
  DENIED:
    'bg-ds-background-danger-subtle text-ds-text-danger border-none shadow-md shadow-ds-background-danger-subtle/20',
};

interface ProjectLiveLogsProps {
  projectId: string;
  locale: string;
}

export function ProjectLiveLogs({ projectId, locale }: ProjectLiveLogsProps) {
  const { t } = useTranslation('dashboard');

  const { data, isLoading } = useQuery({
    queryKey: ['projects', projectId, 'logs'],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/logs?limit=25`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      return res.json();
    },
    refetchInterval: 3000, // Faster polling for high-density "live" feel
  });

  const logs = data?.data || [];

  if (isLoading && !data) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-20 rounded-xl border border-dashed',
          'bg-ds-background-neutral-subtle border-ds-border'
        )}
      >
        <div
          className={cn(
            'h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg mb-4 rotate-3',
            'bg-ds-surface border border-ds-border'
          )}
        >
          <Search className={cn('h-7 w-7 text-ds-text-subtlest opacity-40')} />
        </div>
        <p
          className={cn(
            'text-sm font-black uppercase tracking-widest text-ds-text-heading'
          )}
        >
          No Activity Detected
        </p>
        <p
          className={cn(
            'text-[11px] font-medium mt-1 text-ds-text-subtle opacity-70'
          )}
        >
          {t(
            'monitoring.hub.stats.no_activity',
            'Awaiting real-time scan events...'
          )}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-ds-border bg-ds-surface shadow-ds-shadow-raised relative'
      )}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-ds-background-brand-bold/20 z-10" />
      <Table>
        <TableHeader
          className={cn('bg-ds-surface/60 backdrop-blur-xl sticky top-0 z-20')}
        >
          <TableRow className="hover:bg-transparent border-b border-ds-border">
            <TableHead className="px-6 text-ds-text-subtlest font-black uppercase text-[10px] tracking-[0.2em] h-10">
              Timestamp
            </TableHead>
            <TableHead className="text-ds-text-subtlest font-black uppercase text-[10px] tracking-[0.2em] h-10">
              Access Point
            </TableHead>
            <TableHead className="text-ds-text-subtlest font-black uppercase text-[10px] tracking-[0.2em] h-10">
              Security Subject
            </TableHead>
            <TableHead className="px-6 text-ds-text-subtlest font-black uppercase text-[10px] tracking-[0.2em] text-right h-10">
              Authorization
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-transparent">
          {logs.map((log: ScanLog) => (
            <TableRow
              key={log.id}
              className={cn(
                'border-b border-ds-border/50 transition-all hover:bg-ds-background-neutral-subtle/50',
                log.status === 'DENIED' && 'bg-ds-background-danger-subtle/10'
              )}
            >
              <TableCell className="px-6 py-3">
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-xs font-black tabular-nums text-ds-text-heading'
                    )}
                  >
                    {new Date(log.scannedAt).toLocaleTimeString(locale, {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    })}
                  </span>
                  <span
                    className={cn(
                      'text-[9px] font-bold uppercase tracking-wider text-ds-text-subtlest'
                    )}
                  >
                    {new Date(log.scannedAt).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      'h-7 w-7 rounded-lg flex items-center justify-center shrink-0',
                      'bg-ds-background-selected/40 text-ds-text-selected'
                    )}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span className={cn('text-xs font-bold text-ds-text')}>
                    {log.gate.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <div className="flex flex-col gap-0">
                  <span
                    className={cn('text-xs font-bold text-ds-text-heading')}
                  >
                    {log.qrCode.guestName || 'Registered Resident'}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[9px] tracking-tighter text-ds-text-subtlest opacity-70'
                    )}
                  >
                    ID: {log.qrCode.code?.slice(0, 10).toUpperCase()}...
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-3 text-right">
                <Badge
                  className={cn(
                    'text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-md border-none',
                    SCAN_STATUS_STYLES[log.status] ??
                      'bg-ds-background-neutral-subtle text-ds-text-subtle'
                  )}
                >
                  {log.status === 'DENIED' && (
                    <Shield className="h-3 w-3 me-1.5 inline align-middle" />
                  )}
                  {log.status.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
