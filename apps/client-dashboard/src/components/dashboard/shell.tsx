'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  QrCode,
  ScanLine,
  Shield,
  BarChart3,
  Users,
  Settings,
  CreditCard,
  KeyRound,
  Webhook,
  LogOut,
  Menu,
  ChevronDown,
  Building2,
  ChevronLeft,
  ChevronRight,
  Bell,
  FolderKanban,
  ChevronsUpDown,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Button,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  Separator,
  cn,
} from '@gate-access/ui';
import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';
import { ProjectFilterProvider } from '@/context/ProjectFilterContext';

/** Must stay in sync with ALL_PROJECTS_VALUE in project-cookie.ts */
const ALL_PROJECTS = 'all';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShellUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ShellOrg {
  id: string;
  name: string;
  plan: string;
}

export interface DashboardShellProps {
  user: ShellUser;
  org: ShellOrg | null;
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
  children: React.ReactNode;
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const MAIN_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'QR Codes', href: '/dashboard/qrcodes', icon: QrCode },
  { label: 'Scan Logs', href: '/dashboard/scans', icon: ScanLine },
  { label: 'Gates', href: '/dashboard/gates', icon: Shield },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
] as const;

const WORKSPACE_NAV = [
  { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { label: 'Team', href: '/dashboard/team', icon: Users },
  { label: 'Settings', href: '/dashboard/workspace/settings', icon: Settings },
  { label: 'Billing', href: '/dashboard/workspace/billing', icon: CreditCard },
  { label: 'API Keys', href: '/dashboard/workspace/api-keys', icon: KeyRound },
  { label: 'Webhooks', href: '/dashboard/workspace/webhooks', icon: Webhook },
] as const;

const PLAN_STYLES: Record<string, { badge: string; dot: string }> = {
  FREE: { badge: 'bg-slate-700 text-slate-300', dot: 'bg-slate-400' },
  PRO: { badge: 'bg-blue-900/60 text-blue-300', dot: 'bg-blue-400' },
  ENTERPRISE: { badge: 'bg-violet-900/60 text-violet-300', dot: 'bg-violet-400' },
};

const ADMIN_ROLES = new Set(['ADMIN', 'TENANT_ADMIN']);

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2',
        active
          ? 'bg-blue-600/10 text-white'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
      )}
    >
      {active && (
        <span
          className="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          aria-hidden="true"
        />
      )}
      <Icon
        className={cn(
          'shrink-0 transition-transform duration-200',
          collapsed ? 'h-[1.15rem] w-[1.15rem]' : 'h-4 w-4',
          active && 'text-blue-400 scale-110',
          !active && 'group-hover:scale-110 group-hover:text-slate-200'
        )}
        aria-hidden="true"
      />
      {!collapsed && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </Link>
  );
}

// ─── ProjectSwitcher ──────────────────────────────────────────────────────────

