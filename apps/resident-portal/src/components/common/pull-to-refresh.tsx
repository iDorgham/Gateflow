'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

const TRIGGER_PX = 72;

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const startY = React.useRef<number | null>(null);

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (window.scrollY > 0 || refreshing) return;
    startY.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startY.current === null || refreshing) return;
    const currentY = event.touches[0]?.clientY ?? startY.current;
    const delta = Math.max(0, Math.min(96, currentY - startY.current));
    setPull(delta);
  };

  const onTouchEnd = async () => {
    if (startY.current === null) return;
    if (pull >= TRIGGER_PX) {
      setRefreshing(true);
      router.refresh();
      window.setTimeout(() => {
        setRefreshing(false);
        setPull(0);
      }, 700);
    } else {
      setPull(0);
    }
    startY.current = null;
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center transition-all duration-150"
        style={{ transform: `translateY(${Math.max(-32, pull - 40)}px)` }}
      >
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
          {refreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      </div>
      <div
        style={{ transform: `translateY(${pull * 0.35}px)` }}
        className="transition-transform duration-75"
      >
        {children}
      </div>
    </div>
  );
}
