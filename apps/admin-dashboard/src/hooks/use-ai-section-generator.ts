import { useAIOperation } from './use-ai-operation';
import { BlockType } from '../components/cms/blocks/types';

interface GenerateSectionParams {
  prompt: string;
  blockType: BlockType;
}

export function useAISectionGenerator() {
  const { execute, isLoading, error, retryCount } = useAIOperation<
    any,
    GenerateSectionParams
  >(
    async ({ prompt, blockType }) => {
      const response = await fetch('/api/cms/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, blockType }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate section');
      }

      const data = await response.json();
      return data.section;
    },
    {
      maxRetries: 3,
    }
  );

  return { generateSection: execute, isLoading, error, retryCount };
}
