'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Building,
  Layers,
  Users,
  ShieldCheck,
  DoorOpen,
  Bell,
  Code,
  Globe,
  Trash2,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { cn, ScrollArea, Input } from '@gate-access/ui';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const SETTINGS_TABS: SettingsTab[] = [
  { id: 'general', label: 'General', icon: User, href: '/dashboard/settings' },
  { id: 'workspace', label: 'Workspace', icon: Building, href: '/dashboard/settings/workspace' },
  { id: 'projects', label: 'Projects', icon: Layers, href: '/dashboard/settings/projects' },
  { id: 'residents', label: 'Units & Residents', icon: LayoutGrid, href: '/dashboard/settings/residents' },
  { id: 'team', label: 'Team', icon: Users, href: '/dashboard/settings/team' },
  { id: 'rbac', label: 'Roles & Permissions', icon: ShieldCheck, href: '/dashboard/settings/rbac' },
  { id: 'gates', label: 'Gates & Scanners', icon: DoorOpen, href: '/dashboard/settings/gates' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/settings/notifications' },
  { id: 'api', label: 'API & Webhooks', icon: Code, href: '/dashboard/settings/api' },
  { id: 'integrations', label: 'Integrations', icon: Globe, href: '/dashboard/settings/integrations' },
  { id: 'danger', label: 'Danger Zone', icon: Trash2, href: '/dashboard/settings/danger' },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  const activeTab = SETTINGS_TABS.find((tab) => pathname === tab.href || pathname.startsWith(tab.href + '/')) || SETTINGS_TABS[0];

  const visibleTabs = useMemo(() => {
    if (!search.trim()) return SETTINGS_TABS;
    const q = search.toLowerCase();
    return SETTINGS_TABS.filter((t) => t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Global Search Placeholder */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace preferences, team, and security.</p>
        </div>
        <div className="relative w-full max-w-sm sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search settings..."
            className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search settings sections"
            role="searchbox"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="Settings navigation">
          <nav className="flex flex-col gap-1" role="navigation">
            {visibleTabs.length === 0 ? (
              <p className="px-3.5 py-2.5 text-sm text-muted-foreground/60 italic">No sections match &quot;{search}&quot;</p>
            ) : (
              visibleTabs.map((tab) => {
                const isActive = activeTab.id === tab.id;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-sidebar-pill"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        aria-hidden="true"
                      />
                    )}
                    <Icon
                      className={cn(
                        'h-4.5 w-4.5 shrink-0 transition-transform duration-300',
                        isActive ? 'text-primary scale-110' : 'group-hover:scale-110'
                      )}
                      aria-hidden="true"
                    />
                    <span>{tab.label}</span>
                  </Link>
                );
              })
            )}
          </nav>
        </aside>

        {/* Mobile Horizontal Tabs */}
        <div className="lg:hidden" aria-label="Settings navigation">
          <ScrollArea className="w-full pb-3">
            <div className="flex gap-2" role="navigation">
              {visibleTabs.map((tab) => {
                const isActive = activeTab.id === tab.id;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
