'use client';

import * as React from 'react';
import { cn, Avatar, AvatarFallback, AvatarImage } from '@gateflow/ui';
import { Sparkles, User } from 'lucide-react';

export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  role: 'user' | 'assistant' | 'system';
  src?: string;
  fallback?: string;
}

export function MessageAvatar({
  role,
  src,
  fallback,
  className,
  ...props
}: MessageAvatarProps) {
  const isAssistant = role === 'assistant';
  const isUser = role === 'user';

  return (
    <Avatar
      className={cn(
        'h-8 w-8 shrink-0 select-none border border-[var(--ds-border-subtle)]',
        isAssistant &&
          'bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)] shadow-sm',
        isUser &&
          'bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)]',
        className
      )}
      {...props}
    >
      {src && <AvatarImage src={src} />}
      <AvatarFallback className="text-[10px] font-black uppercase">
        {isAssistant ? (
          <Sparkles size={14} strokeWidth={2.5} />
        ) : isUser ? (
          fallback || <User size={14} />
        ) : (
          'S'
        )}
      </AvatarFallback>
    </Avatar>
  );
}

MessageAvatar.displayName = 'MessageAvatar';
