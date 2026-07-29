/** Pure Resident API URL helpers — no Next.js imports. */

export function joinResidentApiPath(base: string, path: string): string {
  const normalizedBase = base.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalized}`;
}
