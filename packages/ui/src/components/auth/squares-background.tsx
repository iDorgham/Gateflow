'use client';

/**
 * Animated grid background for the login accent panel.
 * Uses GateFlow real estate palette: Kimchi (orange) background with
 * white grid lines and subtle Midnight Blue vignette.
 * Respects prefers-reduced-motion.
 */

import React, { useRef, useEffect } from 'react';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

export interface SquaresBackgroundProps {
  /** Direction of the grid movement */
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  /** Movement speed (0 = static, respects reduced motion) */
  speed?: number;
  /** Color of the square borders — defaults: white/20 on Kimchi */
  borderColor?: CanvasStrokeStyle;
  /** Size of each square in pixels */
  squareSize?: number;
  /** Fill color when a square is hovered */
  hoverFillColor?: CanvasStrokeStyle;
  /** When true, animation is paused (for prefers-reduced-motion) */
  reducedMotion?: boolean;
  /** Vignette color at edges — rgba string for center→edge gradient */
  vignetteColor?: string;
}

/** Real estate palette defaults for Kimchi (orange) panel */
const KIMCHI_BORDER = 'rgba(2, 0, 53, 0.35)'; /* Midnight Blue grid lines */
const KIMCHI_HOVER = 'rgba(2, 0, 53, 0.45)'; /* Midnight Blue on hover */
const KIMCHI_VIGNETTE = 'rgba(2, 0, 53, 0.15)'; // Midnight Blue tint at edges

export function SquaresBackground({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = KIMCHI_BORDER,
  squareSize = 40,
  hoverFillColor = KIMCHI_HOVER,
  reducedMotion = false,
  vignetteColor = KIMCHI_VIGNETTE,
}: SquaresBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);

  const effectiveSpeed = reducedMotion ? 0 : Math.max(speed, 0.1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      ctx.lineWidth = 0.5;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          const gridX = Math.floor((x - startX) / squareSize);
          const gridY = Math.floor((y - startY) / squareSize);

          if (
            hoveredSquareRef.current &&
            gridX === hoveredSquareRef.current.x &&
            gridY === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      // Subtle vignette — Midnight Blue at edges for real estate palette cohesion
      const maxRadius =
        Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)) / 2;
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        maxRadius
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, vignetteColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      if (effectiveSpeed > 0) {
        switch (direction) {
          case 'right':
            gridOffset.current.x =
              (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
            break;
          case 'left':
            gridOffset.current.x =
              (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
            break;
          case 'up':
            gridOffset.current.y =
              (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
            break;
          case 'down':
            gridOffset.current.y =
              (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
            break;
          case 'diagonal':
            gridOffset.current.x =
              (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
            gridOffset.current.y =
              (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
            break;
          default:
            break;
        }
      }
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const hoveredSquareX = Math.floor(
        (mouseX + (gridOffset.current.x % squareSize)) / squareSize
      );
      const hoveredSquareY = Math.floor(
        (mouseY + (gridOffset.current.y % squareSize)) / squareSize
      );

      hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    direction,
    effectiveSpeed,
    borderColor,
    hoverFillColor,
    squareSize,
    vignetteColor,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full border-none bg-transparent block"
      aria-hidden
    />
  );
}

export default SquaresBackground;
