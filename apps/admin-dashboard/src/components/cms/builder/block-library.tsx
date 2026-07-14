import React from 'react';
import { BLOCK_REGISTRY } from '../blocks/registry';
import { BlockType } from '../blocks/types';

interface BlockLibraryProps {
  onAddBlock: (type: BlockType) => void;
}

export function BlockLibrary({ onAddBlock }: BlockLibraryProps) {
  const blockTypes = Object.keys(BLOCK_REGISTRY) as BlockType[];

  return (
    <div className="w-72 border-r border-ds-border bg-ds-surface flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-ds-border">
        <h2 className="font-bold text-ds-text">Block Library</h2>
        <p className="text-sm text-ds-text-subtle">Click a block to add it</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {blockTypes.map((type) => {
          const config = BLOCK_REGISTRY[type];
          const Icon = config.icon;
          return (
            <div
              key={type}
              onClick={() => onAddBlock(type)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-ds-border bg-ds-surface-subtle hover:bg-ds-surface-hover hover:border-ds-border-selected cursor-pointer transition-colors group"
            >
              <div className="h-10 w-10 rounded-lg bg-ds-background-neutral flex items-center justify-center group-hover:bg-ds-background-brand-subtle group-hover:text-ds-text-brand transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-ds-text text-center">
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
