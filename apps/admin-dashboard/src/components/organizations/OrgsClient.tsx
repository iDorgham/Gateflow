'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  cn,
  DynamicTable,
  Column,
} from '@gate-access/ui';
import {
  Building2,
  Search,
  Users,
  QrCode,
  ScanLine,
  Filter,
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
  email: string;
  plan: string;
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
            'flex h-10 w-10 items-center justify-center rounded-lg font-bold text-xs uppercase shadow-sm shrink-0',
            org.deletedAt ? 'bg-[var(--ds-background-neutral,#DFE1E6)] text-[var(--ds-text-subtle,#6B778C)]' : 'bg-[var(--ds-background-brand-bold,#0052CC)] text-white'
          )}>
            {org.name.substring(0, 2)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[var(--ds-text,#172B4D)] truncate">{org.name}</span>
            <span className="text-[11px] text-[var(--ds-text-subtle,#6B778C)] truncate">{org.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (org) => (
        <Badge variant={org.plan === 'PRO' ? 'primary' : 'subtle'} className="h-5 px-2">
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
            <Users className="h-3.5 w-3.5 text-[var(--ds-text-subtlest,#6B778C)] mb-1 group-hover/metric:text-[var(--ds-text-brand,#0052CC)] transition-colors" />
            <span className="text-[11px] font-bold text-[var(--ds-text,#172B4D)] tabular-nums">{org._count.users.toLocaleString(locale)}</span>
          </div>
          <div className="flex flex-col items-center group/metric" title="QR Codes">
            <QrCode className="h-3.5 w-3.5 text-[var(--ds-text-subtlest,#6B778C)] mb-1 group-hover/metric:text-[var(--ds-text-brand,#0052CC)] transition-colors" />
            <span className="text-[11px] font-bold text-[var(--ds-text,#172B4D)] tabular-nums">{org._count.qrCodes.toLocaleString(locale)}</span>
          </div>
          <div className="flex flex-col items-center group/metric" title="Scans (30d)">
            <ScanLine className="h-3.5 w-3.5 text-[var(--ds-text-subtlest,#6B778C)] mb-1 group-hover/metric:text-[var(--ds-text-brand,#0052CC)] transition-colors" />
            <span className="text-[11px] font-bold text-[var(--ds-text,#172B4D)] tabular-nums">{org.scansLast30d.toLocaleString(locale)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (org) => (
        <Badge variant={org.deletedAt ? 'warning' : 'success'} className="h-6">
          {org.deletedAt ? (
            <span className="flex items-center gap-1.5"><ShieldAlert className="h-3 w-3" /> Suspended</span>
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
      <div className="bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] rounded-xl p-4 shadow-sm">
        <form method="GET" className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtlest,#6B778C)]" />
            <Input
              name="q"
              defaultValue={search}
              placeholder="Search organizations…"
              className="pl-10 h-10 rounded-lg bg-[var(--ds-background-neutral-subtle,#F4F5F7)] border-none focus:bg-white transition-all shadow-inner"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              name="plan"
              defaultValue={planFilter}
              className="h-10 rounded-lg border border-[var(--ds-border,#DFE1E6)] bg-white px-4 text-xs font-bold text-[var(--ds-text,#172B4D)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)]"
            >
              <option value="">All Plans</option>
              {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              name="status"
              defaultValue={statusFilter}
              className="h-10 rounded-lg border border-[var(--ds-border,#DFE1E6)] bg-white px-4 text-xs font-bold text-[var(--ds-text,#172B4D)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)]"
            >
              <option value="all">Any Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" className="h-10 px-6 font-bold shadow-md">
              Filter
            </Button>
            <Button variant="subtle" className="h-10 w-10 p-0" asChild>
              <Link href="organizations">
                <X className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] rounded-xl shadow-sm overflow-hidden">
        <DynamicTable
          columns={columns}
          items={orgs}
          onRowClick={(org) => setSelectedOrgId(org.id)}
          emptyState={
            <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-[var(--ds-background-neutral-subtle,#F4F5F7)] flex items-center justify-center">
                <Building2 className="h-10 w-10 text-[var(--ds-text-subtlest,#6B778C)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--ds-text,#172B4D)]">No Organizations</h3>
                <p className="text-sm text-[var(--ds-text-subtle,#6B778C)]">Try changing your search or filters.</p>
              </div>
            </div>
          }
        />
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center px-2">
        <p className="text-[11px] font-bold text-[var(--ds-text-subtle,#6B778C)] uppercase tracking-widest tabular-nums">
          Displaying {orgs.length} <span className="mx-1 text-[var(--ds-text-subtlest,#A5ADBA)]">/</span> Total {total}
        </p>
        <div className="flex items-center gap-4 text-[10px] font-black text-[var(--ds-text-brand,#0052CC)] uppercase tracking-tighter cursor-help hover:opacity-80 transition-opacity">
           <ShieldCheck className="h-3 w-3" />
           System Verified Audit Logs
        </div>
      </div>

      <OrgDetailSheet orgId={selectedOrgId} onClose={() => setSelectedOrgId(null)} />
    </div>
  );
}
