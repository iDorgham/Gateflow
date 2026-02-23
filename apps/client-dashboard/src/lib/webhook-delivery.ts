/**
 * Webhook Delivery System
 *
 * Delivers events to registered webhook endpoints with:
 *  - HMAC-SHA256 payload signing (X-GateFlow-Signature header)
 *  - Up to 3 attempts with exponential back-off (0 → 1 s → 2 s)
 *  - Full delivery audit trail in WebhookDelivery table
 *
 * Usage (fire-and-forget from API routes):
 *   void deliverWebhookEvent(orgId, 'SCAN_SUCCESS', { ... });
 */

import { createHmac } from 'crypto';
import { prisma } from '@gate-access/db';
import type { WebhookEvent } from '@gate-access/db';
import { decryptField } from './encryption';

const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 10_000;
const RETRY_DELAYS_MS = [0, 1_000, 2_000]; // before attempt 1, 2, 3
const MAX_RESPONSE_BODY = 1_000;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Find all active webhooks subscribed to `event` and deliver concurrently.
 * Errors per webhook are isolated — one failure never blocks others.
 */
export async function deliverWebhookEvent(
  orgId: string,
  event: WebhookEvent,
  payload: Record<string, unknown>
): Promise<void> {
  const webhooks = await prisma.webhook.findMany({
    where: {
      organizationId: orgId,
      isActive: true,
      deletedAt: null,
      events: { has: event },
    },
    select: { id: true, url: true, secret: true },
  });

  if (webhooks.length === 0) return;

  await Promise.allSettled(
    webhooks.map((wh) => attemptDelivery(wh, event, payload))
  );
}

/**
 * Send a single test delivery to a specific webhook.
 * Returns the result synchronously so the UI can display feedback.
 */
export async function testWebhookDelivery(
  webhookId: string,
  orgId: string
): Promise<{
  success: boolean;
  statusCode: number | null;
  body: string | null;
  durationMs: number;
}> {
  const webhook = await prisma.webhook.findFirst({
    where: { id: webhookId, organizationId: orgId, deletedAt: null },
    select: { id: true, url: true, secret: true },
  });

  if (!webhook) {
    return {
      success: false,
      statusCode: null,
      body: 'Webhook not found',
      durationMs: 0,
    };
  }

  const testPayload: Record<string, unknown> = {
    test: true,
    message: 'This is a GateFlow webhook test delivery.',
  };

  const deliveryRecord = await prisma.webhookDelivery.create({
    data: {
      webhookId: webhook.id,
      event: 'QR_SCANNED',
      payload: testPayload as object,
      status: 'PENDING',
    },
  });

  const start = Date.now();
  const result = await sendOnce(
    webhook,
    deliveryRecord.id,
    'QR_SCANNED' as WebhookEvent,
    testPayload,
    1
  );
  const durationMs = Date.now() - start;

  await prisma.webhookDelivery.update({
    where: { id: deliveryRecord.id },
    data: {
      status: result.ok ? 'SUCCESS' : 'FAILED',
      statusCode: result.statusCode,
      responseBody: result.body?.slice(0, MAX_RESPONSE_BODY),
      attemptCount: 1,
      lastAttemptAt: new Date(),
    },
  });

  return {
    success: result.ok,
    statusCode: result.statusCode,
    body: result.body?.slice(0, MAX_RESPONSE_BODY) ?? null,
    durationMs,
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

interface WebhookRef {
  id: string;
  url: string;
  secret: string;
}

interface SendResult {
  ok: boolean;
  statusCode: number | null;
  body: string | null;
  error: string | null;
}

async function attemptDelivery(
  webhook: WebhookRef,
  event: WebhookEvent,
  payload: Record<string, unknown>
): Promise<void> {
  const delivery = await prisma.webhookDelivery.create({
    data: {
      webhookId: webhook.id,
      event,
      payload: payload as object,
      status: 'PENDING',
    },
  });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const delayMs = RETRY_DELAYS_MS[attempt - 1] ?? 0;
    if (delayMs > 0) await sleep(delayMs);

    const result = await sendOnce(
      webhook,
      delivery.id,
      event,
      payload,
      attempt
    );
    const isLast = attempt === MAX_ATTEMPTS;

    if (result.ok) {
      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: 'SUCCESS',
          statusCode: result.statusCode,
          responseBody: result.body?.slice(0, MAX_RESPONSE_BODY),
          attemptCount: attempt,
          lastAttemptAt: new Date(),
        },
      });
      return;
    }

    await prisma.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status: isLast ? 'FAILED' : 'RETRYING',
        statusCode: result.statusCode,
        responseBody: (result.body ?? result.error ?? '').slice(
          0,
          MAX_RESPONSE_BODY
        ),
        attemptCount: attempt,
        lastAttemptAt: new Date(),
      },
    });
  }
}

async function sendOnce(
  webhook: WebhookRef,
  deliveryId: string,
  event: WebhookEvent,
  payload: Record<string, unknown>,
  attempt: number
): Promise<SendResult> {
  // Decrypt the webhook secret
  let decryptedSecret: string;
  try {
    decryptedSecret = decryptField(webhook.secret);
  } catch {
    return {
      ok: false,
      statusCode: null,
      body: null,
      error: 'Failed to decrypt webhook secret',
    };
  }

  const body = JSON.stringify({
    id: deliveryId,
    event,
    attempt,
    timestamp: new Date().toISOString(),
    payload,
  });

  const signature = `sha256=${createHmac('sha256', decryptedSecret).update(body).digest('hex')}`;

  try {
    const resp = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GateFlow-Webhooks/1.0',
        'X-GateFlow-Signature': signature,
        'X-GateFlow-Event': event,
        'X-GateFlow-Delivery': deliveryId,
        'X-GateFlow-Attempt': String(attempt),
      },
      body,
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    });

    const respBody = await resp.text().catch(() => '');

    return {
      ok: resp.ok,
      statusCode: resp.status,
      body: respBody,
      error: null,
    };
  } catch (err) {
    return {
      ok: false,
      statusCode: null,
      body: null,
      error: (err as Error).message,
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
