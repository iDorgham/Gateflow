'use client';

import { useState } from 'react';
import { cn, Badge, Avatar, AvatarFallback } from '@gate-access/ui';
import { PanelRight } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AdminSidePanel } from './admin-side-panel';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './language-switcher';
import type { Locale } from '@/lib/i18n/i18n-config';

interface AdminShellProps {
  locale: Locale;
  children: React.ReactNode;
}

export function AdminShell({ locale, children }: AdminShellProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
          <div />
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
            {/* Panel toggle */}
            <button
              onClick={() => setIsPanelOpen((v) => !v)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors',
                isPanelOpen
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              aria-label={isPanelOpen ? 'Close side panel' : 'Open side panel'}
              title={isPanelOpen ? 'Close side panel' : 'Open side panel'}
            >
              <PanelRight className="h-4 w-4" />
            </button>
            <Badge
              variant="outline"
              className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              Super Admin
            </Badge>
            <Avatar className="h-9 w-9 border-2 border-border shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                SA
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background relative z-0">
          <div className="w-full">{children}</div>
        </main>
      </div>

      {/* Right side panel */}
      <AdminSidePanel
        locale={locale}
        isOpen={isPanelOpen}
        onToggle={() => setIsPanelOpen((v) => !v)}
      />
    </div>
  );
}
