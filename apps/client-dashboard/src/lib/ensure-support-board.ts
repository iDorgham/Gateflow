import { prisma } from '@gate-access/db';

const MAX_SERIALIZATION_RETRIES = 3;

function isSerializationFailure(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2034'
  );
}

/**
 * Lazily provision a single SUPPORT board per org for client-dashboard tasks.
 * Retries Prisma P2034 (serialization failure) so concurrent first-time
 * creates don't surface as 500s. TaskBoard still lacks a unique
 * (organizationId, department) constraint — add that in a follow-up migration.
 */
export async function ensureSupportBoard(organizationId: string) {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_SERIALIZATION_RETRIES; attempt++) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const existing = await tx.taskBoard.findFirst({
            where: { organizationId, department: 'SUPPORT' },
          });
          if (existing) return existing;
          return tx.taskBoard.create({
            data: {
              organizationId,
              name: 'General Tasks',
              department: 'SUPPORT',
            },
          });
        },
        { isolationLevel: 'Serializable' }
      );
    } catch (error) {
      lastError = error;
      if (
        !isSerializationFailure(error) ||
        attempt === MAX_SERIALIZATION_RETRIES - 1
      ) {
        throw error;
      }
    }
  }

  throw lastError;
}
