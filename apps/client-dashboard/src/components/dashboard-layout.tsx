'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { Locale } from '@/lib/i18n-config';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@gate-access/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { usePathname } from 'next/navigation';

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
}

function Sidebar({ items, className, onClick, isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className={cn('flex flex-col gap-2 p-4', className)}>
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onClick}
            title={isCollapsed ? item.title : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200',
              isActive
                ? 'bg-ds-background-brand-subtle text-ds-text-brand shadow-sm'
                : 'text-ds-text-subtle hover:bg-ds-background-neutral-subtle hover:text-ds-text font-medium',
              isCollapsed ? 'justify-center px-0 w-11 mx-auto' : 'px-4'
            )}
          >
            <span
              className={cn(
                'transition-colors',
                isActive
                  ? 'text-ds-text-brand'
                  : 'text-ds-text-subtlest group-hover:text-ds-text-subtle'
              )}
            >
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="truncate tracking-tight">{item.title}</span>
            )}
          </a>
        );
      })}
    </aside>
  );
}

function Navbar({ user, onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const currentLocale = (pathname.split('/')[1] || 'en') as Locale;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-ds-border bg-sidebar px-6 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="inline-flex items-center justify-center rounded-xl p-2 text-sm font-medium transition-colors hover:bg-ds-background-neutral-subtle md:hidden"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      <div className="flex flex-1 items-center justify-end gap-3">
        <GlobalSearch />
        <div className="h-4 w-px bg-ds-border mx-1" />

        <ThemeToggle />
        <LanguageSwitcher currentLocale={currentLocale} />

        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-xl p-0 overflow-hidden border border-ds-border hover:border-ds-border-brand transition-all"
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback className="bg-ds-background-brand-bold text-white text-[10px] font-black">
              {user?.name?.charAt(0) ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}

// GlobalSearch component for the client dashboard navbar
function GlobalSearch() {
  return (
    <div className="hidden sm:flex relative items-center max-w-[240px] w-full">
      <svg
        className="absolute ltr:left-3 rtl:right-3 h-3.5 w-3.5 text-ds-text-subtlest"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search everything..."
        className="w-full bg-ds-background-neutral-subtle border border-ds-border rounded-full py-1.5 ltr:pl-9 rtl:pr-9 text-[11px] font-bold text-ds-text-subtle focus:outline-none focus:ring-2 focus:ring-ds-border-brand focus:bg-ds-background-default transition-all"
      />
    </div>
  );
}
function DashboardLayout({
  children,
  sidebarItems = [],
  user,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();
  const currentLocale = (pathname.split('/')[1] || 'en') as Locale;
  const isRtl = currentLocale === 'ar-EG';

  return (
    <div className="flex min-h-dvh w-full bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-foreground sm:antialiased">
      <div
        className={cn(
          'hidden md:block h-dvh transition-all duration-300 flex-shrink-0 bg-sidebar text-sidebar-foreground',
          'ltr:border-r rtl:border-l border-sidebar-border',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          <div
            className={cn(
              'flex h-16 shrink-0 items-center border-b px-6',
              isCollapsed ? 'justify-center px-0' : ''
            )}
          >
            {!isCollapsed ? (
              <span className="text-lg font-black italic uppercase tracking-tighter">
                GateFlow
              </span>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ds-background-brand-bold text-white shadow-sm ring-2 ring-background">
                <span className="text-xs font-black">G</span>
              </div>
            )}
          </div>
          <Sidebar
            items={sidebarItems}
            isCollapsed={isCollapsed}
            className="flex-1 overflow-y-auto"
          />

          <div
            className={cn(
              'mt-auto shrink-0 border-t p-4 flex flex-col gap-2',
              isCollapsed && 'items-center px-2'
            )}
          >
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                'group flex items-center gap-3 rounded-xl py-2 text-sm font-bold text-ds-text-subtle hover:bg-ds-background-neutral-subtle hover:text-ds-text transition-all duration-200',
                isCollapsed ? 'justify-center w-11 px-0' : 'w-full px-4'
              )}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight
                  className={cn(
                    'h-[17px] w-[17px] shrink-0',
                    isRtl && 'rotate-180'
                  )}
                />
              ) : (
                <>
                  <ChevronLeft
                    className={cn(
                      'h-[17px] w-[17px] shrink-0',
                      isRtl && 'rotate-180'
                    )}
                  />
                  <span className="font-extrabold uppercase text-[11px] tracking-widest">
                    {isRtl ? 'تصغير' : 'Collapse'}
                  </span>
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
        <SheetContent side={isRtl ? 'right' : 'left'} className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-black italic uppercase tracking-tighter">
              GateFlow
            </span>
          </div>
          <Sidebar
            items={sidebarItems}
            className="p-4"
            onClick={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden h-dvh">
        <Navbar user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background relative scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}

export { DashboardLayout, Sidebar, Navbar };
export type { DashboardLayoutProps, SidebarProps, NavbarProps, SidebarItem };
