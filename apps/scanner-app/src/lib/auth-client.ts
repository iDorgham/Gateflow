import * as SecureStore from 'expo-secure-store';
import { decodeJwt } from 'jose';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

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
 * Clear all stored tokens (logout).
 */
export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
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
    const payload = decodeJwt(token);
    if (!payload.exp) return true;
    const expiresAtMs = payload.exp * 1000;
    return Date.now() >= expiresAtMs - EXPIRY_BUFFER_MS;
  } catch {
    return true;
  }
}

/**
 * Call the refresh endpoint to get new tokens.
 */
async function refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success || !data.data) return null;

    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };
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
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.message || 'Login failed' };
    }

    await storeTokens({
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    });

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
