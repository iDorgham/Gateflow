'use client';

import * as React from 'react';
import { cn, ScrollArea, EmptyState } from '@gateflow/ui';
import { Sparkles } from 'lucide-react';

export interface ConversationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptySubtitle?: string;
  autoScroll?: boolean;
}

export function Conversation({
  children,
  isEmpty = false,
  emptyTitle = 'Start a conversation',
  emptySubtitle = 'Ask GateAI about your workspace, reports, or tasks.',
  autoScroll = true,
  className,
  dir: _dir,
  ...props
}: ConversationProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (autoScroll && scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [children, autoScroll]);

  return (
    <ScrollArea
      ref={scrollRef}
      className={cn('flex flex-col h-full w-full', className)}
      {...props}
    >
      <div className="flex flex-col min-h-full py-4">
        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center py-20 px-6">
            <EmptyState
              icon={Sparkles}
              title={emptyTitle}
              description={emptySubtitle}
              className="max-w-md grayscale opacity-50"
            />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--ds-border-subtle)]">
            {children}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

Conversation.displayName = 'Conversation';
