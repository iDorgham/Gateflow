import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { BulkQRClient } from './bulk-qr-client';

export const metadata = { title: 'Bulk QR Creation' };

export default async function BulkQRPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const gates = await prisma.gate.findMany({
    where: { organizationId: claims.orgId, deletedAt: null, isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return <BulkQRClient gates={gates} />;
}
