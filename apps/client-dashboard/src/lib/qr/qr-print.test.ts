import {
  QR_PRINT_BG,
  QR_PRINT_FG,
  isPrintableCssColor,
  rewriteSvgFillsForPrint,
  serializeQrSvgForExport,
} from './qr-print';

describe('qr print export colors', () => {
  it('uses resolved hex, not CSS variables', () => {
    expect(QR_PRINT_BG).toMatch(/^#ffffff$/i);
    expect(QR_PRINT_FG).toMatch(/^#0f172a$/i);
    expect(isPrintableCssColor(QR_PRINT_BG)).toBe(true);
    expect(isPrintableCssColor(QR_PRINT_FG)).toBe(true);
    expect(isPrintableCssColor('var(--ds-surface)')).toBe(false);
    expect(isPrintableCssColor('var(--ds-text, #0f172a)')).toBe(false);
  });

  it('rewrites CSS-variable fills so export is not a black square', () => {
    const svg = `<svg viewBox="0 0 256 256"><rect fill="var(--ds-surface)" width="256" height="256"/><path fill="var(--ds-text)" d="M0 0h8v8H0z"/></svg>`;
    expect(rewriteSvgFillsForPrint(svg)).toBe(
      `<svg viewBox="0 0 256 256"><rect fill="${QR_PRINT_BG}" width="256" height="256"/><path fill="${QR_PRINT_FG}" d="M0 0h8v8H0z"/></svg>`
    );
  });

  it('leaves already-printable hex fills unchanged', () => {
    const svg = `<svg><rect fill="#ffffff"/><path fill="#0f172a"/></svg>`;
    expect(rewriteSvgFillsForPrint(svg)).toBe(svg);
  });

  it('adds SVG xmlns for standalone Preview/browser files', () => {
    const serialized = serializeQrSvgForExport(
      `<svg viewBox="0 0 2 2"><rect fill="var(--ds-surface)"/></svg>`
    );
    expect(serialized).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(serialized).toContain(`fill="${QR_PRINT_BG}"`);
  });
});
