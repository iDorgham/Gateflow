import Link from 'next/link';
import { Home } from 'lucide-react';
import { unitMissingMessage } from '@/lib/pilot-ux';
import { PageHeader } from '@/components/layout/page-header';

type Props = {
  intent: 'visitor' | 'open-qr';
  backHref: string;
  title: string;
};

export function UnitRequiredEmpty({ intent, backHref, title }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title={title} backHref={backHref} />
      <main className="mx-auto w-full max-w-md px-4 py-10 pb-24 md:max-w-3xl">
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-6 text-center shadow-sm"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-amber-100">
            <Home className="h-6 w-6 text-amber-700" />
          </div>
          <p className="text-sm font-medium text-amber-950">
            {unitMissingMessage(intent)}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
