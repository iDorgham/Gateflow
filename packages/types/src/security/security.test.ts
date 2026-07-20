import {
  filterValidBrandingTokens,
  generateBrandingCss,
  sanitizeOrgIdForCss,
  validateBrandingTokenValue,
} from './branding-tokens';
import { sanitizeBlogHtmlFields, sanitizeCmsHtml } from './sanitize-cms-html';

describe('sanitizeCmsHtml', () => {
  it('returns empty string for nullish input', () => {
    expect(sanitizeCmsHtml(null)).toBe('');
    expect(sanitizeCmsHtml(undefined)).toBe('');
    expect(sanitizeCmsHtml('')).toBe('');
  });

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

  it('strips target and rel so links cannot opt into window.opener', () => {
    const dirty =
      '<a href="https://evil.example" target="_blank" rel="opener">click</a>';
    const clean = sanitizeCmsHtml(dirty);
    expect(clean).not.toMatch(/target=/i);
    expect(clean).not.toMatch(/rel=/i);
    expect(clean).toContain('href="https://evil.example"');
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

describe('sanitizeBlogHtmlFields', () => {
  it('sanitizes contentEn and contentAr only', () => {
    const body = sanitizeBlogHtmlFields({
      title: '<script>x</script>',
      contentEn: '<p>Safe</p><script>alert(1)</script>',
      contentAr: '<a href="https://a.test" target="_blank" rel="opener">ع</a>',
      status: 'DRAFT',
    });
    expect(body.title).toBe('<script>x</script>');
    expect(body.contentEn).toContain('Safe');
    expect(body.contentEn).not.toMatch(/script/i);
    expect(body.contentAr).toContain('href="https://a.test"');
    expect(body.contentAr).not.toMatch(/target=/i);
    expect(body.contentAr).not.toMatch(/rel=/i);
    expect(body.status).toBe('DRAFT');
  });

  it('leaves non-string content fields untouched', () => {
    const body = sanitizeBlogHtmlFields({
      contentEn: null,
      contentAr: 42,
    });
    expect(body.contentEn).toBeNull();
    expect(body.contentAr).toBe(42);
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
    const css = generateBrandingCss('org-1', {
      '--ds-text-brand': '#0052CC',
    });
    expect(css).toContain("[data-org-id='org-1']");
    expect(css).not.toContain(':root');
    expect(
      generateBrandingCss("'; alert(1); '", { '--ds-text-brand': '#0052CC' })
    ).toBeNull();
    expect(sanitizeOrgIdForCss("'; alert(1); '")).toBeNull();
  });
});
