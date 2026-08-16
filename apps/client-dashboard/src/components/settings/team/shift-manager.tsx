'use client';

import { useState, useTransition } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@gateflow/ui';
import { Clock, DoorOpen, Pencil, CircleDot } from 'lucide-react';
import { toast } from 'sonner';
import { SettingsSectionHeader } from '@/components/settings/settings-section-header';
import {
  updateAssignmentShift,
  type GateAssignment,
  type ShiftLogRow,
} from '@/app/[locale]/dashboard/organizations/[orgId]/settings/team/actions';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ShiftManager({
  assignments,
  logs,
}: {
  assignments: GateAssignment[];
  logs: ShiftLogRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<GateAssignment | null>(null);
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');

  const scheduled = assignments.filter((row) => row.shiftStart || row.shiftEnd);
  const openLogs = logs.filter((row) => !row.endTime);
  const closedLogs = logs.filter((row) => row.endTime);

  function openEdit(row: GateAssignment) {
    setEditing(row);
    setShiftStart(row.shiftStart ?? '');
    setShiftEnd(row.shiftEnd ?? '');
  }

  function saveShift() {
    if (!editing) return;
    startTransition(async () => {
      const res = await updateAssignmentShift(editing.id, shiftStart, shiftEnd);
      if (res.success) {
        toast.success('Shift window updated');
        setEditing(null);
      } else {
        toast.error(res.error || 'Could not update shift');
      }
    });
  }

  return (
    <div className="space-y-8">
      <SettingsSectionHeader
        title="Shifts"
        description="Scheduled gate windows and live scanner sessions. Times are 24-hour local."
      />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CircleDot
            className="h-4 w-4 text-[var(--ds-icon-subtle)]"
            strokeWidth={1.5}
          />
          <h3 className="text-sm font-semibold text-[var(--ds-text)]">
            On duty now
          </h3>
          <Badge variant="secondary" className="rounded-sm text-[10px]">
            {openLogs.length}
          </Badge>
        </div>
        {openLogs.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-[var(--ds-border)] bg-[var(--ds-background-neutral-subtle)] px-4 py-8 text-center text-sm text-[var(--ds-text-subtle)]">
            No open scanner shifts.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--ds-border)] overflow-hidden rounded-[8px] border border-[var(--ds-border)] bg-[var(--ds-surface)]">
            {openLogs.map((log) => (
              <li key={log.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={log.guard.avatarUrl || undefined} />
                  <AvatarFallback className="text-[10px] font-semibold">
                    {initials(log.guard.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {log.guard.name}
                  </p>
                  <p className="truncate text-xs text-[var(--ds-text-subtle)]">
                    {log.gate.name}
                    {log.gate.location ? ` · ${log.gate.location}` : ''}
                  </p>
                </div>
                <Badge className="rounded-sm bg-[var(--ds-background-success-subtle)] text-[var(--ds-text-success)]">
                  Open
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock
            className="h-4 w-4 text-[var(--ds-icon-subtle)]"
            strokeWidth={1.5}
          />
          <h3 className="text-sm font-semibold text-[var(--ds-text)]">
            Scheduled windows
          </h3>
        </div>
        {scheduled.length === 0 ? (
          <p className="rounded-[8px] border border-dashed border-[var(--ds-border)] bg-[var(--ds-background-neutral-subtle)] px-4 py-8 text-center text-sm text-[var(--ds-text-subtle)]">
            No timed shifts yet. Assign a gate and set start/end times.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--ds-border)] overflow-hidden rounded-[8px] border border-[var(--ds-border)] bg-[var(--ds-surface)]">
            {scheduled.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={row.user.avatarUrl || undefined} />
                    <AvatarFallback className="text-[10px] font-semibold">
                      {initials(row.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {row.user.name}
                    </p>
                    <p className="flex items-center gap-1 truncate text-xs text-[var(--ds-text-subtle)]">
                      <DoorOpen className="h-3 w-3" strokeWidth={1.5} />
                      {row.gate.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <Badge
                    variant="outline"
                    className="rounded-sm font-mono text-[11px]"
                  >
                    {row.shiftStart || '—'} – {row.shiftEnd || '—'}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(row)}
                    aria-label={`Edit shift for ${row.user.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {closedLogs.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--ds-text)]">
            Recent sessions
          </h3>
          <ul className="divide-y divide-[var(--ds-border)] overflow-hidden rounded-[8px] border border-[var(--ds-border)]">
            {closedLogs.slice(0, 12).map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
              >
                <span className="truncate font-medium">{log.guard.name}</span>
                <span className="truncate text-xs text-[var(--ds-text-subtle)]">
                  {log.gate.name}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-[var(--ds-text-subtle)]">
                  {new Date(log.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' – '}
                  {log.endTime
                    ? new Date(log.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'open'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Sheet
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit shift window</SheetTitle>
            <SheetDescription>
              {editing
                ? `${editing.user.name} at ${editing.gate.name}`
                : 'Set when this assignment is valid.'}
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="shift-start">Start</Label>
              <Input
                id="shift-start"
                type="time"
                value={shiftStart}
                onChange={(event) => setShiftStart(event.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shift-end">End</Label>
              <Input
                id="shift-end"
                type="time"
                value={shiftEnd}
                onChange={(event) => setShiftEnd(event.target.value)}
                className="h-11"
              />
            </div>
          </div>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={saveShift} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save shift'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
