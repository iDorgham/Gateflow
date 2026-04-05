'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  LayoutDashboard,
  Building2,
  Users,
  ScanLine,
  LogOut,
  Shield,
  ChevronLeft,
  BarChart3,
  ScrollText,
  Activity,
  KeyRound,
  Settings,
  FolderOpen,
  DoorOpen,
  Zap,
  Database,
  Target,
  Columns3,
  Palette,
} from 'lucide-react';
import { useOrganization } from '@/providers/organization-provider';
import {
  cn,
  SideNavigationShell,
  SideNavItem,
  NavGroup,
} from '@gate-access/ui';
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
  const prefix = orgId ? `/organizations/${orgId}` : '';

  return [
    {
      label: t('admin:nav.management', 'Management'),
      items: [
        {
          href: orgId ? `${prefix}` : '/',
          label: t('admin:nav.overview'),
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: '/organizations',
          label: t('admin:nav.organizations'),
          icon: Building2,
        },
        { href: `${prefix}/users`, label: t('admin:nav.users'), icon: Users },
        {
          href: `${prefix}/tasks`,
          label: t('admin:nav.tasks', 'Task Hub'),
          icon: Columns3,
        },
        {
          href: `${prefix}/projects`,
          label: t('admin:nav.projects'),
          icon: FolderOpen,
        },
        {
          href: `${prefix}/gates`,
          label: t('admin:nav.gates'),
          icon: DoorOpen,
        },
        {
          href: `${prefix}/branding`,
          label: t('admin:nav.branding', 'Style Hub'),
          icon: Palette,
        },
      ],
    },
    {
      label: t('admin:nav.intelligence', 'Intelligence'),
      items: [
        {
          href: `${prefix}/analytics`,
          label: t('admin:nav.analytics'),
          icon: BarChart3,
        },
        {
          href: `${prefix}/crm`,
          label: t('admin:nav.crm', 'Lead Intel'),
          icon: Target,
        },
        {
          href: `${prefix}/scans`,
          label: t('admin:nav.scans'),
          icon: ScanLine,
        },
        {
          href: `${prefix}/audit-logs`,
          label: t('admin:nav.audit'),
          icon: ScrollText,
        },
      ],
    },
    {
      label: t('admin:nav.infrastructure', 'Infrastructure'),
      items: [
        {
          href: `${prefix}/monitoring/hub`,
          label: t('admin:nav.ops_hub'),
          icon: Activity,
        },
        {
          href: `${prefix}/monitoring/emulation`,
          label: t('admin:nav.emulation'),
          icon: Zap,
        },
        {
          href: `${prefix}/monitoring/seeding`,
          label: t('admin:nav.seeding'),
          icon: Database,
        },
      ],
    },
    {
      label: t('admin:nav.governance', 'Governance'),
      items: [
        {
          href: `${prefix}/monitoring`,
          label: t('admin:nav.monitoring'),
          icon: Activity,
        },
        {
          href: `${prefix}/authorization-keys`,
          label: t('admin:nav.authKeys', 'Auth Keys'),
          icon: KeyRound,
        },
        {
          href: `${prefix}/settings`,
          label: t('admin:nav.settings'),
          icon: Settings,
        },
        {
          href: `${prefix}/admins`,
          label: t('admin:nav.admins'),
          icon: Shield,
        },
      ],
    },
  ];
};

export function Sidebar() {
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
              onClick={() => {
                handleSignOut();
              }}
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
            // Default: points left. If collapsed: points right.
            // But in RTL: default should point right. If collapsed: points left.
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
