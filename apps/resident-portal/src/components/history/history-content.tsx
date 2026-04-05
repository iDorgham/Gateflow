'use client';

import * as React from 'react';
import { CheckCircle2, Clock, History, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@gateflow/ui';
import { useBreakpoint } from '@/hooks/use-breakpoint';

export interface ResidentHistoryItem {
  id: string;
  status:
    | 'SUCCESS'
    | 'FAILED'
    | 'EXPIRED'
    | 'MAX_USES_REACHED'
    | 'INACTIVE'
    | 'DENIED';
  scannedAt: string;
  gateName: string;
  visitorName: string;
}

export function HistoryContent({ scans }: { scans: ResidentHistoryItem[] }) {
  const { isMd } = useBreakpoint();
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  const filtered = scans.filter((scan) => {
    const ts = new Date(scan.scannedAt).getTime();
    const min = from ? new Date(`${from}T00:00:00`).getTime() : -Infinity;
    const max = to ? new Date(`${to}T23:59:59`).getTime() : Infinity;
    return ts >= min && ts <= max;
  });

  if (!isMd) {
    return (
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((scan) => (
            <div
              key={scan.id}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div
                className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${scan.status === 'SUCCESS' ? 'bg-green-100' : 'bg-red-100'}`}
              >
                {scan.status === 'SUCCESS' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-semibold text-slate-900">
                    {scan.visitorName}
                  </p>
                  <span className="text-[10px] font-medium uppercase text-slate-400">
                    {format(new Date(scan.scannedAt), 'HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Entered through{' '}
                  <span className="font-medium text-slate-900">
                    {scan.gateName}
                  </span>
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  {format(new Date(scan.scannedAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <History className="h-8 w-8 text-slate-300" />
            </div>
            <p className="font-medium text-slate-500">No access logs yet</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="py-2">Visitor</th>
              <th className="py-2">Gate</th>
              <th className="py-2">Status</th>
              <th className="py-2">Scanned At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((scan) => (
              <tr key={scan.id} className="border-b last:border-0">
                <td className="py-3 font-medium text-slate-900">
                  {scan.visitorName}
                </td>
                <td className="py-3 text-slate-700">{scan.gateName}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${scan.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {scan.status}
                  </span>
                </td>
                <td className="py-3 text-slate-600">
                  {format(new Date(scan.scannedAt), 'MMM dd, yyyy HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
