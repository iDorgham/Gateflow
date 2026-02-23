import { cookies } from 'next/headers';
import { prisma } from '@gate-access/db';

const PROJECT_COOKIE = 'gf_current_project';
const SECURE = process.env.NODE_ENV === 'production';

/** Special cookie value meaning "show data from all projects". */
export const ALL_PROJECTS_VALUE = 'all';

/** Returns the raw cookie value (may be ALL_PROJECTS_VALUE, a project id, or null). */
export function getCurrentProjectCookie(): string | null {
  return cookies().get(PROJECT_COOKIE)?.value ?? null;
}

export function setProjectCookie(projectId: string): void {
  cookies().set(PROJECT_COOKIE, projectId, {
    httpOnly: true,
    secure: SECURE,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });
}

/**
 * Returns the active project id for DB filtering.
 *   - null  → "All Projects" mode (no project filter), or no projects exist
 *   - string → validated project id for the org
 * Falls back to the first project when no cookie is set.
 */
export async function getValidatedProjectId(orgId: string): Promise<string | null> {
  const cookieVal = getCurrentProjectCookie();

  // Explicit "All Projects" selection → no filter
  if (cookieVal === ALL_PROJECTS_VALUE) return null;

  if (cookieVal) {
    const exists = await prisma.project.findFirst({
      where: { id: cookieVal, organizationId: orgId, deletedAt: null },
      select: { id: true },
    });
    if (exists) return exists.id;
  }

  // Fallback: first project for this org
  const first = await prisma.project.findFirst({
    where: { organizationId: orgId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });
  return first?.id ?? null;
}
