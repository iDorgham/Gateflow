/**
 * CSRF Token utilities for client-side
 *
 * Functions to get and set CSRF tokens from cookies
 */

const CSRF_COOKIE = 'gf_csrf_token';
const CSRF_HEADER = 'x-csrf-token';

/**
 * Get CSRF token from cookie (client-side)
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + CSRF_COOKIE + '=([^;]+)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Fetch wrapper that automatically adds CSRF token
 */
export async function csrfFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getCsrfToken();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set(CSRF_HEADER, token);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  });
}

/**
 * Server-side: Get CSRF token from cookies (for Server Components)
 */
export async function getCsrfTokenServer(): Promise<string | null> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    const csrfCookie = cookieStore.get(CSRF_COOKIE);
    return csrfCookie?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Generate a secure CSRF token.
 * Uses Web Crypto API (available in both Node.js 18+ and browser).
 */
export function generateCsrfToken(): string {
  const arr = new Uint8Array(32);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export { CSRF_COOKIE, CSRF_HEADER };
