import React, { useState } from 'react';
import { Dialog, DialogContent } from '@gateflow/ui';
import { Button } from '@gateflow/ui';
import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import { Block } from '../blocks/types';
import { BLOCK_REGISTRY } from '../blocks/registry';

interface PreviewModalProps {
  blocks: Block[];
  isOpen: boolean;
  onClose: () => void;
  locale: 'en' | 'ar';
}

export function PreviewModal({
  blocks,
  isOpen,
  onClose,
  locale,
}: PreviewModalProps) {
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop'
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-[100vw] w-[100vw] h-[100vh] p-0 border-0 rounded-none bg-ds-surface-sunken flex flex-col gap-0">
        <div className="flex items-center justify-between p-4 border-b border-ds-border bg-ds-surface shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <h2 className="font-black uppercase tracking-wider text-sm">
              Preview Mode
            </h2>
          </div>
          <div className="flex gap-1 bg-ds-surface-subtle border border-ds-border rounded-lg p-1">
            <Button
              variant={breakpoint === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setBreakpoint('desktop')}
              className={`h-8 px-2 ${breakpoint === 'desktop' ? 'bg-ds-surface shadow-sm' : ''}`}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={breakpoint === 'tablet' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setBreakpoint('tablet')}
              className={`h-8 px-2 ${breakpoint === 'tablet' ? 'bg-ds-surface shadow-sm' : ''}`}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={breakpoint === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setBreakpoint('mobile')}
              className={`h-8 px-2 ${breakpoint === 'mobile' ? 'bg-ds-surface shadow-sm' : ''}`}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-[100px]"></div> {/* Spacer */}
        </div>

        <div className="flex-1 overflow-auto bg-ds-surface-sunken p-8 flex justify-center">
          <div
            className={`bg-ds-surface shadow-2xl transition-all duration-300 w-full overflow-hidden ${
              breakpoint === 'mobile'
                ? 'max-w-[375px]'
                : breakpoint === 'tablet'
                  ? 'max-w-[768px]'
                  : 'max-w-full'
            }`}
          >
            {blocks.map((block) => {
              const BlockComponent = BLOCK_REGISTRY[block.type]?.component;
              if (!BlockComponent) return null;
              return (
                <BlockComponent
                  key={block.id}
                  block={block}
                  locale={locale}
                  isEditor={false}
                />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
