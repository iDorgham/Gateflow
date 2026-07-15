'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@gateflow/ui';
import { formatDistanceToNow } from 'date-fns';
import {
  Shield,
  UserPlus,
  Trash2,
  Key,
  RefreshCw,
  History,
  FileText,
} from 'lucide-react';
import type { ActivityLog } from '@/app/[locale]/dashboard/organizations/[orgId]/settings/team/actions';

interface ActivityLogListProps {
  logs: ActivityLog[];
}

const ACTION_MAP: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  INVITE_MEMBER: {
    label: 'Invited Member',
    icon: UserPlus,
    color: 'text-primary bg-primary/10',
  },
  REVOKE_INVITATION: {
    label: 'Revoked Invite',
    icon: Trash2,
    color: 'text-orange-500 bg-orange-500/10',
  },
  UPDATE_MEMBER_ROLE: {
    label: 'Updated Role',
    icon: Shield,
    color: 'text-blue-500 bg-blue-500/10',
  },
  REMOVE_MEMBER: {
    label: 'Removed Member',
    icon: Trash2,
    color: 'text-red-500 bg-red-500/10',
  },
  REVOKE_SESSIONS: {
    label: 'Force Logout',
    icon: RefreshCw,
    color: 'text-purple-500 bg-purple-500/10',
  },
  CREATE_ROLE: {
    label: 'Created Role',
    icon: Key,
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  UPDATE_ROLE: {
    label: 'Updated Role Def',
    icon: Key,
    color: 'text-blue-500 bg-blue-500/10',
  },
  DELETE_ROLE: {
    label: 'Deleted Role',
    icon: Trash2,
    color: 'text-red-500 bg-red-500/10',
  },
};

export function ActivityLogList({ logs }: ActivityLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-2xl bg-muted/5">
        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-tight">
          No activity recorded
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          Administrative actions will appear here once they occur.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-border/50">
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">
              Admin
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">
              Action
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-10">
              Target
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest h-10 text-right">
              Time
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const action = ACTION_MAP[log.action] || {
              label: log.action,
              icon: FileText,
              color: 'text-gray-500 bg-gray-500/10',
            };
            const Icon = action.icon;

            return (
              <TableRow
                key={log.id}
                className="group border-border/50 hover:bg-muted/20 transition-colors"
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarImage src={log.user?.avatarUrl || ''} />
                      <AvatarFallback className="text-[10px] font-black bg-primary/5 text-primary">
                        {log.user?.name?.[0] || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate">
                        {log.user?.name || 'System / Anonymous'}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate uppercase font-black tracking-tight">
                        {log.user?.email || ''}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    variant="outline"
                    className={`gap-1.5 py-1 px-2 text-[9px] font-black uppercase tracking-widest border-none ${action.color}`}
                  >
                    <Icon className="h-3 w-3" />
                    {action.label}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-muted-foreground font-mono truncate max-w-[150px]">
                      {log.entityId || '-'}
                    </span>
                    {log.metadata && (
                      <span className="text-[9px] text-muted-foreground/70 font-medium">
                        {JSON.stringify(log.metadata).length > 2
                          ? JSON.stringify(log.metadata)
                          : ''}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-right">
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {formatDistanceToNow(log.createdAt, { addSuffix: true })}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
