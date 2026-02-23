'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      aria-label="Print analytics"
    >
      <Printer className="h-3.5 w-3.5" aria-hidden="true" />
      Print
    </button>
  );
}
