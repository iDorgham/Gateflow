'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ProjectFilterProvider } from '@/context/ProjectFilterContext';
import { Toaster, toast } from 'sonner';
import { SecurityNotifier } from './realtime/SecurityNotifier';
import { useRealtimeEvents } from '@/lib/realtime/use-realtime-events';
import { csrfFetch } from '@/lib/csrf';
import type { Locale } from '@/lib/i18n-config';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  Sparkles,
  ListTodo,
  MessageSquare,
  Settings,
  CreditCard,
  Power,
  X,
  Wrench,
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
  Stack,
  Pulse,
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
} from '@gateflow/ui';
import { useTranslation } from 'react-i18next';
import { GlobalSearch } from './global-search';
import { AIAssistant } from './ai-assistant';
import { LanguageSwitcher } from '../language-switcher';
import { ThemeToggle } from './theme-toggle';
import { TeamSidebarChat } from './team/TeamSidebarChat';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useOrganizationFeatures } from '@/context/OrganizationFeaturesContext';
import { buildSidebarNav, NavItemDef } from '@/lib/navigation-builder';
import { OrgSwitcher } from './org-switcher';

export interface DashboardLayoutProps {
  user: { id: string; name: string; email: string; role: string };
  org: { id: string; name: string; plan: string; type: string } | null;
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
  locale: Locale;
  children: React.ReactNode;
  permissions?: Record<string, boolean>;
  /** Platform-only navigation (e.g. traffic emulation). */
  isSuperAdmin?: boolean;
}

export interface TaskItem {
  id: string;
  label: string;
  done: boolean;
}

function ProjectSwitcher({
  projects,
  currentProjectId,
  handleProjectSwitch,
  isPending,
}: {
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
  handleProjectSwitch: (id: string) => void;
  isPending: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentProjectId ?? 'all'}
        onValueChange={handleProjectSwitch}
        disabled={isPending}
      >
        <SelectTrigger className="h-8 w-[180px] bg-ds-surface-raised border border-ds-border-selected/10 text-[11px] font-black uppercase tracking-tighter hover:bg-ds-surface-raised/80 transition-all rounded-lg px-3 shadow-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <Stack
              weight="fill"
              className="h-3.5 w-3.5 shrink-0 text-ds-icon-brand"
            />
            <SelectValue placeholder="Project" />
          </div>
        </SelectTrigger>
        <SelectContent align="start" className="bg-ds-surface border-ds-border">
          <SelectItem value="all" className="text-xs font-bold">
            All Projects
          </SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id} className="text-xs font-medium">
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="h-4 w-px bg-ds-border mx-1 shrink-0" />
    </div>
  );
}

