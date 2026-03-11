import { redirect } from 'next/navigation';
import { getSessionClaims } from './auth-cookies';
import { prisma } from '@gate-access/db';
import type { AccessTokenClaims } from './auth';

export interface DashboardSession {
  claims: AccessTokenClaims;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    organizationId: string | null;
  };
  org: {
    id: string;
    name: string;
    email: string;
    plan: string;
    maskResidentNameOnLandingPage: boolean;
    showUnitOnLandingPage: boolean;
  } | null;
}

/** Verifies the session cookie and fetches user + org from DB. Redirects to /login on failure. */
export async function requireAuth(): Promise<DashboardSession> {
  const claims = await getSessionClaims();
  if (!claims) redirect('/login');

  const userRow = await prisma.user
    .findFirst({
      where: { id: claims.sub, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: { select: { name: true } },
        organizationId: true,
      },
    })
    .catch(() => null);

  if (!userRow) redirect('/login');

  const user: DashboardSession['user'] = {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role.name,
    organizationId: userRow.organizationId,
  };

  let org: DashboardSession['org'] = null;
  if (user.organizationId) {
    org = await prisma.organization
      .findFirst({
        where: { id: user.organizationId, deletedAt: null },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          maskResidentNameOnLandingPage: true,
          showUnitOnLandingPage: true,
        },
      })
      .catch(() => null);
  }

  return { claims, user, org };
}
