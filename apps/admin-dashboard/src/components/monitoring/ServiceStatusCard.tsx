import { cn } from '@gate-access/ui';

type ServiceStatus = 'ok' | 'error' | 'unconfigured';

interface ServiceStatusCardProps {
  label: string;
  status: ServiceStatus;
  latencyMs?: number;
  message?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const statusConfig = {
  ok: {
    dot: 'bg-emerald-500',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    text: 'text-emerald-600 dark:text-emerald-400',
    label: 'Operational',
  },
  error: {
    dot: 'bg-red-500 animate-pulse',
    border: 'border-red-500/20',
    bg: 'bg-red-500/5',
    text: 'text-red-600 dark:text-red-400',
    label: 'Error',
  },
  unconfigured: {
    dot: 'bg-amber-400',
    border: 'border-amber-400/20',
    bg: 'bg-amber-400/5',
    text: 'text-amber-600 dark:text-amber-400',
    label: 'Not configured',
  },
};

export function ServiceStatusCard({ label, status, latencyMs, message, icon: Icon }: ServiceStatusCardProps) {
  const cfg = statusConfig[status];

  return (
    <div className={cn('rounded-2xl border-2 p-5 transition-colors', cfg.border, cfg.bg)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', cfg.bg)}>
            <Icon className={cn('h-4.5 w-4.5', cfg.text)} />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-foreground">{label}</p>
            <p className={cn('text-xs font-bold mt-0.5', cfg.text)}>{message ?? cfg.label}</p>
          </div>
        </div>
        <span className={cn('mt-1 h-2.5 w-2.5 rounded-full shrink-0', cfg.dot)} />
      </div>
      {latencyMs !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Latency</span>
          <span className={cn(
            'rounded-md px-1.5 py-0.5 text-[10px] font-black font-mono',
            latencyMs < 50 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : latencyMs < 200 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          )}>
            {latencyMs}ms
          </span>
        </div>
      )}
    </div>
  );
}
