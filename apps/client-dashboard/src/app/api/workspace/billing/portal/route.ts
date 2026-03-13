import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { getStripeClient } from '@gate-access/stripe';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admins can access the billing portal
  if (claims.role !== 'TENANT_ADMIN' && claims.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const org = await prisma.organization.findUnique({
      where: { id: claims.orgId },
      select: { stripeCustomerId: true },
    });

    if (!org?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please subscribe to a plan first.' },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${baseUrl}/dashboard/workspace/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe Portal] Error:', err.message);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
