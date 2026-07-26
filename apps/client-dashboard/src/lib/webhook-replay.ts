import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@gate-access/db';
import type { Prisma } from '@gate-access/db';

const EVENT_ID_PATTERN = /^[A-Za-z0-9:_-]{8,128}$/;
export const WEBHOOK_FRESHNESS_MS = 5 * 60_000;
const REPLAY_ACTION = 'WEBHOOK_EVENT_PROCESSED';
const REPLAY_ENTITY_TYPE = 'WebhookEvent';

interface WebhookEnvelope {
  eventId: string;
  now?: Date;
  rawBody: string;
  secret: string;
  signature: string;
  timestamp: string;
}

export function verifyWebhookEnvelope({
  eventId,
  now = new Date(),
  rawBody,
  secret,
  signature,
  timestamp,
}: WebhookEnvelope): boolean {
  if (
    !secret ||
    secret.length < 32 ||
    !EVENT_ID_PATTERN.test(eventId) ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const eventTime = Date.parse(timestamp);
  if (
    !Number.isFinite(eventTime) ||
    Math.abs(now.getTime() - eventTime) > WEBHOOK_FRESHNESS_MS
  ) {
    return false;
  }

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${eventId}.${rawBody}`)
    .digest();
  const supplied = Buffer.from(signature, 'hex');
  return (
    supplied.length === expected.length && timingSafeEqual(supplied, expected)
  );
}

interface ReplayContext {
  eventId: string;
  organizationId: string;
  provider: 'perimeter' | 'whatsapp';
}

export async function runReplayProtectedWebhook<T>(
  context: ReplayContext,
  work: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<{ duplicate: true } | { duplicate: false; value: T }> {
  const replayKey = `${context.provider}:${context.organizationId}:${context.eventId}`;

  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${replayKey}))`;

    const existing = await tx.auditLog.findFirst({
      where: {
        action: REPLAY_ACTION,
        entityType: REPLAY_ENTITY_TYPE,
        entityId: context.eventId,
        organizationId: context.organizationId,
        metadata: { path: ['provider'], equals: context.provider },
      },
      select: { id: true },
    });
    if (existing) return { duplicate: true as const };

    const value = await work(tx as unknown as Prisma.TransactionClient);
    await tx.auditLog.create({
      data: {
        action: REPLAY_ACTION,
        entityType: REPLAY_ENTITY_TYPE,
        entityId: context.eventId,
        organizationId: context.organizationId,
        metadata: { provider: context.provider },
      },
    });

    return { duplicate: false as const, value };
  });
}
