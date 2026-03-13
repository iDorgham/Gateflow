import Stripe from 'stripe';
import { Plan } from '@gate-access/types';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

/**
 * Get Stripe client instance.
 * Ensures the secret key is present.
 */
export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  return stripe;
}

/**
 * Map our Plan enum to Stripe Price IDs.
 * These should be defined in environment variables.
 */
export function getPriceIdForPlan(plan: Plan): string | undefined {
  switch (plan) {
    case Plan.PRO:
      return process.env.STRIPE_PRICE_ID_PRO;
    case Plan.ENTERPRISE:
      return process.env.STRIPE_PRICE_ID_ENTERPRISE;
    case Plan.FREE:
    default:
      return undefined;
  }
}

/**
 * Map Stripe Price ID back to our Plan enum.
 */
export function getPlanForPriceId(priceId: string): Plan {
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return Plan.PRO;
  if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) return Plan.ENTERPRISE;
  return Plan.FREE;
}

/**
 * Verify Stripe webhook signature.
 */
export function verifyStripeSignature(payload: string | Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export * from 'stripe';
