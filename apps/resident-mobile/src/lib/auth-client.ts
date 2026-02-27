import * as SecureStore from 'expo-secure-store';
import { decode } from 'base-64';

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const CSRF_TOKEN_KEY = 'csrf_token';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

// Trigger refresh this many ms before the token actually expires
const EXPIRY_BUFFER_MS = 60_000;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Basic JWT decoder since expo-jwt can be finicky in some environments
 */
function decodeJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    return JSON.parse(decode(payload));
  } catch {
    return null;
  }
}

export async function storeTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export async function storeCsrfToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(CSRF_TOKEN_KEY, token);
}

export async function getCsrfToken(): Promise<string | null> {
  return SecureStore.getItemAsync(CSRF_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(CSRF_TOKEN_KEY);
}

let _refreshInFlight: Promise<AuthTokens | null> | null = null;

function deduplicatedRefresh(refreshToken: string): Promise<AuthTokens | null> {
  if (_refreshInFlight !== null) return _refreshInFlight;
  _refreshInFlight = doRefresh(refreshToken).finally(() => {
    _refreshInFlight = null;
  });
  return _refreshInFlight;
}

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

  await storeTokens(newTokens);
  return newTokens.accessToken;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000 - EXPIRY_BUFFER_MS;
  } catch {
    return true;
  }
}

async function doRefresh(refreshToken: string): Promise<AuthTokens | null> {
  try {
    const csrfToken = await getCsrfToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (csrfToken) headers['x-csrf-token'] = csrfToken;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      if (typeof data.message === 'string' && (data.message.includes('revoked') || data.message.includes('reuse'))) {
        await clearTokens();
      }
      return null;
    }

    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
    };
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
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

    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      const csrfMatch = cookies.match(/gf_csrf_token=([^;]+)/);
      if (csrfMatch) await storeCsrfToken(decodeURIComponent(csrfMatch[1]));
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

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