function ProjectSwitcher({
  projects,
  currentProjectId,
  collapsed,
}: {
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
  collapsed: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // null means "All Projects"
  const current = currentProjectId
    ? (projects.find((p) => p.id === currentProjectId) ?? null)
    : null;
  const displayName = current?.name ?? 'All Projects';

  if (projects.length === 0) return null;

  const handleSwitch = (value: string) => {
    // value is '' for All Projects, or a specific project id
    const projectId = value === '' ? ALL_PROJECTS : value;
    const effectiveCurrent = currentProjectId ?? ALL_PROJECTS;
    if (projectId === effectiveCurrent) return;
    fetch('/api/project/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ projectId }),
    }).then(() => {
      startTransition(() => { router.refresh(); });
    });
  };

  if (collapsed) {
    return (
      <div className="flex justify-center py-2 px-2">
        <div
          title={displayName}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900/30 text-blue-300 text-[10px] font-bold ring-1 ring-blue-500/20 transition-colors hover:bg-blue-900/50"
        >
          {current?.name?.[0]?.toUpperCase() ?? '∗'}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-2 border-b border-slate-800">
      <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        Project
      </p>
      <div className="relative">
        <select
          value={currentProjectId ?? ''}
          onChange={(e) => handleSwitch(e.target.value)}
          disabled={isPending}
          className="w-full appearance-none rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 pr-8 text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-60"
          aria-label="Switch project"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <ChevronsUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      </div>
    </div>
  );
}

// ─── SidebarContent ───────────────────────────────────────────────────────────

function SidebarContent({
  user,
  org,
  pathname,
  collapsed,
  onToggleCollapse,
  onNavigate,
  projects,
  currentProjectId,
}: {
  user: ShellUser;
  org: ShellOrg | null;
  pathname: string;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  projects: { id: string; name: string }[];
  currentProjectId: string | null;
}) {
  const isAdmin = ADMIN_ROLES.has(user.role);
  const planStyle = PLAN_STYLES[org?.plan ?? 'FREE'] ?? PLAN_STYLES.FREE;

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center',
          collapsed ? 'justify-center px-2' : 'gap-3 px-5 border-b border-slate-800',
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold shadow-[0_0_12px_rgba(37,99,235,0.4)]">
          G
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight">GateFlow</span>
        )}
      </div>

      {/* Org badge */}
      {org && (
        <div
          className={cn(
            collapsed ? 'flex justify-center py-2' : 'px-4 py-3 border-b border-slate-800',
          )}
        >
          {collapsed ? (
            <span
              title={`${org.name} (${org.plan})`}
              className={cn('inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-105', planStyle.badge)}
            >
              {org.name[0].toUpperCase()}
            </span>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="truncate text-sm font-medium text-slate-200">{org.name}</span>
              </div>
              <span className={cn('mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold', planStyle.badge)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', planStyle.dot)} />
                {org.plan}
              </span>
            </>
          )}
        </div>
      )}

      {/* Project switcher */}
      <ProjectSwitcher
        projects={projects}
        currentProjectId={currentProjectId}
        collapsed={collapsed}
      />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-0.5 px-2 py-4" aria-label="Main navigation">
        {!collapsed && (
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Main
          </p>
        )}
        {MAIN_NAV.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href, 'exact' in item && item.exact)}
            collapsed={collapsed}
            onClick={onNavigate}
          />
        ))}

        {isAdmin && (
          <>
            <Separator className={cn('bg-slate-800', collapsed ? 'my-2' : 'my-3')} />
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Workspace
              </p>
            )}
            {WORKSPACE_NAV.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={isActive(item.href)}
                collapsed={collapsed}
                onClick={onNavigate}
              />
            ))}
          </>
        )}
      </nav>

      {/* Sign-out + collapse toggle */}
      <div className="shrink-0 border-t border-slate-800 px-2 py-3 space-y-1">
        <a
          href="/logout"
          title={collapsed ? 'Sign out' : undefined}
          className={cn(
            'group flex items-center rounded-lg text-slate-400 transition-colors hover:bg-red-900/20 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
            collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2',
          )}
          aria-label="Sign out"
        >
          <LogOut className={cn('shrink-0 transition-transform duration-200 group-hover:scale-110', collapsed ? 'h-[1.15rem] w-[1.15rem]' : 'h-4 w-4')} aria-hidden="true" />
          {!collapsed && <span className="text-sm font-medium">Sign out</span>}
        </a>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
            className={cn(
              'flex w-full items-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300',
              collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-[1.15rem] w-[1.15rem] shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium">Collapse</span>
                <kbd className="ml-auto hidden rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500 sm:block">
                  ⌘B
                </kbd>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ThemeToggle ──────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg" />
    );
  }

  return (
    <button
      onClick={() => {
        document.documentElement.classList.add('transitioning');
        setTheme(theme === 'dark' ? 'light' : 'dark');
        setTimeout(() => document.documentElement.classList.remove('transitioning'), 350);
      }}
      className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

// ─── DashboardShell ───────────────────────────────────────────────────────────

export function DashboardShell({ user, org, projects, currentProjectId, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Hydrate collapse state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored === 'true') setCollapsed(true);
    setMounted(true);
  }, []);

  // Persist collapse state
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed, mounted]);

  // Keyboard shortcut ⌘B / Ctrl+B
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setCollapsed((v) => !v);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            'hidden shrink-0 md:block transition-[width] duration-200 ease-in-out',
            mounted ? (collapsed ? 'w-[4.5rem]' : 'w-60') : 'w-60',
          )}
          aria-label="Sidebar"
        >
          <SidebarContent
            user={user}
            org={org}
            pathname={pathname}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((v) => !v)}
            projects={projects}
            currentProjectId={currentProjectId}
          />
        </aside>

        {/* Mobile sidebar (Sheet) */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-60 p-0 border-0" aria-label="Mobile navigation">
            <SidebarContent
              user={user}
              org={org}
              pathname={pathname}
              collapsed={false}
              onNavigate={() => setMobileOpen(false)}
              projects={projects}
              currentProjectId={currentProjectId}
            />
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Topbar */}
          <header
            className="flex h-16 shrink-0 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm dark:bg-slate-900 dark:border-slate-800"
            role="banner"
          >
            {/* Mobile menu button */}
            <button
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Breadcrumb / page title area */}
            <div className="flex-1 min-w-0" />

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Notification bell stub */}
              <button
                className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                aria-label="Notifications (coming soon)"
                title="Notifications (coming soon)"
              >
                <Bell className="h-4.5 w-4.5" aria-hidden="true" />
              </button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="User menu"
                >
                  <Avatar className="h-7 w-7 ring-2 ring-blue-600/20">
                    <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate sm:block text-slate-700 dark:text-slate-300">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    <p className="mt-0.5 text-xs text-slate-400 capitalize">
                      {user.role.replace('_', ' ').toLowerCase()}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      Profile settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/workspace/settings" className="cursor-pointer">
                      Workspace settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a
                      href="/logout"
                      className="flex items-center cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      Sign out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Scrollable page content */}
          <main
            id="main-content"
            className="flex-1 overflow-y-auto p-4 md:p-6"
            tabIndex={-1}
          >
            <ProjectFilterProvider currentProjectId={currentProjectId} projects={projects}>
              {children}
            </ProjectFilterProvider>
          </main>
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: 'font-sans text-sm',
          },
        }}
      />
    </>
  );
}
