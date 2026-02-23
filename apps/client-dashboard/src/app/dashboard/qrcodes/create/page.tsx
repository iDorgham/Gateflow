import { getSessionClaims } from '@/lib/auth-cookies';
import { getValidatedProjectId } from '@/lib/project-cookie';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { CreateQRClient } from './create-qr-client';

export const metadata = { title: 'Create QR Code' };

export default async function CreateQRPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const projectId = await getValidatedProjectId(claims.orgId);

  const [gates, currentProject] = await Promise.all([
    prisma.gate.findMany({
      where: { organizationId: claims.orgId, isActive: true, deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    projectId
      ? prisma.project.findFirst({
          where: { id: projectId, deletedAt: null },
          select: { id: true, name: true },
        })
      : Promise.resolve(null),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create QR Code</h1>
        <p className="text-sm text-slate-500">
          Generate a cryptographically signed QR code for gate access.
        </p>
      </div>
      <CreateQRClient
        organizationId={claims.orgId}
        gates={gates}
        currentProject={currentProject ?? null}
      />
    </div>
  );
}
