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
  EmptyState,
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
import { SettingsSectionHeader } from '@/components/settings/settings-section-header';

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
    color: 'text-warning bg-warning/10',
  },
  UPDATE_MEMBER_ROLE: {
    label: 'Updated Role',
    icon: Shield,
    color: 'text-info bg-info/10',
  },
  REMOVE_MEMBER: {
    label: 'Removed Member',
    icon: Trash2,
    color: 'text-danger bg-danger/10',
  },
  REVOKE_SESSIONS: {
    label: 'Force Logout',
    icon: RefreshCw,
    color: 'text-[var(--gf-color-discovery)] bg-[var(--gf-color-discovery)]/10',
  },
  CREATE_ROLE: {
    label: 'Created Role',
    icon: Key,
    color: 'text-success bg-success/10',
  },
  UPDATE_ROLE: {
    label: 'Updated Role Def',
    icon: Key,
    color: 'text-info bg-info/10',
  },
  DELETE_ROLE: {
    label: 'Deleted Role',
    icon: Trash2,
    color: 'text-danger bg-danger/10',
  },
};

export function ActivityLogList({ logs }: ActivityLogListProps) {
  return (
    <div className="space-y-4">
      <SettingsSectionHeader
        title="Activity"
        description="Administrative actions for this organization."
      />
      {logs.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activity recorded"
          description="Administrative actions will appear here once they occur."
          className="min-h-[240px]"
        />
      ) : (
        <div className="overflow-hidden rounded-[8px] border border-[var(--ds-border)] bg-[var(--ds-surface)]">
          <Table>
            <TableHeader className="bg-[var(--ds-background-neutral-subtle)]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 text-xs font-semibold">
                  Admin
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold">
                  Action
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold">
                  Target
                </TableHead>
                <TableHead className="h-10 text-right text-xs font-semibold">
                  Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const action = ACTION_MAP[log.action] || {
                  label: log.action,
                  icon: FileText,
                  color: 'text-muted-foreground bg-muted',
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
                        {formatDistanceToNow(log.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
