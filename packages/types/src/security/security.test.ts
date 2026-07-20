import {
  filterValidBrandingTokens,
  generateBrandingCss,
  sanitizeOrgIdForCss,
  validateBrandingTokenValue,
} from './branding-tokens';
import { sanitizeCmsHtml } from './sanitize-cms-html';

describe('sanitizeCmsHtml', () => {
  it('strips script tags and event handlers', () => {
    const dirty =
      '<p>Hello</p><script>alert(1)</script><img src=x onerror=alert(1) />';
    const clean = sanitizeCmsHtml(dirty);
    expect(clean).not.toMatch(/script/i);
    expect(clean).not.toMatch(/onerror/i);
    expect(clean).toContain('Hello');
  });

  it('blocks javascript: URLs in links', () => {
    const dirty = '<a href="javascript:alert(1)">click</a>';
    const clean = sanitizeCmsHtml(dirty);
    expect(clean).not.toMatch(/javascript:/i);
  });

  it('blocks dangerous SVG payloads', () => {
    const dirty =
      '<svg><foreignObject><body xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></body></foreignObject></svg>';
    const clean = sanitizeCmsHtml(dirty);
    expect(clean).not.toMatch(/foreignObject/i);
    expect(clean).not.toMatch(/script/i);
  });

  it('preserves safe semantic markup', () => {
    const dirty =
      '<h2>Title</h2><p>Body with <strong>bold</strong> and <a href="https://example.com">link</a>.</p>';
    const clean = sanitizeCmsHtml(dirty);
    expect(clean).toContain('<h2>');
    expect(clean).toContain('<strong>');
    expect(clean).toContain('href="https://example.com"');
  });
});

describe('branding token validation', () => {
  it('rejects CSS injection in token values', () => {
    expect(validateBrandingTokenValue('#0052CC')).toBe(true);
    expect(validateBrandingTokenValue('16px')).toBe(true);
    expect(
      validateBrandingTokenValue(
        '#fff; } body { background: url(javascript:alert(1))'
      )
    ).toBe(false);
    expect(validateBrandingTokenValue('url(https://evil.test/x)')).toBe(false);
  });

  it('filters unknown tokens and invalid values', () => {
    const filtered = filterValidBrandingTokens({
      '--ds-text-brand': '#0052CC',
      '--evil-token': 'red',
      '--ds-border': '}; @import url(x)',
    });
    expect(filtered).toEqual({ '--ds-text-brand': '#0052CC' });
  });

  it('generates CSS only for safe org ids and tokens', () => {
    expect(
      generateBrandingCss('org-1', { '--ds-text-brand': '#0052CC' })
    ).toContain("[data-org-id='org-1']");
    expect(
      generateBrandingCss("'; alert(1); '", { '--ds-text-brand': '#0052CC' })
    ).toBeNull();
    expect(sanitizeOrgIdForCss("'; alert(1); '")).toBeNull();
  });
});
