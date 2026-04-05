'use client';

import { useEffect } from 'react';
import { Button } from '@gateflow/ui';
import { AlertTriangle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AdminDashboard] Runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-ds-text">Something went wrong</h2>
        <p className="text-sm text-ds-text-subtle max-w-md">
          {error.message?.includes('connect') ||
          error.message?.includes('database')
            ? 'Unable to connect to the database. Check that DATABASE_URL is configured correctly on Vercel.'
            : 'An unexpected error occurred. Check the function logs for details.'}
        </p>
        {error.digest && (
          <p className="text-xs text-ds-text-subtlest font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
