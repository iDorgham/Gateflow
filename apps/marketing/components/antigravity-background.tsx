'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  lx: number;
  ly: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  size: number;
  color: string;
  angle: number;
  orbitRadius: number;
  rotationSpeed: number;
}

const PARTICLE_COUNT = 1200;
const LERP_FACTOR = 0.04;
const COLORS = [
  '#0052cc', // Atlassian Blue (Brand)
  '#0747a6', // Darker Blue
  '#7c3aed', // Purple
  '#4f46e5', // Indigo
  '#00b8d9', // Deep Sea (Info)
  '#ffab00', // Warning (Orange)
];

export const AntigravityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const focalPointRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();

  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const orbitRadius = 100 + Math.random() * Math.max(width, height) * 0.7;
      const x = centerX + Math.cos(angle) * orbitRadius;
      const y = centerY + Math.sin(angle) * orbitRadius;

      particles.push({
        x,
        y,
        lx: x,
        ly: y,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        size: Math.random() * 1.5 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle,
        orbitRadius,
        rotationSpeed:
          (0.0005 + Math.random() * 0.001) * (Math.random() > 0.5 ? 1 : -1),
      });
    }
    particlesRef.current = particles;
  };

  const update = (width: number, height: number) => {
    // Easing for focal point
    focalPointRef.current.x +=
      (mouseRef.current.x - focalPointRef.current.x) * LERP_FACTOR;
    focalPointRef.current.y +=
      (mouseRef.current.y - focalPointRef.current.y) * LERP_FACTOR;

    const fx = focalPointRef.current.x;
    const fy = focalPointRef.current.y;

    particlesRef.current.forEach((p) => {
      // Step orbit angle
      p.angle += p.rotationSpeed;

      // Calculate native orbit position
      const orbitX = fx + Math.cos(p.angle) * p.orbitRadius;
      const orbitY = fy + Math.sin(p.angle) * p.orbitRadius;

      // Distance to focal point
      const dx = fx - p.x;
      const dy = fy - p.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq);

      // Force from focal point (inverse square law gravity-ish)
      const forceMultiplier = Math.min(2, 1000 / (dist + 50));
      const gravityX = (dx / dist) * forceMultiplier;
      const gravityY = (dy / dist) * forceMultiplier;

      // Target seeking (towards its orbital slot)
      p.ax = (orbitX - p.x) * 0.005 + gravityX * 0.1;
      p.ay = (orbitY - p.y) * 0.005 + gravityY * 0.1;

      // Update velocity
      p.vx += p.ax;
      p.vy += p.ay;

      // High friction to keep it controlled
      p.vx *= 0.95;
      p.vy *= 0.95;

      p.lx = p.x;
      p.ly = p.y;
      p.x += p.vx;
      p.y += p.vy;
    });
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);

    particlesRef.current.forEach((p) => {
      const dx = p.x - focalPointRef.current.x;
      const dy = p.y - focalPointRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const opacity = Math.max(0.05, Math.min(0.6, 1 - dist / (width * 0.6)));

      ctx.beginPath();
      // Near center -> brighter, more blue/indigo. Far -> purple/orange.
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';

      // Draw tail based on velocity
      const velocityScale = 2;
      ctx.moveTo(p.x - p.vx * velocityScale, p.y - p.vy * velocityScale);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    });
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
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
        focalPointRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
        mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    handleResize();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.3] dark:opacity-[0.15]"
      style={{ filter: 'blur(1px)' }}
    />
  );
};
