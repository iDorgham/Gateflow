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
  CreditCard,
} from 'lucide-react';
import { cn, ScrollArea, Input } from '@gateflow/ui';
import { useTranslation } from 'react-i18next';
import { useOrganizationFeatures } from '@/context/OrganizationFeaturesContext';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  slug: string;
  permission?: string;
}

interface SettingsTabDef {
  id: string;
  icon: React.ElementType;
  slug: string;
  permission?: string;
}

// `slug` is appended to whatever `/settings` root the layout is currently
// mounted under (e.g. `/en/dashboard/organizations/{orgId}/settings`) — see
// SettingsLayout's `settingsRoot`. Do not hardcode an absolute href here:
// the flat `/dashboard/settings/*` routes are legacy redirect shims (see
// dashboard/settings/[...slug]/page.tsx) that forward to the org-scoped
// path, so a hardcoded href never matches `usePathname()` and the active
// tab silently stops updating.
const SETTINGS_TABS_DEFS: SettingsTabDef[] = [
  { id: 'general', icon: User, slug: '' },
  {
    id: 'workspace',
    icon: Building,
    slug: 'workspace',
    permission: 'workspace:manage',
  },
  {
    id: 'projects',
    icon: Layers,
    slug: 'projects',
    permission: 'projects:view',
  },
  {
    id: 'residents',
    icon: LayoutGrid,
    slug: 'residents',
    permission: 'units:view',
  },
  { id: 'team', icon: Users, slug: 'team', permission: 'users:view' },
  { id: 'rbac', icon: ShieldCheck, slug: 'rbac', permission: 'roles:manage' },
  { id: 'gates', icon: DoorOpen, slug: 'gates', permission: 'gates:view' },
  { id: 'notifications', icon: Bell, slug: 'notifications' },
  { id: 'api', icon: Code, slug: 'api', permission: 'api_keys:manage' },
  {
    id: 'integrations',
    icon: Globe,
    slug: 'integrations',
    permission: 'workspace:manage',
  },
  {
    id: 'billing',
    icon: CreditCard,
    slug: 'billing',
    permission: 'billing:view',
  },
  {
    id: 'danger',
    icon: Trash2,
    slug: 'danger',
    permission: 'workspace:manage',
  },
];

export function SettingsLayout({
  children,
  permissions = {},
  orgName,
}: {
  children: React.ReactNode;
  permissions?: Record<string, boolean>;
  orgName?: string;
}) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const { t } = useTranslation('dashboard');
  const features = useOrganizationFeatures();

  // The layout is mounted under different roots (org-scoped
  // `/dashboard/organizations/{orgId}/settings`, and the legacy
  // `/dashboard/settings` redirect shim) — derive the root from the live
  // pathname rather than hardcoding one, so tab hrefs always match.
  const settingsRoot = useMemo(() => {
    const idx = pathname.indexOf('/settings');
    return idx === -1 ? pathname : pathname.slice(0, idx + '/settings'.length);
  }, [pathname]);

  const tabs: SettingsTab[] = useMemo(() => {
    return SETTINGS_TABS_DEFS.filter((def) => {
      // Filter by vertical config
      if (!features.settings.visibleTabs.includes(def.id)) return false;
      // Filter by permissions
      if (def.permission && !permissions[def.permission]) return false;
      return true;
    }).map((def) => {
      let label = t(
        `settings.tabs.${def.id}`,
        def.id.charAt(0).toUpperCase() + def.id.slice(1)
      );

      // Terminology overrides
      if (def.id === 'residents') {
        label = `${t(features.terminology.unitLabelPlural)} & ${t(features.terminology.contactLabelPlural)}`;
      } else if (def.id === 'projects') {
        label = t(features.terminology.projectLabel);
      }

      const href = def.slug ? `${settingsRoot}/${def.slug}` : settingsRoot;

      return { ...def, label, href };
    });
  }, [features, permissions, t, settingsRoot]);

  const activeTab = tabs.find((tab) =>
    tab.slug === ''
      ? pathname === tab.href
      : pathname === tab.href || pathname.startsWith(tab.href + '/')
  ) ||
    tabs[0] || {
      id: 'none',
      label: 'Settings',
      href: '#',
      icon: User,
      slug: '',
    };

  const visibleTabs = useMemo(() => {
    if (!search.trim()) return tabs;
    const q = search.toLowerCase();
    return tabs.filter(
      (t) => t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    );
  }, [search, tabs]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Global Search Placeholder */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ds-text)]">
            {t(features.terminology.orgLabel)}{' '}
            {t('settings.titleSuffix', 'Settings')}
          </h1>
          <p className="text-sm text-[var(--ds-text-subtle)]">
            {t('settings.description', {
              defaultValue:
                'Global configuration and administrative nodes for {{orgName}}.',
              orgName: orgName || t('settings.titleSuffix', 'Settings'),
            })}
          </p>
        </div>
        <div className="relative w-full max-w-sm sm:w-72">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
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
        <aside
          className="hidden w-64 shrink-0 lg:block"
          aria-label="Settings navigation"
        >
          <nav className="flex flex-col gap-1" role="navigation">
            {visibleTabs.length === 0 ? (
              <p className="px-3.5 py-2.5 text-sm text-muted-foreground/60 italic">
                No sections match &quot;{search}&quot;
              </p>
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
                      'group relative flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle)] hover:text-[var(--ds-text)]'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-sidebar-pill"
                        className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive
                          ? 'text-primary'
                          : 'text-[var(--ds-icon-subtle)]'
                      )}
                      strokeWidth={1.5}
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
                      'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'border border-[var(--ds-border)] bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)]'
                    )}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
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
