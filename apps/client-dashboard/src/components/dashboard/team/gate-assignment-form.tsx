'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  MultiSelect,
} from '@gateflow/ui';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { csrfFetch } from '@/lib/csrf';

interface Gate {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export function GateAssignmentForm({ locale: _locale }: { locale: string }) {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [selectedGates, setSelectedGates] = React.useState<string[]>([]);
  const [shiftStart, setShiftStart] = React.useState<string>('');
  const [shiftEnd, setShiftEnd] = React.useState<string>('');

  const { data: users = [], isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['team-members-list'],
    queryFn: async () => {
      const res = await fetch('/api/team/members');
      const json = await res.json();
      return json.data || [];
    },
  });

  const { data: gates = [], isLoading: loadingGates } = useQuery<Gate[]>({
    queryKey: ['gates-list'],
    queryFn: async () => {
      const res = await fetch('/api/gates');
      const json = await res.json();
      return json.data || [];
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      gateIds: string[];
      shiftStart?: string | null;
      shiftEnd?: string | null;
    }) => {
      const res = await csrfFetch('/api/gates/assignments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to assign');
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gate-assignments-list'] });
      toast.success(
        t('gateAssignments.success.assigned', 'Assignments added.')
      );
      // Reset form
      setSelectedUser('');
      setSelectedGates([]);
      setShiftStart('');
      setShiftEnd('');
    },
    onError: (err: Error) => {
      toast.error(
        err.message ||
          t('gateAssignments.errors.assignFailed', 'Assign failed.')
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || selectedGates.length === 0) {
      toast.error(
        t(
          'gateAssignments.validation.selectUserAndGates',
          'Select a user and at least one gate.'
        )
      );
      return;
    }

    assignMutation.mutate({
      userId: selectedUser,
      gateIds: selectedGates,
      shiftStart: shiftStart || null,
      shiftEnd: shiftEnd || null,
    });
  };

  const gateOptions = gates.map((g) => ({
    label: g.name,
    value: g.id,
  }));

  return (
    <Card className="rounded-2xl border-[var(--ds-border)] bg-[var(--ds-surface)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {t('gateAssignments.assignTitle', 'Assign user to gates')}
        </CardTitle>
        <CardDescription>
          {t(
            'gateAssignments.assignDescription',
            'Select a team member and one or more gates to allow scanning.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-select">
                {t('gateAssignments.userLabel', 'User')}
              </Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger
                  id="user-select"
                  className="bg-white dark:bg-slate-900 border-[var(--ds-border)]"
                >
                  <SelectValue
                    placeholder={t(
                      'gateAssignments.selectUser',
                      'Select a user…'
                    )}
                  />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-[var(--ds-border)]">
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gate-multiselect">
                {t('gateAssignments.gatesLabel', 'Gates')}
              </Label>
              <MultiSelect
                options={gateOptions}
                onChange={setSelectedGates}
                selected={selectedGates}
                placeholder={t('gateAssignments.selectGates', 'Select gates…')}
                className="bg-white dark:bg-slate-900 border-[var(--ds-border)] w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shift-start">
                {t('gateAssignments.shiftStart', 'Shift start (optional)')}
              </Label>
              <Input
                id="shift-start"
                type="time"
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                className="bg-white dark:bg-slate-900 border-[var(--ds-border)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shift-end">
                {t('gateAssignments.shiftEnd', 'Shift end (optional)')}
              </Label>
              <Input
                id="shift-end"
                type="time"
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                className="bg-white dark:bg-slate-900 border-[var(--ds-border)]"
              />
            </div>

            <div className="flex items-end lg:justify-end">
              <Button
                type="submit"
                disabled={
                  assignMutation.isPending || loadingUsers || loadingGates
                }
                className="w-full sm:w-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {assignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.processing', 'Processing…')}
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('gateAssignments.assignButton', 'Assign')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
