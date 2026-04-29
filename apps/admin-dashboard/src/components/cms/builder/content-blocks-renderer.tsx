import React from 'react';
import { BLOCK_REGISTRY } from '../blocks/registry';

interface ContentBlocksRendererProps {
  blocks: any[];
  locale?: 'en' | 'ar';
}

export function ContentBlocksRenderer({
  blocks,
  locale = 'en',
}: ContentBlocksRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {blocks.map((block, index) => {
        const BlockComponent = (BLOCK_REGISTRY as any)[block.type]?.component;
        if (!BlockComponent) return null;

        return (
          <BlockComponent
            key={block.id || index}
            block={block}
            locale={locale}
            isSelected={false}
            isEditor={false}
          />
        );
      })}
    </div>
  );
}
