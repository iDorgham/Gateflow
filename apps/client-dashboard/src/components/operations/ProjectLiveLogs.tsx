'use client';

import React, { useEffect, useState } from 'react';
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
} from '@gate-access/ui';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, MapPin, Search } from 'lucide-react';
import { token } from '@atlaskit/tokens';

const SCAN_STATUS_STYLES: Record<string, string> = {
  SUCCESS:
    'bg-[var(--ds-background-success-subtle,#E3FCEF)] text-[var(--ds-text-success,#006644)] border-none',
  FAILED:
    'bg-[var(--ds-background-danger-subtle,#FFEBE6)] text-[var(--ds-text-danger,#BF2600)] border-none',
  EXPIRED:
    'bg-[var(--ds-background-warning-subtle,#FFF0B3)] text-[var(--ds-text-warning,#172B4D)] border-none',
  MAX_USES_REACHED:
    'bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--ds-text-selected,#0747A6)] border-none',
  INACTIVE:
    'bg-[var(--ds-background-neutral-subtle,#F4F5F7)] text-[var(--ds-text-subtle,#42526E)] border-none',
  DENIED:
    'bg-[var(--ds-background-danger-subtle,#FFEBE6)] text-[var(--ds-text-danger,#BF2600)] border-none',
};

interface ProjectLiveLogsProps {
  projectId: string;
  locale: string;
}

export function ProjectLiveLogs({ projectId, locale }: ProjectLiveLogsProps) {
  const { t } = useTranslation('dashboard');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['projects', projectId, 'logs'],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/logs?limit=20`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      return res.json();
    },
    refetchInterval: 5000, // Poll every 5 seconds for "live" feel
  });

  const logs = data?.data || [];

  if (isLoading && !data) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed',
          'bg-[var(--ds-background-neutral-subtle,#F4F5F7)] border-[var(--ds-border,#DFE1E6)]'
        )}
      >
        <div
          className={cn(
            'h-16 w-16 rounded-full flex items-center justify-center shadow-sm mb-4',
            'bg-[var(--ds-surface,#FFFFFF)]'
          )}
        >
          <Search
            className={cn(
              'h-8 w-8 text-[var(--ds-text-subtle,#6B778C)] opacity-20'
            )}
          />
        </div>
        <p className={cn('text-sm font-bold', 'text-[var(--ds-text,#172B4D)]')}>
          No scans recorded yet
        </p>
        <p
          className={cn('text-xs mt-1', 'text-[var(--ds-text-subtle,#6B778C)]')}
        >
          Activity will appear here in real-time as guests arrive.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border',
        'border-[var(--ds-border,#DFE1E6)]'
      )}
    >
      <Table>
        <TableHeader
          className={cn('bg-[var(--ds-background-neutral-bold,#020035)]')}
        >
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="px-8 text-white font-black uppercase text-[10px] tracking-widest h-12">
              Time
            </TableHead>
            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest h-12">
              Gate / Access Point
            </TableHead>
            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest h-12">
              Subject / Code
            </TableHead>
            <TableHead className="px-8 text-white font-black uppercase text-[10px] tracking-widest text-right h-12">
              Security Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-background">
          {logs.map((log: any) => (
            <TableRow
              key={log.id}
              className={cn(
                'border-b transition-colors',
                'border-[var(--ds-border,#DFE1E6)]',
                'hover:bg-[var(--ds-background-neutral-subtle,#F4F5F7)]',
                log.status === 'DENIED' &&
                  'bg-[var(--ds-background-danger-subtle,#FFEBE6)]'
              )}
            >
              <TableCell className="px-8 py-5">
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-sm font-bold tabular-nums',
                      'text-[var(--ds-text,#172B4D)]'
                    )}
                  >
                    {new Date(log.scannedAt).toLocaleTimeString(locale, {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-medium uppercase',
                      'text-[var(--ds-text-subtle,#6B778C)]'
                    )}
                  >
                    {new Date(log.scannedAt).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-5">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center',
                      'bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--ds-text-selected,#0747A6)]'
                    )}
                  >
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-bold',
                      'text-[var(--ds-text,#172B4D)]'
                    )}
                  >
                    {log.gate.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-5">
                <div className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      'text-sm font-bold',
                      'text-[var(--ds-text,#172B4D)]'
                    )}
                  >
                    {log.qrCode.guestName || 'Registered Resident'}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[10px] tracking-tighter',
                      'text-[var(--ds-text-subtle,#6B778C)]'
                    )}
                  >
                    ID: {log.qrCode.code?.slice(0, 12)}...
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-8 py-5 text-right">
                <Badge
                  className={cn(
                    'text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full',
                    SCAN_STATUS_STYLES[log.status] ??
                      'bg-[var(--ds-background-neutral-subtle,#F4F5F7)] text-[var(--ds-text-subtle,#42526E)]'
                  )}
                >
                  {log.status === 'DENIED' && (
                    <Shield className="h-3 w-3 me-1 inline" />
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
