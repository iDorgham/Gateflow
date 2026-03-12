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
  Users,
  Search,
  Filter,
  X,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { UserDetailSheet } from './UserDetailSheet';

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

const roleBadgeColors: Record<string, string> = {
  ADMIN: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200',
  TENANT_ADMIN: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200',
  TENANT_USER: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200',
  VISITOR: 'bg-muted text-muted-foreground border-border',
  RESIDENT: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200',
};

export function UsersClient({ users, locale, search, roleFilter, statusFilter, total, roles }: UsersClientProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
                name="role"
                defaultValue={roleFilter}
                className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">All roles</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>{r.name.replace('_', ' ')}</option>
                ))}
              </select>
              <select
                name="status"
                defaultValue={statusFilter}
                className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="h-9 rounded-xl">Apply</Button>
              <Button variant="outline" size="sm" className="h-9 rounded-xl" asChild>
                <Link href="users">
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
            <table className="w-full text-sm" role="table" aria-label="Users">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Organization</th>
                  <th className="px-6 py-4 text-center">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8 opacity-20" />
                        <p className="font-medium">No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const suspended = user.deletedAt !== null;
                    const roleName = user.role?.name ?? '';
                    const initials = user.name.split(' ').map((n) => n[0]).join('').substring(0, 2);
                    return (
                      <tr
                        key={user.id}
                        className={cn(
                          'group transition-colors cursor-pointer',
                          suspended ? 'bg-muted/30 opacity-75' : 'hover:bg-primary/5'
                        )}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-full font-bold text-[10px] uppercase shadow-sm shrink-0',
                              suspended ? 'bg-muted text-muted-foreground' : 'bg-foreground text-background'
                            )}>
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground leading-none truncate">{user.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.organization ? (
                            <div className="flex flex-col gap-0.5">
                              <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{user.organization.name}</p>
                              <Badge variant="secondary" className={cn(
                                'w-fit text-[9px] font-bold uppercase tracking-tight h-4 px-1.5',
                                user.organization.plan === 'PRO'
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                  : 'bg-muted text-muted-foreground'
                              )}>
                                {user.organization.plan}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-wider">Platform</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {roleName && (
                            <Badge variant="outline" className={cn('text-[10px] font-bold uppercase tracking-wider', roleBadgeColors[roleName] ?? '')}>
                              {roleName.replace('_', ' ')}
                            </Badge>
                          )}
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
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            View →
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
        <p>Showing {users.length} of {total} users</p>
        <p>Sorted by newest first</p>
      </div>

      <UserDetailSheet userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </>
  );
}
