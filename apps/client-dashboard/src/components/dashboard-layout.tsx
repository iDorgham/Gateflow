'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Sheet, SheetContent, SheetTrigger, Button, Avatar, AvatarFallback, AvatarImage } from '@gate-access/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
  onClick?: () => void;
  isCollapsed?: boolean;
}

interface NavbarProps {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  onMenuClick?: () => void;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems?: SidebarItem[];
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  className?: string;
}

function Sidebar({ items, className, onClick, isCollapsed }: SidebarProps) {
  return (
    <aside className={cn('flex flex-col gap-2 p-4', className)}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onClick}
          title={isCollapsed ? item.title : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isCollapsed ? 'justify-center px-0 w-10 mx-auto' : 'px-3'
          )}
        >
          {item.icon}
          {!isCollapsed && <span>{item.title}</span>}
        </a>
      ))}
    </aside>
  );
}

function Navbar({ user, onMenuClick }: NavbarProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:hidden"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      <div className="flex flex-1 items-center justify-end gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex"
          aria-label="Toggle theme"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden dark:block"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:hidden"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </Button>

        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}

function DashboardLayout({
  children,
  sidebarItems = [],
  user,
  className,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      <div 
        className={cn(
          "hidden md:block h-screen transition-all duration-300 flex-shrink-0 border-r bg-card",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          <div className={cn("flex h-16shrink-0 items-center border-b px-6 h-16", isCollapsed ? "justify-center px-0" : "")}>
            {!isCollapsed ? (
              <span className="text-lg font-semibold">Gate Access</span>
            ) : (
              <span className="text-lg font-bold">G</span>
            )}
          </div>
          <Sidebar items={sidebarItems} isCollapsed={isCollapsed} className="flex-1 overflow-y-auto" />
          
          <div className={cn("mt-auto shrink-0 border-t p-4 flex flex-col gap-2", isCollapsed && "items-center px-2")}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "group flex items-center gap-3 rounded-xl py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200",
                isCollapsed ? "justify-center w-10 px-0" : "w-full px-4"
              )}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-[17px] w-[17px] shrink-0" />
              ) : (
                <>
                  <ChevronLeft className="h-[17px] w-[17px] shrink-0" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <span />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-semibold">Gate Access</span>
          </div>
          <Sidebar
            items={sidebarItems}
            className="p-4"
            onClick={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden h-screen">
        <Navbar user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export { DashboardLayout, Sidebar, Navbar };
export type { DashboardLayoutProps, SidebarProps, NavbarProps, SidebarItem };
