import {
  parseColor,
  relativeLuminance,
  contrastRatio,
  evaluateContrast,
  roundRatio,
  WCAG22,
} from './wcag';

describe('wcag contrast engine', () => {
  describe('parseColor', () => {
    it('parses 6-digit hex', () => {
      expect(parseColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColor('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('parses 3-digit shorthand hex', () => {
      expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('parses rgb() and rgba()', () => {
      expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('rgb(12.5, 127.5, 254.5)')).toEqual({
        r: 13,
        g: 128,
        b: 255,
      });
      expect(parseColor('rgb(.5, .5, .5)')).toEqual({ r: 1, g: 1, b: 1 });
      expect(parseColor('rgba(0, 128, 255, 0.5)')).toEqual({
        r: 0,
        g: 128,
        b: 255,
        a: 0.5,
      });
      expect(parseColor('rgba(.5, .5, .5, .5)')).toEqual({
        r: 1,
        g: 1,
        b: 1,
        a: 0.5,
      });
    });

    it('is case-insensitive for hex', () => {
      expect(parseColor('#AABBCC')).toEqual({ r: 170, g: 187, b: 204 });
    });

    it('returns null for unsupported formats', () => {
      expect(parseColor(null)).toBeNull();
      expect(parseColor('')).toBeNull();
      expect(parseColor('oklch(62% 0.25 32)')).toBeNull();
      expect(parseColor('transparent')).toBeNull();
    });

    it('rejects malformed decimal components', () => {
      expect(parseColor('rgb(1.2.3, 0, 0)')).toBeNull();
      expect(parseColor('rgba(0, 1.2.3, 0, 0.5)')).toBeNull();
      expect(parseColor('rgba(0, 0, 0, 0.5.1)')).toBeNull();
    });
  });

  describe('contrastRatio', () => {
    it('black on white is 21', () => {
      expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
    });

    it('same color is 1', () => {
      expect(contrastRatio('#000000', '#000000')).toBeCloseTo(1, 1);
    });

    it('is symmetric (order-independent)', () => {
      const a = contrastRatio('#123456', '#abcdef');
      const b = contrastRatio('#abcdef', '#123456');
      expect(a).toBeCloseTo(b, 6);
    });

    it('accepts parsed RGB tuples', () => {
      expect(
        contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })
      ).toBeCloseTo(21, 1);
    });

    it('returns NaN for unparseable input', () => {
      expect(Number.isNaN(contrastRatio('nope', '#ffffff'))).toBe(true);
    });

    it('returns NaN for transparent and translucent colors', () => {
      expect(Number.isNaN(contrastRatio('rgba(0, 0, 0, 0)', '#ffffff'))).toBe(
        true
      );
      expect(Number.isNaN(contrastRatio('rgba(0, 0, 0, 0.5)', '#ffffff'))).toBe(
        true
      );
      expect(contrastRatio('rgba(0, 0, 0, 1)', '#ffffff')).toBeCloseTo(21, 1);
      expect(contrastRatio('rgba(.5, .5, .5, 1)', '#ffffff')).toBeCloseTo(
        20.87,
        1
      );
    });
  });

  describe('relativeLuminance', () => {
    it('white luminance is 1', () => {
      expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 4);
    });

    it('black luminance is 0', () => {
      expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 4);
    });
  });

  describe('evaluateContrast against known AA/AAA ratios', () => {
    it('flags a passing AA normal pair', () => {
      // #0f172a (text) on #ffffff (surface) exceeds 4.5:1
      const outcome = evaluateContrast('#0f172a', '#ffffff');
      expect(outcome.aaNormal).toBe(true);
      expect(outcome.aaLarge).toBe(true);
      expect(outcome.fails).toBe(false);
      expect(outcome.ratio).toBeGreaterThanOrEqual(WCAG22.aaNormal);
    });

    it('flags a failing low-contrast pair', () => {
      // #cbd5e1 (neutral-300) on white is ~1.48:1 — fails even large text
      const outcome = evaluateContrast('#cbd5e1', '#ffffff');
      expect(outcome.ratio).toBeLessThan(WCAG22.aaLarge);
      expect(outcome.aaNormal).toBe(false);
      expect(outcome.aaLarge).toBe(false);
      expect(outcome.fails).toBe(true);
    });

    it('surfaces the subtlest text token as a real audit risk', () => {
      // --gf-color-text-subtlest (#94a3b8) on white is ~2.56:1 → below AA large 3:1
      const outcome = evaluateContrast('#94a3b8', '#ffffff');
      expect(outcome.ratio).toBeLessThan(WCAG22.aaLarge);
      expect(outcome.fails).toBe(true);
    });

    it('never passes an unmeasurable translucent foreground', () => {
      const outcome = evaluateContrast('rgba(0, 0, 0, 0.5)', '#ffffff');
      expect(Number.isNaN(outcome.ratio)).toBe(true);
      expect(outcome.aaNormal).toBe(false);
      expect(outcome.aaLarge).toBe(false);
      expect(outcome.fails).toBe(true);
    });

    it('rounds ratio for display', () => {
      expect(roundRatio(4.567, 1)).toBe(4.6);
      expect(roundRatio(21, 1)).toBe(21);
    });
  });
});
