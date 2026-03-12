import { cn } from '@gate-access/ui';

interface Metric {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: 'danger' | 'warning' | 'ok' | 'neutral';
}

interface LiveMetricsGridProps {
  metrics: Metric[];
}

const highlightConfig = {
  danger: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  ok: 'text-emerald-600 dark:text-emerald-400',
  neutral: 'text-foreground',
};

export function LiveMetricsGrid({ metrics }: LiveMetricsGridProps) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
      {metrics.map(({ label, value, sub, highlight = 'neutral' }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
          <p className={cn('text-2xl font-black', highlightConfig[highlight])}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      ))}
    </div>
  );
}
