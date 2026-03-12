'use client';

import { cn, Tabs, TabsList, TabsTrigger, TabsContent, Button } from '@gate-access/ui';
import { Sparkles, ScrollText, MessageSquare, X, ChevronRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n/i18n-config';

interface AdminSidePanelProps {
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidePanel({ locale: _locale, isOpen, onToggle }: AdminSidePanelProps) {
  const isRtl = _locale === 'ar-EG';

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-l border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out overflow-hidden',
        isOpen ? 'w-[380px] min-w-[380px]' : 'w-0 min-w-0 border-l-0'
      )}
    >
      {/* Collapse toggle on left edge */}
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

      <div className={cn('flex h-full flex-col', !isOpen && 'hidden')}>
        <Tabs defaultValue="ai" className="flex h-full flex-col">
          {/* Tab bar */}
          <div
            className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2 bg-muted/20"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <TabsList className="bg-sidebar-accent h-10 p-1 gap-0.5">
              <TabsTrigger
                value="ai"
                className="gap-1.5 px-4 text-[11px] font-black uppercase tracking-widest data-[state=active]:text-primary"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                AI
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="gap-1.5 px-4 text-[11px] font-black uppercase tracking-widest data-[state=active]:text-primary"
              >
                <ScrollText className="h-4 w-4" aria-hidden="true" />
                Logs
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="gap-1.5 px-4 text-[11px] font-black uppercase tracking-widest data-[state=active]:text-primary"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Chat
              </TabsTrigger>
            </TabsList>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-8 w-8 shrink-0"
              onClick={onToggle}
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* AI tab — placeholder until Phase 5 */}
          <TabsContent value="ai" className="flex-1 overflow-hidden m-0">
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight text-foreground">
                  GateFlow Admin AI
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Platform assistant — coming in Phase 5
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Logs tab — placeholder */}
          <TabsContent value="logs" className="flex-1 overflow-hidden m-0">
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                <ScrollText className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight text-foreground">
                  Activity Logs
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Admin action log — coming soon
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Chat tab — placeholder */}
          <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                <MessageSquare className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tight text-foreground">
                  Team Chat
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Internal comms — coming soon
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
