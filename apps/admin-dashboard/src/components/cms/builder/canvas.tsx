import React from 'react';
import { Reorder } from 'framer-motion';
import { Block } from '../blocks/types';
import { BLOCK_REGISTRY } from '../blocks/registry';
import { GripVertical } from 'lucide-react';

interface CanvasProps {
  blocks: Block[];
  selectedBlockId: string | null;
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  locale: 'en' | 'ar';
  onSelectBlock: (id: string) => void;
  onReorderBlocks: (blocks: Block[]) => void;
  onUpdateBlock: (id: string, key: string, value: any) => void;
}

export function Canvas({
  blocks,
  selectedBlockId,
  breakpoint,
  locale,
  onSelectBlock,
  onReorderBlocks,
  onUpdateBlock,
}: CanvasProps) {
  const getContainerWidth = () => {
    switch (breakpoint) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="flex-1 bg-ds-surface-sunken overflow-y-auto flex justify-center p-4 md:p-8">
      <div
        className={`w-full bg-ds-surface shadow-md transition-all duration-300 rounded-lg overflow-hidden flex flex-col ${getContainerWidth()}`}
        style={{ minHeight: '80vh' }}
      >
        <Reorder.Group
          axis="y"
          values={blocks}
          onReorder={onReorderBlocks}
          className="flex flex-col min-h-full"
        >
          {blocks.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-ds-text-subtle p-12 text-center">
              <div>
                <p className="text-lg font-medium mb-2">Canvas is empty</p>
                <p className="text-sm">
                  Drag and drop blocks from the library to build your page.
                </p>
              </div>
            </div>
          )}
          {blocks.map((block) => {
            const BlockComponent = BLOCK_REGISTRY[block.type]?.component;
            if (!BlockComponent) return null;

            return (
              <Reorder.Item
                key={block.id}
                value={block}
                className="relative group outline-none"
              >
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-ds-surface border border-ds-border rounded shadow-sm p-1"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4 text-ds-icon-subtle" />
                </div>

                <div
                  onClick={() => onSelectBlock(block.id)}
                  className={`relative ${selectedBlockId === block.id ? 'ring-2 ring-ds-border-selected ring-inset z-0' : 'hover:ring-2 hover:ring-ds-border-selected/50 hover:ring-inset'}`}
                >
                  <BlockComponent
                    block={block}
                    locale={locale}
                    isSelected={selectedBlockId === block.id}
                    isEditor={true}
                    onContentChange={(key: string, value: any) =>
                      onUpdateBlock(block.id, key, value)
                    }
                  />
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
}
