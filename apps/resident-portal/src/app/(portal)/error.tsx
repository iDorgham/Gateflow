'use client';

import { useEffect } from 'react';
import { Button } from '@gateflow/ui';

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold text-slate-900">
        Something went wrong
      </h2>
      <p className="text-sm text-slate-500">
        Please try again. If this continues, contact support.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
