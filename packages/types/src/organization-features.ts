import { OrganizationType } from './base';

export interface OrganizationTerminology {
  orgLabel: string;
  unitLabel: string;
  unitLabelPlural: string;
  contactLabel: string;
  contactLabelPlural: string;
  visitorLabel: string;
  projectLabel: string;
}

export interface SidebarConfig {
  visibleCapabilities: string[];
  moduleGroups: {
    id: string;
    labelKey: string;
    items: string[];
  }[];
}

export interface DashboardConfig {
  kpiIds: string[];
  chartIds: string[];
  quickActions: string[];
}

export interface SettingsConfig {
  visibleTabs: string[];
}

export interface OrganizationFeatures {
  type: OrganizationType;
  terminology: OrganizationTerminology;
  sidebar: SidebarConfig;
  dashboard: DashboardConfig;
  settings: SettingsConfig;
  flags: {
    maintenanceModule: boolean;
    rushHourAnalytics: boolean;
    vipListEmphasis: boolean;
    marketingAttribution: boolean;
    capacityWidgets: boolean;
    attendanceKpis: boolean;
    incidentEmphasis: boolean;
  };
}

/**
 * Single source of truth for organization-specific dashboard behavior.
 * This config drives terminology, navigation visibility, and dashboard layouts.
 * Translation keys follow the pattern: orgType.<type>.<key>
 */
export const ORGANIZATION_FEATURES: Record<
  OrganizationType,
  OrganizationFeatures
