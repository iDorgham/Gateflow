import * as SecureStore from 'expo-secure-store';
import JWT from 'expo-jwt';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const CSRF_TOKEN_KEY = 'csrf_token';
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

// Trigger refresh this many ms before the token actually expires
const EXPIRY_BUFFER_MS = 60_000;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Token storage ────────────────────────────────────────────────────────────

/**
 * Store both tokens securely after login or rotation.
 */
export async function storeTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

/**
 * Store CSRF token after login or rotation.
 */
export async function storeCsrfToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(CSRF_TOKEN_KEY, token);
}

/**
 * Get CSRF token.
 */
export async function getCsrfToken(): Promise<string | null> {
  return SecureStore.getItemAsync(CSRF_TOKEN_KEY);
}

/**
 * Clear all stored tokens (logout or session revocation).
 */
export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(CSRF_TOKEN_KEY);
}

// ─── Concurrency guard ────────────────────────────────────────────────────────

/**
 * At most one refresh network request is allowed in-flight at a time.
 *
 * Problem without this: when multiple API calls fire simultaneously and the
 * access token is expired, every one of them calls refreshTokens() with the
 * same old refresh token.  The server's reuse-detection logic then sees the
 * second (duplicate) request as a replay attack and revokes ALL sessions,
 * logging the user out.
 *
 * Solution: the first caller creates the promise and every subsequent caller
 * that arrives while the refresh is in progress receives the same promise.
 * The network request is made exactly once.
 */
let _refreshInFlight: Promise<AuthTokens | null> | null = null;

function deduplicatedRefresh(refreshToken: string): Promise<AuthTokens | null> {
  if (_refreshInFlight !== null) {
    // Another refresh is already underway — wait for its result.
    return _refreshInFlight;
  }
  _refreshInFlight = doRefresh(refreshToken).finally(() => {
    _refreshInFlight = null;
  });
  return _refreshInFlight;
}

// ─── Main public API ──────────────────────────────────────────────────────────

/**
 * Return a valid access token, triggering a rotation if the stored token is
 * expired (or within EXPIRY_BUFFER_MS of expiry).
 *
 * Returns null if the user is not authenticated or if token rotation fails,
 * in which case all stored tokens are cleared and the user must re-login.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (!accessToken) return null;

  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }

  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const newTokens = await deduplicatedRefresh(refreshToken);
  if (!newTokens) {
    await clearTokens();
    return null;
  }

  // Store the rotated tokens (idempotent — multiple concurrent callers all
  // store the same values returned by the single in-flight request).
  await storeTokens(newTokens);
  return newTokens.accessToken;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Check if a JWT access token is expired (with buffer).
 * Signature is NOT verified — we only need the exp claim.
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JWT.decode(token, null);
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000 - EXPIRY_BUFFER_MS;
  } catch {
    return true;
  }
}

/**
 * Call the refresh endpoint and return the new token pair on success.
 * Returns null on any failure (network error, 4xx, 5xx).
 *
 * On reuse detection (server revokes all sessions) the local tokens are also
 * cleared so the user is prompted to re-login immediately.
 */
async function doRefresh(refreshToken: string): Promise<AuthTokens | null> {
  try {
    const csrfToken = await getCsrfToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      // If the server detected token reuse it will have revoked every session.
      // Mirror that locally so the UI can redirect to login immediately.
      if (
        typeof data.message === 'string' &&
        (data.message.includes('revoked') || data.message.includes('reuse'))
      ) {
        await clearTokens();
      }
      return null;
    }

    const newTokens: AuthTokens = {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };

    // The server rotates the CSRF token on each refresh — update SecureStore.
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const csrfMatch = setCookieHeader.match(/gf_csrf_token=([^;]+)/);
      if (csrfMatch) {
        await storeCsrfToken(decodeURIComponent(csrfMatch[1]));
      }
    }

    return newTokens;
  } catch {
    return null;
  }
}

// ─── Login / logout ───────────────────────────────────────────────────────────

/**
 * Authenticate with email + password and store the issued tokens.
 */
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.message || 'Login failed' };
    }

    await storeTokens({
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    });

    // Extract and store CSRF token from Set-Cookie header.
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      const csrfMatch = cookies.match(/gf_csrf_token=([^;]+)/);
      if (csrfMatch) {
        await storeCsrfToken(decodeURIComponent(csrfMatch[1]));
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Revoke the refresh token on the server (best-effort) and clear local state.
 */
export async function logout(): Promise<void> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  await clearTokens();
}

export { isTokenExpired, EXPIRY_BUFFER_MS };
