import React, { useState } from 'react';
import { Button, Label, Textarea } from '@gateflow/ui';
import { useAISectionGenerator } from '../../../hooks/use-ai-section-generator';
import { BlockType } from '../blocks/types';
import { Sparkles } from 'lucide-react';

interface AISectionGeneratorProps {
  blockType: BlockType;
  onInsert: (content: any) => void;
}

export function AISectionGenerator({
  blockType,
  onInsert,
}: AISectionGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const { generateSection, isLoading } = useAISectionGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const section = await generateSection({ prompt, blockType });
    onInsert(section);
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-ds-surface-subtle border border-ds-border rounded-lg mt-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-ds-text-brand" />
        <Label className="font-bold">AI Section Architect</Label>
      </div>
      <Textarea
        placeholder={`Describe your ${blockType} section...`}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[80px]"
      />
      <Button
        onClick={handleGenerate}
        disabled={isLoading || !prompt.trim()}
        className="w-full bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
      >
        {isLoading ? 'Generating...' : 'Generate with AI'}
      </Button>
    </div>
  );
}
