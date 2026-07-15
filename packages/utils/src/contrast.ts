/**
 * WCAG 2.1 Contrast Validator
 * 
 * Calculates the contrast ratio between two colors to ensure
 * accessibility compliance (WCAG 2.1 AA/AAA).
 */

/**
 * Calculates the relative luminance of a color
 * Formula: 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where R, G, B are sRGB components scaled to [0, 1]
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parses a hex color string to RGB
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

/**
 * Validates contrast between two hex colors
 * Returns the ratio and compliance status.
 */
export function validateContrast(color1: string, color2: string) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return { ratio: 0, passesAA: false, passesAAA: false, error: 'Invalid color format' };
  }

  const l1 = getRelativeLuminance(...rgb1);
  const l2 = getRelativeLuminance(...rgb2);

  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (brighter + 0.05) / (darker + 0.05);

  return {
    ratio: Number(ratio.toFixed(2)),
    passesAA: ratio >= 4.5, // Standard for normal text
    passesAAA: ratio >= 7,   // Enhanced contrast
    passesLargeAA: ratio >= 3 // Large text or UI components
  };
}
