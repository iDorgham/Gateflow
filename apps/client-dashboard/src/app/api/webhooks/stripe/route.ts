import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import {
  verifyStripeSignature,
  getPlanForPriceId,
  type Stripe,
} from '@gate-access/stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = verifyStripeSignature(body, signature);
  } catch (err: any) {
    console.error(`[Stripe Webhook] Verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.client_reference_id;
        const customerId = session.customer as string;

        if (orgId && customerId) {
          await prisma.organization.update({
            where: { id: orgId },
            data: { stripeCustomerId: customerId },
          });
          console.log(`[Stripe Webhook] Linked org ${orgId} to customer ${customerId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;
        const plan = getPlanForPriceId(priceId);
        const expiresAt = new Date(subscription.current_period_end * 1000);

        await prisma.organization.update({
          where: { stripeCustomerId: customerId },
          data: {
            plan,
            stripeSubscriptionId: subscription.id,
            planExpiresAt: expiresAt,
          },
        });
        console.log(`[Stripe Webhook] Updated subscription for customer ${customerId} to ${plan}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await prisma.organization.update({
          where: { stripeCustomerId: customerId },
          data: {
            plan: 'FREE',
            stripeSubscriptionId: null,
            planExpiresAt: null,
          },
        });
        console.log(`[Stripe Webhook] Canceled subscription for customer ${customerId}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`[Stripe Webhook] Processing error: ${err.message}`);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
