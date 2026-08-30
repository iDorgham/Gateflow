/**
 * @gateflow/tokens - Semantic: Surface Layers (Tier 2 Semantic)
 * Dual-Mode Surface Hierarchy: OKLCH Satin-Charcoal (Dark) vs Porcelain (Light).
 */

export const semanticLayers = {
  light: {
    layer01: 'oklch(98.5% 0.005 250)', // #f8f9fa - Canvas / Page background
    layer02: 'oklch(100% 0 0)',         // #ffffff - Default card / table container
    layer03: 'oklch(100% 0 0)',         // #ffffff (+ shadow) - Raised surface / Floating header
    layer04: 'oklch(100% 0 0)',         // #ffffff (+ deep shadow) - Modal overlay / Sheet
    glowSubtle: 'none',
    glowFocused: '0 0 0 2px rgba(237, 75, 0, 0.25)',
  },
  dark: {
    layer01: 'oklch(8% 0.012 250)',    // #0b0d11 - Sunken canvas / Page gutter
    layer02: 'oklch(12% 0.015 250)',   // #12151c - Default card / table container
    layer03: 'oklch(16% 0.018 250)',   // #191d26 - Raised surface / Floating header
    layer04: 'oklch(20% 0.020 250)',   // #212633 - Modal overlay / Sheet
    glowSubtle: '0 0 0 1px rgba(255, 255, 255, 0.04) inset, 0 2px 8px -2px rgba(0, 0, 0, 0.5)',
    glowFocused: '0 0 0 1px rgba(237, 75, 0, 0.20) inset, 0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 0 16px -2px rgba(237, 75, 0, 0.15)',
  },
} as const;
