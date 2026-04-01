import { LoadingSkeleton } from '@/components/common/loading-skeleton';

export default function ProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6">
      <LoadingSkeleton className="h-28 w-full" />
      <LoadingSkeleton className="h-52 w-full" />
      <LoadingSkeleton className="h-52 w-full" />
    </div>
  );
}
