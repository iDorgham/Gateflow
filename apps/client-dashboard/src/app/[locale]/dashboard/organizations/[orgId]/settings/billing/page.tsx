import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { getStripeClient } from '@gate-access/stripe';
import { BillingTab } from '../tabs/billing-tab';

async function getNextBillingDate(
  stripeSubscriptionId: string | null
): Promise<string | null> {
  if (!stripeSubscriptionId) return null;
  try {
    const stripe = getStripeClient();
    const subscription =
      await stripe.subscriptions.retrieve(stripeSubscriptionId);
    return new Date(subscription.current_period_end * 1000).toISOString();
  } catch (err) {
    console.error('[Billing] Failed to fetch subscription period end:', err);
    return null;
  }
}

export default async function BillingSettingsPage() {
  const { org } = await requireAuth();
  if (!org) return null;

  const [gateCount, qrCount, orgBilling] = await Promise.all([
    prisma.gate.count({
      where: { organizationId: org.id, deletedAt: null },
    }),
    prisma.qRCode.count({
      where: { organizationId: org.id, deletedAt: null },
    }),
    prisma.organization.findUnique({
      where: { id: org.id },
      select: { stripeSubscriptionId: true },
    }),
  ]);

  const nextBillingDate = await getNextBillingDate(
    orgBilling?.stripeSubscriptionId ?? null
  );

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
        nextBillingDate={nextBillingDate}
      />
    </div>
  );
}
