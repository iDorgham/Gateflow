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

const COLOR_ORANGE = '#ED4B00'; // Kimchi Orange
const COLOR_GRAY_LIGHT = '#64748b'; // Slate 500
const COLOR_WHITE_DARK = '#FFFFFF';

export const AntigravityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const nodesRef = useRef<GridNode[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const scrollRef = useRef(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains('dark'));
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
  }, []);

  const initGrid = () => {
    const nodes: GridNode[] = [];
    const baseColor = isDark ? COLOR_WHITE_DARK : COLOR_GRAY_LIGHT;

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
          color: isOrange ? COLOR_ORANGE : baseColor,
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
    const baseColor = isDark ? COLOR_WHITE_DARK : COLOR_GRAY_LIGHT;

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
          ctx.fillStyle = COLOR_ORANGE;
          if (isDark) {
            ctx.shadowColor = COLOR_ORANGE;
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGrid();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDark]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{
        filter: isDark ? 'contrast(1.1) brightness(1.1)' : 'none',
        opacity: isDark ? 0.9 : 0.7,
      }}
    />
  );
};
