'use client';

import * as React from 'react';
import { cn, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@gate-access/ui';
import { Sparkles, History, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Locale } from '@/lib/i18n-config';

interface SidePanelProps {
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
  activeTab: 'assistant' | 'notifications';
  onTabChange: (tab: 'assistant' | 'notifications') => void;
  children: React.ReactNode;
  notificationsContent?: React.ReactNode;
  notificationsCount: number;
}

export function SidePanel({
  locale,
  isOpen,
  onToggle,
  activeTab,
  onTabChange,
  children,
  notificationsContent,
  notificationsCount,
}: SidePanelProps) {
  const isRtl = locale === 'ar';

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-l border-border bg-card transition-all duration-300 ease-in-out',
        isOpen ? 'w-[400px]' : 'w-0 border-l-0'
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          'absolute bottom-[38px] -left-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-transform hover:bg-accent',
          !isOpen && 'rotate-180'
        )}
      >
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <div className={cn('flex h-full flex-col overflow-hidden', !isOpen && 'hidden')}>
        <Tabs
          value={activeTab}
          onValueChange={(val) => onTabChange(val as any)}
          className="flex h-full flex-col"
        >
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-2 bg-muted/20">
            <TabsList className="bg-muted/50 h-9 p-1">
              <TabsTrigger value="assistant" className="gap-2 px-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">
                  {isRtl ? 'المساعد' : 'AI Assistant'}
                </span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 px-3 relative">
                <History className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">
                  {isRtl ? 'التنبيهات' : 'Notifications'}
                </span>
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground font-bold">
                    {notificationsCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="assistant" className="flex-1 overflow-hidden m-0">
            {children}
          </TabsContent>

          <TabsContent value="notifications" className="flex-1 overflow-y-auto m-0">
            {notificationsContent}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
