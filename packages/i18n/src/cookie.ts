export const LOCALE_COOKIE_NAME = 'gf_locale';
export const LEGACY_LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const SUPPORTED_LOCALES = ['en', 'ar-EG'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en';

export const SHARED_LOCALE_PARENT_DOMAINS = ['gateflow.site'] as const;

const LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);

export function parseLocale(
  value: string | null | undefined
): SupportedLocale | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  if (LOCALE_SET.has(normalized)) {
    return normalized as SupportedLocale;
  }
  // Support standard fallback alias like 'ar' -> 'ar-EG'
  if (normalized.toLowerCase() === 'ar') {
    return 'ar-EG';
  }
  return undefined;
}

/**
 * Parent Domain for the shared locale cookie.
 * Host-only on localhost / IPs / preview hosts so we never set a public-suffix
 * Domain like `.vercel.app`. Production `*.gateflow.site` uses `.gateflow.site`.
 */
export function resolveLocaleCookieDomain(
  hostname: string
): string | undefined {
  const host = hostname.trim().toLowerCase().replace(/\.$/, '');
  if (!host) return undefined;
  if (host === 'localhost' || host.endsWith('.localhost')) return undefined;
  if (host === '127.0.0.1' || host === '[::1]' || host === '::1') {
    return undefined;
  }
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return undefined;

  for (const parent of SHARED_LOCALE_PARENT_DOMAINS) {
    if (host === parent || host.endsWith(`.${parent}`)) {
      return `.${parent}`;
    }
  }

  return undefined;
}

export function serializeLocaleCookie(
  locale: SupportedLocale,
  options: { hostname: string; secure?: boolean }
): string {
  const parts = [
    `${LOCALE_COOKIE_NAME}=${encodeURIComponent(locale)}`,
    'Path=/',
    `Max-Age=${LOCALE_COOKIE_MAX_AGE}`,
    'SameSite=Lax',
  ];

  const domain = resolveLocaleCookieDomain(options.hostname);
  if (domain) parts.push(`Domain=${domain}`);
  if (options.secure) parts.push('Secure');

  return parts.join('; ');
}

export function readLocaleFromCookieHeader(
  cookieHeader: string
): SupportedLocale | undefined {
  let legacy: SupportedLocale | undefined;

  for (const pair of cookieHeader.split(';')) {
    const trimmed = pair.trim();
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const name = trimmed.slice(0, eq);
    let decoded: string;
    try {
      decoded = decodeURIComponent(trimmed.slice(eq + 1));
    } catch (e) {
      if (e instanceof URIError) continue;
      throw e;
    }
    const value = parseLocale(decoded);
    if (!value) continue;
    if (name === LOCALE_COOKIE_NAME) return value;
    if (name === LEGACY_LOCALE_COOKIE_NAME) legacy = value;
  }

  return legacy;
}

export function readLocaleCookie(): SupportedLocale | undefined {
  if (typeof document === 'undefined') return undefined;
  return readLocaleFromCookieHeader(document.cookie);
}

export function persistLocaleCookie(
  locale: SupportedLocale,
  env: { hostname?: string; protocol?: string } = {}
): void {
  if (typeof document === 'undefined') return;
  const hostname = env.hostname ?? window.location.hostname;
  const protocol = env.protocol ?? window.location.protocol;
  document.cookie = serializeLocaleCookie(locale, {
    hostname,
    secure: protocol === 'https:',
  });
}
