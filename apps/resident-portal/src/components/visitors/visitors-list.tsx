'use client';

import * as React from 'react';
import Link from 'next/link';
import { Filter, Plus, QrCode, Search, User } from 'lucide-react';
import { Button, Input } from '@gate-access/ui';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { NewVisitorSheet } from '@/components/visitors/new-visitor-sheet';

export interface VisitorListItem {
  id: string;
  visitorName: string | null;
  isOpenQR: boolean;
  qrCode: {
    isActive: boolean;
    expiresAt: string | null;
    currentUses: number;
  };
  accessRule: {
    type: 'ONETIME' | 'RECURRING' | 'PERMANENT' | 'DATERANGE';
  } | null;
}

interface VisitorsListProps {
  visitors: VisitorListItem[];
  unitId: string;
}

export function VisitorsList({ visitors, unitId }: VisitorsListProps) {
  const { isMd } = useBreakpoint();
  const [query, setQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'active' | 'expired'
  >('all');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const filtered = visitors.filter((v) => {
    const isActive =
      v.qrCode.isActive &&
      (!v.qrCode.expiresAt || new Date(v.qrCode.expiresAt) > new Date());
    const nameMatch = (v.visitorName || 'open access qr')
      .toLowerCase()
      .includes(query.toLowerCase());
    const statusMatch =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
          ? isActive
          : !isActive;
    return nameMatch && statusMatch;
  });

  if (!isMd) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search visitors..."
              className="pl-9"
            />
          </div>
          <button className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-50">
            <Filter className="h-4 w-4 text-slate-600" />
          </button>
        </div>

        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((v) => {
              return (
                <div
                  key={v.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-full ${v.isOpenQR ? 'bg-purple-100' : 'bg-blue-100'} flex items-center justify-center`}
                    >
                      {v.isOpenQR ? (
                        <QrCode className="h-6 w-6 text-purple-600" />
                      ) : (
                        <User className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {v.visitorName || 'Open Access QR'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {v.accessRule?.type ?? 'PERMANENT'} -{' '}
                        {v.qrCode.currentUses} uses
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/visitors/${v.id}`}
                    className="text-xs font-medium text-blue-600"
                  >
                    Details
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">
              No visitors found
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Filters</h3>
        <div className="space-y-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'expired' ? 'default' : 'outline'}
            className="w-full justify-start"
            onClick={() => setStatusFilter('expired')}
          >
            Expired
          </Button>
        </div>
      </aside>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search visitors..."
              className="pl-9"
            />
          </div>
          <Button className="gap-1" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="py-2">Visitor</th>
                <th className="py-2">Type</th>
                <th className="py-2">Uses</th>
                <th className="py-2">Status</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => {
                const isActive =
                  v.qrCode.isActive &&
                  (!v.qrCode.expiresAt ||
                    new Date(v.qrCode.expiresAt) > new Date());
                return (
                  <tr key={v.id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-slate-900">
                      {v.visitorName || 'Open Access QR'}
                    </td>
                    <td className="py-3 text-slate-600">
                      {v.accessRule?.type ?? 'PERMANENT'}
                    </td>
                    <td className="py-3 text-slate-600">
                      {v.qrCode.currentUses}
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {isActive ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/visitors/${v.id}`}
                        className="font-medium text-blue-600"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <NewVisitorSheet
        unitId={unitId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}
