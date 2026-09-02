/**
 * WCAG 2.2 contrast utilities.
 *
 * Pure, dependency-free implementations of the relative-luminance and
 * contrast-ratio formulas from WCAG 2.x, plus threshold helpers that map a
 * ratio to the WCAG 2.2 AA / AAA success-criterion outcomes.
 *
 * Only hex (`#rrggbb`, `#rgb`) and `rgb()/rgba()` colors are supported for
 * parsing. Design-system tokens resolve to these concrete values in computed
 * styles, so consumers call `parseColor` with a resolved color string.
 */

export type RGB = { r: number; g: number; b: number; a?: number };

/** True if the string looks like a parseable color we can measure. */
export function isMeasurableColor(value: string | null | undefined): boolean {
  if (!value) return false;
  const v = value.trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) || /^rgba?\(/i.test(v);
}

/**
 * Parse a `#rgb`, `#rrggbb`, or `rgb()/rgba()` string into 0-255 RGB channels.
 * Returns `null` for anything else.
 */
export function parseColor(value: string | null | undefined): RGB | null {
  if (!value) return null;
  const v = value.trim();

  const hexShorthand = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(v);
  if (hexShorthand) {
    return {
      r: parseInt(hexShorthand[1] + hexShorthand[1], 16),
      g: parseInt(hexShorthand[2] + hexShorthand[2], 16),
      b: parseInt(hexShorthand[3] + hexShorthand[3], 16),
    };
  }

  const hexLong = /^#([0-9a-f]{6})$/i.exec(v);
  if (hexLong) {
    return {
      r: parseInt(hexLong[1].slice(0, 2), 16),
      g: parseInt(hexLong[1].slice(2, 4), 16),
      b: parseInt(hexLong[1].slice(4, 6), 16),
    };
  }

  const rgb =
    /^rgb\(\s*((?:\d+(?:\.\d+)?|\.\d+))\s*,\s*((?:\d+(?:\.\d+)?|\.\d+))\s*,\s*((?:\d+(?:\.\d+)?|\.\d+))\s*\)$/i.exec(
      v
    );
  if (rgb) {
    return {
      r: clampChannel(parseFloat(rgb[1])),
      g: clampChannel(parseFloat(rgb[2])),
      b: clampChannel(parseFloat(rgb[3])),
    };
  }

  const rgba =
    /^rgba\(\s*((?:\d+(?:\.\d+)?|\.\d+))\s*,\s*((?:\d+(?:\.\d+)?|\.\d+))\s*,\s*((?:\d+(?:\.\d+)?|\.\d+))\s*,\s*((?:\d+(?:\.\d+)?|\.\d+))\s*\)$/i.exec(
      v
    );
  if (rgba) {
    const alpha = parseFloat(rgba[4]);
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) return null;
    return {
      r: clampChannel(parseFloat(rgba[1])),
      g: clampChannel(parseFloat(rgba[2])),
      b: clampChannel(parseFloat(rgba[3])),
      a: alpha,
    };
  }

  return null;
}

/**
 * Clamp a color channel value to the valid 0-255 range.
 *
 * @param value - The raw channel value to clamp.
 * @returns The clamped value, rounded to the nearest integer.
 */
function clampChannel(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(255, Math.max(0, Math.round(value)));
}

/**
 * Convert an sRGB channel value to its linear RGB equivalent for luminance calculation.
 * Applies the WCAG 2.x sRGB to linear RGB transformation formula.
 *
 * @param channel - The sRGB channel value in the range 0-255.
 * @returns The linearized channel value in the range 0-1.
 */
function channelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * WCAG relative luminance of an sRGB color, in the range 0 (black) to 1 (white).
 */
export function relativeLuminance(color: RGB): number {
  const R = channelToLinear(color.r);
  const G = channelToLinear(color.g);
  const B = channelToLinear(color.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * WCAG contrast ratio between two colors, in the range 1 to 21.
 * Accepts either parsed RGB tuples or color strings (parsed internally).
 */
export function contrastRatio(
  foreground: RGB | string | null | undefined,
  background: RGB | string | null | undefined
): number {
  const fg =
    typeof foreground === 'string' || foreground == null
      ? parseColor(foreground as string | null | undefined)
      : foreground;
  const bg =
    typeof background === 'string' || background == null
      ? parseColor(background as string | null | undefined)
      : background;

  if (!fg || !bg || (fg.a ?? 1) < 1 || (bg.a ?? 1) < 1) return NaN;

  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG 2.2 thresholds (rounded to 1 decimal place for display).
 * - 4.5:1  — AA for normal text and 3px+ UI component graphics under 1.4.11
 * - 3:1    — AA Large Text (18pt / 14pt bold) and 1.4.11 non-text contrast
 * - 7:1    — AAA normal text (informational reference, not a GateFlow target)
 */
export const WCAG22 = {
  aaNormal: 4.5,
  aaLarge: 3,
  aaaNormal: 7,
  aaaLarge: 4.5,
} as const;

export type ContrastOutcome = {
  ratio: number;
  /** AA for normal text (>= 4.5:1) and non-text/UI component contrast. */
  aaNormal: boolean;
  /** AA for large text (>= 3:1, the WCAG 2.2 1.4.3 Large Text bar). */
  aaLarge: boolean;
  /** AAA for normal text (>= 7:1) — advisory only for GateFlow. */
  aaaNormal: boolean;
  /** True when the pair fails even the 3:1 large-text bar. */
  fails: boolean;
};

/**
 * Evaluate a foreground/background pair against WCAG 2.2 thresholds.
 * Returns a full outcome record; callers render the badges.
 */
export function evaluateContrast(
  foreground: RGB | string | null | undefined,
  background: RGB | string | null | undefined
): ContrastOutcome {
  const ratio = contrastRatio(foreground, background);
  if (Number.isNaN(ratio)) {
    return {
      ratio: Number.NaN,
      aaNormal: false,
      aaLarge: false,
      aaaNormal: false,
      fails: true,
    };
  }
  return {
    ratio,
    aaNormal: ratio >= WCAG22.aaNormal,
    aaLarge: ratio >= WCAG22.aaLarge,
    aaaNormal: ratio >= WCAG22.aaaNormal,
    fails: ratio < WCAG22.aaLarge,
  };
}

/** Round to a fixed number of decimals for display. */
export function roundRatio(ratio: number, decimals = 1): number {
  if (Number.isNaN(ratio)) return Number.NaN;
  const factor = Math.pow(10, decimals);
  return Math.round(ratio * factor) / factor;
}
