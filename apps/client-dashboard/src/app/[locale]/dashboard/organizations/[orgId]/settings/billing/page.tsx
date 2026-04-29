import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { BillingTab } from '../tabs/billing-tab';

export default async function BillingSettingsPage() {
  const { org } = await requireAuth();
  if (!org) return null;

  const [gateCount, qrCount] = await Promise.all([
    prisma.gate.count({
      where: { organizationId: org.id, deletedAt: null },
    }),
    prisma.qRCode.count({
      where: { organizationId: org.id, deletedAt: null },
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <BillingTab 
        org={{
          name: org.name,
          plan: org.plan,
          stripeCustomerId: org.stripeCustomerId,
        }}
        gateCount={gateCount}
        qrCount={qrCount}
      />
    </div>
  );
}
