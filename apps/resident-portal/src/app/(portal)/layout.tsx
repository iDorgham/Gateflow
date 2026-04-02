import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { PortalShell } from '@/components/layout/portal-shell';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GateFlow',
  },
};

export const viewport: Viewport = {
  themeColor: 'token("color.background.accent.blue.bold")',
};

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

  const organizationId = (claims.org as string) || (claims.orgId as string);
  const unit = await prisma.unit.findFirst({
    where: {
      userId: claims.sub,
      organizationId,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!unit) {
    redirect('/no-unit-linked');
  }

  return <PortalShell>{children}</PortalShell>;
}
