import { LoadingSkeleton } from '@/components/common/loading-skeleton';

export default function PortalLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
      <LoadingSkeleton className="h-24 w-full" />
      <LoadingSkeleton className="h-40 w-full" />
      <LoadingSkeleton className="h-40 w-full" />
    </div>
  );
}
