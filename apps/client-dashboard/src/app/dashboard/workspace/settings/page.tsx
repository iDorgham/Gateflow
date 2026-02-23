import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { WorkspaceSettingsClient } from './settings-client';

export const metadata = { title: 'Workspace Settings' };

export default async function WorkspaceSettingsPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const org = await prisma.organization.findFirst({
    where: { id: claims.orgId, deletedAt: null },
    select: { id: true, name: true, email: true, domain: true, plan: true, createdAt: true },
  });
  if (!org) redirect('/dashboard');

  return (
    <WorkspaceSettingsClient
      org={{
        id: org.id,
        name: org.name,
        email: org.email,
        domain: org.domain ?? '',
        plan: org.plan,
        createdAt: org.createdAt.toISOString(),
      }}
    />
  );
}
