import {
  SquaresFour,
  QrCode as QrCodeIcon,
  Record,
  ChartLineUp,
  House,
  Gear,
  Sparkle,
  Users,
  Buildings,
  Stack,
  Pulse,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';
import { Wrench, type LucideIcon } from 'lucide-react';
import { OrganizationFeatures } from '@gate-access/types';
import { TFunction } from 'i18next';

export type NavCapabilityId =
  | 'overview'
  | 'ai'
  | 'projects'
  | 'qrcodes'
  | 'scans'
  | 'gates'
  | 'team'
  | 'analytics'
  | 'maintenance'
  | 'settings'
  | 'contacts'
  | 'units'
  | 'emulation';

type NavIcon = PhosphorIcon | LucideIcon;

export interface NavItemDef {
  id: NavCapabilityId;
  label: string;
  href: string;
  icon: NavIcon;
  exact?: boolean;
  i18nKey: string;
  permission?: string;
}

export const NAV_REGISTRY: Record<NavCapabilityId, NavItemDef> = {
  overview: {
    id: 'overview',
    label: 'Dashboard',
    href: '/',
    icon: SquaresFour,
    exact: true,
    i18nKey: 'sidebar.overview',
  },
  ai: {
    id: 'ai',
    label: 'AI assistant',
    href: '/dashboard/ai',
    icon: Sparkle,
    i18nKey: 'sidebar.gateAi',
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    href: '/dashboard/projects',
    icon: Stack,
    i18nKey: 'sidebar.projects',
    permission: 'projects:view',
  },
  qrcodes: {
    id: 'qrcodes',
    label: 'QR Codes',
    href: '/dashboard/qrcodes',
    icon: QrCodeIcon,
    i18nKey: 'sidebar.qrCodes',
    permission: 'qr:view',
  },
  scans: {
    id: 'scans',
    label: 'Scan Logs',
    href: '/dashboard/scans',
    icon: Record,
    i18nKey: 'sidebar.scanLogs',
    permission: 'scans:view',
  },
  gates: {
    id: 'gates',
    label: 'Gates',
    href: '/dashboard/gates',
    icon: House,
    i18nKey: 'sidebar.gates',
    permission: 'gates:view',
  },
  team: {
    id: 'team',
    label: 'Team',
    href: '/dashboard/team',
    icon: Users,
    i18nKey: 'sidebar.team',
    permission: 'users:view',
  },
  analytics: {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartLineUp,
    i18nKey: 'sidebar.analytics',
    permission: 'analytics:view',
  },
  maintenance: {
    id: 'maintenance',
    label: 'Maintenance',
    href: '/dashboard/maintenance',
    icon: Wrench,
    i18nKey: 'sidebar.maintenance',
    permission: 'maintenance:view',
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Gear,
    i18nKey: 'sidebar.settings',
    permission: 'workspace:manage',
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    href: '/dashboard/residents/contacts',
    icon: Users,
    i18nKey: 'sidebar.contacts',
    permission: 'contacts:manage',
  },
  units: {
    id: 'units',
    label: 'Units',
    href: '/dashboard/residents/units',
    icon: Buildings,
    i18nKey: 'sidebar.units',
    permission: 'units:view',
  },
  emulation: {
    id: 'emulation',
    label: 'Traffic emulation',
    href: '/dashboard/emulation',
    icon: Pulse,
    i18nKey: 'sidebar.emulation',
  },
};

export interface SidebarGroup {
  id: string;
  label: string;
  items: NavItemDef[];
}

export function buildSidebarNav(
  features: OrganizationFeatures,
  permissions: Record<string, boolean>,
  t: TFunction,
  isSuperAdmin: boolean,
  orgId?: string
): SidebarGroup[] {
  const groups: SidebarGroup[] = [];
  for (const groupConfig of features.sidebar.moduleGroups) {
    const groupItems: NavItemDef[] = [];

    for (const itemId of groupConfig.items) {
      const def = NAV_REGISTRY[itemId as NavCapabilityId];
      if (!def) continue;

      // Filter by visibility in config
      if (!features.sidebar.visibleCapabilities.includes(itemId)) continue;

      // Filter by permission
      if (def.permission && !permissions[def.permission]) continue;

      // Inject orgId into href
      let href = def.href;
      if (orgId) {
        if (def.id === 'overview') {
          href = `/dashboard/organizations/${orgId}`;
        } else if (href.startsWith('/dashboard')) {
          href = `/dashboard/organizations/${orgId}${href.replace('/dashboard', '')}`;
        }
      }

      // Apply terminology override to label if applicable
      let label = t(def.i18nKey, def.label);
      if (itemId === 'units') {
        label = t(features.terminology.unitLabelPlural, 'Units');
      } else if (itemId === 'contacts') {
        label = t(features.terminology.contactLabelPlural, 'Contacts');
      }

      groupItems.push({
        ...def,
        label,
        href,
      });
    }

    if (groupItems.length > 0) {
      groups.push({
        id: groupConfig.id,
        label: t(groupConfig.labelKey, groupConfig.id),
        items: groupItems,
      });
    }
  }

  // Add SuperAdmin group if applicable
  if (isSuperAdmin) {
    const emulationDef = { ...NAV_REGISTRY.emulation };
    if (orgId) {
      emulationDef.href = `/dashboard/organizations/${orgId}/emulation`;
    }
    
    groups.push({
      id: 'platform',
      label: t('sidebar.groupPlatform', 'Platform'),
      items: [emulationDef],
    });
  }

  return groups;
}
