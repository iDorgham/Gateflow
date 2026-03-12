'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Sidebar } from './sidebar';

import { LanguageSwitcher } from '../language-switcher';
import { GlobalSearch } from './global-search';
import { SidePanel } from './side-panel';
import { AIAssistant } from './ai-assistant';
import { NotificationDropdown } from './notification-dropdown';
import { ProjectFilterProvider } from '@/context/ProjectFilterContext';
import { getCsrfToken } from '@/lib/csrf';
import { Locale } from '@/lib/i18n-config';
import { useRealtimeEvents } from '@/lib/realtime/use-realtime-events';
import {
  SheetContent,
  Button,
  Sheet,
} from '@gate-access/ui';
import {
  Sparkles,
  Menu,
  ChevronsUpDown,
} from 'lucide-react';
import { cn } from '@gate-access/ui';
import { HeaderUserMenu } from './header-user-menu';

interface ExpiredQR {
  id: string;
  code: string;
  expiresAt: string;
  gateName: string | null;
}

export interface DashboardShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  org: {
    id: string;
    name: string;
    plan: string;
  } | null;
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
  locale: Locale;
  children: React.ReactNode;
  hideGates?: boolean;
  permissions?: Record<string, boolean>;
}

function MiniHeader({ locale }: { locale: Locale }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString(locale === 'ar-EG' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = time.toLocaleTimeString(locale === 'ar-EG' ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="bg-primary px-4 py-1 flex justify-between items-center text-[10px] text-primary-foreground font-medium z-40">
      <div className="flex items-center gap-4 opacity-90 tracking-wide" suppressHydrationWarning>
        <span className="uppercase" suppressHydrationWarning>{dateStr}</span>
        <span className="font-mono tabular-nums" suppressHydrationWarning>{timeStr}</span>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher currentLocale={locale} variant="mini" />
      </div>
    </div>
  );
}

export function DashboardShell({
  user,
  org,
  projects,
  currentProjectId,
  locale,
  children,
  hideGates,
  permissions,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [expiredQRs, setExpiredQRs] = useState<ExpiredQR[]>([]);

  // Open a single SSE connection for this tab; invalidates TanStack Query
  // caches on org-scoped events so all pages stay live without page reloads.
  useRealtimeEvents();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const fetchExpiredQRs = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/expired-qrs');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setExpiredQRs(json.items);
      }
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    fetchExpiredQRs();
  }, [fetchExpiredQRs]);


  const handleProjectSwitch = (projectId: string) => {
    const val = projectId === 'all' ? 'all' : projectId;
    const csrfToken = getCsrfToken() || '';

    fetch('/api/project/switch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken
      },
      body: JSON.stringify({ projectId: val }),
    }).then(() => {
      startTransition(() => {
        if (val === 'all') {
          router.push(`/${locale}/dashboard`);
        } else {
          router.push(`/${locale}/dashboard/projects/${projectId}`);
        }
      });
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Global mini header spanning sidebar + content */}
      <MiniHeader locale={locale} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left sidebar - matches content height below mini header */}
        <div
          className={cn(
            'hidden md:flex h-full shrink-0 transition-all duration-300 ease-in-out',
            isCollapsed ? 'w-20' : 'w-64'
          )}
        >
          <Sidebar
            user={user}
            org={org}
            projects={projects}
            currentProjectId={currentProjectId}
            locale={locale}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            hideGates={hideGates}
            permissions={permissions}
          />
        </div>

        {/* Right side: main header + content */}
        <div className="flex flex-1 min-h-0 flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border bg-sidebar text-sidebar-foreground px-4 md:px-6 shadow-sm z-30">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex flex-1 max-w-md">
                <GlobalSearch locale={locale} />
              </div>

              {/* Project Switcher */}
              {projects.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 relative">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 line-clamp-1">
                    Project
                  </span>
                  <div className="relative w-40">
                    <select
                      value={currentProjectId ?? 'all'}
                      onChange={(e) => handleProjectSwitch(e.target.value)}
                      disabled={isPending}
                      className="w-full appearance-none rounded-md bg-secondary/50 border border-border/50 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 transition-all hover:bg-secondary px-3 py-1.5 h-8"
                    >
                      <option value="all">All Projects</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground opacity-50" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="sm:hidden flex items-center">
                <GlobalSearch locale={locale} />
              </div>
              {/* Notification bell (header) */}
              <NotificationDropdown items={expiredQRs} locale={locale} />
              {/* AI Assistant toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'relative text-muted-foreground hover:text-foreground transition-colors',
                  isSidePanelOpen && 'text-primary bg-primary/10'
                )}
                onClick={() => setIsSidePanelOpen((v) => !v)}
                aria-label="Toggle AI Assistant"
              >
                <Sparkles className="h-[17px] w-[17px]" />
              </Button>
              <HeaderUserMenu
                user={user}
                org={org}
                locale={locale}
              />
            </div>
          </header>

        <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Mobile Sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="p-0 border-0 w-64"
            aria-label="Mobile navigation"
          >
            <Sidebar
              user={user}
              org={org}
              projects={projects}
              currentProjectId={currentProjectId}
              locale={locale}
              isCollapsed={false}
              onToggleCollapse={() => setMobileOpen(false)}
              hideGates={hideGates}
              permissions={permissions}
            />
          </SheetContent>
        </Sheet>

        {/* Page content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 bg-muted/20 flex flex-col">
          <div
            className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full flex-1 flex flex-col"
          >
            <ProjectFilterProvider
              currentProjectId={currentProjectId}
              projects={projects}
            >
              {children}
            </ProjectFilterProvider>
          </div>
        </main>

          <SidePanel
            locale={locale}
            isOpen={isSidePanelOpen}
            onToggle={() => setIsSidePanelOpen((v) => !v)}
            currentUserId={user.id}
          >
            <AIAssistant locale={locale} />
          </SidePanel>
        </div>
        </div>
      </div>
    </div>
  );
}
