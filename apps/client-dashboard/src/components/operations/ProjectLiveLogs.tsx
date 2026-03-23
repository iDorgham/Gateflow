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
  Skeleton
} from '@gate-access/ui';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Shield, Clock, MapPin, Search } from 'lucide-react';

const SCAN_STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'bg-[#E3FCEF] text-[#006644] dark:bg-[#E3FCEF]/10 dark:text-[#E3FCEF] border-none',
  FAILED: 'bg-[#FFEBE6] text-[#BF2600] dark:bg-[#FFEBE6]/10 dark:text-[#FF8F73] border-none',
  EXPIRED: 'bg-[#FFF0B3] text-[#172B4D] dark:bg-[#FFF0B3]/10 dark:text-[#FFF0B3] border-none',
  MAX_USES_REACHED: 'bg-[#DEEBFF] text-[#0747A6] dark:bg-[#DEEBFF]/10 dark:text-[#DEEBFF] border-none',
  INACTIVE: 'bg-[#F4F5F7] text-[#42526E] dark:bg-[#F4F5F7]/10 dark:text-[#A5ADBA] border-none',
  DENIED: 'bg-[#FFEBE6] text-[#BF2600] dark:bg-[#FFEBE6]/10 dark:text-[#FF8F73] border-none',
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
      <div className="flex flex-col items-center justify-center py-20 bg-[#F4F5F7] dark:bg-[#091E42]/10 rounded-3xl border-2 border-dashed border-[#DFE1E6] dark:border-[#343A46]">
        <div className="h-16 w-16 rounded-full bg-white dark:bg-background flex items-center justify-center shadow-sm mb-4">
          <Search className="h-8 w-8 text-[#6B778C] opacity-20" />
        </div>
        <p className="text-sm font-bold text-[#172B4D] dark:text-white">No scans recorded yet</p>
        <p className="text-xs text-[#6B778C] mt-1">Activity will appear here in real-time as guests arrive.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DFE1E6] dark:border-[#343A46]">
      <Table>
        <TableHeader className="bg-[#020035] dark:bg-[#020035]">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="px-8 text-white font-black uppercase text-[10px] tracking-widest h-12">Time</TableHead>
            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest h-12">Gate / Access Point</TableHead>
            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest h-12">Subject / Code</TableHead>
            <TableHead className="px-8 text-white font-black uppercase text-[10px] tracking-widest text-right h-12">Security Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-background">
          {logs.map((log: any) => (
            <TableRow 
              key={log.id} 
              className={cn(
                "border-b border-[#DFE1E6] dark:border-[#343A46] hover:bg-[#F4F5F7] dark:hover:bg-[#091E42]/20 transition-colors",
                log.status === 'DENIED' && "bg-[#FFEBE6]/30 dark:bg-[#BF2600]/5"
              )}
            >
              <TableCell className="px-8 py-5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#172B4D] dark:text-white tabular-nums">
                    {new Date(log.scannedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="text-[10px] text-[#6B778C] font-medium uppercase">
                    {new Date(log.scannedAt).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#DEEBFF] flex items-center justify-center text-[#0747A6]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-[#172B4D] dark:text-white">
                    {log.gate.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-[#172B4D] dark:text-white">
                    {log.qrCode.guestName || 'Registered Resident'}
                  </span>
                  <span className="font-mono text-[10px] text-[#6B778C] tracking-tighter">
                    ID: {log.qrCode.code?.slice(0, 12)}...
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-8 py-5 text-right">
                <Badge
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                    SCAN_STATUS_STYLES[log.status] ?? 'bg-[#F4F5F7] text-[#42526E]'
                  )}
                >
                  {log.status === 'DENIED' && <Shield className="h-3 w-3 mr-1 inline" />}
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
