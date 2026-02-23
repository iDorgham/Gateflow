import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { ApiKeysClient } from './api-keys-client';
import type { ApiKeyRow } from './api-keys-client';

export const metadata = { title: 'API Keys' };

export default async function ApiKeysPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const keys = await prisma.apiKey.findMany({
    where: { organizationId: claims.orgId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      scopes: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
      createdBy: true,
    },
  });

  // Serialize Date objects to ISO strings for the client component
  const rows: ApiKeyRow[] = keys.map((k) => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.keyPrefix,
    scopes: k.scopes as ApiKeyRow['scopes'],
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
    expiresAt: k.expiresAt?.toISOString() ?? null,
    createdAt: k.createdAt.toISOString(),
    createdBy: k.createdBy,
  }));

  return (
    <ApiKeysClient initialKeys={rows} />
  );
}
