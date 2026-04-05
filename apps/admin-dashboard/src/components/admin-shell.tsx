'use client';

import { useState } from 'react';
import { cn, Avatar, AvatarFallback } from '@gate-access/ui';
import { PanelRight, HelpCircle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AdminSidePanel } from './admin-side-panel';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './language-switcher';
import type { Locale } from '@/lib/i18n/i18n-config';
import { useTranslation } from 'react-i18next';

interface AdminShellProps {
  locale: Locale;
  children: React.ReactNode;
}

export function AdminShell({ locale, children }: AdminShellProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex h-screen overflow-hidden bg-ds-background-default">
      {/* Left sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-ds-border bg-ds-background-default/80 px-6 backdrop-blur-md sticky top-0 z-30">
          <div />
          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />

            <button
              className="flex h-8 w-8 items-center justify-center rounded-sm text-ds-text-subtle hover:bg-ds-background-subtle hover:text-ds-text transition-colors"
              title={t('admin:header.help', 'Help & Resources')}
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            <div className="h-4 w-px bg-ds-border mx-1" />

            {/* Panel toggle */}
            <button
              onClick={() => setIsPanelOpen((v) => !v)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-sm transition-colors',
                isPanelOpen
                  ? 'bg-ds-background-selected text-ds-text-selected'
                  : 'text-ds-text-subtle hover:bg-ds-background-subtle hover:text-ds-text'
              )}
              aria-label={isPanelOpen ? 'Close side panel' : 'Open side panel'}
              title={isPanelOpen ? 'Close side panel' : 'Open side panel'}
            >
              <PanelRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 rounded-sm p-1 hover:bg-ds-background-subtle transition-colors cursor-pointer group ml-1">
              <span className="max-w-[120px] truncate text-xs font-bold hidden sm:inline text-ds-text-subtle group-hover:text-ds-text">
                Selena Admin
              </span>
              <Avatar size="small" className="border border-ds-border">
                <AvatarFallback className="bg-ds-background-brand-subtle text-ds-text-brand text-[9px] font-black uppercase">
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
