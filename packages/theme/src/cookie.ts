import {
  LEGACY_THEME_STORAGE_KEY,
  SHARED_THEME_PARENT_DOMAINS,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  THEME_NAMES,
  THEME_STORAGE_KEY,
  type ThemeName,
} from './constants';

export type { ThemeName } from './constants';
export {
  LEGACY_THEME_STORAGE_KEY,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  THEME_NAMES,
  THEME_STORAGE_KEY,
} from './constants';

const THEME_NAME_SET = new Set<string>(THEME_NAMES);

const SCRIPT_ESCAPE_MAP: Record<string, string> = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\0': '\\0',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};
const SCRIPT_ESCAPE_RE = /[<>/\\\b\f\n\r\t\0\u2028\u2029]/g;

function escapeForInlineScriptLiteral(value: string): string {
  return JSON.stringify(value).replace(
    SCRIPT_ESCAPE_RE,
    (ch) => SCRIPT_ESCAPE_MAP[ch] ?? ch
  );
}

export function parseTheme(
  value: string | null | undefined
): ThemeName | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return THEME_NAME_SET.has(normalized)
    ? (normalized as ThemeName)
    : undefined;
}

/**
 * Parent Domain for the shared theme cookie.
 * Host-only on localhost / IPs / preview hosts so we never set a public-suffix
 * Domain like `.vercel.app`. Production `*.gateflow.site` uses `.gateflow.site`.
 */
export function resolveThemeCookieDomain(
  hostname: string
): string | undefined {
  const host = hostname.trim().toLowerCase().replace(/\.$/, '');
  if (!host) return undefined;
  if (host === 'localhost' || host.endsWith('.localhost')) return undefined;
  if (host === '127.0.0.1' || host === '[::1]' || host === '::1') {
    return undefined;
  }
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return undefined;

  for (const parent of SHARED_THEME_PARENT_DOMAINS) {
    if (host === parent || host.endsWith(`.${parent}`)) {
      return `.${parent}`;
    }
  }

  return undefined;
}

export function serializeThemeCookie(
  theme: ThemeName,
  options: { hostname: string; secure?: boolean }
): string {
  const parts = [
    `${THEME_COOKIE_NAME}=${encodeURIComponent(theme)}`,
    'Path=/',
    `Max-Age=${THEME_COOKIE_MAX_AGE}`,
    'SameSite=Lax',
  ];

  const domain = resolveThemeCookieDomain(options.hostname);
  if (domain) parts.push(`Domain=${domain}`);
  if (options.secure) parts.push('Secure');

  return parts.join('; ');
}

export function readThemeFromCookieHeader(
  cookieHeader: string
): ThemeName | undefined {
  let legacy: ThemeName | undefined;

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
    const value = parseTheme(decoded);
    if (!value) continue;
    if (name === THEME_COOKIE_NAME) return value;
    if (name === LEGACY_THEME_STORAGE_KEY) legacy = value;
  }

  return legacy;
}

export function readThemeCookie(): ThemeName | undefined {
  if (typeof document === 'undefined') return undefined;
  return readThemeFromCookieHeader(document.cookie);
}

export function persistThemeCookie(
  theme: ThemeName,
  env: { hostname?: string; protocol?: string } = {}
): void {
  if (typeof document === 'undefined') return;
  const hostname = env.hostname ?? window.location.hostname;
  const protocol = env.protocol ?? window.location.protocol;
  document.cookie = serializeThemeCookie(theme, {
    hostname,
    secure: protocol === 'https:',
  });
}

/**
 * Blocking bootstrap: copy the shared cookie into localStorage so next-themes
 * (which only reads localStorage) picks up the cross-subdomain preference
 * before first paint.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var KEY=${escapeForInlineScriptLiteral(
  THEME_STORAGE_KEY
)};var LEGACY=${escapeForInlineScriptLiteral(
  LEGACY_THEME_STORAGE_KEY
)};var valid={light:1,dark:1,system:1};function readCookie(name){var m=document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]*)'));return m?decodeURIComponent(m[1]):null}function pick(){var value=readCookie(KEY)||readCookie(LEGACY);if(!value||!valid[value]){try{value=localStorage.getItem(KEY)||localStorage.getItem(LEGACY)}catch(e){value=null}}return value&&valid[value]?value:null}var value=pick();if(value){try{localStorage.setItem(KEY,value)}catch(e){}}}catch(e){}})();`;
