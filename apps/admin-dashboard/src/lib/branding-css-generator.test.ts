import {
  filterValidBrandingTokens,
  generateBrandingCss,
} from '@/lib/branding-css-generator';

describe('branding-css-generator', () => {
  it('rejects CSS injection in generated output', () => {
    const css = generateBrandingCss('org-abc', {
      '--ds-text-brand': '#0052CC',
      '--evil': 'red',
      '--ds-border': '}; body { background: red }',
    });
    expect(css).toContain('--ds-text-brand: #0052CC');
    expect(css).not.toContain('--evil');
    expect(css).not.toContain('body {');
  });

  it('returns null for unsafe org ids', () => {
    expect(
      generateBrandingCss("x'; alert(1); '", { '--ds-text-brand': '#0052CC' })
    ).toBeNull();
  });

  it('filters invalid token keys via shared helper', () => {
    expect(
      filterValidBrandingTokens({
        '--ds-text-brand': '#0052CC',
        '--not-allowed': 'red',
      })
    ).toEqual({ '--ds-text-brand': '#0052CC' });
  });
});
