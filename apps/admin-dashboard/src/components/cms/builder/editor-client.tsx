'use client';

import React, { useState } from 'react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@gateflow/ui';
import { ArrowLeft, Save, Eye, Globe, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Block, BlockType } from '../blocks/types';
import { BLOCK_REGISTRY } from '../blocks/registry';
import { BlockLibrary } from './block-library';
import { Canvas } from './canvas';
import { StylePanel } from './style-panel';
import { BreakpointControls } from './breakpoint-controls';
import { AISectionGenerator } from './ai-section-generator';
import { PreviewModal } from './preview-modal';
import { PublishDialog } from './publish-dialog';
import { VersionHistory, Version } from '../version-history';

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Mock versions
  const [versions] = useState<Version[]>([
    {
      id: 'v2',
      version: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      createdBy: { id: 'u1', name: 'Yasser D.' },
      changes: ['Updated Hero headline', 'Added features section'],
      isAiGenerated: true,
      content: initialBlocks,
    },
    {
      id: 'v1',
      version: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      createdBy: { id: 'u1', name: 'Yasser D.' },
      changes: ['Initial page creation'],
      isAiGenerated: false,
      content: initialBlocks.slice(0, 1),
    },
  ]);

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

  const handleRestoreVersion = (version: Version) => {
    setBlocks(version.content);
    setIsHistoryOpen(false);
    toast.success(`Restored to version ${version.version}`);
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
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsHistoryOpen(true)}
          >
            <History className="h-4 w-4" /> History
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => setIsPublishOpen(true)}
            disabled={isSaving}
            className="gap-2 bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Block Library */}
        <div className="w-72 shrink-0 flex flex-col border-r border-ds-border bg-ds-surface h-full">
          <div className="flex-1 overflow-y-auto">
            <BlockLibrary onAddBlock={handleAddBlock} />
          </div>
          <div className="p-4 border-t border-ds-border">
            <AISectionGenerator
              blockType="HERO" // Defaulting to HERO for now, could be dynamic
              onInsert={(content) => {
                const newBlock: Block = {
                  id: `AI_${Date.now()}`,
                  type: 'HERO',
                  content,
                  styles: {},
                  metadata: { aiGenerated: true },
                };
                setBlocks([...blocks, newBlock]);
                setSelectedBlockId(newBlock.id);
                toast.success('AI section added!');
              }}
            />
          </div>
        </div>

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

      <PreviewModal
        blocks={blocks}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        locale={locale}
      />

      <PublishDialog
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        aiGeneratedCount={blocks.filter((b) => b.metadata?.aiGenerated).length}
        onConfirm={async () => {
          setIsSaving(true);
          try {
            const res = await fetch(`/api/cms/landing-pages/${pageId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ confirmed: true, blocks }),
            });
            if (res.ok) {
              toast.success('Landing page published successfully!');
              setIsPublishOpen(false);
            } else {
              toast.error('Failed to publish');
            }
          } finally {
            setIsSaving(false);
          }
        }}
      />

      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <SheetContent side="right" className="w-[350px] p-0 sm:max-w-none">
          <VersionHistory
            contentId={pageId}
            versions={versions}
            onRestore={handleRestoreVersion}
            onView={(v) => {
              setBlocks(v.content);
              setIsHistoryOpen(false);
              toast.info(`Viewing version ${v.version} (Preview Mode)`);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
