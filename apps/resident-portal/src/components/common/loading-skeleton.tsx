import { cn } from '@gate-access/ui';

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/80', className)}
    />
  );
}
