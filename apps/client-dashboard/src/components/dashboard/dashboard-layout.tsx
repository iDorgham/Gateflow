'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  QrCode,
  ScanLine,
  BarChart3,
  Settings,
  Power,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Sparkles,
  ListTodo,
  CreditCard,
  Users,
  Home,
  X,
  Building,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Button,
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  Sheet,
  SheetContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gate-access/ui';
import { GlobalSearch } from './global-search';
import { AIAssistant } from './ai-assistant';
import { ThemeToggle } from './theme-toggle';
import { ProjectFilterProvider } from '@/context/ProjectFilterContext';
import { Locale } from '@/lib/i18n-config';

export interface DashboardLayoutProps {
  user: { id: string; name: string; email: string; role: string };
  org: { id: string; name: string; plan: string } | null;
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
  locale: Locale;
  children: React.ReactNode;
  permissions?: Record<string, boolean>;
}

export interface TaskItem {
  id: string;
  label: string;
  done: boolean;
}

function MiniHeader({ user, locale }: { user: DashboardLayoutProps['user']; locale: Locale }) {
  const router = useRouter();
  const initials = user.name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2);

  return (
    <header
      className="flex h-8 shrink-0 items-center justify-end gap-2 border-b border-border/50 bg-muted/30 px-3 md:px-4"
      role="banner"
      aria-label="User and account"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-left outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Open user menu"
          >
            <Avatar className="h-5 w-5 border border-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[120px] truncate text-xs font-medium hidden sm:inline">{user.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/dashboard/settings`} className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/dashboard/settings?tab=billing`} className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between gap-2 cursor-default">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeToggle />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => router.push(`/${locale}/logout`)}
          >
            <Power className="h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function SearchHeader({ locale }: { locale: Locale }) {
  return (
    <div
      className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      role="search"
    >
      <div className="flex flex-1 items-center max-w-xl">
        <GlobalSearch locale={locale} />
      </div>
      <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground" aria-hidden>
        <span>⌘</span>K
      </kbd>
    </div>
  );
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'QR Codes', href: '/dashboard/qrcodes', icon: QrCode },
  { label: 'Scan Logs', href: '/dashboard/scans', icon: ScanLine },
  { label: 'Gates', href: '/dashboard/gates', icon: Home },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const RESIDENTS_ITEMS = [
  { label: 'Contacts', href: '/dashboard/residents/contacts', icon: Users },
  { label: 'Units', href: '/dashboard/residents/units', icon: Building },
];

