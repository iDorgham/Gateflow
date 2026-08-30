'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/skeleton';

export interface DynamicIslandProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: number | string;
  minWidth?: number | string;
  className?: string;
  /**
   * When true, only mounts children once the element is near the viewport
   */
  deferUntilVisible?: boolean;
  rootMargin?: string;
}

/**
 * DynamicIsland — Guarantees zero Cumulative Layout Shift (CLS) for dynamic,
 * heavy client widgets (e.g. Recharts, SSE feeds, complex tables).
 */
export function DynamicIsland({
  children,
  fallback,
  minHeight = '120px',
  minWidth,
  className,
  deferUntilVisible = false,
  rootMargin = '200px',
}: DynamicIslandProps) {
  const [isMounted, setIsMounted] = React.useState(!deferUntilVisible);
  const [isVisible, setIsVisible] = React.useState(!deferUntilVisible);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!deferUntilVisible || !containerRef.current) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [deferUntilVisible, rootMargin]);

  const style: React.CSSProperties = {
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
  };

  if (!isMounted || !isVisible) {
    return (
      <div
        ref={containerRef}
        style={style}
        className={cn('relative w-full flex items-center justify-center', className)}
        aria-busy="true"
        aria-label="Loading interactive content"
      >
        {fallback || (
          <Skeleton
            className="w-full h-full rounded-[var(--ds-radius-lg)] bg-[var(--ds-layer-02)]"
            style={style}
          />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={style} className={cn('relative w-full', className)}>
      <React.Suspense
        fallback={
          fallback || (
            <Skeleton
              className="w-full h-full rounded-[var(--ds-radius-lg)] bg-[var(--ds-layer-02)]"
              style={style}
            />
          )
        }
      >
        {children}
      </React.Suspense>
    </div>
  );
}

/**
 * Preload high-priority hero images in the browser document head
 */
export function preloadCriticalImage(href: string, as = 'image'): void {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
}
