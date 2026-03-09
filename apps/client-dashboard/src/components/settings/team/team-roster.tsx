'use client';

import { useState, useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Input,
  cn,
} from '@gate-access/ui';
import { 
  MoreHorizontal, 
  UserCog, 
  Trash2, 
  Search,
  LogOut,
  Mail
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { removeMember, updateMemberRole, revokeUserSessions } from '../../../app/[locale]/dashboard/settings/team/actions';
import { InviteMemberSheet } from './invite-member-sheet';

interface Role {
  id: string;
  name: string;
  isBuiltIn: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
  _count: {
    scanLogs: number;
  };
  createdAt: string | Date;
}

interface TeamRosterProps {
  users: User[];
  roles: Role[];
  currentUserId: string;
}

export function TeamRoster({ users, roles, currentUserId }: TeamRosterProps) {
  const { t } = useTranslation('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemove = async (userId: string) => {
    if (userId === currentUserId) return;
    if (!confirm(t('settings.team.removeConfirm', 'Are you sure you want to remove this member?'))) return;

    startTransition(async () => {
      const res = await removeMember(userId);
      if (res.success) {
        toast.success(t('settings.team.removed', 'Member removed successfully'));
      } else {
        toast.error(res.error || t('common.error', 'An error occurred'));
      }
    });
  };

  const handleRevokeSessions = async (userId: string) => {
    startTransition(async () => {
      const res = await revokeUserSessions(userId);
      if (res.success) {
        toast.success(t('settings.team.sessionsRevoked', 'All active sessions revoked'));
      } else {
        toast.error(res.error || t('common.error', 'An error occurred'));
      }
    });
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    startTransition(async () => {
      const res = await updateMemberRole(userId, roleId);
      if (res.success) {
        toast.success(t('settings.team.roleUpdated', 'Role updated successfully'));
      } else {
        toast.error(res.error || t('common.error', 'An error occurred'));
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('settings.team.search', 'Search members...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <InviteMemberSheet roles={roles}>
          <Button className="w-full sm:w-auto gap-2 rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px]">
            <Mail className="h-4 w-4" />
            {t('settings.team.invite', 'Invite Member')}
          </Button>
        </InviteMemberSheet>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t('settings.team.member', 'Member')}</TableHead>
              <TableHead>{t('settings.team.role', 'Role')}</TableHead>
              <TableHead className="text-center">{t('settings.team.activity', 'Activity')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">
                  {t('settings.team.empty', 'No team members found.')}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback className="font-bold bg-primary/10 text-primary text-xs">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                          {user.name}
                          {user.id === currentUserId && (
                            <Badge variant="secondary" className="text-[9px] font-black uppercase py-0 px-1 border-primary/20 bg-primary/5 text-primary">Me</Badge>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "font-black uppercase tracking-widest text-[10px] px-2 py-0.5",
                      user.role.isBuiltIn ? "bg-muted/50" : "bg-primary/5 border-primary/20 text-primary"
                    )}>
                      {user.role.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-xs font-bold text-muted-foreground">
                    {user._count.scanLogs} {t('settings.team.scans', 'scans')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-xl p-1 shadow-2xl border-primary/10">
                        <div className="px-2 py-2 mb-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{t('settings.team.changeRole', 'Change Role')}</p>
                        </div>
                        {roles.map((role) => (
                          <DropdownMenuItem
                            key={role.id}
                            disabled={user.id === currentUserId || isPending}
                            onClick={() => handleRoleChange(user.id, role.id)}
                            className={cn(
                              "rounded-lg text-xs font-bold px-3 py-2",
                              user.role.id === role.id && "bg-primary/10 text-primary"
                            )}
                          >
                            <UserCog className="h-3.5 w-3.5 mr-2 opacity-50" />
                            {role.name}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleRevokeSessions(user.id)}
                          disabled={isPending}
                          className="rounded-lg text-xs font-bold px-3 py-2 text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                        >
                          <LogOut className="h-3.5 w-3.5 mr-2" />
                          {t('settings.team.revokeSessions', 'Force Logout')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemove(user.id)}
                          disabled={user.id === currentUserId || isPending}
                          className="rounded-lg text-xs font-bold px-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/5"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          {t('settings.team.remove', 'Remove from Team')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
