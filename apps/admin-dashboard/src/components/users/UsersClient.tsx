'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  cn,
  DynamicTable,
  Column,
  NativeSelect,
  Input,
} from '@gateflow/ui';
import { PageHeader } from '@gateflow/components';
import {
  Users,
  Search,
  X,
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { UserDetailSheet } from './UserDetailSheet';
import { AddUserSheet } from './AddUserSheet';

interface User {
  id: string;
  name: string;
  email: string | null;
  deletedAt: string | null;
  createdAt: string;
  role: { id: string; name: string } | null;
  organization: { id: string; name: string; plan: string | null } | null;
}

interface UsersClientProps {
  users: User[];
  locale: string;
  search: string;
  roleFilter: string;
  statusFilter: string;
  total: number;
  roles: { id: string; name: string }[];
  translations: {
    title: string;
    subtitle: string;
    addLabel: string;
    searchPlaceholder: string;
    allRoles: string;
    anyStatus: string;
    active: string;
    suspended: string;
    filter: string;
    emptyTitle: string;
    emptySubtitle: string;
    totalUnits: string;
    sortedBy: string;
    columns: {
      user: string;
      org: string;
      role: string;
      status: string;
    };
    addUser: any;
  };
}

export function UsersClient({
  users,
  locale,
  search,
  roleFilter,
  statusFilter,
  total,
  roles,
  translations,
}: UsersClientProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const columns = useMemo<Column<User>[]>(
    () => [
      {
        key: 'user',
        label: translations.columns.user,
        render: (user) => {
          const initials = user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2);
          return (
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full font-bold text-[10px] uppercase shadow-sm shrink-0 transition-colors',
                  user.deletedAt
                    ? 'bg-ds-background-neutral text-ds-text-subtle'
                    : 'bg-ds-background-brand-bold text-ds-text-inverse'
                )}
              >
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-ds-text truncate leading-tight group-hover:text-ds-text-brand transition-colors">
                  {user.name}
                </span>
                <span className="text-[11px] text-ds-text-subtle truncate">
                  {user.email}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: 'organization',
        label: translations.columns.org,
        render: (user) =>
          user.organization ? (
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-ds-text truncate max-w-[140px] uppercase tracking-tight leading-tight">
                {user.organization.name}
              </span>
              <Badge
                variant={
                  user.organization.plan === 'PRO' ? 'primary' : 'subtle'
                }
                className="w-fit text-[9px] h-4 px-1.5 border-ds-border-selected/20 font-bold uppercase"
              >
                {user.organization.plan}
              </Badge>
            </div>
          ) : (
            <span className="text-[10px] font-black text-ds-text-subtlest uppercase tracking-widest italic opacity-50">
              Platform
            </span>
          ),
      },
      {
        key: 'role',
        label: translations.columns.role,
        align: 'center',
        render: (user) =>
          user.role ? (
            <Badge
              variant="subtle"
              className="text-[10px] h-5 px-2 font-semibold bg-ds-background-neutral-subtle text-ds-text-subtle border-none"
            >
              {user.role.name.replace('_', ' ')}
            </Badge>
          ) : null,
      },
      {
        key: 'status',
        label: translations.columns.status,
        render: (user) => (
          <Badge
            variant={user.deletedAt ? 'default' : 'success'}
            className="h-6 px-2"
          >
            {user.deletedAt ? (
              <span className="flex items-center gap-1.5 text-ds-text-subtle">
                <ShieldAlert className="h-3 w-3" /> {translations.suspended}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" /> {translations.active}
              </span>
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
    ],
    [setSelectedUserId, translations]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        titleClassName="italic uppercase"
        title={translations.title}
        subtitle={translations.subtitle}
        badge={
          <Badge
            variant="primary"
            className="bg-ds-background-selected text-ds-text-selected border-ds-border-selected/30 font-bold text-xs px-2.5 py-1"
          >
            {total.toLocaleString(locale)}
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            className="h-10 px-6 font-bold rounded-full shadow-sm gap-2 uppercase tracking-tighter"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {translations.addLabel}
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-ds-background-default border border-ds-border rounded-xl p-5 shadow-sm">
        <form method="GET" className="flex flex-wrap items-center gap-5">
          <div className="relative flex-1 min-w-[300px] group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-brand transition-colors" />
            <Input
              name="q"
              defaultValue={search}
              placeholder={translations.searchPlaceholder}
              className="w-full h-10 pl-10 rounded-full bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all shadow-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <NativeSelect
              name="role"
              defaultValue={roleFilter}
              className="h-10 rounded-full border border-ds-border bg-ds-background-default px-4 text-xs font-bold text-ds-text focus:ring-2 focus:ring-ds-border-focused min-w-[130px]"
            >
              <option value="">{translations.allRoles}</option>
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name.replace('_', ' ')}
                </option>
              ))}
            </NativeSelect>
            <NativeSelect
              name="status"
              defaultValue={statusFilter}
              className="h-10 rounded-full border border-ds-border bg-ds-background-default px-4 text-xs font-bold text-ds-text focus:ring-2 focus:ring-ds-border-focused min-w-[140px]"
            >
              <option value="all">{translations.anyStatus}</option>
              <option value="active">{translations.active}</option>
              <option value="suspended">{translations.suspended}</option>
            </NativeSelect>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              className="h-10 px-6 font-bold rounded-full shadow-sm"
            >
              {translations.filter}
            </Button>
            <Button
              variant="subtle"
              className="h-10 w-10 p-0 rounded-full"
              asChild
            >
              <Link href="users">
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
          items={users}
          onRowClick={(user) => setSelectedUserId(user.id)}
          emptyState={
            <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-ds-background-neutral-subtle flex items-center justify-center">
                <Users className="h-10 w-10 text-ds-text-subtlest" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ds-text">
                  {translations.emptyTitle}
                </h3>
                <p className="text-sm text-ds-text-subtle">
                  {translations.emptySubtitle}
                </p>
              </div>
            </div>
          }
        />
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center px-1">
        <p className="text-[11px] font-bold text-ds-text-subtle uppercase tracking-widest tabular-nums">
          {translations.totalUnits}: {users.length}{' '}
          <span className="mx-1 text-ds-text-subtlest">/</span> Total {total}
        </p>
        <p className="text-[10px] font-black text-ds-text-subtlest uppercase tracking-tighter">
          {translations.sortedBy}
        </p>
      </div>

      <UserDetailSheet
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
      <AddUserSheet
        open={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        translations={translations.addUser}
      />
    </div>
  );
}
