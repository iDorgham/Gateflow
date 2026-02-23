import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { BillingClient } from './billing-client';

export const metadata = { title: 'Billing' };

export default async function BillingPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const [org, gateCount, qrCount] = await Promise.all([
    prisma.organization.findFirst({
      where: { id: claims.orgId, deletedAt: null },
      select: { name: true, plan: true },
    }),
    prisma.gate.count({ where: { organizationId: claims.orgId } }),
    prisma.qRCode.count({ where: { organizationId: claims.orgId } }),
  ]);

  if (!org) redirect('/dashboard');

  return (
    <BillingClient 
      org={{
        name: org.name,
        plan: org.plan,
      }}
      gateCount={gateCount}
      qrCount={qrCount}
    />
  );
}
