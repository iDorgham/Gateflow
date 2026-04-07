'use client';

import { useState } from 'react';
import { Button, Avatar, AvatarFallback, cn } from '@gateflow/ui';
import { Sidebar } from './Sidebar';
import { AdminSidePanel } from './admin-side-panel';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import type { Locale } from '@/lib/i18n/i18n-config';
import { useTranslation } from 'react-i18next';
import { GlobalSearch } from './GlobalSearch';
import { PanelRight } from 'lucide-react';

interface AdminShellProps {
  locale: Locale;
  children: React.ReactNode;
}

export function AdminShell({ children, locale: _locale }: AdminShellProps) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-full bg-ds-surface-sunken overflow-hidden selection:bg-ds-background-selected/30 selection:text-ds-text-selected sm:antialiased">
      {/* Left/Right Sidebar */}
      <div className="flex h-full shrink-0 border-inline-end border-ds-border bg-ds-surface/40 shadow-sm z-30 ltr:border-r rtl:border-l backdrop-blur-xl">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-ds-border bg-ds-surface/60 px-6 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-ds-text-subtlest truncate">
              {t('admin:shell.core_platform', 'Core Platform')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <GlobalSearch />
            <div className="h-4 w-px bg-ds-border mx-1" />

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher currentLocale={_locale} />

              <div className="flex items-center gap-2 rounded-lg p-1 pl-3 bg-ds-surface border border-ds-border hover:bg-ds-surface-raised transition-all cursor-pointer group ltr:pl-3 rtl:pr-3">
                <span className="max-w-[120px] truncate text-[10px] font-black uppercase tracking-tight text-ds-text-subtle group-hover:text-ds-text">
                  Selena Admin
                </span>
                <Avatar
                  size="small"
                  className="border-2 border-ds-background shadow-sm h-7 w-7"
                >
                  <AvatarFallback className="bg-ds-background-brand-bold text-ds-text-inverse text-[9px] font-black uppercase">
                    SA
                  </AvatarFallback>
                </Avatar>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-lg border transition-all duration-300',
                  isSidePanelOpen
                    ? 'bg-ds-background-brand-bold text-ds-text-inverse border-ds-background-brand-bold shadow-lg shadow-ds-background-brand-bold/20 hover:bg-ds-background-brand-bold/90'
                    : 'bg-ds-surface border-ds-border text-ds-icon-subtle hover:bg-ds-surface-raised'
                )}
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                aria-label="Toggle AI Panel"
              >
                <PanelRight
                  className={cn(
                    'h-4 w-4',
                    !isSidePanelOpen && 'rotate-180 transition-transform'
                  )}
                />
              </Button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 lg:p-8 bg-ds-surface-sunken scroll-smooth custom-scrollbar relative">
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
