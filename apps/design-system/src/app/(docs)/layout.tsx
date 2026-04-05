'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Library,
  Layers,
  Palette,
  Accessibility,
  Package,
  BookOpen,
  History,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import {
  cn,
  Button,
  ScrollArea,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@gateflow/ui';
import { useGateFlowColorMode } from '@gateflow/theme';

const sidebarItems = [
  { label: 'Foundations', href: '/foundations', icon: Library },
  { label: 'Tokens', href: '/tokens', icon: Palette },
  { label: 'Accessibility', href: '/accessibility', icon: Accessibility },
  {
    label: 'Components',
    href: '/components',
    icon: Layers,
    subItems: [
      { label: 'Primitives', href: '/components/primitives' },
      { label: 'Patterns', href: '/components/patterns' },
      { label: 'AI UI', href: '/components/ai' },
    ],
  },
  { label: 'Packages', href: '/packages', icon: Package },
  { label: 'Guidelines', href: '/guidelines', icon: BookOpen },
  { label: 'Changelog', href: '/changelog', icon: History },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { colorMode, setColorMode } = useGateFlowColorMode();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--ds-border-subtle)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ds-background-brand-bold)] text-white shadow-sm font-black">
                G
              </div>
              <span className="hidden font-black tracking-tight text-xl md:inline-block">
                GateFlow{' '}
                <span className="text-[var(--ds-text-subtle)] font-medium">
                  Design
                </span>
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="hidden max-w-sm flex-1 md:block">
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-icon-subtle)]"
                />
                <input
                  type="text"
                  placeholder="Search design system..."
                  className="h-9 w-full rounded-md border border-[var(--ds-border)] bg-[var(--ds-background-neutral-subtle)] pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused)] transition-all"
                  readOnly
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-50 bg-[var(--ds-background-neutral-pressed)]">
                  ⌘K
                </kbd>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                >
                  {colorMode === 'dark' ? (
                    <Moon size={18} />
                  ) : colorMode === 'light' ? (
                    <Sun size={18} />
                  ) : (
                    <Laptop size={18} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setColorMode('light')}>
                  <Sun size={14} className="mr-2" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorMode('dark')}>
                  <Moon size={14} className="mr-2" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorMode('system')}>
                  <Laptop size={14} className="mr-2" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 border-r border-[var(--ds-border-subtle)] bg-background transition-transform duration-200 ease-in-out md:sticky md:block',
            isSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0',
            'top-16 h-[calc(100vh-64px)]'
          )}
        >
          <ScrollArea className="h-full py-6 px-4">
            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + '/');

                return (
                  <div key={item.href} className="flex flex-col gap-1">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                          : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] hover:text-[var(--ds-text)]'
                      )}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>

                    {item.subItems && isActive && (
                      <div className="ml-9 flex flex-col gap-1 border-l border-[var(--ds-border-subtle)] pl-4">
                        {item.subItems.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                'rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                                isSubActive
                                  ? 'text-[var(--ds-text-selected)]'
                                  : 'text-[var(--ds-text-subtlest)] hover:text-[var(--ds-text)]'
                              )}
                              onClick={() => setIsSidebarOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden md:px-4">
          <div className="mx-auto max-w-5xl py-10 px-4 md:px-8">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
