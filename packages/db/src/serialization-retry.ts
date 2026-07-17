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
 */
export async function withSerializableRetry<T>(
  transactionClient: {
    $transaction: (
      fn: (tx: any) => Promise<T>,
      opts: { isolationLevel: 'Serializable' }
    ) => Promise<T>;
  },
  fn: (tx: any) => Promise<T>,
  maxRetries: number = MAX_SERIALIZATION_RETRIES
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await transactionClient.$transaction(fn, {
        isolationLevel: 'Serializable',
      });
    } catch (error) {
      if (!isSerializationFailure(error) || attempt === maxRetries - 1) {
        throw error;
      }
    }
  }

  // Unreachable: the loop above always returns or throws.
  throw new Error('withSerializableRetry: exhausted retries unexpectedly');
}
