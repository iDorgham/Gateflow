import Stripe from 'stripe';
import { Plan } from '@gate-access/types';

let stripeInstance: Stripe | null = null;

/**
 * Get Stripe client instance.
 * Ensures the secret key is present and lazily initializes the client.
 */
export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  
  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }
  
  return stripeInstance;
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
  return getStripeClient().webhooks.constructEvent(payload, signature, webhookSecret);
}

export * from 'stripe';
