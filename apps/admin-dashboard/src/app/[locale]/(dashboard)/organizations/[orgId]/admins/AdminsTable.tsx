'use client';

import * as React from 'react';
import { Badge, Button, Column, DynamicTable, cn } from '@gateflow/ui';
import { KeyRound, ShieldCheck, ShieldAlert } from 'lucide-react';
import { resetAdminPassword, toggleSuspend } from './admin-actions';

type AdminRow = {
  id: string;
  name: string;
  email: string | null;
  deletedAt: Date | string | null;
};

export type AdminsTableLabels = {
  platformAdmins: string;
  suspended: string;
  reset: string;
  restore: string;
  suspend: string;
};

export function AdminsTable({
  admins,
  locale,
  labels,
}: {
  admins: AdminRow[];
  locale: string;
  labels: AdminsTableLabels;
}) {
  const columns = React.useMemo<Column<AdminRow>[]>(() => {
    return [
      {
        key: 'admin',
        label: labels.platformAdmins,
        render: (admin) => {
          const suspended = admin.deletedAt !== null;
          return (
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-[10px] uppercase shadow-inner',
                  suspended
                    ? 'bg-ds-background-neutral text-ds-text-subtle'
                    : 'bg-ds-background-brand-bold text-ds-text-inverse'
                )}
              >
                {admin.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    'text-xs font-bold font-mono tracking-tight',
                    suspended
                      ? 'text-ds-text-subtle line-through opacity-50'
                      : 'text-ds-text'
                  )}
                >
                  {admin.name}
                </span>
                <span className="text-[10px] text-ds-text-subtle font-medium">
                  {admin.email ?? '—'}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: 'status',
        label: 'Status',
        render: (admin) => (
          <Badge
            variant={admin.deletedAt ? 'warning' : 'success'}
            className="h-5 px-2 text-[9px] font-black italic uppercase"
          >
            {admin.deletedAt ? labels.suspended : 'Active'}
          </Badge>
        ),
      },
      {
        key: 'actions',
        label: '',
        align: 'right',
        render: (admin) => (
          <div className="flex items-center gap-2">
            <form action={resetAdminPassword}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={admin.id} />
              <Button
                type="submit"
                variant="subtle"
                size="compact"
                className="h-7 text-[10px] font-black uppercase tracking-widest gap-1.5 opacity-60 hover:opacity-100"
              >
                <KeyRound className="h-3 w-3" />
                {labels.reset}
              </Button>
            </form>
            <form action={toggleSuspend}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="id" value={admin.id} />
              <input
                type="hidden"
                name="suspended"
                value={String(admin.deletedAt !== null)}
              />
              <Button
                type="submit"
                variant={admin.deletedAt ? 'success' : 'destructive'}
                size="compact"
                className="h-7 text-[10px] font-black uppercase tracking-widest gap-1.5"
              >
                {admin.deletedAt ? (
                  <>
                    <ShieldCheck className="h-3 w-3" /> {labels.restore}
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-3 w-3" /> {labels.suspend}
                  </>
                )}
              </Button>
            </form>
          </div>
        ),
      },
    ];
  }, [
    labels.platformAdmins,
    labels.suspended,
    labels.reset,
    labels.restore,
    labels.suspend,
    locale,
  ]);

  return <DynamicTable columns={columns} items={admins} />;
}
