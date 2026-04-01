'use client';

import Link from 'next/link';
import { Plus, QrCode, Users } from 'lucide-react';
import * as React from 'react';
import { cn } from '@gate-access/ui';

export function QuickCreateFAB() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-20 md:hidden">
      <div
        className={cn(
          'mb-3 flex flex-col gap-2 transition-all',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <Link
          href="/visitors/new?template=delivery"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow"
        >
          <QrCode className="h-4 w-4 text-blue-600" />
          Delivery (1 tap)
        </Link>
        <Link
          href="/visitors/new?template=weekend"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow"
        >
          <Users className="h-4 w-4 text-purple-600" />
          Weekend Guest
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-300 transition hover:bg-blue-700"
        aria-label="Open quick visitor templates"
      >
        <Plus
          className={cn('h-6 w-6 transition-transform', open && 'rotate-45')}
        />
      </button>
    </div>
  );
}
