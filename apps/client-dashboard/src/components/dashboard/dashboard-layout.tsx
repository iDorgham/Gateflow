'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Sparkles,
  X,
  Settings,
  Power,
  CreditCard,
  ListTodo
} from 'lucide-react';
import {
  SquaresFour,
  QrCode as QrCodeIcon,
  Record,
  ChartLineUp,
  House,
  Gear,
  Sparkle,
  Users,
  Buildings,
} from '@phosphor-icons/react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { GlobalSearch } from './global-search';
import { AIAssistant } from './ai-assistant';
import { ThemeToggle } from './theme-toggle';
import { ProjectFilterProvider } from '@/context/ProjectFilterContext';
import { Locale } from '@/lib/i18n-config';
import { useRealtimeEvents } from '@/lib/realtime/use-realtime-events';
import { getCsrfToken } from '@/lib/csrf';

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

function SearchHeader({ 
  locale, 
  user,
  projects, 
  currentProjectId,
  handleProjectSwitch,
  isPending
}: { 
  locale: Locale;
  user: DashboardLayoutProps['user'];
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
  handleProjectSwitch: (id: string) => void;
  isPending: boolean;
}) {
  const initials = user.name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-default,#FFFFFF)]/80 px-4 backdrop-blur-md sticky top-0 z-30"
      role="search"
    >
      <div className="flex flex-1 items-center max-w-md">
        <GlobalSearch locale={locale} />
      </div>

      <div className="flex items-center gap-2">
        {/* Project Switcher */}
        {projects.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ds-text-subtlest,#6B778C)]">
              Project
            </span>
            <Select
              value={currentProjectId ?? 'all'}
              onValueChange={handleProjectSwitch}
              disabled={isPending}
            >
              <SelectTrigger className="h-7 w-[140px] bg-[var(--ds-background-neutral-subtle,#F4F5F7)] border-none text-xs font-medium hover:bg-[var(--ds-background-neutral,#DFE1E6)] transition-colors">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all" className="text-xs">All Projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1 rounded-sm p-1 transition-colors hover:bg-[var(--ds-background-subtle,#F4F5F7)] focus-visible:ring-2 focus-visible:ring-[var(--ds-border-selected,#4C9AFF)] outline-none"
              aria-label="Open user menu"
            >
              <Avatar size="xsmall">
                <AvatarFallback className="bg-[var(--ds-background-brand-subtle,#DEEBFF)] text-[var(--ds-text-brand,#0052CC)] text-[9px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3 text-[var(--ds-icon-subtle,#6B778C)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-2">
            <DropdownMenuLabel className="font-normal px-2 py-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-[var(--ds-text,#172B4D)]">{user.name}</p>
                <p className="text-xs text-[var(--ds-text-subtle,#42526E)] truncate">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--ds-border,#DFE1E6)]" />
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/dashboard/settings`} className="flex items-center gap-2 cursor-pointer py-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/dashboard/settings?tab=billing`} className="flex items-center gap-2 cursor-pointer py-2">
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[var(--ds-border,#DFE1E6)]" />
            <DropdownMenuItem
              className="text-[var(--ds-text-danger,#DE350B)] focus:text-[var(--ds-text-danger,#DE350B)] cursor-pointer py-2"
              onClick={() => (window.location.href = `/${locale}/logout`)}
            >
              <Power className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-2 hidden lg:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: SquaresFour, exact: true, i18nKey: 'sidebar.overview' },
  { label: 'GateAI', href: '/dashboard/ai', icon: Sparkle, i18nKey: 'sidebar.gateAi' },
  { label: 'QR Codes', href: '/dashboard/qrcodes', icon: QrCodeIcon, i18nKey: 'sidebar.qrCodes' },
  { label: 'Scan Logs', href: '/dashboard/scans', icon: Record, i18nKey: 'sidebar.scanLogs' },
  { label: 'Gates', href: '/dashboard/gates', icon: House, i18nKey: 'sidebar.gates' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: ChartLineUp, i18nKey: 'sidebar.analytics' },
  { label: 'Settings', href: '/dashboard/settings', icon: Gear, i18nKey: 'sidebar.settings' },
];

const RESIDENTS_ITEMS = [
  { label: 'Contacts', href: '/dashboard/residents/contacts', icon: Users, i18nKey: 'sidebar.contacts' },
  { label: 'Units', href: '/dashboard/residents/units', icon: Buildings, i18nKey: 'sidebar.units' },
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
  const { t } = useTranslation('dashboard');
  const isActive = (href: string, exact?: boolean) => {
    const localized = `/${locale}${href}`;
    return exact ? pathname === localized : pathname === localized || pathname.startsWith(localized + '/');
  };

  const NavItem = ({ 
    item, 
    collapsed, 
    onClick 
  }: { 
    item: { label: string; href: string; icon: React.ElementType; exact?: boolean; i18nKey?: string }; 
    collapsed: boolean;
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    const active = isActive(item.href, item.exact);
    const label = item.i18nKey ? t(item.i18nKey, item.label) : item.label;

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/${locale}${item.href}`}
              onClick={onClick}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors mb-1',
                active 
                  ? 'bg-[#DEEBFF] text-[#0052CC] dark:bg-[#0747A6]/30 dark:text-[#4C9AFF]' 
                  : 'text-[#42526E] dark:text-[#97A0AF] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A]',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon weight={active ? 'fill' : 'regular'} className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={10}>
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
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
      <div className={cn('shrink-0 border-b border-border/50 p-4', isCollapsed ? 'flex justify-center' : 'px-5')}>
        <Link
          href={`/${locale}/dashboard`}
          className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="GateFlow home"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0052CC] text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!isCollapsed && <span className="text-lg font-bold tracking-tight text-[#172B4D] dark:text-[#EBECF0]">GateFlow</span>}
        </Link>
      </div>

      <ScrollArea className="flex-1 py-2">
          <nav className="space-y-0.5 px-3">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B778C] dark:text-[#97A0AF] mb-3 mt-4">
                {t('sidebar.groupMain', 'Main')}
              </p>
            )}
            <NavItem item={NAV_ITEMS[0]} collapsed={isCollapsed} />

            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B778C] dark:text-[#97A0AF] mb-3 mt-8">
                {t('sidebar.groupResidents', 'Residents')}
              </p>
            )}
            <Collapsible defaultOpen className="space-y-1">
              <CollapsibleTrigger
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#42526E] dark:text-[#97A0AF] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring mb-1',
                  isCollapsed && 'justify-center px-0'
                )}
              >
                <Users className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{t('sidebar.groupResidents', 'Residents')}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform [[data-state=open]_&]:rotate-180" />
                  </>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={cn('space-y-1', isCollapsed ? 'mt-1' : 'ml-4 mt-0.5')}>
                  {RESIDENTS_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const label = item.i18nKey ? t(item.i18nKey, item.label) : item.label;
                    return (
                      <TooltipProvider key={item.href} delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/${locale}${item.href}`}
                              className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mb-1',
                                active 
                                  ? 'bg-[#DEEBFF] text-[#0052CC] dark:bg-[#0747A6]/30 dark:text-[#4C9AFF] font-semibold' 
                                  : 'text-[#42526E] dark:text-[#97A0AF] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A]',
                                isCollapsed && 'justify-center px-0'
                              )}
                            >
                              <Icon weight={active ? 'fill' : 'regular'} className="h-5 w-5 shrink-0" />
                              {!isCollapsed && <span>{label}</span>}
                            </Link>
                          </TooltipTrigger>
                          {isCollapsed && (
                            <TooltipContent side="right" sideOffset={10}>
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B778C] dark:text-[#97A0AF] mb-3 mt-8">
                {t('sidebar.groupAccess', 'Access')}
              </p>
            )}
            {NAV_ITEMS.filter((item) => item.href !== '/dashboard' && item.href !== '/dashboard/settings').map((item) => (
              <NavItem key={item.href} item={item} collapsed={isCollapsed} />
            ))}

            {!isCollapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B778C] dark:text-[#97A0AF] mb-3 mt-8">
                {t('sidebar.groupSystem', 'System')}
              </p>
            )}
            <NavItem item={NAV_ITEMS.find(n => n.href === '/dashboard/settings')!} collapsed={isCollapsed} />
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

  const { t } = useTranslation('dashboard');
  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  const isActive = (href: string, exact?: boolean) => {
    const localized = `/${locale}${href}`;
    return exact ? pathname === localized : pathname === localized || pathname.startsWith(localized + '/');
  };

  const NavItem = ({ 
    item, 
    collapsed, 
    onClick 
  }: { 
    item: { label: string; href: string; icon: React.ElementType; exact?: boolean; i18nKey?: string }; 
    collapsed: boolean;
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    const active = isActive(item.href, item.exact);
    const label = item.i18nKey ? t(item.i18nKey, item.label) : item.label;

    return (
      <Link
        href={`/${locale}${item.href}`}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors mb-1',
          active 
            ? 'bg-[#DEEBFF] text-[#0052CC] dark:bg-[#0747A6]/30 dark:text-[#4C9AFF]' 
            : 'text-[#42526E] dark:text-[#97A0AF] hover:bg-[#EBECF0] dark:hover:bg-[#2C333A]',
          collapsed && 'justify-center px-0'
        )}
      >
        <Icon weight={active ? 'fill' : 'regular'} className="h-6 w-6 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRtl ? 'right' : 'left'}
        className="w-72 p-0 border-0 bg-white dark:bg-[#091E42] text-[#172B4D] dark:text-[#EBECF0]"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full pt-6">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 px-5 pb-5 border-b border-border/50" onClick={() => onOpenChange(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0052CC] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#172B4D]">GateFlow</span>
          </Link>
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-0.5 px-3">
              <NavItem
                item={{
                  href: '/dashboard',
                  label: t('sidebar.overview', 'Dashboard'),
                  icon: SquaresFour,
                  exact: true,
                }}
                collapsed={false}
                onClick={() => onOpenChange(false)}
              />
              <div className="py-2">
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B778C] mb-2 mt-4">Residents</p>
                {RESIDENTS_ITEMS.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    collapsed={false}
                    onClick={() => onOpenChange(false)}
                  />
                ))}
              </div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#6B778C] mb-2 mt-4">{t('sidebar.groupSystem', 'System')}</p>
              {NAV_ITEMS.filter((n) => n.href !== '/dashboard').map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  collapsed={false}
                  onClick={() => onOpenChange(false)}
                />
              ))}
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
  useRealtimeEvents();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
  
  const [rightOpen, setRightOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isRtl = locale === 'ar-EG';
  const pathname = usePathname();

  // Dynamic breadcrumbs calculation
  const segments = pathname.split('/').filter(Boolean).slice(1); // skip locale
  const breadcrumbs = segments.map((s, i) => {
    const label = s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
    const href = '/' + locale + '/' + segments.slice(0, i + 1).join('/');
    return { label, href };
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background" dir={isRtl ? 'rtl' : 'ltr'} lang={locale}>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LeftSidebar locale={locale} isCollapsed={leftCollapsed} onToggleCollapse={() => setLeftCollapsed((c) => !c)} isRtl={isRtl} />

        <div className="flex flex-1 min-w-0 flex-col min-h-0 overflow-hidden">
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <SearchHeader 
                locale={locale} 
                user={user}
                projects={projects}
                currentProjectId={currentProjectId}
                handleProjectSwitch={handleProjectSwitch}
                isPending={isPending}
              />
            </div>
          </div>

          <div className="hidden md:block sticky top-0 z-20">
            <SearchHeader 
              locale={locale} 
              user={user}
              projects={projects}
              currentProjectId={currentProjectId}
              handleProjectSwitch={handleProjectSwitch}
              isPending={isPending}
            />
          </div>

          <main className="flex-1 min-h-0 overflow-y-auto p-6 lg:p-10 bg-[var(--ds-surface-sunken,#FAFBFC)]" role="main">
            <ProjectFilterProvider currentProjectId={currentProjectId} projects={projects}>
              <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
              </div>
            </ProjectFilterProvider>
          </main>
        </div>

        <RightSidePanel locale={locale} isOpen={rightOpen} onToggle={() => setRightOpen((o) => !o)} />
      </div>

      <MobileSidebar locale={locale} isOpen={mobileNavOpen} onOpenChange={setMobileNavOpen} isRtl={isRtl} />
    </div>
  );
}
