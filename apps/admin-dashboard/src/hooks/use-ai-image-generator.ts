import { useState } from 'react';

export function useAIImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateImage = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/cms/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('Failed to generate image');
      const data = await response.json();
      setImageUrl(data.imageUrl);
      return data.imageUrl;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateImage, isGenerating, imageUrl };
}