function SearchHeader({
  locale,
  user,
  projects,
  currentProjectId,
  handleProjectSwitch,
  isPending,
}: {
  locale: Locale;
  user: DashboardLayoutProps['user'];
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
  handleProjectSwitch: (id: string) => void;
  isPending: boolean;
}) {
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-ds-border bg-ds-surface/60 px-4 backdrop-blur-xl sticky top-0 z-30"
      role="search"
    >
      <div className="flex flex-1 items-center max-w-2xl gap-2">
        <ProjectSwitcher
          projects={projects}
          currentProjectId={currentProjectId}
          handleProjectSwitch={handleProjectSwitch}
          isPending={isPending}
        />
        <GlobalSearch locale={locale} />
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg p-1 transition-all hover:bg-ds-surface-raised border border-transparent hover:border-ds-border-selected/20 focus-visible:ring-2 focus-visible:ring-ds-border-brand outline-none"
              aria-label="Open user menu"
            >
              <Avatar className="h-8 w-8 border-2 border-ds-background ring-1 ring-ds-border-brand/10">
                <AvatarFallback className="bg-ds-background-brand-bold text-ds-text-inverse text-[10px] font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3 text-ds-icon-subtlest" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 p-2 bg-ds-surface border-ds-border shadow-ds-shadow-overlay"
          >
            <DropdownMenuLabel className="font-normal px-2 py-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-black text-ds-text-heading tracking-tight">
                  {user.name}
                </p>
                <p className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-widest truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-ds-border" />
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/dashboard/settings`}
                className="flex items-center gap-2 cursor-pointer py-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/${locale}/dashboard/settings?tab=billing`}
                className="flex items-center gap-2 cursor-pointer py-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-ds-border" />
            <DropdownMenuItem
              className="flex items-center gap-2 text-ds-text-danger focus:text-ds-text-danger focus:bg-ds-background-danger-subtle cursor-pointer py-2 font-bold"
              onClick={() => (window.location.href = `/${locale}/logout`)}
            >
              <Power className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 ml-1">
          <LanguageSwitcher currentLocale={locale} />
          <div className="hidden lg:block ml-1">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarNavItem({
  item,
  collapsed,
  onClick,
  locale,
  isRtl,
}: {
  item: NavItemDef;
  collapsed: boolean;
  onClick?: () => void;
  locale: string;
  isRtl: boolean;
}) {
  const { t } = useTranslation('dashboard');
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive = (href: string, exact?: boolean) => {
    const localized = `/${locale}${href}`;
    return exact
      ? pathname === localized
      : pathname === localized || pathname.startsWith(localized + '/');
  };

  const active = isActive(item.href, item.exact);
  const label = item.label;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/${locale}${item.href}`}
            onClick={onClick}
            className={cn(
              'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium mb-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              active
                ? 'text-primary'
                : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] hover:bg-accent/50',
              collapsed && 'justify-center px-0'
            )}
          >
            {active && (
              <motion.span
                layoutId="active-nav-indicator"
                className="absolute inset-0 rounded-md bg-primary/10"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <Icon
              weight={active ? 'fill' : 'regular'}
              className="relative z-10 h-5 w-5 shrink-0"
            />
            <AnimatePresence mode="wait" initial={false}>
              {!collapsed && (
                <motion.span
                  key={`label-${item.href}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative z-10 overflow-hidden whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side={isRtl ? 'left' : 'right'} sideOffset={10}>
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

function LeftSidebar({
  locale,
  isCollapsed,
  onToggleCollapse,
  isRtl,
  onOpenChat,
  isSuperAdmin,
  permissions = {},
  org,
}: {
  locale: Locale;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isRtl: boolean;
  onOpenChat: () => void;
  isSuperAdmin: boolean;
  permissions?: Record<string, boolean>;
  org: DashboardLayoutProps['org'];
}) {
  const { t } = useTranslation('dashboard');
  const features = useOrganizationFeatures();

  const navGroups = buildSidebarNav(
    features,
    permissions,
    t,
    isSuperAdmin,
    org?.id
  );

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden md:flex h-full flex-col border-e border-ds-border bg-ds-surface/60 backdrop-blur-xl text-ds-text shrink-0 relative overflow-hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-border/20 px-4',
          isCollapsed && 'justify-center px-0'
        )}
      >
        <OrgSwitcher currentOrg={org} collapsed={isCollapsed} />
      </div>

      <ScrollArea className="flex-1">
        <LayoutGroup id="sidebar-nav">
          <nav className="flex flex-col gap-8 py-6 px-4">
            {navGroups.map((group) => (
              <div key={group.id} className="flex flex-col gap-1.5">
                <AnimatePresence mode="wait" initial={false}>
                  {!isCollapsed && (
                    <motion.p
                      key={`group-label-${group.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)] mb-2"
                    >
                      {group.label}
                    </motion.p>
                  )}
                </AnimatePresence>
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.id}
                    item={item}
                    collapsed={isCollapsed}
                    locale={locale}
                    isRtl={isRtl}
                  />
                ))}
              </div>
            ))}
          </nav>
        </LayoutGroup>
      </ScrollArea>

      <div className="shrink-0 p-4 mt-auto border-t border-ds-border/10">
        <div className="flex items-center gap-1">
          <div className="flex-1 min-w-0">
            <SidebarNavItem
              item={
                buildSidebarNav(features, permissions, t, false)[0]?.items.find(
                  (i) => i.id === 'settings'
                ) || {
                  id: 'settings',
                  label: 'Settings',
                  href: '/dashboard/settings',
                  icon: Gear,
                  i18nKey: 'sidebar.settings',
                }
              }
              collapsed={isCollapsed}
              locale={locale}
              isRtl={isRtl}
            />
          </div>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] transition-all',
                    isCollapsed && 'w-full'
                  )}
                  aria-label={
                    isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                  }
                >
                  <motion.div
                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {isRtl ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </motion.div>
                </button>
              </TooltipTrigger>
              <TooltipContent side={isRtl ? 'left' : 'right'} sideOffset={10}>
                {isCollapsed ? 'Expand' : 'Collapse'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.aside>
  );
}

function RightSidePanel({
  locale,
  isOpen,
  onToggle,
  tasks: initialTasks = [],
  activeTab = 'assistant',
  onTabChange,
  currentUserId,
}: {
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
  tasks?: TaskItem[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  currentUserId: string;
}) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const isRtl = locale === 'ar-EG';

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
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
          'hidden md:flex h-full flex-col border-ds-border bg-ds-surface transition-all duration-300 ease-in-out overflow-hidden',
          isOpen ? 'w-[360px] border-l' : 'w-0 border-l-0'
        )}
      >
        {isOpen && (
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="flex flex-col h-full min-w-0"
          >
            <div className="shrink-0 flex items-center h-14 border-b border-ds-border px-3 gap-2">
              <TabsList className="grid grid-cols-3 h-8 bg-ds-surface-sunken flex-1">
                <TabsTrigger value="assistant" className="gap-2 text-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isRtl ? 'المساعد' : 'AI'}
                </TabsTrigger>
                <TabsTrigger value="team" className="gap-2 text-xs">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {isRtl ? 'الفريق' : 'Chat'}
                </TabsTrigger>
                <TabsTrigger value="tasks" className="gap-2 text-xs">
                  <ListTodo className="h-3.5 w-3.5" />
                  {isRtl ? 'المهام' : 'Tasks'}
                </TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={onToggle}
                aria-label="Close side panel"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <TabsContent
              value="assistant"
              className="flex-1 overflow-hidden m-0 min-h-0 data-[state=inactive]:hidden"
            >
              <AIAssistant locale={locale} />
            </TabsContent>
            <TabsContent
              value="team"
              className="flex-1 overflow-hidden m-0 min-h-0 data-[state=inactive]:hidden"
            >
              <TeamSidebarChat
                isOpen={isOpen && activeTab === 'team'}
                onClose={() => {}}
                locale={locale}
                currentUserId={currentUserId}
                pure
              />
            </TabsContent>
            <TabsContent
              value="tasks"
              className="flex-1 overflow-y-auto m-0 min-h-0 data-[state=inactive]:hidden"
            >
              <div className="p-4 space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {isRtl ? 'لا توجد مهام نشطة.' : 'No active tasks.'}
                  </p>
                ) : (
                  tasks.map((task) => (
                    <label
                      key={task.id}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border border-ds-border bg-ds-surface-raised px-3 py-2.5 cursor-pointer transition-all hover:border-ds-border-selected/40',
                        task.done && 'opacity-60 grayscale'
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
  isSuperAdmin,
  permissions = {},
  org,
}: {
  locale: Locale;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isRtl: boolean;
  onOpenChat: () => void;
  isSuperAdmin: boolean;
  permissions?: Record<string, boolean>;
  org: DashboardLayoutProps['org'];
}) {
  const { t } = useTranslation('dashboard');
  const features = useOrganizationFeatures();
  const navGroups = buildSidebarNav(
    features,
    permissions,
    t,
    isSuperAdmin,
    org?.id
  );

  const NavItem = ({
    item,
    onClick,
  }: {
    item: NavItemDef;
    onClick?: () => void;
  }) => {
    const pathname = usePathname();
    const isActive = (href: string, exact?: boolean) => {
      const localized = `/${locale}${href}`;
      return exact
        ? pathname === localized
        : pathname === localized || pathname.startsWith(localized + '/');
    };

    const active = isActive(item.href, item.exact);
    const Icon = item.icon;
    const label = item.label;

    return (
      <Link
        href={`/${locale}${item.href}`}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors mb-1',
          active
            ? 'bg-primary/10 text-primary'
            : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] hover:bg-accent/50'
        )}
      >
        <Icon
          weight={active ? 'fill' : 'regular'}
          className="h-6 w-6 shrink-0"
        />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRtl ? 'right' : 'left'}
        className="w-72 p-0 border-0 bg-background text-foreground"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          <Link
            href={`/${locale}`}
            className="flex h-14 shrink-0 items-center gap-3 px-6 border-b border-ds-border bg-ds-surface/60 backdrop-blur-xl"
            onClick={() => onOpenChange(false)}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ds-background-brand-bold text-ds-text-inverse shadow-lg shadow-ds-background-brand-bold/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-base font-black tracking-tighter text-ds-text-heading uppercase">
              GateFlow
            </span>
          </Link>
          <ScrollArea className="flex-1 py-4">
            <nav className="flex flex-col gap-8 py-4 px-3">
              {navGroups.map((group) => (
                <div key={group.id} className="flex flex-col gap-1.5">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)] mb-2">
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      onClick={() => onOpenChange(false)}
                    />
                  ))}
                </div>
              ))}

              <div className="mt-auto border-t border-border/50 pt-4">
                <NavItem
                  item={
                    navGroups[0]?.items.find((i) => i.id === 'settings') || {
                      id: 'settings',
                      label: 'Settings',
                      href: '/dashboard/settings',
                      icon: Gear,
                      i18nKey: 'sidebar.settings',
                    }
                  }
                  onClick={() => onOpenChange(false)}
                />
              </div>
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
  isSuperAdmin = false,
}: DashboardLayoutProps) {
  useRealtimeEvents();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [rightPanelTab, setRightPanelTab] = useState('assistant');
  const [rightOpen, setRightOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const router = useRouter();

  const handleProjectSwitch = (projectId: string) => {
    const val = projectId === 'all' ? 'all' : projectId;

    csrfFetch('/api/project/switch', {
      method: 'POST',
      body: JSON.stringify({ projectId: val }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to switch project');
        }
        return res;
      })
      .then(() => {
        startTransition(() => {
          if (val === 'all') {
            router.push(`/${locale}`);
          } else {
            router.push(`/${locale}/dashboard/projects/${projectId}`);
          }
        });
      })
      .catch((error) => {
        console.error('Project switch failed:', error);
        toast.error('Failed to switch project. Please try again.');
      });
  };

  const isRtl = locale === 'ar-EG';
  const pathname = usePathname();
  // Matches the /ai, /ai-hub, and /gateai(/...) route segments regardless of
  // how deep they sit under /dashboard/organizations/[orgId]/.
  const isAiPage = /\/(ai|ai-hub|gateai)(\/|$)/.test(pathname ?? '');
  const isFullBleed = isAiPage || pathname?.includes('/dashboard/onboarding');

  const onOpenChat = () => {
    setRightPanelTab('team');
    setRightOpen(true);
  };

  return (
    <div
      className="flex h-dvh flex-col overflow-hidden bg-ds-surface-sunken"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={locale}
    >
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LeftSidebar
          locale={locale}
          isCollapsed={leftCollapsed}
          onToggleCollapse={() => setLeftCollapsed((c) => !c)}
          isRtl={isRtl}
          onOpenChat={onOpenChat}
          isSuperAdmin={isSuperAdmin}
          permissions={_permissions as Record<string, boolean>}
          org={_org}
        />

        <div className="flex flex-1 min-w-0 flex-col min-h-0 overflow-hidden">
          <div className="flex h-14 shrink-0 items-center gap-2 border-b border-ds-border bg-ds-surface px-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
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

          <main
            className={`flex-1 min-h-0 bg-ds-surface-sunken ${!isFullBleed ? 'p-5 lg:p-8 overflow-y-auto' : isAiPage ? 'overflow-hidden flex flex-col' : 'overflow-y-auto flex flex-col'}`}
            role="main"
          >
            <ProjectFilterProvider
              currentProjectId={currentProjectId}
              projects={projects}
            >
              <div
                className={`animate-in fade-in slide-in-from-bottom-2 duration-500 ${!isFullBleed ? 'max-w-[1600px] mx-auto' : 'flex-1 flex flex-col h-full'}`}
              >
                {children}
              </div>
            </ProjectFilterProvider>
          </main>
        </div>

        <RightSidePanel
          locale={locale}
          isOpen={rightOpen}
          onToggle={() => setRightOpen((o) => !o)}
          activeTab={rightPanelTab}
          onTabChange={setRightPanelTab}
          currentUserId={user.id}
        />
      </div>

      <MobileSidebar
        locale={locale}
        isOpen={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        isRtl={isRtl}
        onOpenChat={onOpenChat}
        isSuperAdmin={isSuperAdmin}
        permissions={_permissions as Record<string, boolean>}
        org={_org}
      />

      <SecurityNotifier />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
