'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Rocket,
  BookOpen,
  Menu,
  Settings,
  BarChart3,
  Users,
  ScanLine,
  Columns3,
  FolderOpen,
  DoorOpen,
  Activity,
  KeyRound,
  Shield,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { useOrganization } from '@/providers/organization-provider';
import { cn, SideNavigationShell, SideNavItem, NavGroup } from '@gateflow/ui';
import { OrgSwitcher } from './organizations/org-switcher';

interface NavItemData {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavGroupData {
  label: string;
  items: NavItemData[];
}

const getNavGroups = (t: TFunction, orgId: string | null): NavGroupData[] => {
  return [
    {
      label: t('admin:nav.platform', 'Platform'),
      items: [
        {
          href: '/',
          label: t('admin:nav.dashboard', 'Dashboard'),
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: '/organizations',
          label: t('admin:nav.organizations', 'Organizations'),
          icon: Building2,
        },
      ],
    },
    {
      label: t('admin:nav.cms', 'CMS'),
      items: [
        {
          href: '/cms/pages',
          label: t('admin:nav.pages', 'Pages'),
          icon: FileText,
        },
        {
          href: '/cms/landing-pages',
          label: t('admin:nav.landing_pages', 'Landing Pages'),
          icon: Rocket,
        },
        {
          href: '/cms/blog',
          label: t('admin:nav.blog', 'Blog'),
          icon: BookOpen,
        },
        {
          href: '/cms/menus',
          label: t('admin:nav.menus', 'Menus'),
          icon: Menu,
        },
        {
          href: '/cms/settings',
          label: t('admin:nav.settings', 'Settings'),
          icon: Settings,
        },
      ],
    },
    {
      label: t('admin:nav.intelligence', 'Intelligence'),
      items: [
        {
          href: '/analytics/dashboard',
          label: t('admin:nav.analytics', 'Analytics'),
          icon: BarChart3,
        },
        {
          href: '/crm/contacts',
          label: t('admin:nav.crm', 'CRM'),
          icon: Users,
        },
        {
          href: orgId ? `/organizations/${orgId}/scans` : '/scans',
          label: t('admin:nav.scans', 'Scans'),
          icon: ScanLine,
        },
      ],
    },
    {
      label: t('admin:nav.operations', 'Operations'),
      items: [
        {
          href: orgId ? `/organizations/${orgId}/tasks` : '/tasks',
          label: t('admin:nav.task_hub', 'Task Hub'),
          icon: Columns3,
        },
        {
          href: orgId ? `/organizations/${orgId}/projects` : '/projects',
          label: t('admin:nav.projects', 'Projects'),
          icon: FolderOpen,
        },
        {
          href: orgId ? `/organizations/${orgId}/gates` : '/gates',
          label: t('admin:nav.gates', 'Gates'),
          icon: DoorOpen,
        },
      ],
    },
    {
      label: t('admin:nav.governance', 'Governance'),
      items: [
        {
          href: orgId ? `/organizations/${orgId}/monitoring` : '/monitoring',
          label: t('admin:nav.monitoring', 'Monitoring'),
          icon: Activity,
        },
        {
          href: orgId
            ? `/organizations/${orgId}/authorization-keys`
            : '/authorization-keys',
          label: t('admin:nav.auth_keys', 'Auth Keys'),
          icon: KeyRound,
        },
        {
          href: '/team-roles',
          label: t('admin:nav.team_roles', 'Team Roles'),
          icon: Shield,
        },
        {
          href: orgId ? `/organizations/${orgId}/settings` : '/settings',
          label: t('admin:nav.settings', 'Settings'),
          icon: Settings,
        },
      ],
    },
  ];
};

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { orgId } = useOrganization();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navGroups = getNavGroups(t, orgId);
  const localePrefix = `/${i18n.language}`;

  async function handleSignOut() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="relative h-full transition-all duration-300">
      <SideNavigationShell
        isCollapsed={isCollapsed}
        header={
          <div
            className={cn(
              'flex h-16 items-center px-4 gap-3 border-b border-border/40 mb-2',
              isCollapsed && 'justify-center border-none'
            )}
          >
            <OrgSwitcher isCollapsed={isCollapsed} />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black italic tracking-tighter text-ds-text uppercase">
                  GateFlow
                </span>
                <span className="text-[10px] font-black text-ds-text-brand tracking-widest uppercase opacity-90">
                  Platform Admin
                </span>
              </div>
            )}
          </div>
        }
        footer={
          <div className="flex flex-col gap-0.5 p-2">
            <SideNavItem
              href="#"
              label={t('admin:nav.signOut', 'Sign out')}
              icon={LogOut}
              isCollapsed={isCollapsed}
              onClick={() => handleSignOut()}
            />
          </div>
        }
      >
        {navGroups.map((group) => (
          <NavGroup
            key={group.label}
            label={group.label}
            isCollapsed={isCollapsed}
          >
            {group.items.map((item) => {
              const itemHref = `${localePrefix}${item.href === '/' ? '' : item.href}`;
              const active = item.exact
                ? pathname === itemHref || pathname === `${itemHref}/`
                : pathname.startsWith(itemHref);
              return (
                <SideNavItem
                  key={item.href}
                  label={item.label}
                  href={itemHref}
                  icon={item.icon}
                  isActive={active}
                  isCollapsed={isCollapsed}
                />
              );
            })}
          </NavGroup>
        ))}
      </SideNavigationShell>

      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-ds-border bg-ds-background-default shadow-sm hover:bg-ds-background-neutral-subtle transition-all group',
          'ltr:-right-3 rtl:-left-3'
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          className={cn(
            'h-3.5 w-3.5 text-ds-icon-subtle transition-transform group-hover:text-ds-icon',
            i18n.language === 'ar-EG'
              ? isCollapsed
                ? 'rotate-0'
                : 'rotate-180'
              : isCollapsed
                ? 'rotate-180'
                : 'rotate-0'
          )}
        />
      </button>
    </div>
  );
}
