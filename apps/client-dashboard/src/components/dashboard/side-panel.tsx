'use client';

import { useState } from 'react';
import { cn, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@gate-access/ui';
import { ChevronRight, X, Sparkles, ClipboardList, MessageSquare } from 'lucide-react';
import type { Locale } from '@/lib/i18n-config';
import { TasksPanel } from './tasks-panel';
import { TeamChat } from './team-chat';

type PanelTab = 'assistant' | 'tasks' | 'chat';

interface SidePanelProps {
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
  currentUserId: string;
  children: React.ReactNode; // AI assistant
}

export function SidePanel({ locale, isOpen, onToggle, currentUserId, children }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>('assistant');
  const isRtl = locale === 'ar-EG';

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-l border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
        isOpen ? 'w-[400px]' : 'w-0 border-l-0'
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute bottom-[38px] -left-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar shadow-sm transition-transform hover:bg-sidebar-accent',
          !isOpen && 'rotate-180'
        )}
        aria-label={isOpen ? 'Close panel' : 'Open panel'}
      >
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <div className={cn('flex h-full flex-col overflow-hidden', !isOpen && 'hidden')}>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as PanelTab)}
          className="flex h-full flex-col"
        >
          {/* Tab header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2 bg-muted/20" dir={isRtl ? 'rtl' : 'ltr'}>
            <TabsList className="bg-sidebar-accent h-9 p-1 gap-0.5">
              <TabsTrigger value="assistant" className="gap-1.5 px-2.5 text-[11px] font-black uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {isRtl ? 'المساعد' : 'AI'}
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-1.5 px-2.5 text-[11px] font-black uppercase tracking-widest">
                <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                {isRtl ? 'المهام' : 'Tasks'}
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-1.5 px-2.5 text-[11px] font-black uppercase tracking-widest">
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                {isRtl ? 'الدردشة' : 'Chat'}
              </TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onToggle} aria-label="Close panel">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="assistant" className="flex-1 overflow-hidden m-0">
            {children}
          </TabsContent>

          <TabsContent value="tasks" className="flex-1 overflow-hidden m-0">
            <TasksPanel />
          </TabsContent>

          <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
            <TeamChat currentUserId={currentUserId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
