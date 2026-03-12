import { prisma, Prisma } from '@gate-access/db';
import { EventType } from '@gate-access/db';

export { EventType };

/**
 * Append an org-scoped event to the EventLog table for SSE consumers.
 *
 * Rules:
 * - Fire-and-forget: never throw, never block the primary request.
 * - Prunes EventLog rows older than 24 h on each write (non-blocking).
 */
export async function emitEvent(
  organizationId: string,
  type: EventType,
  payload: Record<string, unknown> = {}
): Promise<void> {
  try {
    await prisma.eventLog.create({
      data: { organizationId, type, payload: payload as Prisma.InputJsonObject },
    });
    // Prune old events asynchronously — do not await or let it fail the caller
    pruneOldEvents(organizationId).catch((err) => {
      console.error('[emitEvent] pruneOldEvents failed:', err);
    });
  } catch (err) {
    // Event emission must never break the primary request
    console.error('[emitEvent] Failed to write EventLog:', err);
  }
}

async function pruneOldEvents(organizationId: string): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await prisma.eventLog.deleteMany({
    where: { organizationId, createdAt: { lt: cutoff } },
  });
}
