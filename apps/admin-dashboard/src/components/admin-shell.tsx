'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@gate-access/ui';
import { Sidebar } from './Sidebar';
import { AdminSidePanel } from './admin-side-panel';
import { LanguageSwitcher } from './language-switcher';
import type { Locale } from '@/lib/i18n/i18n-config';
import { useTranslation } from 'react-i18next';
import { GlobalSearch } from './GlobalSearch';

interface AdminShellProps {
  locale: Locale;
  children: React.ReactNode;
}

export function AdminShell({ children, locale: _locale }: AdminShellProps) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-foreground">
      {/* Left Sidebar */}
      <div className="flex h-full shrink-0 border-r border-ds-border bg-ds-background-default shadow-xl z-30">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-ds-border bg-background px-6 sticky top-0 z-20">
          <div className="flex items-center gap-1.5 min-w-0">
            <h1 className="text-sm font-black uppercase tracking-widest text-ds-text-subtlest truncate">
              {t('admin:shell.core_platform', 'Core Platform')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <GlobalSearch />
            <div className="h-4 w-px bg-ds-border mx-1" />

            <div className="flex items-center gap-3">
              <LanguageSwitcher currentLocale={_locale} />

              <div className="flex items-center gap-2 rounded-full p-1 pl-3 bg-ds-background-neutral-subtle border border-ds-border hover:bg-ds-background-neutral transition-all cursor-pointer group">
                <span className="max-w-[120px] truncate text-[11px] font-black uppercase tracking-tight text-ds-text-subtle group-hover:text-ds-text">
                  Selena Admin
                </span>
                <Avatar
                  size="small"
                  className="border-2 border-ds-background-default shadow-sm h-7 w-7"
                >
                  <AvatarFallback className="bg-ds-background-brand-bold text-white text-[9px] font-black uppercase">
                    SA
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-background scroll-smooth custom-scrollbar relative">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </main>
      </div>

      {/* Right Side Panel */}
      <div className="shrink-0 h-full">
        <AdminSidePanel
          locale={_locale}
          isOpen={isSidePanelOpen}
          onToggle={() => setIsSidePanelOpen(!isSidePanelOpen)}
        />
      </div>
    </div>
  );
}
