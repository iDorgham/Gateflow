import { getValidAccessToken } from './auth-client';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL != null && process.env.EXPO_PUBLIC_API_URL !== ''
    ? `${process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '')}/api`
    : 'http://localhost:3001/api';

export async function residentFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getValidAccessToken();
  if (!token) {
    const err = new Error('Not authenticated') as Error & { status?: number };
    err.status = 401;
    throw err;
  }

  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    ...(typeof options.headers === 'object' && options.headers != null && !(options.headers instanceof Headers)
      ? Object.fromEntries(
          Object.entries(options.headers).map(([k, v]) => [k, typeof v === 'string' ? v : String(v)])
        )
      : {}),
    Authorization: `Bearer ${token}`,
  };
  if (options.body != null && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(url, { ...options, headers });
}
