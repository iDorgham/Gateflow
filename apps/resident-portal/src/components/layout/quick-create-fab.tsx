'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export function QuickCreateFAB() {
  return (
    <Link
      href="/visitors/new"
      className="fixed bottom-20 right-4 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-300 transition hover:bg-blue-700 md:hidden"
      aria-label="Create visitor pass"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
}
