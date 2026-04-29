import React from 'react';
import { Block } from '../blocks/types';
import {
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
} from '@gateflow/ui';
import { token } from '../blocks/types';
import { Sparkles, X } from 'lucide-react';

interface StylePanelProps {
  block: Block;
  onUpdateStyle: (key: string, value: string) => void;
}

export function StylePanel({ block, onUpdateStyle }: StylePanelProps) {
  const { styles } = block;

  const bgPresets = [
    { label: 'Transparent', value: 'transparent' },
    { label: 'Default', value: token('ds.background.default') },
    { label: 'Neutral', value: token('ds.background.neutral') },
    { label: 'Neutral Subtle', value: token('ds.background.neutral.subtle') },
    { label: 'Brand', value: token('ds.background.brand.bold') },
    { label: 'Brand Subtle', value: token('ds.background.brand.subtle') },
  ];

  const textPresets = [
    { label: 'Default', value: token('ds.text') },
    { label: 'Subtle', value: token('ds.text.subtle') },
    { label: 'Inverse', value: token('ds.text.inverse') },
    { label: 'Brand', value: token('ds.text.brand') },
  ];

  const spacePresets = [
    { label: 'None', value: '0' },
    { label: '100 (8px)', value: token('ds.space.100') },
    { label: '200 (16px)', value: token('ds.space.200') },
    { label: '300 (24px)', value: token('ds.space.300') },
    { label: '400 (32px)', value: token('ds.space.400') },
    { label: '500 (40px)', value: token('ds.space.500') },
    { label: '600 (48px)', value: token('ds.space.600') },
    { label: '800 (64px)', value: token('ds.space.800') },
    { label: '1000 (80px)', value: token('ds.space.1000') },
  ];

  return (
    <div className="w-80 border-l border-ds-border bg-ds-surface flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-ds-border">
        <h2 className="font-bold text-ds-text">Style Panel</h2>
        <p className="text-sm text-ds-text-subtle">Editing {block.type}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Colors */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-ds-text-subtle">
            Colors
          </h3>
          <div className="space-y-2">
            <Label className="text-xs">Background</Label>
            <Select
              value={styles.backgroundColor || 'transparent'}
              onValueChange={(val) => onUpdateStyle('backgroundColor', val)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bgPresets.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Text Color</Label>
            <Select
              value={styles.textColor || token('ds.text')}
              onValueChange={(val) => onUpdateStyle('textColor', val)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {textPresets.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Layout */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-ds-text-subtle">
            Layout
          </h3>
          <div className="space-y-2">
            <Label className="text-xs">Background Image</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
              >
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8 text-ds-text-brand border-ds-border-brand/30 hover:bg-ds-background-brand-subtle"
                onClick={async () => {
                  const prompt = window.prompt(
                    'Describe the background image you want to generate:'
                  );
                  if (prompt) {
                    try {
                      const res = await fetch('/api/cms/generate-image', {
                        method: 'POST',
                        body: JSON.stringify({ prompt }),
                      });
                      const data = await res.json();
                      if (data.imageUrl) {
                        onUpdateStyle(
                          'backgroundImage',
                          `url(${data.imageUrl})`
                        );
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
              >
                <Sparkles className="h-3 w-3 mr-1" /> AI Generate
              </Button>
            </div>
            {styles.backgroundImage && (
              <div className="mt-2 relative h-20 rounded-md overflow-hidden border border-ds-border">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: styles.backgroundImage }}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => onUpdateStyle('backgroundImage', '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Text Align</Label>
            <Select
              value={styles.textAlign || 'start'}
              onValueChange={(val) => onUpdateStyle('textAlign', val)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start (Left)</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End (Right)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Spacing */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-ds-text-subtle">
            Spacing
          </h3>
          <div className="space-y-2">
            <Label className="text-xs">Padding Block (Top/Bottom)</Label>
            <Select
              value={styles.paddingBlock || token('ds.space.400')}
              onValueChange={(val) => onUpdateStyle('paddingBlock', val)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spacePresets.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Padding Inline (Left/Right)</Label>
            <Select
              value={styles.paddingInline || token('ds.space.200')}
              onValueChange={(val) => onUpdateStyle('paddingInline', val)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spacePresets.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
