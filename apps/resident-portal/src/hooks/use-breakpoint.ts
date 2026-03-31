'use client';

import { useEffect, useMemo, useState } from 'react';
import { tokens } from '@gate-access/ui';

type BreakpointName = 'xs' | 'sm' | 'md' | 'lg';

function parsePx(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value.replace('px', ''), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function useBreakpoint() {
  const breakpoints = useMemo(
    () => ({
      xs: parsePx(tokens?.screens?.xs, 600),
      sm: parsePx(tokens?.screens?.sm, 768),
      md: parsePx(tokens?.screens?.md, 992),
      lg: parsePx(tokens?.screens?.lg, 1200),
    }),
    []
  );

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return {
    width,
    isXs: width >= breakpoints.xs,
    isSm: width >= breakpoints.sm,
    isMd: width >= breakpoints.md,
    isLg: width >= breakpoints.lg,
    current:
      width >= breakpoints.lg
        ? ('lg' as BreakpointName)
        : width >= breakpoints.md
          ? ('md' as BreakpointName)
          : width >= breakpoints.sm
            ? ('sm' as BreakpointName)
            : ('xs' as BreakpointName),
    breakpoints,
  };
}
