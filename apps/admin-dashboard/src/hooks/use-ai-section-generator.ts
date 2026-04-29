import { useState } from 'react';
import { BlockType } from '../components/cms/blocks/types';

interface GenerateSectionParams {
  prompt: string;
  blockType: BlockType;
}

export function useAISectionGenerator() {
  const [isLoading, setIsLoading] = useState(false);

  const generateSection = async ({
    prompt,
    blockType,
  }: GenerateSectionParams) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cms/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, blockType }),
      });
      if (!response.ok) throw new Error('Failed to generate section');
      const data = await response.json();
      return data.section;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateSection, isLoading };
}
