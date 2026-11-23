import { cn } from '@gateflow/ui';
import type { ActivityBucket } from '@/lib/dashboard/overview-data';

/**
 * Server-rendered stacked bar chart (granted + rejected per bucket).
 *
 * Plain flex + CSS, no chart library: zero client JS, zero layout shift, and the
 * time axis mirrors automatically in RTL because it is a flex row. Each bar
 * carries a native tooltip and the whole chart has a text summary for screen
 * readers.
 */
export function StackedBars({
  buckets,
  labelFor,
  tickEvery,
  highlightLast = true,
  height = 160,
  formatNumber,
  grantedLabel,
  rejectedLabel,
  summary,
}: {
  buckets: ActivityBucket[];
  labelFor: (b: ActivityBucket) => string;
  tickEvery: number;
  highlightLast?: boolean;
  height?: number;
  formatNumber: (n: number) => string;
  grantedLabel: string;
  rejectedLabel: string;
  summary: string;
}) {
  const max = Math.max(1, ...buckets.map((b) => b.granted + b.rejected));
  const scaleMax = niceCeil(max);
  const gridLines = [1, 0.5];

  return (
    <figure className="m-0 flex flex-1 flex-col">
      <figcaption className="sr-only">{summary}</figcaption>
      <div
        className="relative flex-1"
        style={{ minHeight: height }}
        aria-hidden="true"
      >
        {/* Gridlines + scale labels pinned to the inline-start edge */}
        {gridLines.map((g) => (
          <div
            key={g}
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[var(--ds-border-subtle)]"
            style={{ top: `${(1 - g) * 100}%` }}
          >
            <span className="absolute start-0 -top-2 bg-[var(--ds-surface)] pe-1.5 text-[10px] tabular-nums leading-4 text-[var(--ds-text-subtlest)]">
              {formatNumber(Math.round(scaleMax * g))}
            </span>
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 border-t border-[var(--ds-border-subtle)]" />

        <div className="absolute inset-0 flex items-end gap-[3px] ps-8">
          {buckets.map((b, i) => {
            const total = b.granted + b.rejected;
            const isLast = highlightLast && i === buckets.length - 1;
            return (
              <div
                key={b.key}
                className="group relative flex h-full min-w-0 flex-1 flex-col justify-end"
                title={`${labelFor(b)} · ${grantedLabel} ${formatNumber(b.granted)} · ${rejectedLabel} ${formatNumber(b.rejected)}`}
              >
                <div
                  className="flex w-full flex-col justify-end overflow-hidden rounded-t-[2px]"
                  style={{ height: `${(total / scaleMax) * 100}%` }}
                >
                  {b.rejected > 0 && (
                    <div
                      className="w-full bg-[var(--gf-color-danger)]"
                      style={{ flexGrow: b.rejected, minHeight: 2 }}
                    />
                  )}
                  {b.granted > 0 && (
                    <div
                      className={cn(
                        'w-full bg-[var(--gf-color-info)] transition-opacity group-hover:opacity-80',
                        !isLast && 'opacity-70'
                      )}
                      style={{ flexGrow: b.granted }}
                    />
                  )}
                </div>
                {total === 0 && (
                  <div className="h-px w-full bg-[var(--ds-border-bold)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis ticks */}
      <div className="mt-2 flex gap-[3px] ps-8" aria-hidden="true">
        {buckets.map((b, i) => (
          <div
            key={b.key}
            className="min-w-0 flex-1 overflow-visible whitespace-nowrap text-[10px] leading-4 tabular-nums text-[var(--ds-text-subtlest)]"
          >
            {(buckets.length - 1 - i) % tickEvery === 0 ? labelFor(b) : ''}
          </div>
        ))}
      </div>
    </figure>
  );
}

export function ChartLegend({
  items,
}: {
  items: { label: string; className: string; value?: string }[];
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--ds-text-subtle)]">
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-center gap-1.5">
          <span
            className={cn('h-2 w-2 rounded-[2px]', it.className)}
            aria-hidden="true"
          />
          {it.label}
          {it.value && (
            <span className="font-medium tabular-nums text-[var(--ds-text-primary)]">
              {it.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function niceCeil(n: number): number {
  if (n <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(n)));
  const steps = [1, 2, 2.5, 5, 10];
  for (const s of steps) if (s * pow >= n) return s * pow;
  return 10 * pow;
}
