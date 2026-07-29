'use client';

import Link from 'next/link';
import { Plus, QrCode, Users } from 'lucide-react';
import * as React from 'react';
import { cn } from '@gateflow/ui';

export function QuickCreateFAB() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed bottom-24 end-6 z-40 md:hidden">
      <div
        className={cn(
          'mb-4 flex flex-col items-end gap-3 transition-all duration-300 ease-[var(--ds-easing-entrance)]',
          open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        )}
      >
        <Link
          href="/visitors/new?template=delivery"
          className="inline-flex items-center gap-2 rounded-xl border border-ds-border bg-ds-surface/90 backdrop-blur-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-ds-text-heading shadow-ds-shadow-raised"
        >
          <QrCode className="h-4 w-4 text-ds-icon-brand" />
          Delivery (1 tap)
        </Link>
        <Link
          href="/visitors/new?template=weekend"
          className="inline-flex items-center gap-2 rounded-xl border border-ds-border bg-ds-surface/90 backdrop-blur-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-ds-text-heading shadow-ds-shadow-raised"
        >
          <Users className="h-4 w-4 text-ds-icon-accent-purple" />
          Weekend Guest
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ds-background-brand-bold text-ds-text-inverse shadow-xl shadow-ds-background-brand-bold/30 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Open quick visitor templates"
      >
        <Plus
          className={cn(
            'h-6 w-6 transition-transform duration-300',
            open && 'rotate-45'
          )}
        />
      </button>
    </div>
  );
}
