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
  Target,
  Briefcase,
  Monitor,
  PenTool,
  BrainCircuit,
} from 'lucide-react';
import {
  cn,
  SideNavigationShell,
  SideNavItem,
  NavGroup,
} from '@gate-access/ui';

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

const getNavGroups = (t: TFunction): NavGroupData[] => [
  {
    label: t('admin:nav.management', 'Core Platform'),
    items: [
      {
        href: '/',
        label: t('admin:nav.overview', 'Overview'),
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: '/organizations',
        label: t('admin:nav.organizations', 'Organizations'),
        icon: Building2,
      },
      { href: '/users', label: t('admin:nav.users', 'Users'), icon: Users },
      { href: '/projects', label: t('admin:nav.projects', 'Projects'), icon: FolderOpen },
      { href: '/gates', label: t('admin:nav.gates', 'Gates'), icon: DoorOpen },
      { 
        href: '/intelligence', 
        label: t('admin:nav.intelligence_hub', 'Intelligence Hub'), 
        icon: BrainCircuit 
      },
    ],
  },
  {
    label: t('admin:nav.intelligence', 'Ops & Analytics'),
    items: [
      { href: '/analytics', label: t('admin:nav.analytics', 'Performance'), icon: BarChart3 },
      { href: '/scans', label: t('admin:nav.scans', 'Scan Traffic'), icon: ScanLine },
      { href: '/monitoring/hub', label: t('admin:nav.ops_hub', 'Ops Control'), icon: Activity },
      { href: '/audit-logs', label: t('admin:nav.audit', 'Audit Trail'), icon: ScrollText },
    ],
  },
  {
    label: t('admin:nav.sales_crm', 'Sales & CRM'),
    items: [
      { href: '/crm', label: t('admin:nav.crm_dashboard', 'Lead CRM'), icon: Target },
      { href: '/crm/deals', label: t('admin:nav.deals', 'Deal Pipeline'), icon: Briefcase },
    ],
  },
  {
    label: t('admin:nav.cms', 'Content & CMS'),
    items: [
      { href: '/cms/pages', label: t('admin:nav.landing_pages', 'Landing Pages'), icon: Monitor },
      { href: '/cms/blog', label: t('admin:nav.blog_posts', 'Blog Studio'), icon: PenTool },
    ],
  },
  {
    label: t('admin:nav.governance', 'Governance'),
    items: [
      {
        href: '/monitoring/emulation',
        label: t('admin:nav.emulation', 'Emulation'),
        icon: Zap,
      },
      {
        href: '/authorization-keys',
        label: t('admin:nav.authKeys', 'Auth Keys'),
        icon: KeyRound,
      },
      { href: '/settings', label: t('admin:nav.settings', 'Settings'), icon: Settings },
      { href: '/admins', label: t('admin:nav.admins', 'Admins'), icon: Shield },
    ],
  },
];

import { OrgSwitcher } from './organizations/OrgSwitcher';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n: i18nInstance } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { orgId } = useOrganization();

  const navGroups = getNavGroups(t);
  const localePrefix = `/${i18nInstance.language}`;

  const getScopedHref = (href: string) => {
    // These paths remain global (or special)
    const globalPaths = ['/organizations', '/admins', '/settings', '/authorization-keys', '/monitoring/emulation'];
    
    if (orgId && !globalPaths.includes(href)) {
      return `${localePrefix}/organizations/${orgId}${href === '/' ? '' : href}`;
    }
    
    return `${localePrefix}${href === '/' ? '' : href}`;
  };

  async function handleSignOut() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="relative h-full transition-all duration-300">
      <SideNavigationShell
        isCollapsed={isCollapsed}
        header={<OrgSwitcher isCollapsed={isCollapsed} />}
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
              const itemHref = getScopedHref(item.href);
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
            i18nInstance.language === 'ar-EG'
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
