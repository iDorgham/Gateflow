import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface AIOperationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  maxRetries?: number;
}

export function useAIOperation<T, P>(
  operation: (params: P) => Promise<T>,
  options: AIOperationOptions<T> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(
    async (params: P) => {
      setIsLoading(true);
      setError(null);
      setRetryCount(0);

      const run = async (currentAttempt: number): Promise<T | null> => {
        try {
          const result = await operation(params);
          setIsLoading(false);
          options.onSuccess?.(result);
          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));

          if (currentAttempt < (options.maxRetries ?? 3)) {
            setRetryCount(currentAttempt + 1);
            console.warn(
              `[AI_RETRY] Attempt ${currentAttempt + 1} failed. Retrying...`
            );
            return run(currentAttempt + 1);
          }

          setIsLoading(false);
          setError(error);
          options.onError?.(error);
          toast.error(`AI Operation Failed: ${error.message}`);
          return null;
        }
      };

      return run(0);
    },
    [operation, options]
  );

  return {
    execute,
    isLoading,
    error,
    retryCount,
    reset: () => {
      setError(null);
      setIsLoading(false);
      setRetryCount(0);
    },
  };
}
