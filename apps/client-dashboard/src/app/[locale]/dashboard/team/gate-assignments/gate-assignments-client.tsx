'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  MultiSelect,
} from '@gate-access/ui';
import { Loader2, UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { csrfFetch } from '@/lib/csrf';

interface Gate {
  id: string;
  name: string;
  location?: string | null;
}

interface OrgUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface AssignmentRow {
  id: string;
  userId: string;
  user: { id: string; name: string | null; email: string };
  gateId: string;
  gate: { id: string; name: string; location: string | null };
  createdAt: string;
}

export function GateAssignmentsClient() {
  const { t } = useTranslation('dashboard');
  const [gates, setGates] = useState<Gate[]>([]);
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedGateIds, setSelectedGateIds] = useState<string[]>([]);
  const [assignPending, setAssignPending] = useState(false);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const [gatesRes, usersRes, assignmentsRes] = await Promise.all([
        fetch('/api/gates'),
        fetch('/api/users'),
        fetch('/api/gates/assignments'),
      ]);

      const [gatesJson, usersJson, assignmentsJson] = await Promise.all([
        gatesRes.json(),
        usersRes.json(),
        assignmentsRes.json(),
      ]);

      if (gatesRes.ok && gatesJson.success && Array.isArray(gatesJson.data)) {
        setGates(gatesJson.data);
      } else {
        setGates([]);
      }
      if (usersRes.ok && usersJson.success && Array.isArray(usersJson.data)) {
        setUsers(usersJson.data);
      } else {
        setUsers([]);
      }
      if (assignmentsRes.ok && assignmentsJson.success && Array.isArray(assignmentsJson.data)) {
        setAssignments(assignmentsJson.data);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      setLoadError((err as Error).message);
      toast.error(t('gateAssignments.errors.load', 'Failed to load data.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async () => {
    if (!selectedUserId || selectedGateIds.length === 0) {
      toast.error(t('gateAssignments.validation.selectUserAndGates', 'Select a user and at least one gate.'));
      return;
    }
    setAssignPending(true);
    try {
      const res = await csrfFetch('/api/gates/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, gateIds: selectedGateIds }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(t('gateAssignments.success.assigned', 'Assignments added.'));
        setSelectedGateIds([]);
        await fetchData();
      } else {
        toast.error(data.message || t('gateAssignments.errors.assignFailed', 'Assign failed.'));
      }
    } catch {
      toast.error(t('common.errors.network', 'Network error.'));
    } finally {
      setAssignPending(false);
    }
  };

  const handleUnassign = async (assignmentId: string, userId: string, gateId: string) => {
    setUnassigningId(assignmentId);
    try {
      const res = await csrfFetch('/api/gates/assignments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, gateId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(t('gateAssignments.success.unassigned', 'Assignment removed.'));
        await fetchData();
      } else {
        toast.error(data.message || t('gateAssignments.errors.unassignFailed', 'Unassign failed.'));
      }
    } catch {
      toast.error(t('common.errors.network', 'Network error.'));
    } finally {
      setUnassigningId(null);
    }
  };

  const gateOptions = gates.map((g) => ({ label: g.location ? `${g.name} (${g.location})` : g.name, value: g.id }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Assign form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t('gateAssignments.assignTitle', 'Assign user to gates')}
          </CardTitle>
          <CardDescription>
            {t('gateAssignments.assignDescription', 'Select a team member and one or more gates to allow scanning at those gates.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadError && (
            <p className="text-sm text-destructive">{loadError}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="gate-assign-user">{t('gateAssignments.userLabel', 'User')}</Label>
            <select
              id="gate-assign-user"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">{t('gateAssignments.selectUser', 'Select a user…')}</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>{t('gateAssignments.gatesLabel', 'Gates')}</Label>
            <MultiSelect
              options={gateOptions}
              selected={selectedGateIds}
              onChange={setSelectedGateIds}
              placeholder={t('gateAssignments.selectGates', 'Select gates…')}
            />
          </div>
          <Button
            onClick={handleAssign}
            disabled={assignPending || !selectedUserId || selectedGateIds.length === 0}
          >
            {assignPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('gateAssignments.assignButton', 'Assign')}
          </Button>
        </CardContent>
      </Card>

      {/* Section 2: Current assignments table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('gateAssignments.tableTitle', 'Current assignments')}</CardTitle>
          <CardDescription>
            {t('gateAssignments.tableDescription', 'Users and the gates they can scan at.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              {t('gateAssignments.noAssignments', 'No assignments yet. Use the form above to assign users to gates.')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('gateAssignments.tableUser', 'User')}</TableHead>
                  <TableHead>{t('gateAssignments.tableGate', 'Gate')}</TableHead>
                  <TableHead className="w-[100px]">{t('gateAssignments.tableActions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="font-medium">{row.user.name || row.user.email}</span>
                      <br />
                      <span className="text-xs text-muted-foreground">{row.user.email}</span>
                    </TableCell>
                    <TableCell>
                      {row.gate.location ? `${row.gate.name} (${row.gate.location})` : row.gate.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={unassigningId === row.id}
                        onClick={() => handleUnassign(row.id, row.userId, row.gateId)}
                      >
                        {unassigningId === row.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">{t('gateAssignments.unassign', 'Unassign')}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
