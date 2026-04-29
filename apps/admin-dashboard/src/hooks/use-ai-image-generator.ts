import { useState } from 'react';
import { useAIOperation } from './use-ai-operation';

export function useAIImageGenerator() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { execute, isLoading, error, retryCount } = useAIOperation<
    string,
    string
  >(
    async (prompt) => {
      const response = await fetch('/api/cms/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      return data.imageUrl;
    },
    {
      maxRetries: 3,
    }
  );

  return {
    generateImage: execute,
    isGenerating: isLoading,
    imageUrl,
    error,
    retryCount,
  };
}
