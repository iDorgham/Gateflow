'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  LoadingSpinner,
  EmptyState,
} from '@gateflow/ui';
import { toast } from 'sonner';
import { Trash2, User as UserIcon, Loader2, MapPin, Clock } from 'lucide-react';
import { csrfFetch } from '@/lib/csrf';

interface GateAssignment {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  gateId: string;
  gate: {
    id: string;
    name: string;
    location: string | null;
  };
  shiftStart: string | null;
  shiftEnd: string | null;
}

export function GateAssignmentsTable({ locale: _locale }: { locale: string }) {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery<GateAssignment[]>({
    queryKey: ['gate-assignments-list'],
    queryFn: async () => {
      const res = await fetch('/api/gates/assignments');
      const json = await res.json();
      return json.data || [];
    },
  });

  const unassignMutation = useMutation({
    mutationFn: async ({
      userId,
      gateId,
    }: {
      userId: string;
      gateId: string;
    }) => {
      const res = await csrfFetch('/api/gates/assignments', {
        method: 'DELETE',
        body: JSON.stringify({ userId, gateId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to unassign');
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gate-assignments-list'] });
      toast.success(
        t('gateAssignments.success.unassigned', 'Assignment removed.')
      );
    },
    onError: (err: Error) => {
      toast.error(
        err.message ||
          t('gateAssignments.errors.unassignFailed', 'Unassign failed.')
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  // Group by user for better visualization
  const grouped = assignments.reduce(
    (acc, curr) => {
      if (!acc[curr.userId]) {
        acc[curr.userId] = {
          user: curr.user,
          assignments: [],
        };
      }
      acc[curr.userId].assignments.push(curr);
      return acc;
    },
    {} as Record<
      string,
      { user: GateAssignment['user']; assignments: GateAssignment[] }
    >
  );

  const entries = Object.values(grouped);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {t('gateAssignments.tableTitle', 'Current assignments')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(
              'gateAssignments.tableDescription',
              'Users and the gates they can scan at.'
            )}
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-bold uppercase tracking-wider bg-muted border-border"
        >
          {entries.length} Assigned Members
        </Badge>
      </div>

      <div className="rounded-2xl border-[var(--ds-border)] bg-[var(--ds-surface)] overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[var(--ds-background-neutral-subtle)] border-b border-[var(--ds-border)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] text-xs font-bold uppercase text-muted-foreground">
                {t('gateAssignments.tableUser', 'User')}
              </TableHead>
              <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                {t('gateAssignments.tableGate', 'Gate')}
              </TableHead>
              <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                {t('gateAssignments.tableShift', 'Shift')}
              </TableHead>
              <TableHead className="text-right text-xs font-bold uppercase text-muted-foreground">
                {t('gateAssignments.tableActions', 'Actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <EmptyState
                    icon={UserIcon}
                    title={t(
                      'gateAssignments.noAssignmentsTitle',
                      'No assignments yet'
                    )}
                    description={t(
                      'gateAssignments.noAssignments',
                      'Use the form above to assign users.'
                    )}
                    className="min-h-[240px] border-0 rounded-none"
                  />
                </TableCell>
              </TableRow>
            ) : (
              entries.map(({ user, assignments: userAssignments }) => (
                <React.Fragment key={user.id}>
                  {userAssignments.map((assignment, index) => (
                    <TableRow
                      key={assignment.id}
                      className="group border-b border-[var(--ds-border)] hover:bg-[var(--ds-background-neutral-subtle)] transition-colors duration-200"
                    >
                      <TableCell className="align-top py-4">
                        {index === 0 && (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-info/30 shadow-sm">
                              <AvatarFallback className="bg-info-subtle text-info-bold text-sm font-bold">
                                {user.name
                                  .split(' ')
                                  .filter(Boolean)
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-foreground truncate">
                                {user.name}
                              </span>
                              <span className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-info-subtle text-info-bold border-info/30 font-bold text-[11px] px-2 py-0">
                              {assignment.gate.name}
                            </Badge>
                          </div>
                          {assignment.gate.location && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic font-medium ml-1">
                              <MapPin className="h-3 w-3" />
                              <span>{assignment.gate.location}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        {assignment.shiftStart && assignment.shiftEnd ? (
                          <div className="flex items-center gap-2 text-xs font-semibold text-foreground bg-muted/50 px-2 py-1 rounded-md w-fit">
                            <Clock className="h-3.5 w-3.5 text-info-bold" />
                            <span>
                              {assignment.shiftStart} — {assignment.shiftEnd}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right align-middle py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-danger-bold hover:bg-danger-subtle transition-all"
                          onClick={() => {
                            if (
                              window.confirm(
                                t(
                                  'gateAssignments.unassignConfirm',
                                  'Are you sure you want to remove this assignment?'
                                )
                              )
                            ) {
                              unassignMutation.mutate({
                                userId: user.id,
                                gateId: assignment.gateId,
                              });
                            }
                          }}
                          disabled={unassignMutation.isPending}
                        >
                          {unassignMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4.5 w-4.5" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