> = {
  [OrganizationType.REAL_ESTATE]: {
    type: OrganizationType.REAL_ESTATE,
    terminology: {
      orgLabel: 'orgType:realEstate.orgLabel',
      unitLabel: 'orgType:realEstate.unitLabel',
      unitLabelPlural: 'orgType:realEstate.unitLabelPlural',
      contactLabel: 'orgType:realEstate.contactLabel',
      contactLabelPlural: 'orgType:realEstate.contactLabelPlural',
      visitorLabel: 'orgType:realEstate.visitorLabel',
      projectLabel: 'orgType:realEstate.projectLabel',
    },
    sidebar: {
      visibleCapabilities: [
        'overview',
        'projects',
        'qr',
        'scans',
        'gates',
        'contacts',
        'units',
        'analytics',
        'maintenance',
        'team',
        'settings',
      ],
      moduleGroups: [
        {
          id: 'main',
          labelKey: 'sidebar.groupMain',
          items: ['overview', 'ai'],
        },
        {
          id: 'residents',
          labelKey: 'sidebar.groupResidents',
          items: ['contacts', 'units'],
        },
        {
          id: 'access',
          labelKey: 'sidebar.groupAccess',
          items: [
            'projects',
            'qrcodes',
            'scans',
            'gates',
            'team',
            'analytics',
            'maintenance',
          ],
        },
      ],
    },
    dashboard: {
      kpiIds: [
        'total-scans',
        'active-qr',
        'active-residents',
        'open-maintenance',
      ],
      chartIds: ['scans-by-hour', 'scans-by-gate', 'maintenance-status'],
      quickActions: ['create-qr', 'add-resident', 'report-incident'],
    },
    settings: {
      visibleTabs: [
        'workspace',
        'projects',
        'team',
        'roles',
        'notifications',
        'api-keys',
        'webhooks',
        'integrations',
        'billing',
      ],
    },
    flags: {
      maintenanceModule: true,
      rushHourAnalytics: true,
      vipListEmphasis: false,
      marketingAttribution: false,
      capacityWidgets: false,
      attendanceKpis: false,
      incidentEmphasis: true,
    },
  },
  [OrganizationType.SCHOOL]: {
    type: OrganizationType.SCHOOL,
    terminology: {
      orgLabel: 'orgType:school.orgLabel',
      unitLabel: 'orgType:school.unitLabel',
      unitLabelPlural: 'orgType:school.unitLabelPlural',
      contactLabel: 'orgType:school.contactLabel',
      contactLabelPlural: 'orgType:school.contactLabelPlural',
      visitorLabel: 'orgType:school.visitorLabel',
      projectLabel: 'orgType:school.projectLabel',
    },
    sidebar: {
      visibleCapabilities: [
        'overview',
        'qr',
        'scans',
        'gates',
        'contacts',
        'units',
        'analytics',
        'team',
        'settings',
      ],
      moduleGroups: [
        {
          id: 'main',
          labelKey: 'sidebar.groupMain',
          items: ['overview', 'ai'],
        },
        {
          id: 'residents',
          labelKey: 'sidebar.groupResidents',
          items: ['contacts', 'units'],
        },
        {
          id: 'access',
          labelKey: 'sidebar.groupAccess',
          items: ['qrcodes', 'scans', 'gates', 'team', 'analytics'],
        },
      ],
    },
    dashboard: {
      kpiIds: [
        'total-scans',
        'active-qr',
        'active-students',
        'security-incidents',
      ],
      chartIds: ['attendance-trend', 'scans-by-gate', 'incident-summary'],
      quickActions: ['create-qr', 'log-attendance', 'report-incident'],
    },
    settings: {
      visibleTabs: [
        'workspace',
        'residents',
        'team',
        'roles',
        'notifications',
        'integrations',
        'billing',
      ],
    },
    flags: {
      maintenanceModule: false,
      rushHourAnalytics: true,
      vipListEmphasis: false,
      marketingAttribution: false,
      capacityWidgets: false,
      attendanceKpis: true,
      incidentEmphasis: true,
    },
  },
  [OrganizationType.CLUB]: {
    type: OrganizationType.CLUB,
    terminology: {
      orgLabel: 'orgType:club.orgLabel',
      unitLabel: 'orgType:club.unitLabel',
      unitLabelPlural: 'orgType:club.unitLabelPlural',
      contactLabel: 'orgType:club.contactLabel',
      contactLabelPlural: 'orgType:club.contactLabelPlural',
      visitorLabel: 'orgType:club.visitorLabel',
      projectLabel: 'orgType:club.projectLabel',
    },
    sidebar: {
      visibleCapabilities: [
        'overview',
        'qr',
        'scans',
        'gates',
        'contacts',
        'units',
        'analytics',
        'team',
        'settings',
      ],
      moduleGroups: [
        {
          id: 'main',
          labelKey: 'sidebar.groupMain',
          items: ['overview', 'ai'],
        },
        {
          id: 'residents',
          labelKey: 'sidebar.groupResidents',
          items: ['contacts', 'units'],
        },
        {
          id: 'access',
          labelKey: 'sidebar.groupAccess',
          items: ['qrcodes', 'scans', 'gates', 'team', 'analytics'],
        },
      ],
    },
    dashboard: {
      kpiIds: [
        'current-capacity',
        'total-members',
        'active-qr',
        'daily-guests',
      ],
      chartIds: ['capacity-trend', 'scans-by-hour', 'membership-types'],
      quickActions: ['create-qr', 'check-in-member', 'issue-day-pass'],
    },
    settings: {
      visibleTabs: [
        'workspace',
        'residents',
        'team',
        'roles',
        'notifications',
        'api-keys',
        'integrations',
        'billing',
        'marketing',
      ],
    },
    flags: {
      maintenanceModule: true,
      rushHourAnalytics: false,
      vipListEmphasis: true,
      marketingAttribution: true,
      capacityWidgets: true,
      attendanceKpis: false,
      incidentEmphasis: false,
    },
  },
  [OrganizationType.NIGHTCLUB]: {
    type: OrganizationType.NIGHTCLUB,
    terminology: {
      orgLabel: 'orgType:nightclub.orgLabel',
      unitLabel: 'orgType:nightclub.unitLabel',
      unitLabelPlural: 'orgType:nightclub.unitLabelPlural',
      contactLabel: 'orgType:nightclub.contactLabel',
      contactLabelPlural: 'orgType:nightclub.contactLabelPlural',
      visitorLabel: 'orgType:nightclub.visitorLabel',
      projectLabel: 'orgType:nightclub.projectLabel',
    },
    sidebar: {
      visibleCapabilities: [
        'overview',
        'qr',
        'scans',
        'gates',
        'contacts',
        'units',
        'analytics',
        'team',
        'settings',
      ],
      moduleGroups: [
        {
          id: 'main',
          labelKey: 'sidebar.groupMain',
          items: ['overview', 'ai'],
        },
        {
          id: 'residents',
          labelKey: 'sidebar.groupResidents',
          items: ['contacts', 'units'],
        },
        {
          id: 'access',
          labelKey: 'sidebar.groupAccess',
          items: ['qrcodes', 'scans', 'gates', 'team', 'analytics'],
        },
      ],
    },
    dashboard: {
      kpiIds: [
        'current-capacity',
        'guest-list-count',
        'vip-arrivals',
        'total-scans',
      ],
      chartIds: ['entry-velocity', 'capacity-gauge', 'guest-demographics'],
      quickActions: ['add-to-guest-list', 'check-in-vip', 'view-blacklist'],
    },
    settings: {
      visibleTabs: [
        'workspace',
        'residents',
        'team',
        'roles',
        'notifications',
        'api-keys',
        'integrations',
        'billing',
        'marketing',
      ],
    },
    flags: {
      maintenanceModule: false,
      rushHourAnalytics: false,
      vipListEmphasis: true,
      marketingAttribution: true,
      capacityWidgets: true,
      attendanceKpis: false,
      incidentEmphasis: false,
    },
  },
  [OrganizationType.EVENT_ORGANISER]: {
    type: OrganizationType.EVENT_ORGANISER,
    terminology: {
      orgLabel: 'orgType:event.orgLabel',
      unitLabel: 'orgType:event.unitLabel',
      unitLabelPlural: 'orgType:event.unitLabelPlural',
      contactLabel: 'orgType:event.contactLabel',
      contactLabelPlural: 'orgType:event.contactLabelPlural',
      visitorLabel: 'orgType:event.visitorLabel',
      projectLabel: 'orgType:event.projectLabel',
    },
    sidebar: {
      visibleCapabilities: [
        'overview',
        'projects',
        'qr',
        'scans',
        'gates',
        'contacts',
        'analytics',
        'team',
        'settings',
      ],
      moduleGroups: [
        {
          id: 'main',
          labelKey: 'sidebar.groupMain',
          items: ['overview', 'ai'],
        },
        {
          id: 'access',
          labelKey: 'sidebar.groupAccess',
          items: ['projects', 'qrcodes', 'scans', 'gates', 'team', 'analytics'],
        },
      ],
    },
    dashboard: {
      kpiIds: [
        'total-tickets',
        'checked-in',
        'active-gates',
        'conversion-rate',
      ],
      chartIds: [
        'check-in-velocity',
        'tickets-by-type',
        'marketing-attribution',
      ],
      quickActions: ['create-event', 'bulk-invite', 'export-attendees'],
    },
    settings: {
      visibleTabs: [
        'workspace',
        'projects',
        'team',
        'roles',
        'notifications',
        'api-keys',
        'webhooks',
        'integrations',
        'billing',
        'marketing',
      ],
    },
    flags: {
      maintenanceModule: false,
      rushHourAnalytics: false,
      vipListEmphasis: true,
      marketingAttribution: true,
      capacityWidgets: false,
      attendanceKpis: false,
      incidentEmphasis: false,
    },
  },
};

export function getOrganizationFeatures(
  type: OrganizationType
): OrganizationFeatures {
  return (
    ORGANIZATION_FEATURES[type] ||
    ORGANIZATION_FEATURES[OrganizationType.REAL_ESTATE]
  );
}
