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
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-default,#FFFFFF)]/80 px-6 backdrop-blur-md sticky top-0 z-30">
          <div />
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
            {/* Panel toggle */}
            <button
              onClick={() => setIsPanelOpen((v) => !v)}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--ds-border,#DFE1E6)] transition-colors',
                isPanelOpen
                  ? 'bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--ds-text-selected,#0052CC)] border-[var(--ds-border-selected,#4C9AFF)]'
                  : 'text-[var(--ds-text-subtle,#42526E)] hover:bg-[var(--ds-background-subtle,#F4F5F7)] hover:text-[var(--ds-text,#172B4D)]'
              )}
              aria-label={isPanelOpen ? 'Close side panel' : 'Open side panel'}
              title={isPanelOpen ? 'Close side panel' : 'Open side panel'}
            >
              <PanelRight className="h-4 w-4" />
            </button>
            <Badge
              variant="outline"
              className="bg-[var(--ds-background-danger-subtle,#FFEBE6)] text-[var(--ds-text-danger,#DE350B)] border-[var(--ds-border-danger,#FF5630)] h-6"
            >
              Super Admin
            </Badge>
            <div className="flex items-center gap-2 rounded-sm p-1 hover:bg-[var(--ds-background-subtle,#F4F5F7)] transition-colors cursor-pointer group">
              <span className="max-w-[120px] truncate text-xs font-medium hidden sm:inline text-[var(--ds-text-subtle,#42526E)]">Selena Admin</span>
              <Avatar size="small" className="border border-[var(--ds-border,#DFE1E6)]">
                <AvatarFallback className="bg-[var(--ds-background-brand-subtle,#DEEBFF)] text-[var(--ds-text-brand,#0052CC)] text-[9px] font-bold">
                  SA
                </AvatarFallback>
              </Avatar>
            </div>
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
