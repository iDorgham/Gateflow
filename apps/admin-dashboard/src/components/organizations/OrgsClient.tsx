'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  Input,
  cn,
  DynamicTable,
  Column,
  NativeSelect,
} from '@gate-access/ui';
import {
  Building2,
  Search,
  Users,
  QrCode,
  ScanLine,
  X,
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal,
} from 'lucide-react';
import { OrgDetailSheet } from './OrgDetailSheet';
import { useMemo } from 'react';

interface Org {
  id: string;
  name: string;
  email: string | null;
  plan: string | null;
  deletedAt: string | null;
  createdAt: string;
  _count: { users: number; qrCodes: number; gates: number };
  scansLast30d: number;
}

interface OrgsClientProps {
  orgs: Org[];
  locale: string;
  search: string;
  planFilter: string;
  statusFilter: string;
  total: number;
}

const PLANS = ['FREE', 'PRO'] as const;

export function OrgsClient({ orgs, locale, search, planFilter, statusFilter, total }: OrgsClientProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const columns = useMemo<Column<Org>[]>(() => [
    {
      key: 'organization',
      label: 'Organization',
      render: (org) => (
        <div className="flex items-center gap-4">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg font-bold text-xs uppercase shadow-sm shrink-0 transition-colors',
            org.deletedAt ? 'bg-ds-background-neutral text-ds-text-subtle' : 'bg-ds-background-brand-bold text-ds-text-inverse'
          )}>
            {org.name.substring(0, 2)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-ds-text text-sm truncate leading-tight">{org.name}</span>
            <span className="text-xs text-ds-text-subtle truncate">{org.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (org) => (
        <Badge variant={org.plan === 'PRO' ? 'primary' : 'subtle'} className="h-5 px-2 font-bold uppercase text-[9px]">
          {org.plan}
        </Badge>
      ),
    },
    {
      key: 'metrics',
      label: 'Platform Usage',
      align: 'center',
      render: (org) => (
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center group/metric" title="Users">
            <Users className="h-3.5 w-3.5 text-ds-text-subtlest mb-1 group-hover/metric:text-ds-text-brand transition-colors" />
            <span className="text-[11px] font-bold text-ds-text tabular-nums">{org._count.users.toLocaleString(locale)}</span>
          </div>
          <div className="flex flex-col items-center group/metric" title="QR Codes">
            <QrCode className="h-3.5 w-3.5 text-ds-text-subtlest mb-1 group-hover/metric:text-ds-text-brand transition-colors" />
            <span className="text-[11px] font-bold text-ds-text tabular-nums">{org._count.qrCodes.toLocaleString(locale)}</span>
          </div>
          <div className="flex flex-col items-center group/metric" title="Scans (30d)">
            <ScanLine className="h-3.5 w-3.5 text-ds-text-subtlest mb-1 group-hover/metric:text-ds-text-brand transition-colors" />
            <span className="text-[11px] font-bold text-ds-text tabular-nums">{org.scansLast30d.toLocaleString(locale)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (org) => (
        <Badge variant={org.deletedAt ? 'default' : 'success'} className="h-6 px-2">
          {org.deletedAt ? (
            <span className="flex items-center gap-1.5 text-ds-text-subtle"><ShieldAlert className="h-3 w-3" /> Suspended</span>
          ) : (
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Active</span>
          )}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (org) => (
        <Button
          variant="subtle"
          size="sm"
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrgId(org.id);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ], [locale, setSelectedOrgId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filters */}
      <div className="bg-ds-background-default border border-ds-border rounded-xl p-5 shadow-sm">
        <form method="GET" className="flex flex-wrap items-center gap-5">
          <div className="relative flex-1 min-w-[300px] group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-brand transition-colors" />
            <Input
              name="q"
              defaultValue={search}
              placeholder="Search organizations…"
              className="pl-10 h-10 rounded-full bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all shadow-none"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <NativeSelect
              name="plan"
              defaultValue={planFilter}
              className="h-10 rounded-full border border-ds-border bg-ds-background-default px-4 text-xs font-bold text-ds-text focus:ring-2 focus:ring-ds-border-focused min-w-[120px]"
            >
              <option value="">All Plans</option>
              {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
            </NativeSelect>
            <NativeSelect
              name="status"
              defaultValue={statusFilter}
              className="h-10 rounded-full border border-ds-border bg-ds-background-default px-4 text-xs font-bold text-ds-text focus:ring-2 focus:ring-ds-border-focused min-w-[140px]"
            >
              <option value="all">Any Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </NativeSelect>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" className="h-10 px-6 font-bold rounded-full shadow-sm">
              Filter
            </Button>
            <Button variant="subtle" className="h-10 w-10 p-0 rounded-full" asChild>
              <Link href="organizations">
                <X className="h-4 w-4 text-ds-text-subtlest" />
              </Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-ds-background-default border border-ds-border rounded-xl shadow-sm overflow-hidden">
        <DynamicTable
          columns={columns}
          items={orgs}
          onRowClick={(org) => setSelectedOrgId(org.id)}
          emptyState={
            <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center">
                <Building2 className="h-10 w-10 text-ds-text-subtlest" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ds-text">No Organizations</h3>
                <p className="text-sm text-ds-text-subtle">Try changing your search or filters.</p>
              </div>
            </div>
          }
        />
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center px-1">
        <p className="text-[11px] font-bold text-ds-text-subtle uppercase tracking-widest tabular-nums">
          Displaying {orgs.length} <span className="mx-1 text-ds-text-subtlest">/</span> Total {total}
        </p>
        <div className="flex items-center gap-4 text-[10px] font-black text-ds-text-brand uppercase tracking-tighter cursor-help hover:opacity-80 transition-opacity">
           <ShieldCheck className="h-3.5 w-3.5" />
           System Verified Audit Logs
        </div>
      </div>

      <OrgDetailSheet orgId={selectedOrgId} onClose={() => setSelectedOrgId(null)} />
    </div>
  );
}
