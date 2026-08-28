'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * AntigravityBackground 3.0 - "Magnetic Sentinel Ground"
 * Inspired by @gf-creative-director and @gf-creative-ui-animation
 *
 * Features:
 * - 3D Magnetic Gravity: Nodes are attracted to the cursor's projected floor position.
 * - Ray-Plane Intersection: Calculates mouse position in 3D space.
 * - Magnet Gravity Lines: Grid warps dynamically toward the focal point.
 * - Balanced Spring Physics: Smooth, attractive mechanical lifts.
 */

interface GridNode {
  x: number; // 3D X (Relative to base)
  baseX: number;
  y: number; // 3D Y (Base ground height)
  z: number; // 3D Z (Depth relative to base)
  baseZ: number;
  targetY: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  isOrange: boolean;
}

const GRID_SIZE_X = 40;
const GRID_SIZE_Z = 35;
const SPACING_X = 140;
const SPACING_Z = 110;

// Tokens resolved dynamically via getComputedStyle in useTokenColors hook
const TOKEN_PRIMARY_ACCENT = '--ds-primary-accent';
const TOKEN_TEXT_SUBTLE = '--ds-text-subtle';
const TOKEN_TEXT_PRIMARY = '--ds-text-primary';

export const AntigravityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const nodesRef = useRef<GridNode[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const scrollRef = useRef(0);
  // Cache resolved CSS colors here so draw() never touches getComputedStyle —
  // calling it every animation frame forces a style/layout flush 60x/sec.
  const colorsRef = useRef({ accent: 'black', base: 'black' });
  const [isDark, setIsDark] = useState(false);

  const refreshColors = (dark: boolean) => {
    colorsRef.current = {
      accent: getResolvedColor(TOKEN_PRIMARY_ACCENT),
      base: getResolvedColor(dark ? TOKEN_TEXT_PRIMARY : TOKEN_TEXT_SUBTLE),
    };
  };

  useEffect(() => {
    const checkDark = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
      refreshColors(dark);
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const handleMouseEnter = () => {
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getResolvedColor = (variable: string) => {
    if (typeof window === 'undefined') return 'black';
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim() || 'black'
    );
  };

  const initGrid = () => {
    const nodes: GridNode[] = [];
    const accentColor = getResolvedColor(TOKEN_PRIMARY_ACCENT);
    const baseColor = isDark
      ? getResolvedColor(TOKEN_TEXT_PRIMARY)
      : getResolvedColor(TOKEN_TEXT_SUBTLE);

    for (let z = 0; z < GRID_SIZE_Z; z++) {
      for (let x = 0; x < GRID_SIZE_X; x++) {
        const isOrange = Math.random() > 0.94;
        const posX = (x - GRID_SIZE_X / 2) * SPACING_X;
        const posZ = z * SPACING_Z + 100;
        nodes.push({
          x: posX,
          baseX: posX,
          y: 450,
          z: posZ,
          baseZ: posZ,
          targetY: 450,
          vx: 0,
          vy: 0,
          vz: 0,
          color: isOrange ? accentColor : baseColor,
          isOrange,
        });
      }
    }
    nodesRef.current = nodes;
  };

  const update = (width: number, height: number) => {
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const cx = width / 2;
    const cy = height / 2;
    const focalLength = 1000;

    // Ray-Plane Intersection: Solve for mouse position on Y=450 plane
    // Plane: y = 450. Ray: P = E + t*D. E=(0,0,0). D=(mx-cx, my-cy, focalLength)
    // t*(my-cy) = 450 => t = 450 / (my - cy)
    const dyMouse = my - cy;
    let groundMX = 0;
    let groundMZ = 0;

    // Only calculate if mouse is below horizon to avoid infinity
    if (dyMouse > 50) {
      const t = 450 / dyMouse;
      groundMX = (mx - cx) * t;
      groundMZ = focalLength * t;
    }

    const STIFFNESS = 0.08;
    const DAMPING = 0.82;
    const ATTRACTION = 0.015;

    scrollRef.current += 1.5;

    nodesRef.current.forEach((node) => {
      // Calculate depth-based scroll
      let z = (node.baseZ - scrollRef.current) % (GRID_SIZE_Z * SPACING_Z);
      if (z < 0) z += GRID_SIZE_Z * SPACING_Z;
      node.z = z + 100;

      // Distance to 3D ground mouse position
      const dx = groundMX - node.x;
      const dz = groundMZ - node.z;
      const dist3d = Math.sqrt(dx * dx + dz * dz);

      // Target position
      let tx = node.baseX;
      let ty = 450;
      let targetZ = z + 100;

      if (mouseRef.current.active && dyMouse > 50 && dist3d < 800) {
        const power = 1 - dist3d / 800;
        // Magnetic Pull (X and Z)
        tx += dx * power * 0.4;
        targetZ += (groundMZ - (z + 100)) * power * 0.2;
        // Magnetic Lift (Y)
        ty -= 180 * Math.pow(power, 1.5);
      }

      // Spring Physics (X)
      node.vx += (tx - node.x) * ATTRACTION;
      node.vx *= DAMPING;
      node.x += node.vx;

      // Spring Physics (Y)
      node.vy += (ty - node.y) * STIFFNESS;
      node.vy *= DAMPING;
      node.y += node.vy;

      // Spring Physics (Z)
      node.vz += (targetZ - node.z) * ATTRACTION;
      node.vz *= DAMPING;
      node.z += node.vz;
    });
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const focalLength = 1000;
    const { accent: accentColor, base: baseColor } = colorsRef.current;

    for (let z = 0; z < GRID_SIZE_Z; z++) {
      for (let x = 0; x < GRID_SIZE_X; x++) {
        const i = z * GRID_SIZE_X + x;
        const p1 = nodesRef.current[i];

        const scale1 = focalLength / p1.z;
        const x1 = cx + p1.x * scale1;
        const y1 = cy + p1.y * scale1;

        if (y1 < 0 || y1 > height || scale1 < 0.1) continue;

        // Visual density factor
        const opacity = Math.min(
          0.3,
          0.5 * (1 - p1.z / (GRID_SIZE_Z * SPACING_Z))
        );
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 1 * scale1;

        // Draw connections
        if (x < GRID_SIZE_X - 1) {
          const p2 = nodesRef.current[i + 1];
          // Simple depth check to avoid drawing across the wrap-around scroll
          if (Math.abs(p1.z - p2.z) < SPACING_Z * 2) {
            const scale2 = focalLength / p2.z;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(cx + p2.x * scale2, cy + p2.y * scale2);
            ctx.stroke();
          }
        }

        if (z < GRID_SIZE_Z - 1) {
          const p3 = nodesRef.current[i + GRID_SIZE_X];
          if (Math.abs(p1.z - p3.z) < SPACING_Z * 2) {
            const scale3 = focalLength / p3.z;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(cx + p3.x * scale3, cy + p3.y * scale3);
            ctx.stroke();
          }
        }

        // Highlight attractive nodes
        if (p1.isOrange) {
          const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
          ctx.globalAlpha = opacity * 3 * pulse;
          ctx.fillStyle = accentColor;
          if (isDark) {
            ctx.shadowColor = accentColor;
            ctx.shadowBlur = 12 * scale1;
          }
          ctx.beginPath();
          ctx.arc(x1, y1, 4 * scale1 * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    update(canvas.width, canvas.height);
    draw(ctx, canvas.width, canvas.height);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Only run on desktop screens (>= 1024px) to preserve mobile battery and prevent TBT spikes
    if (typeof window === 'undefined' || window.innerWidth < 1024) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGrid();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Draw a single static frame instead of a continuous 60fps loop.
      const ctx = canvas.getContext('2d');
      if (ctx) draw(ctx, canvas.width, canvas.height);
      return () => window.removeEventListener('resize', handleResize);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (!isVisible && requestRef.current) {
          cancelAnimationFrame(requestRef.current);
          requestRef.current = undefined;
        } else if (isVisible && !requestRef.current) {
          requestRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Defer animation loop start until browser is idle
    const win = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const startAnimation = () => {
      if (isVisible && !requestRef.current) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(startAnimation, { timeout: 1000 });
    } else {
      timeoutId = window.setTimeout(startAnimation, 200);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
      if (idleId !== undefined) win.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [isDark]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        filter: isDark ? 'contrast(1.1) brightness(1.1)' : 'none',
        opacity: isDark ? 0.9 : 0.7,
      }}
    />
  );
};
