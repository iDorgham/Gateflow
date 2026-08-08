'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  MoreVertical,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  User as UserIcon,
  Loader2,
} from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gateflow/ui';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';

interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: {
    id: string;
    name: string;
  };
  createdAt: string;
  lastActiveAt: string | null;
}

interface Role {
  id: string;
  name: string;
}

export function TeamMembersTable({ locale: _locale }: { locale: string }) {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery<Member[]>({
    queryKey: ['team-members-list'],
    queryFn: async () => {
      const res = await fetch('/api/team/members');
      const json = await res.json();
      return json.data || [];
    },
  });

  // For simplicity in Phase 3, we'll fetch roles from the organization's existing roles
  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['org-roles'],
    queryFn: async () => {
      const res = await fetch('/api/team/roles');
      const json = await res.json();
      return json.data || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      memberId,
      roleId,
    }: {
      memberId: string;
      roleId: string;
    }) => {
      const res = await csrfFetch('/api/team/members', {
        method: 'PATCH',
        body: JSON.stringify({ id: memberId, roleId }),
      });
      if (!res.ok) {
        throw new Error('Failed to update role');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members-list'] });
      toast.success(t('team.members.roleUpdated', 'Role updated successfully'));
    },
    onError: () => {
      toast.error(t('team.members.roleUpdateFailed', 'Failed to update role'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await csrfFetch(`/api/team/members?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to remove member');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members-list'] });
      toast.success(t('team.members.removed', 'Member removed from team'));
    },
    onError: () => {
      toast.error(t('team.members.removeFailed', 'Failed to remove member'));
    },
  });

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return (
          <ShieldCheck className="h-4 w-4 text-[var(--ds-icon-accent-green)]" />
        );
      case 'moderator':
        return <Shield className="h-4 w-4 text-[var(--ds-icon-accent-blue)]" />;
      case 'operator':
        return (
          <ShieldAlert className="h-4 w-4 text-[var(--ds-icon-accent-orange)]" />
        );
      default:
        return <UserIcon className="h-4 w-4 text-[var(--ds-icon-subtle)]" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--ds-border)] bg-[var(--ds-surface)] overflow-hidden">
      <Table>
        <TableHeader className="bg-[var(--ds-background-neutral-subtle)]">
          <TableRow>
            <TableHead className="w-[300px]">
              {t('team.members.name', 'Member')}
            </TableHead>
            <TableHead>{t('team.members.role', 'Role')}</TableHead>
            <TableHead>{t('team.members.joined', 'Joined')}</TableHead>
            <TableHead className="text-right">
              {t('common.actions', 'Actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow
              key={member.id}
              className="hover:bg-[var(--ds-background-neutral-subtle)] transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-9 w-9 border border-[var(--ds-border)]">
                      {member.avatarUrl && (
                        <AvatarImage src={member.avatarUrl} />
                      )}
                      <AvatarFallback className="bg-[var(--ds-background-neutral-subtle)] text-xs font-bold">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {member.lastActiveAt &&
                      new Date().getTime() -
                        new Date(member.lastActiveAt).getTime() <
                        5 * 60 * 1000 && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--ds-surface)] bg-[var(--ds-background-success-bold)]" />
                      )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--ds-text)]">
                      {member.name}
                    </span>
                    <span className="text-xs text-[var(--ds-text-subtle)]">
                      {member.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getRoleIcon(member.role.name)}
                  <Select
                    value={member.role.id}
                    onValueChange={(val) =>
                      updateRoleMutation.mutate({
                        memberId: member.id,
                        roleId: val,
                      })
                    }
                  >
                    <SelectTrigger className="h-8 w-[140px] border-none bg-transparent hover:bg-[var(--ds-background-neutral-subtle)] text-xs font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem
                          key={role.id}
                          value={role.id}
                          className="text-xs"
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="text-xs text-[var(--ds-text-subtle)]">
                {format(new Date(member.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-[var(--ds-text-danger)] focus:text-[var(--ds-text-danger)]"
                      onClick={() => {
                        if (
                          confirm(
                            t(
                              'team.members.confirmDelete',
                              'Are you sure you want to remove this member?'
                            )
                          )
                        ) {
                          deleteMutation.mutate(member.id);
                        }
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('team.members.remove', 'Remove from team')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
