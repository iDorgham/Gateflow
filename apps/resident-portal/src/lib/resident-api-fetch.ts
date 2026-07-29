import { cookies } from 'next/headers';
import { resolveResidentApiBase } from '@/lib/api-upstream';

export function buildResidentApiUrl(path: string): string {
  const base = resolveResidentApiBase();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export async function sessionCookieHeader(): Promise<string> {
  const store = await cookies();
  return store
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join('; ');
}

export type ResidentFetchResult<T> =
  { ok: true; data: T } | { ok: false; status: number; error: string };

export async function fetchResidentJson<T>(
  path: string
): Promise<ResidentFetchResult<T>> {
  const cookie = await sessionCookieHeader();
  try {
    const res = await fetch(buildResidentApiUrl(path), {
      cache: 'no-store',
      headers: cookie ? { cookie } : {},
    });
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error:
          res.status === 401 || res.status === 403
            ? 'Unauthorized'
            : `Request failed (${res.status})`,
      };
    }
    const json = (await res.json()) as { success?: boolean; data?: T };
    if (!json?.success || json.data === undefined) {
      return { ok: false, status: res.status, error: 'Invalid response' };
    }
    return { ok: true, data: json.data };
  } catch {
    return { ok: false, status: 0, error: 'Network error' };
  }
}
