'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from './sidebar';

import { ThemeToggle } from './theme-toggle';
import { ProjectFilterProvider } from '@/context/ProjectFilterContext';
import { 
  Avatar, 
  AvatarFallback, 
  Sheet, 
  SheetContent, 
  Button
} from '@gate-access/ui';
import { Toaster } from 'sonner';
import { Menu, Bell } from 'lucide-react';

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
  children: React.ReactNode;
}

export function DashboardShell({ user, org, projects, currentProjectId, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar org={org} projects={projects} currentProjectId={currentProjectId} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 border-0 w-64" aria-label="Mobile navigation">
          <Sidebar org={org} projects={projects} currentProjectId={currentProjectId} />
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
            <div className="hidden md:block">
              <h2 className="text-sm font-bold tracking-tight text-foreground uppercase opacity-40">Client Dashboard</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4.5 w-4.5" />
            </Button>
            <ThemeToggle />
            <div className="h-8 w-[1px] bg-border mx-1" />
            <Link href="/dashboard/settings?tab=profile" className="flex items-center gap-3 pl-1 group hover:opacity-80 transition-opacity">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-foreground leading-none group-hover:text-primary transition-colors">{user.name}</span>
                <span className="text-[10px] font-medium text-muted-foreground mt-1 capitalize">{user.role.toLowerCase().replace('_', ' ')}</span>
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
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ProjectFilterProvider currentProjectId={currentProjectId} projects={projects}>
              {children}
            </ProjectFilterProvider>
          </div>
        </main>
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
