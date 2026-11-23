import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, cn } from '@gateflow/ui';

/**
 * Shared shell for every overview widget. One header recipe, one padding
 * scale (16/20px), one border token, so the bento grid reads as one system.
 */
export function Panel({
  title,
  meta,
  action,
  className,
  bodyClassName,
  children,
  labelledBy,
}: {
  title: string;
  meta?: React.ReactNode;
  action?: { href: string; label: string };
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const headingId =
    labelledBy ?? `panel-${title.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <Card
      className={cn(
        'flex min-w-0 flex-col border-[var(--ds-border)] bg-[var(--ds-surface)] shadow-none',
        className
      )}
      role="region"
      aria-labelledby={headingId}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <h2
            id={headingId}
            className="text-sm font-semibold leading-5 text-[var(--ds-text-primary)]"
          >
            {title}
          </h2>
          {meta && (
            <p className="mt-0.5 text-xs leading-4 text-[var(--ds-text-subtlest)]">
              {meta}
            </p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-medium text-[var(--ds-text-subtle)] transition-colors hover:bg-[var(--ds-surface-sunken)] hover:text-[var(--ds-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {action.label}
            <ArrowRight
              className="h-3.5 w-3.5 rtl:rotate-180"
              aria-hidden="true"
            />
          </Link>
        )}
      </header>
      <div className={cn('flex-1 px-5 pb-5', bodyClassName)}>{children}</div>
    </Card>
  );
}

export function PanelEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-[120px] items-center justify-center rounded-md border border-dashed border-[var(--ds-border-subtle)] px-4 text-center text-xs text-[var(--ds-text-subtlest)]">
      {children}
    </div>
  );
}

/** Semantic tone → token classes. The only place status colors are chosen. */
export const TONE = {
  success: {
    dot: 'bg-[var(--gf-color-success)]',
    text: 'text-[var(--gf-color-success)]',
    chip: 'bg-[var(--ds-background-success-subtle)] text-[var(--gf-color-success)]',
  },
  danger: {
    dot: 'bg-[var(--gf-color-danger)]',
    text: 'text-[var(--gf-color-danger)]',
    chip: 'bg-[var(--ds-background-danger-subtle)] text-[var(--gf-color-danger)]',
  },
  warning: {
    dot: 'bg-[var(--gf-color-warning)]',
    text: 'text-[var(--gf-color-warning)]',
    chip: 'bg-[var(--ds-background-warning-subtle)] text-[var(--gf-color-warning)]',
  },
  info: {
    dot: 'bg-[var(--gf-color-info)]',
    text: 'text-[var(--gf-color-info)]',
    chip: 'bg-[var(--ds-background-information-subtle)] text-[var(--gf-color-info)]',
  },
  neutral: {
    dot: 'bg-[var(--ds-text-subtlest)]',
    text: 'text-[var(--ds-text-subtle)]',
    chip: 'bg-[var(--ds-surface-sunken)] text-[var(--ds-text-subtle)]',
  },
} as const;

export type Tone = keyof typeof TONE;

export function scanStatusTone(status: string): Tone {
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'DENIED':
    case 'FAILED':
      return 'danger';
    case 'EXPIRED':
    case 'MAX_USES_REACHED':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function StatusChip({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1.5 rounded-sm px-1.5 text-[11px] font-medium leading-none',
        TONE[tone].chip
      )}
    >
      <span
        className={cn('h-1.5 w-1.5 rounded-full', TONE[tone].dot)}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

export function relativeTime(iso: string, now: Date, locale: string): string {
  const diff = (new Date(iso).getTime() - now.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    style: 'short',
  });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
}
