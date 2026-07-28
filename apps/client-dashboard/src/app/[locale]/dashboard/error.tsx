'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';
import { Button } from '@gateflow/ui';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  useEffect(() => {
    console.error('[Dashboard error boundary]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ds-background-danger-subtle">
        <AlertTriangle className="h-6 w-6 text-ds-text-danger" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">
          Something went wrong
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          This page hit an unexpected error. You can try again, or head back to
          the dashboard.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCw className="h-4 w-4" />
          Try again
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link href={`/${locale}/dashboard`}>
            <Home className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
