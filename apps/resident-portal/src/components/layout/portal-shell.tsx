'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNav } from './bottom-nav';
import { QuickCreateFAB } from './quick-create-fab';
import { Sidebar } from './sidebar';
import { useBreakpoint } from '@/hooks/use-breakpoint';

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { isMd } = useBreakpoint();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (isMd) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            onPanEnd={(_, info) => {
              const canGoBack = pathname !== '/';
              const isSwipeBack =
                info.point.x < 48 &&
                info.offset.x > 84 &&
                Math.abs(info.offset.y) < 42;
              if (canGoBack && isSwipeBack) router.back();
            }}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <QuickCreateFAB />
      <BottomNav />
    </div>
  );
}
