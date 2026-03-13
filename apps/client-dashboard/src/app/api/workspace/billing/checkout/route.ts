import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { getStripeClient, getPriceIdForPlan } from '@gate-access/stripe';
import { Plan } from '@gate-access/types';
import { z } from 'zod';

const CheckoutSchema = z.object({
  plan: z.nativeEnum(Plan),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admins can trigger billing changes
  if (claims.role !== 'TENANT_ADMIN' && claims.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { plan } = CheckoutSchema.parse(body);

    const priceId = getPriceIdForPlan(plan);
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan or missing price ID' }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: claims.orgId },
      select: { email: true, stripeCustomerId: true },
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const stripe = getStripeClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

    const session = await stripe.checkout.sessions.create({
      customer: org.stripeCustomerId || undefined,
      customer_email: org.stripeCustomerId ? undefined : org.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard/workspace/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/workspace/billing?canceled=true`,
      client_reference_id: claims.orgId,
      metadata: {
        organizationId: claims.orgId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe Checkout] Error:', err.message);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
