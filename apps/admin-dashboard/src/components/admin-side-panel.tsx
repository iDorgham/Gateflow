'use client';

import {
  cn,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
} from '@gate-access/ui';
import {
  Sparkles,
  ScrollText,
  MessageSquare,
  X,
  ChevronRight,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n/i18n-config';
import { AdminAIAssistant } from './admin-ai-assistant';

interface AdminSidePanelProps {
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidePanel({
  locale: _locale,
  isOpen,
  onToggle,
}: AdminSidePanelProps) {
  const isRtl = _locale === 'ar-EG';

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-l border-ds-border bg-sidebar transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden',
        isOpen
          ? 'w-[420px] min-w-[420px] rounded-l-[32px] shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.5)]'
          : 'w-0 min-w-0 border-l-0'
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
              className="ml-2 h-8 w-8 shrink-0 hover:bg-ds-surface-sunken"
              onClick={onToggle}
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* AI tab — live assistant */}
          <TabsContent
            value="ai"
            className="flex-1 overflow-hidden m-0 border-none"
          >
            <AdminAIAssistant locale={_locale} />
          </TabsContent>

          {/* Logs tab — placeholder */}
          <TabsContent value="logs" className="flex-1 overflow-hidden m-0">
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center bg-ds-background-default">
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-ds-background-brand-subtle/40 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-ds-background-brand-subtle">
                  <ScrollText className="h-8 w-8 text-ds-text-brand" />
                </div>
              </div>
              <div className="max-w-[200px]">
                <p className="text-sm font-black uppercase tracking-tight text-ds-text">
                  Operational Logs
                </p>
                <p className="text-[11px] text-ds-text-subtle mt-1.5 leading-relaxed">
                  Real-time platform events and system heartbeats — coming soon.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Chat tab — placeholder */}
          <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center bg-ds-background-default">
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-ds-background-accent-teal/20 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-ds-background-accent-teal/10 text-ds-text-accent-teal">
                  <MessageSquare className="h-8 w-8" />
                </div>
              </div>
              <div className="max-w-[200px]">
                <p className="text-sm font-black uppercase tracking-tight text-ds-text">
                  Team HQ
                </p>
                <p className="text-[11px] text-ds-text-subtle mt-1.5 leading-relaxed">
                  Collaborative workspace for platform admins — coming soon.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
