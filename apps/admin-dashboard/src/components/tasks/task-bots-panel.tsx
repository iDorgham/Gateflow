'use client';

import React from 'react';
import {
  Sparkles,
  BookOpen,
  Rocket,
  ChevronRight,
  Zap,
  Activity,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  cn,
} from '@gateflow/ui';

interface TaskBot {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'active' | 'idle' | 'running';
  type: string;
}

interface TaskBotsPanelProps {
  onSelectBot: (botId: string) => void;
  activeBotId?: string;
}

export function TaskBotsPanel({
  onSelectBot,
  activeBotId,
}: TaskBotsPanelProps) {
  const bots: TaskBot[] = [
    {
      id: 'blog-writer',
      name: 'Blog Writer',
      description: 'Generate SEO-optimized blog drafts from trending topics.',
      icon: BookOpen,
      status: 'active',
      type: 'BLOG_WRITER',
    },
    {
      id: 'lp-generator',
      name: 'LP Generator',
      description: 'Create high-converting landing page structures with AI.',
      icon: Rocket,
      status: 'active',
      type: 'LANDING_PAGE_GENERATOR',
    },
  ];

  return (
    <Card className="border-ds-border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden border-dashed">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
            <Sparkles className="h-4 w-4 text-ds-icon-brand" />
            AI Task Bots
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-widest px-1.5 h-4"
          >
            System Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {bots.map((bot) => {
          const isActive = activeBotId === bot.id;
          return (
            <button
              key={bot.id}
              onClick={() => onSelectBot(bot.id)}
              className={cn(
                'w-full group relative flex items-start gap-3 p-3 rounded-xl transition-all duration-300 text-left border border-transparent hover:border-ds-border-brand/30 hover:bg-ds-background-brand-subtle',
                isActive
                  ? 'bg-ds-background-brand-subtle border-ds-border-brand/40 shadow-inner'
                  : 'bg-muted/30'
              )}
            >
              <div
                className={cn(
                  'shrink-0 h-10 w-10 rounded-lg flex items-center justify-center transition-colors shadow-sm',
                  isActive
                    ? 'bg-ds-background-brand-bold text-ds-icon-inverse'
                    : 'bg-ds-background-neutral text-ds-icon-subtle group-hover:bg-ds-background-brand-bold group-hover:text-ds-icon-inverse'
                )}
              >
                <bot.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-[11px] font-black uppercase tracking-tight',
                      isActive ? 'text-ds-text-brand' : 'text-ds-text'
                    )}
                  >
                    {bot.name}
                  </span>
                  {isActive && (
                    <Zap className="h-3 w-3 text-ds-icon-brand animate-pulse" />
                  )}
                </div>
                <p className="text-[10px] text-ds-text-subtle font-bold line-clamp-2 leading-snug">
                  {bot.description}
                </p>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 shrink-0 self-center transition-transform',
                  isActive
                    ? 'text-ds-icon-brand translate-x-0.5'
                    : 'text-ds-icon-disabled group-hover:text-ds-icon-subtle'
                )}
              />

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-ds-background-brand-bold rounded-r-full" />
              )}
            </button>
          );
        })}

        <div className="pt-2 border-t border-border/30 mt-2">
          <Button
            variant="ghost"
            className="w-full justify-between h-8 text-[9px] font-black uppercase tracking-widest text-ds-text-subtler hover:text-ds-text hover:bg-muted/50"
          >
            <span className="flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              View Run History
            </span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
