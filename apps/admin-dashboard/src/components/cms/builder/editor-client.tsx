'use client';

import React, { useState } from 'react';
import { Button } from '@gateflow/ui';
import { ArrowLeft, Save, Eye, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Block, BlockType } from '../blocks/types';
import { BLOCK_REGISTRY } from '../blocks/registry';
import { BlockLibrary } from './block-library';
import { Canvas } from './canvas';
import { StylePanel } from './style-panel';
import { BreakpointControls } from './breakpoint-controls';

export function EditorClient({
  initialBlocks = [],
  locale = 'en',
  pageId,
}: {
  initialBlocks: Block[];
  locale: 'en' | 'ar';
  pageId: string;
}) {
  const router = useRouter();

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleAddBlock = (type: BlockType) => {
    const config = BLOCK_REGISTRY[type];
    const newBlock: Block = {
      id: `${type}_${Date.now()}`,
      type,
      content: {
        en: { ...config.defaultContent },
        ar: { ...config.defaultContent },
      },
      styles: {},
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlockContent = (id: string, key: string, value: any) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          content: {
            ...b.content,
            [locale]: {
              ...b.content[locale],
              [key]: value,
            },
          },
        };
      })
    );
  };

  const handleUpdateBlockStyle = (id: string, key: string, value: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          styles: {
            ...b.styles,
            [key]: value,
          },
        };
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Mock save
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success('Page saved successfully!');
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-ds-surface-sunken">
      {/* Top Toolbar */}
      <div className="h-14 shrink-0 bg-ds-surface border-b border-ds-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-bold text-sm">Editing: {pageId}</h1>
            <span className="text-xs text-ds-text-subtle">Saved just now</span>
          </div>
        </div>

        <BreakpointControls breakpoint={breakpoint} onChange={setBreakpoint} />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-ds-surface-subtle border border-ds-border rounded-md mr-4 text-xs font-medium uppercase tracking-wider text-ds-text-subtle">
            <Globe className="h-3 w-3" />
            {locale === 'en' ? 'English' : 'Arabic'}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
          >
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Block Library */}
        <BlockLibrary onAddBlock={handleAddBlock} />

        {/* Center Canvas */}
        <div
          className="flex-1 overflow-hidden"
          onClick={() => setSelectedBlockId(null)}
        >
          <Canvas
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            breakpoint={breakpoint}
            locale={locale}
            onSelectBlock={(id) => setSelectedBlockId(id)}
            onReorderBlocks={setBlocks}
            onUpdateBlock={handleUpdateBlockContent}
          />
        </div>

        {/* Right Sidebar - Style Panel */}
        {selectedBlock && (
          <StylePanel
            block={selectedBlock}
            onUpdateStyle={(k, v) =>
              handleUpdateBlockStyle(selectedBlock.id, k, v)
            }
          />
        )}
      </div>
    </div>
  );
}
