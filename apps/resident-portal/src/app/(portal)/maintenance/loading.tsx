import { LoadingSkeleton } from '@/components/common/loading-skeleton';

export default function MaintenanceLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-3 px-4 py-6">
      <LoadingSkeleton className="h-24 w-full" />
      <LoadingSkeleton className="h-24 w-full" />
      <LoadingSkeleton className="h-24 w-full" />
    </div>
  );
}
