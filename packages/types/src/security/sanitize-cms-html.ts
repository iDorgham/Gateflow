import { FilterXSS, type IWhiteList } from 'xss';

const CMS_WHITE_LIST: IWhiteList = {
  p: [],
  br: [],
  strong: [],
  em: [],
  u: [],
  b: [],
  i: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  ul: [],
  ol: [],
  li: [],
  // No target/rel — untrusted CMS must not set window.opener via target=_blank rel=opener
  a: ['href', 'title'],
  blockquote: [],
  code: [],
  pre: [],
  img: ['src', 'alt', 'title', 'width', 'height'],
  figure: [],
  figcaption: [],
  table: [],
  thead: [],
  tbody: [],
  tr: [],
  th: [],
  td: [],
  hr: [],
  span: ['class'],
  div: ['class'],
};

const cmsFilter = new FilterXSS({
  whiteList: CMS_WHITE_LIST,
  stripIgnoreTag: true,
  stripIgnoreTagBody: [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'svg',
    'form',
  ],
  css: false,
  onTagAttr(tag, name, value) {
    if (name.startsWith('on')) return '';
    if ((name === 'href' || name === 'src') && /^\s*javascript:/i.test(value)) {
      return '';
    }
    // Defense in depth if target/rel ever re-enter the whitelist
    if (tag === 'a' && (name === 'target' || name === 'rel')) {
      return '';
    }
    return undefined;
  },
});

/**
 * Strict allowlist sanitization for CMS HTML stored in the database and rendered
 * via dangerouslySetInnerHTML on the marketing site.
 */
export function sanitizeCmsHtml(dirty: string | null | undefined): string {
  if (!dirty) return '';
  return cmsFilter.process(dirty);
}

/** Sanitize optional CMS fields on blog write payloads. */
export function sanitizeBlogHtmlFields<T extends Record<string, unknown>>(
  body: T
): T {
  const next = { ...body } as Record<string, unknown>;
  for (const key of ['contentEn', 'contentAr'] as const) {
    if (typeof next[key] === 'string') {
      next[key] = sanitizeCmsHtml(next[key] as string);
    }
  }
  return next as T;
}
