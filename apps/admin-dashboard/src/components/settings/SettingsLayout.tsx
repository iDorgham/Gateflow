'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Database,
  Mail,
  Globe,
  Settings,
  Bell,
  Key,
  Trash2,
  Search,
  LayoutGrid,
  Activity,
  UserCheck,
} from 'lucide-react';
import { cn, ScrollArea, Input, PageHeader, Badge } from '@gate-access/ui';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
  group?: string;
}

const SETTINGS_TABS: SettingsTab[] = [
  {
    id: 'authentication',
    label: 'Authentication',
    icon: Shield,
    href: '/settings/authentication',
    group: 'Security',
  },
  {
    id: 'database',
    label: 'Database Info',
    icon: Database,
    href: '/settings/database',
    group: 'Infrastructure',
  },
  {
    id: 'audit-logs',
    label: 'Audit Trail',
    icon: Activity,
    href: '/settings/audit-logs',
    badge: 'SYSTEM',
    group: 'Security',
  },
  {
    id: 'email',
    label: 'Email SMTP',
    icon: Mail,
    href: '/settings/email',
    badge: 'COMMING SOON',
    group: 'Communications',
  },
  {
    id: 'localization',
    label: 'Localization',
    icon: Globe,
    href: '/settings/localization',
    group: 'Platform',
  },
  {
    id: 'api-access',
    label: 'Global API Keys',
    icon: Key,
    href: '/settings/api',
    group: 'Infrastructure',
  },
];

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [search, setSearch] = useState('');

  const activeTab = useMemo(() => {
    return (
      SETTINGS_TABS.find((tab) => {
        const fullHref = `/${locale}${tab.href}`;
        return pathname === fullHref || pathname.startsWith(fullHref + '/');
      }) || SETTINGS_TABS[0]
    );
  }, [pathname, locale]);

  const groups = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = SETTINGS_TABS.filter(
      (t) =>
        t.label.toLowerCase().includes(q) || t.group?.toLowerCase().includes(q)
    );

    const map = new Map<string, SettingsTab[]>();
    filtered.forEach((tab) => {
      const group = tab.group || 'General';
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(tab);
    });
    return Array.from(map.entries());
  }, [search]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <PageHeader
        title="Admin Governance"
        subtitle="Manage global system policies, infrastructure, and security protocols."
      />

      <div className="flex flex-col lg:flex-row gap-10 min-h-[600px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtlest group-focus-within:text-ds-text-brand transition-colors" />
            <Input
              placeholder="Search settings…"
              className="pl-10 h-10 rounded-xl bg-ds-background-neutral-subtle border-ds-border focus:bg-ds-background-default transition-all shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <nav className="flex flex-col gap-8">
            {groups.map(([groupName, tabs]) => (
              <div key={groupName} className="flex flex-col gap-1.5">
                <h4 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest mb-2">
                  {groupName}
                </h4>
                <div className="flex flex-col gap-1">
                  {tabs.map((tab) => {
                    const fullHref = `/${locale}${tab.href}`;
                    const isActive = activeTab.id === tab.id;
                    const Icon = tab.icon;

                    return (
                      <Link
                        key={tab.id}
                        href={fullHref}
                        className={cn(
                          'flex items-center justify-between group px-3 py-2.5 rounded-xl transition-all duration-300',
                          isActive
                            ? 'bg-ds-background-selected border border-ds-border-selected shadow-sm translate-x-1'
                            : 'hover:bg-ds-background-neutral-subtle border border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={cn(
                              'h-4 w-4 transition-colors',
                              isActive
                                ? 'text-ds-text-brand'
                                : 'text-ds-text-subtlest'
                            )}
                          />
                          <span
                            className={cn(
                              'text-xs font-bold transition-colors',
                              isActive
                                ? 'text-ds-text-selected'
                                : 'text-ds-text-subtle'
                            )}
                          >
                            {tab.label}
                          </span>
                        </div>
                        {tab.badge && (
                          <Badge
                            variant="primary"
                            className="text-[8px] h-4 px-1.5 font-black rounded border-ds-border-selected/20 uppercase tracking-tighter bg-ds-background-brand-bold text-ds-text-inverse"
                          >
                            {tab.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-ds-border/50">
            <div className="bg-ds-background-neutral-subtle rounded-2xl p-5 flex flex-col gap-4 border border-ds-border/30 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-ds-background-brand-bold flex items-center justify-center text-ds-text-inverse font-black text-sm uppercase shadow-lg shadow-ds-background-brand-bold/20">
                  AD
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-black text-ds-text uppercase tracking-tight">
                    Admin Console
                  </span>
                  <span className="text-[9px] font-bold text-ds-text-subtlest uppercase">
                    v8.4.1 Build 2026.04
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black text-ds-text-brand uppercase tracking-widest px-1">
                <UserCheck className="h-3 w-3" /> Root Access Active
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-ds-background-default border border-ds-border rounded-3xl shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-1 p-8 lg:p-12 overflow-y-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
