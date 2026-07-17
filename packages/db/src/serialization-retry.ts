export const MAX_SERIALIZATION_RETRIES = 3;

export function isSerializationFailure(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2034'
  );
}

/**
 * Run `fn` inside a Serializable-isolation transaction, retrying on Prisma
 * P2034 (serialization failure) so a losing concurrent transaction gets a
 * second attempt instead of surfacing as a 500 to the caller.
 *
 * `client` is loosely typed because the app's Prisma client is Accelerate-
 * extended and its `$transaction` signature does not match stock PrismaClient.
 */
export async function withSerializableRetry<T>(
  client: {
    $transaction: (
      fn: (tx: any) => Promise<T>,
      opts: { isolationLevel: 'Serializable' }
    ) => Promise<T>;
  },
  fn: (tx: any) => Promise<T>,
  maxRetries: number = MAX_SERIALIZATION_RETRIES
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.$transaction(fn, {
        isolationLevel: 'Serializable',
      });
    } catch (error) {
      lastError = error;
      if (!isSerializationFailure(error) || attempt === maxRetries - 1) {
        throw error;
      }
    }
  }

  throw lastError;
}