function LeftSidebar({
  locale,
  isCollapsed,
  onToggleCollapse,
  isRtl,
}: {
  locale: Locale;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isRtl: boolean;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    const localized = `/${locale}${href}`;
    return exact ? pathname === localized : pathname === localized || pathname.startsWith(localized + '/');
  };

  return (
    <aside
      className={cn(
        'hidden md:flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shrink-0 transition-[width] duration-300 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={cn('shrink-0 border-b border-sidebar-border p-3', isCollapsed ? 'flex justify-center' : 'px-4')}>
        <Link
          href={`/${locale}/dashboard`}
          className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          aria-label="GateFlow home"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>
          {!isCollapsed && <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">GateFlow</span>}
        </Link>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          <Link
            href={`/${locale}/dashboard`}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive('/dashboard', true) ? 'bg-primary/10 text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>

          <Collapsible defaultOpen className="space-y-1">
            <CollapsibleTrigger
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Users className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Residents</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform [[data-state=open]_&]:rotate-180" />
                </>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className={cn('space-y-0.5', isCollapsed ? 'mt-1' : 'ml-4 mt-1')}>
                {RESIDENTS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={`/${locale}${item.href}`}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        active ? 'bg-primary/10 text-sidebar-foreground font-medium' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                        isCollapsed && 'justify-center px-2'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {NAV_ITEMS.filter((item) => item.href !== '/dashboard').map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="shrink-0 border-t border-sidebar-border p-2 flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isRtl ? <ChevronRight className={cn('h-4 w-4', isCollapsed && 'rotate-180')} /> : <ChevronLeft className={cn('h-4 w-4', isCollapsed && 'rotate-180')} />}
        </Button>
      </div>
    </aside>
  );
}

function RightSidePanel({
  locale,
  isOpen,
  onToggle,
  tasks: initialTasks = [],
}: {
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
  tasks?: TaskItem[];
}) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const isRtl = locale === 'ar-EG';

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  return (
    <>
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 z-40 h-10 w-10 rounded-full border-2 shadow-lg md:right-6"
          style={isRtl ? { right: 'auto', left: '1.5rem' } : undefined}
          onClick={onToggle}
          aria-label="Open side panel"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      )}

      <div
        className={cn(
          'hidden md:flex h-full flex-col border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out overflow-hidden',
          isOpen ? 'w-[360px] border-l' : 'w-0 border-l-0'
        )}
      >
        {isOpen && (
          <Tabs defaultValue="assistant" className="flex flex-col h-full min-w-0">
            <div className="shrink-0 flex items-center border-b border-sidebar-border px-2 py-2 gap-2">
              <TabsList className="grid grid-cols-2 h-9 bg-sidebar-accent flex-1">
                <TabsTrigger value="assistant" className="gap-2 text-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isRtl ? 'المساعد' : 'AI Assistant'}
                </TabsTrigger>
                <TabsTrigger value="tasks" className="gap-2 text-xs">
                  <ListTodo className="h-3.5 w-3.5" />
                  {isRtl ? 'المهام' : 'Tasks'}
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onToggle} aria-label="Close side panel">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <TabsContent value="assistant" className="flex-1 overflow-hidden m-0 mt-2 min-h-0 data-[state=inactive]:hidden">
              <AIAssistant locale={locale} />
            </TabsContent>
            <TabsContent value="tasks" className="flex-1 overflow-y-auto m-0 mt-2 min-h-0 data-[state=inactive]:hidden">
              <div className="p-4 space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">{isRtl ? 'لا توجد مهام نشطة.' : 'No active tasks.'}</p>
                ) : (
                  tasks.map((task) => (
                    <label
                      key={task.id}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 cursor-pointer transition-colors hover:bg-muted/50',
                        task.done && 'opacity-60 line-through'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className="h-4 w-4 rounded border-input"
                        aria-label={task.label}
                      />
                      <span className="text-sm">{task.label}</span>
                    </label>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}

function MobileSidebar({
  locale,
  isOpen,
  onOpenChange,
  isRtl,
}: {
  locale: Locale;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRtl: boolean;
}) {
  const pathname = usePathname();

  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  const isActive = (href: string, exact?: boolean) => {
    const localized = `/${locale}${href}`;
    return exact ? pathname === localized : pathname === localized || pathname.startsWith(localized + '/');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRtl ? 'right' : 'left'}
        className="w-64 p-0 border-0 bg-sidebar text-sidebar-foreground"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full pt-6">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 px-4 pb-4 border-b border-sidebar-border" onClick={() => onOpenChange(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">GateFlow</span>
          </Link>
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              <Link
                href={`/${locale}/dashboard`}
                className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium', isActive('/dashboard', true) ? 'bg-primary/10' : 'hover:bg-sidebar-accent')}
                onClick={() => onOpenChange(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <div className="py-1">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Residents</p>
                {RESIDENTS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={`/${locale}${item.href}`}
                      className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm', isActive(item.href) ? 'bg-primary/10' : 'hover:bg-sidebar-accent')}
                      onClick={() => onOpenChange(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              {NAV_ITEMS.filter((n) => n.href !== '/dashboard').map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium', isActive(item.href, item.exact) ? 'bg-primary/10' : 'hover:bg-sidebar-accent')}
                    onClick={() => onOpenChange(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DashboardLayout({
  user,
  org: _org,
  projects,
  currentProjectId,
  locale,
  children,
  permissions: _permissions,
}: DashboardLayoutProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isRtl = locale === 'ar-EG';

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background" dir={isRtl ? 'rtl' : 'ltr'} lang={locale}>
      <MiniHeader user={user} locale={locale} />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LeftSidebar locale={locale} isCollapsed={leftCollapsed} onToggleCollapse={() => setLeftCollapsed((c) => !c)} isRtl={isRtl} />

        <div className="flex flex-1 min-w-0 flex-col min-h-0 overflow-hidden">
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background px-4 md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <SearchHeader locale={locale} />
            </div>
          </div>

          <div className="hidden md:block sticky top-0 z-20">
            <SearchHeader locale={locale} />
          </div>

          <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/20" role="main">
            <ProjectFilterProvider currentProjectId={currentProjectId} projects={projects}>
              <div className="animate-in fade-in duration-300">{children}</div>
            </ProjectFilterProvider>
          </main>
        </div>

        <RightSidePanel locale={locale} isOpen={rightOpen} onToggle={() => setRightOpen((o) => !o)} />
      </div>

      <MobileSidebar locale={locale} isOpen={mobileNavOpen} onOpenChange={setMobileNavOpen} isRtl={isRtl} />
    </div>
  );
}
