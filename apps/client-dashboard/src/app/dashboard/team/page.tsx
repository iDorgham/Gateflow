import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { TeamClient } from './team-client';

export const metadata = { title: 'Team' };

export default async function TeamPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const members = await prisma.user.findMany({
    where: { organizationId: claims.orgId, deletedAt: null },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <TeamClient
      members={members.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        createdAt: m.createdAt.toISOString(),
      }))}
      currentUserId={claims.sub}
    />
  );
}
