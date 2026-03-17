'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  cn,
  DynamicTable,
  Column,
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
}

export function UsersClient({ users, search, roleFilter, statusFilter, total, roles }: UsersClientProps) {
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
              'flex h-9 w-9 items-center justify-center rounded-full font-bold text-[10px] uppercase shadow-sm shrink-0',
              user.deletedAt ? 'bg-[var(--ds-background-neutral,#DFE1E6)] text-[var(--ds-text-subtle,#6B778C)]' : 'bg-[var(--ds-background-brand-bold,#0052CC)] text-[var(--ds-text-inverse,#FFFFFF)]'
            )}>
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[var(--ds-text,#172B4D)] truncate">{user.name}</span>
              <span className="text-[11px] text-[var(--ds-text-subtle,#6B778C)] truncate">{user.email}</span>
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
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[var(--ds-text,#172B4D)] truncate max-w-[140px] uppercase tracking-tight">
              {user.organization.name}
            </span>
            <Badge variant={user.organization.plan === 'PRO' ? 'primary' : 'subtle'} className="w-fit text-[9px] h-4 px-1.5 border-[var(--ds-border-selected,#B3D4FF)]/30 font-bold">
              {user.organization.plan}
            </Badge>
          </div>
        ) : (
          <span className="text-[10px] font-black text-[var(--ds-text-subtlest,#A5ADBA)] uppercase tracking-widest italic">Platform</span>
        )
      ),
    },
    {
      key: 'role',
      label: 'Role',
      align: 'center',
      render: (user) => (
        user.role ? (
          <Badge variant="subtle" className="text-[10px] h-5">
            {user.role.name.replace('_', ' ')}
          </Badge>
        ) : null
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <Badge variant={user.deletedAt ? 'default' : 'success'} className="h-6">
          {user.deletedAt ? (
             <span className="flex items-center gap-1.5 text-[var(--ds-text-subtle,#6B778C)]"><ShieldAlert className="h-3 w-3" /> Suspended</span>
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
      render: (user) => (
        <Button
          variant="subtle"
          size="sm"
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
      <div className="bg-[var(--ds-background-default,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] rounded-xl p-4 shadow-sm">
        <form method="GET" className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-subtlest,#6B778C)]" />
            <input
              name="q"
              defaultValue={search}
              placeholder="Search by name or email…"
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--ds-background-neutral-subtle,#F4F5F7)] border-[var(--ds-border,#DFE1E6)] focus:border-[var(--ds-border-focused,#4C9AFF)] text-sm font-medium focus:bg-[var(--ds-background-default,#FFFFFF)] transition-all shadow-inner outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              name="role"
              defaultValue={roleFilter}
              className="h-10 rounded-lg border border-[var(--ds-border,#DFE1E6)] bg-white px-4 text-xs font-bold text-[var(--ds-text,#172B4D)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused,#4C9AFF)]"
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>{r.name.replace('_', ' ')}</option>
              ))}
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
              Apply
            </Button>
            <Button variant="subtle" className="h-10 w-10 p-0" asChild>
              <Link href="users">
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
      <div className="flex justify-between items-center px-2">
        <p className="text-[11px] font-bold text-[var(--ds-text-subtle,#6B778C)] uppercase tracking-widest tabular-nums">
          Displaying {users.length} <span className="mx-1 text-[var(--ds-text-subtlest,#A5ADBA)]">/</span> Total {total}
        </p>
        <p className="text-[10px] font-black text-[var(--ds-text-subtlest,#6B778C)] uppercase">
           Sorted by newest registration
        </p>
      </div>

      <UserDetailSheet userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </div>
  );
}
