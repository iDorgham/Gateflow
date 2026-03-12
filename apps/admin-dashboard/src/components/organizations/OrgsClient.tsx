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
} from 'lucide-react';
import { OrgDetailSheet } from './OrgDetailSheet';

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

const planColors: Record<string, string> = {
  FREE: 'bg-muted text-muted-foreground border-border',
  PRO: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
};

export function OrgsClient({ orgs, locale, search, planFilter, statusFilter, total }: OrgsClientProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  return (
    <>
      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form method="GET" className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={search}
                placeholder="Search by name or email…"
                className="pl-9 h-10 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                name="plan"
                defaultValue={planFilter}
                className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">All plans</option>
                {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                name="status"
                defaultValue={statusFilter}
                className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="h-9 rounded-xl">
                Apply
              </Button>
              <Button variant="outline" size="sm" className="h-9 rounded-xl" asChild>
                <Link href="organizations">
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Clear
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Organizations">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
                  <th className="px-6 py-4 text-left">Organization</th>
                  <th className="px-6 py-4 text-left">Plan</th>
                  <th className="px-6 py-4 text-center">Metrics</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orgs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Building2 className="h-8 w-8 opacity-20" />
                        <p className="font-medium">No organizations found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orgs.map((org) => {
                    const suspended = org.deletedAt !== null;
                    return (
                      <tr
                        key={org.id}
                        className={cn(
                          'group transition-colors cursor-pointer',
                          suspended ? 'bg-muted/30 opacity-75' : 'hover:bg-primary/5'
                        )}
                        onClick={() => setSelectedOrgId(org.id)}
                      >
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg font-bold text-xs uppercase shadow-sm shrink-0',
                              suspended ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
                            )}>
                              {org.name.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground leading-none truncate">{org.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">{org.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={cn('text-[10px] font-bold uppercase tracking-wider', planColors[org.plan] ?? '')}>
                            {org.plan}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center" title="Users">
                              <Users className="h-3 w-3 text-muted-foreground mb-1" />
                              <span className="text-[11px] font-bold text-foreground">{org._count.users.toLocaleString(locale)}</span>
                            </div>
                            <div className="flex flex-col items-center" title="QR Codes">
                              <QrCode className="h-3 w-3 text-muted-foreground mb-1" />
                              <span className="text-[11px] font-bold text-foreground">{org._count.qrCodes.toLocaleString(locale)}</span>
                            </div>
                            <div className="flex flex-col items-center" title="Scans (30d)">
                              <ScanLine className="h-3 w-3 text-muted-foreground mb-1" />
                              <span className="text-[11px] font-bold text-foreground">{org.scansLast30d.toLocaleString(locale)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn(
                            'border-none rounded-sm px-2 py-0.5 text-[10px] font-bold tracking-tight uppercase',
                            suspended ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300' : 'bg-emerald-500 text-white'
                          )}>
                            {suspended ? (
                              <span className="flex items-center gap-1"><ShieldAlert className="h-2.5 w-2.5" /> Suspended</span>
                            ) : (
                              <span className="flex items-center gap-1"><ShieldCheck className="h-2.5 w-2.5" /> Active</span>
                            )}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setSelectedOrgId(org.id)}
                          >
                            View details →
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-[11px] font-medium text-muted-foreground px-1">
        <p>Showing {orgs.length} of {total} organizations</p>
        <p>Sorted by newest first</p>
      </div>

      {/* Detail sheet */}
      <OrgDetailSheet orgId={selectedOrgId} onClose={() => setSelectedOrgId(null)} />
    </>
  );
}
