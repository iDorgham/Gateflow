import type { TaskBoard } from '@prisma/client';
import { prisma } from './client';
import { withSerializableRetry } from './serialization-retry';

/**
 * Lazily provision a single TaskBoard per (organizationId, department).
 * Uses upsert against the unique (organizationId, department) constraint so
 * concurrent first-time creates converge on one board. Serializable retry
 * covers residual write skew during the consolidation window.
 */
export async function ensureBoard(
  organizationId: string,
  department: 'SALES' | 'MARKETING' | 'DEV' | 'SUPPORT',
  name: string
): Promise<TaskBoard> {
  return withSerializableRetry(prisma, async (tx) => {
    return tx.taskBoard.upsert({
      where: {
        organizationId_department: { organizationId, department },
      },
      create: { organizationId, name, department },
      update: {},
    }) as Promise<TaskBoard>;
  });
}
