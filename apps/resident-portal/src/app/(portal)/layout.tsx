import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

/**
 * Guard: RESIDENT users must have a linked unit to access portal content.
 * If RESIDENT and no unit → redirect to /no-unit-linked.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return <>{children}</>;
  }

  const isResident =
    typeof claims.roleName === 'string' &&
    claims.roleName.toUpperCase() === 'RESIDENT';

  if (!isResident) {
    return <>{children}</>;
  }

  const unit = await prisma.unit.findFirst({
    where: { userId: claims.sub, deletedAt: null },
    select: { id: true },
  });

  if (!unit) {
    redirect('/no-unit-linked');
  }

  return <>{children}</>;
}
