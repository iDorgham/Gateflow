'use client';

import { useState } from 'react';
import { Button, Avatar, AvatarFallback, cn } from '@gate-access/ui';
import { Sidebar } from './Sidebar';
import { AdminSidePanel } from './admin-side-panel';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import type { Locale } from '@/lib/i18n/i18n-config';
import { useTranslation } from 'react-i18next';
import { GlobalSearch } from './GlobalSearch';
import { PanelRight, HelpCircle, Shield, Building2 } from 'lucide-react';

interface AdminShellProps {
  locale: Locale;
  children: React.ReactNode;
}

import { useOrganization } from './providers/OrganizationProvider';

export function AdminShell({ children, locale: _locale }: AdminShellProps) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const { t } = useTranslation();
  const { organization } = useOrganization();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-foreground sm:antialiased">
      {/* Left/Right Sidebar */}
      <div className="flex h-full shrink-0 border-inline-end border-ds-border bg-sidebar/40 shadow-sm z-30 ltr:border-r rtl:border-l backdrop-blur-xl">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-1.5 min-w-0">
            <h1 className="text-sm font-black uppercase tracking-widest text-ds-text-subtlest truncate flex items-center gap-2">
              {organization ? (
                <>
                  <Building2 className="h-4 w-4 text-ds-text-brand" />
                  <span className="text-ds-text-brand">{organization.name}</span>
                  <span className="opacity-30">/</span>
                  <span className="text-ds-text-subtlest">{t('admin:shell.org_dashboard', 'Organization')}</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 text-ds-text-subtlest" />
                  <span>{t('admin:shell.core_platform', 'Global Platform')}</span>
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <GlobalSearch />
            <div className="h-4 w-px bg-ds-border mx-1" />

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher currentLocale={_locale} />
              
              <div className="h-4 w-px bg-ds-border mx-1" />

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-lg border transition-all duration-300',
                  isSidePanelOpen
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:bg-primary/90'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
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

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 rounded-lg p-1 pl-3 bg-card border border-border hover:bg-muted transition-all cursor-pointer group ltr:pl-3 rtl:pr-3">
                <Avatar
                  size="small"
                  className="border-2 border-background shadow-sm h-7 w-7"
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
          {children}
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
