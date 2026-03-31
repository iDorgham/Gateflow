'use client';

import { useState } from 'react';
import { BottomNav } from './bottom-nav';
import { QuickCreateFAB } from './quick-create-fab';
import { Sidebar } from './sidebar';
import { useBreakpoint } from '@/hooks/use-breakpoint';

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { isMd } = useBreakpoint();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isMd) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((prev) => !prev)} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main>{children}</main>
      <QuickCreateFAB />
      <BottomNav />
    </div>
  );
}
