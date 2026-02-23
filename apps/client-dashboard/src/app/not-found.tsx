import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 shadow-sm">
        <ShieldX className="h-10 w-10 text-red-500" aria-hidden="true" />
      </div>

      <h1 className="text-7xl font-black tracking-tight text-slate-900 dark:text-white">404</h1>
      <p className="mt-3 text-lg font-medium text-slate-600 dark:text-slate-400">
        Page not found
      </p>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Back to Dashboard
      </Link>

      <p className="mt-10 text-xs text-slate-400 dark:text-slate-600">
        © {new Date().getFullYear()} GateFlow
      </p>
    </div>
  );
}
