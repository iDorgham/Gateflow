/**
 * Constrain CMS/authored hrefs to internal paths or http(s) URLs.
 * Rejects javascript:, data:, and other executable schemes.
 */
export function safeHref(
  value: string | null | undefined,
  fallback = '/contact'
): string {
  const raw = (value ?? '').trim();
  if (!raw) return fallback;

  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }

  try {
    const url = new URL(raw);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {
    // not a valid absolute URL
  }

  return fallback;
}
