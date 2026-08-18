import type { ReactNode } from 'react';
import { cn } from '@gateflow/ui';

export const SETTINGS_TABS_LIST =
  'h-auto w-fit flex-wrap rounded-[8px] bg-[var(--ds-background-neutral-subtle)] p-1 sm:flex-nowrap';

export const SETTINGS_TAB_TRIGGER =
  'gap-2 rounded-[6px] px-4 py-2 text-sm font-medium data-[state=active]:bg-[var(--ds-surface)] data-[state=active]:shadow-sm';

export function SettingsSectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[var(--ds-border)] pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--ds-text)]">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm text-[var(--ds-text-subtle)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className={cn('flex shrink-0 items-center gap-2')}>{action}</div>
      ) : null}
    </div>
  );
}
