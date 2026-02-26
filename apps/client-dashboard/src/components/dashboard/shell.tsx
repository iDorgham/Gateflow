'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from 'next/link';
import { Sidebar } from './sidebar';

import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from '../language-switcher';
import { GlobalSearch } from './global-search';
import { AIAssistant } from './ai-assistant';
import { ProjectFilterProvider } from '@/context/ProjectFilterContext';
import { getCsrfToken } from '@/lib/csrf';
import { Locale } from '@/lib/i18n-config';
import {
  Avatar,
  AvatarFallback,
  Sheet,
  SheetContent,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gate-access/ui';
import { Toaster } from 'sonner';
import {
  Menu,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react';
import { cn } from '@gate-access/ui';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expiredQRs, setExpiredQRs] = useState<ExpiredQR[]>([]);
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

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

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
        router.refresh();
      });
    });
  };

  return (
    <div className="flex h-[105.3vh] overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden md:flex h-full shrink-0 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <Sidebar
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

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 border-0 w-64"
          aria-label="Mobile navigation"
        >
          <Sidebar
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

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6 shadow-sm">
          <div className="flex items-center gap-4">
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

            {/* Project Switcher in Header */}
            {projects.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 ml-4 relative">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                  Project
                </span>
                <div className="relative w-48">
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

          <div className="flex items-center gap-3">
            <div className="sm:hidden flex items-center">
              <GlobalSearch locale={locale} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Bell className="h-[17px] w-[17px]" />
                  {expiredQRs.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {expiredQRs.length === 0 ? (
                  <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  <>
                    {expiredQRs.map((qr) => (
                      <DropdownMenuItem key={qr.id} asChild>
                        <Link
                          href={`/${locale}/dashboard/qrcodes?q=${encodeURIComponent(qr.code)}`}
                          className="flex flex-col items-start gap-0.5 cursor-pointer"
                        >
                          <span className="font-mono text-xs font-medium">
                            {qr.code}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Expired{' '}
                            {new Date(qr.expiresAt).toLocaleDateString()}
                            {qr.gateName ? ` · ${qr.gateName}` : ''}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${locale}/dashboard/qrcodes`}
                        className="text-xs text-center w-full justify-center cursor-pointer"
                      >
                        View all QR codes
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="h-8 w-[1px] bg-border mx-1" />
            <Link
              href={`/${locale}/dashboard/settings?tab=profile`}
              className="flex items-center gap-3 pl-1 group hover:opacity-80 transition-opacity"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                  {user.name}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground mt-1 capitalize">
                  {user.role.toLowerCase().replace('_', ' ')}
                </span>
              </div>
              <Avatar className="h-9 w-9 border-2 border-border shadow-sm ring-1 ring-primary/5 group-hover:ring-primary/20 transition-all">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-transparent">
          <div
            className="animate-in fade-in slide-in-from-bottom-2 duration-500 w-full"
          >
            <ProjectFilterProvider
              currentProjectId={currentProjectId}
              projects={projects}
            >
              {children}
            </ProjectFilterProvider>
          </div>
        </main>
      </div>

      <Toaster position="bottom-right" richColors />
      <AIAssistant locale={locale} />
    </div>
  );
}
