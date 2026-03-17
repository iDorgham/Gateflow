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
  Pagination,
} from '@gate-access/ui';
import {
  Users,
  Search,
  X,
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal,
} from 'lucide-react';
import { UserDetailSheet } from './UserDetailSheet';
import { useMemo } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  deletedAt: string | null;
  createdAt: string;
  role: { id: string; name: string } | null;
  organization: { id: string; name: string; plan: string } | null;
}

interface UsersClientProps {
  users: User[];
  locale: string;
  search: string;
  roleFilter: string;
  statusFilter: string;
  total: number;
  roles: { id: string; name: string }[];
  page: number;
  totalPages: number;
}

export function UsersClient({ users, search, roleFilter, statusFilter, total, roles, page, totalPages }: UsersClientProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const columns = useMemo<Column<User>[]>(() => [
    {
      key: 'user',
      label: 'User',
      render: (user) => {
        const initials = user.name.split(' ').map((n) => n[0]).join('').substring(0, 2);
        return (
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-sm font-bold text-[10px] uppercase shadow-sm shrink-0 transition-all group-hover:bg-[var(--ds-background-brand-bold,#0052CC)] group-hover:text-white',
              user.deletedAt ? 'bg-[var(--ds-background-neutral,#DFE1E6)] text-[var(--ds-text-subtle,#6B778C)]' : 'bg-[var(--ds-background-neutral-subtle,#F4F5F7)] text-[var(--ds-text,#172B4D)]'
            )}>
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[var(--ds-text,#172B4D)] truncate text-xs leading-tight">{user.name}</span>
              <span className="text-[10px] text-[var(--ds-text-subtlest,#6B778C)] truncate">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'organization',
      label: 'Organization',
      render: (user) => (
        user.organization ? (
          <div className="flex flex-col gap-0.5">
            <Link 
              href={`/organizations/${user.organization.id}`}
              className="text-[11px] font-bold text-[var(--ds-text,#172B4D)] truncate max-w-[140px] uppercase tracking-tighter hover:text-[var(--ds-text-brand,#0052CC)] transition-colors"
            >
              {user.organization.name}
            </Link>
            <Badge variant={user.organization.plan === 'PRO' ? 'primary' : 'subtle'} className="w-fit text-[9px] h-4 px-1.5 rounded-sm">
              {user.organization.plan}
            </Badge>
          </div>
        ) : (
          <Badge variant="subtle" className="text-[9px] h-4 px-1.5 rounded-sm italic uppercase tracking-widest font-bold">Platform</Badge>
        )
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => (
        user.role ? (
          <Badge variant="subtle" className="text-[10px] h-5 rounded-sm font-bold uppercase tracking-tight">
            {user.role.name.replace('_', ' ')}
          </Badge>
        ) : null
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <Badge variant={user.deletedAt ? 'warning' : 'success'} className="h-6 rounded-sm px-2">
          {user.deletedAt ? (
             <span className="flex items-center gap-1.5 font-bold uppercase text-[9px]"><ShieldAlert className="h-3 w-3" /> Suspended</span>
          ) : (
             <span className="flex items-center gap-1.5 font-bold uppercase text-[9px]"><ShieldCheck className="h-3 w-3" /> Active</span>
          )}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (user) => (
        <Button
          variant="subtle"
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUserId(user.id);
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      ),
    },
  ], [setSelectedUserId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filters */}
      <div className="bg-[var(--ds-background-default,#FFFFFF)] dark:bg-[#1D2125] border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] rounded-sm p-4 shadow-sm">
        <form method="GET" className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--ds-text-subtlest,#6B778C)]" />
            <Input
              name="q"
              defaultValue={search}
              placeholder="Search by name or email…"
              className="pl-9 h-8 bg-[var(--ds-background-neutral-subtle,#F4F5F7)] dark:bg-[#2C333A] border-[#DFE1E6] dark:border-[#343A46] focus:bg-white dark:focus:bg-[#1D2125] transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              name="role"
              defaultValue={roleFilter}
              className="h-8 rounded-sm border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] bg-white dark:bg-[#1D2125] px-3 text-xs font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)]"
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>{r.name.replace('_', ' ')}</option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={statusFilter}
              className="h-8 rounded-sm border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] bg-white dark:bg-[#1D2125] px-3 text-xs font-semibold text-[var(--ds-text,#172B4D)] dark:text-[#E3E6E8] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)]"
            >
              <option value="all">Any Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" className="h-8 px-6 font-bold rounded-sm">
              Apply
            </Button>
            <Button variant="subtle" className="h-8 w-8 p-0" asChild>
              <Link href="users">
                <X className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-[var(--ds-background-default,#FFFFFF)] dark:bg-[#1D2125] border border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46] rounded-sm shadow-sm overflow-hidden">
        <DynamicTable
          columns={columns}
          items={users}
          onRowClick={(user) => setSelectedUserId(user.id)}
          emptyState={
            <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-[var(--ds-background-neutral-subtle,#F4F5F7)] flex items-center justify-center">
                <Users className="h-10 w-10 text-[var(--ds-text-subtlest,#6B778C)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--ds-text,#172B4D)]">No Users Found</h3>
                <p className="text-sm text-[var(--ds-text-subtle,#6B778C)]">Try adjusting your filters or search query.</p>
              </div>
            </div>
          }
        />
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 pt-2 border-t border-[var(--ds-border,#DFE1E6)] dark:border-[#343A46]">
        <p className="text-[11px] font-bold text-[var(--ds-text-subtle,#6B778C)] uppercase tracking-widest tabular-nums order-2 sm:order-1">
          Displaying {users.length} <span className="mx-1 text-[var(--ds-text-subtlest,#A5ADBA)]">/</span> Total {total}
        </p>

        {totalPages > 1 && (
          <div className="order-1 sm:order-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              getHref={(p) => {
                const params = new URLSearchParams(window.location.search);
                params.set('page', p.toString());
                return `?${params.toString()}`;
              }}
            />
          </div>
        )}

        <p className="text-[10px] font-black text-[var(--ds-text-subtlest,#6B778C)] uppercase order-3">
           Sorted by newest registration
        </p>
      </div>

      <UserDetailSheet userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </div>
  );
}
