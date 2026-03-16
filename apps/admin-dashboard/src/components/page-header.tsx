import { cn } from '@gate-access/ui';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, badge, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between py-2', className)}>
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-[var(--ds-text,#172B4D)] leading-none italic uppercase">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-[13px] font-medium text-[var(--ds-text-subtle,#6B778C)] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
          {actions}
        </div>
      )}
    </div>
  );
}
