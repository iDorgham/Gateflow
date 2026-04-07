'use client';

import {
  cn,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
} from '@gateflow/ui';
import { Sparkles, ScrollText, MessageSquare, X } from 'lucide-react';
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
        isOpen ? 'w-[420px] min-w-[420px] shadow-xl' : 'w-0 min-w-0 border-l-0'
      )}
    >
      <div className={cn('flex h-full flex-col', !isOpen && 'hidden')}>
        <Tabs defaultValue="ai" className="flex h-full flex-col">
          {/* Tab bar */}
          <div
            className="flex h-16 shrink-0 items-center justify-between border-b border-border px-3 py-2 bg-card"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <TabsList className="bg-muted/50 h-11 p-1 gap-1 rounded-xl w-full">
              <TabsTrigger
                value="ai"
                className="flex-1 gap-1.5 px-4 text-[10px] h-9 rounded-lg font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                <Sparkles
                  className="h-3.5 w-3.5 transition-transform group-active:scale-95"
                  aria-hidden="true"
                />
                AI
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="flex-1 gap-1.5 px-4 text-[10px] h-9 rounded-lg font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
                Logs
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex-1 gap-1.5 px-4 text-[10px] h-9 rounded-lg font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
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
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center bg-background">
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
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center bg-background">
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
