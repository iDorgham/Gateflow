import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-muted via-background to-info/10 px-4 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-danger-subtle shadow-sm">
        <ShieldX className="h-10 w-10 text-danger" aria-hidden="true" />
      </div>

      <h1 className="text-7xl font-black tracking-tight text-foreground">
        404
      </h1>
      <p className="mt-3 text-lg font-medium text-muted-foreground">
        Page not found
      </p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Back to Dashboard
      </Link>

      <p className="mt-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()} GateFlow
      </p>
    </div>
  );
}
