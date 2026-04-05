'use client';

import * as React from 'react';
import { cn } from '@gateflow/ui';
import { MessageAvatar } from './MessageAvatar';
import { StreamingIndicator } from './StreamingIndicator';

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role: 'user' | 'assistant' | 'system';
  content?: string | React.ReactNode;
  isStreaming?: boolean;
  timestamp?: string;
  avatar?: string;
  name?: string;
  actions?: React.ReactNode;
  attachments?: React.ReactNode;
}

export function Message({
  role,
  content,
  isStreaming = false,
  timestamp,
  avatar,
  name,
  actions,
  attachments,
  className,
  ...props
}: MessageProps) {
  const isAssistant = role === 'assistant';
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'group flex w-full gap-4 py-4 px-2 transition-colors hover:bg-[var(--ds-background-neutral-subtle-hovered)]',
        isAssistant && 'bg-[var(--ds-background-neutral-subtle)]',
        className
      )}
      {...props}
    >
      <div className="flex shrink-0 items-start">
        <MessageAvatar role={role} src={avatar} />
      </div>

      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-tight text-[var(--ds-text)]">
              {name || (isAssistant ? 'GateAI' : isUser ? 'User' : 'System')}
            </span>
            {timestamp && (
              <span className="text-[10px] text-[var(--ds-text-subtle)] font-medium">
                {timestamp}
              </span>
            )}
          </div>
          {actions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {actions}
            </div>
          )}
        </div>

        <div className="relative text-sm text-[var(--ds-text)] leading-relaxed prose prose-slate dark:prose-invert max-w-none">
          {content}
          {isStreaming && (
            <div className="ml-1 inline-flex align-middle">
              <StreamingIndicator />
            </div>
          )}
        </div>

        {attachments && <div className="mt-2">{attachments}</div>}
      </div>
    </div>
  );
}

Message.displayName = 'Message';
