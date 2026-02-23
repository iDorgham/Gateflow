import * as SecureStore from 'expo-secure-store';
import JWT from 'expo-jwt';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const CSRF_TOKEN_KEY = 'csrf_token';
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

// Buffer before actual expiry to trigger refresh (60 seconds)
const EXPIRY_BUFFER_MS = 60_000;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Store both tokens securely after login.
 */
export async function storeTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

/**
 * Store CSRF token after login.
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
 * Clear all stored tokens (logout).
 */
export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(CSRF_TOKEN_KEY);
}

/**
 * Get a valid access token, refreshing if expired.
 * Returns null if not authenticated or refresh fails.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (!accessToken) return null;

  // Check if token is expired (or about to expire)
  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }

  // Try to refresh
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const newTokens = await refreshTokens(refreshToken);
  if (!newTokens) {
    // Refresh failed — clear tokens, user must re-login
    await clearTokens();
    return null;
  }

  await storeTokens(newTokens);
  return newTokens.accessToken;
}

/**
 * Check if a JWT access token is expired (with buffer).
 */
function isTokenExpired(token: string): boolean {
  try {
    // null key → skip signature verification, just parse the payload claims.
    // JWT.decode still throws TokenExpired if exp is already past, which the
    // catch below handles. We also apply our own early-refresh buffer below.
    const payload = JWT.decode(token, null);
    if (!payload.exp) return true;
    const expiresAtMs = payload.exp * 1000;
    return Date.now() >= expiresAtMs - EXPIRY_BUFFER_MS;
  } catch {
    return true;
  }
}

/**
 * Call the refresh endpoint to get new tokens.
 * Handles token rotation - stores new refresh token.
 * Returns null on failure, including token reuse detection.
 */
async function refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
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

    // Handle token reuse detection - clear all tokens
    if (!response.ok || !data.success) {
      if (
        data.message?.includes('revoked') ||
        data.message?.includes('reuse')
      ) {
        // Token reuse detected - clear all sessions
        await clearTokens();
      }
      return null;
    }

    const newTokens = {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };

    // Store new tokens (rotation)
    await storeTokens(newTokens);

    // Extract and store new CSRF token if present
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      const csrfMatch = setCookie.match(/gf_csrf_token=([^;]+)/);
      if (csrfMatch) {
        await storeCsrfToken(decodeURIComponent(csrfMatch[1]));
      }
    }

    return newTokens;
  } catch {
    return null;
  }
}

/**
 * Login via the auth API and store tokens.
 */
export async function login(
  email: string,
  password: string
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

    // Extract and store CSRF token from cookie
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
 * Logout: revoke refresh token on server and clear local storage.
 */
export async function logout(): Promise<void> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    // Best-effort server revocation
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  await clearTokens();
}

export { isTokenExpired, EXPIRY_BUFFER_MS };
