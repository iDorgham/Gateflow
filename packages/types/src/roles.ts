import type { Permission } from './base';
import { OrganizationType } from './base';
import { BUILT_IN_ROLES, DEFAULT_PERMISSIONS } from './user';

/** Legacy spaced names and ids → canonical slugs. */
const ROLE_SLUG_ALIASES: Record<string, string> = {
  ORGANIZATION_ADMIN: 'ORG_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  SECURITY_MANAGER: 'SECURITY_MANAGER',
  GATE_OPERATOR: 'GATE_OPERATOR',
  TENANT_ADMIN: 'TENANT_ADMIN',
  TENANT_USER: 'TENANT_USER',
};

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Organization Admin',
  SECURITY_MANAGER: 'Security Manager',
  GATE_OPERATOR: 'Gate Operator',
  TENANT_ADMIN: 'Tenant Admin',
  TENANT_USER: 'Tenant User',
  VISITOR: 'Visitor',
  RESIDENT: 'Resident',
  ADMIN: 'Admin',
};

function titleCaseFromSlug(slug: string): string {
  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/** Canonical UNDERSCORE slug used for matching, permissions, and storage. */
export function roleSlug(value: string): string {
  const normalized = value
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase();
  return ROLE_SLUG_ALIASES[normalized] ?? normalized;
}

/** Human-readable role name. Spaces are allowed (School Teacher). */
export function formatRoleLabel(value: string): string {
  const slug = roleSlug(value);
  if (ROLE_DISPLAY_NAMES[slug]) return ROLE_DISPLAY_NAMES[slug];
  if (/\s/.test(value.trim()) && roleSlug(value) === slug) {
    return value.trim();
  }
  return titleCaseFromSlug(slug);
}

function asOrganizationType(
  value: OrganizationType | string
): OrganizationType {
  if ((Object.values(OrganizationType) as string[]).includes(value)) {
    return value as OrganizationType;
  }
  return OrganizationType.REAL_ESTATE;
}

export function filterVisibleTeamRoles<
  T extends {
    name: string;
    slug?: string | null;
    organizationId?: string | null;
  },
>(
  roles: readonly T[],
  orgType: OrganizationType | string
): Array<T & { slug: string; name: string }> {
  const typedOrgType = asOrganizationType(orgType);
  const seen = new Set<string>();
  return roles
    .filter((role) =>
      isTeamRoleVisibleForOrg(
        role.slug || role.name,
        typedOrgType,
        role.organizationId
      )
    )
    .map((role) => {
      const slug = role.slug?.trim()
        ? roleSlug(role.slug)
        : roleSlug(role.name);
      const name = /\s/.test(role.name.trim())
        ? role.name.trim()
        : formatRoleLabel(role.name);
      return { ...role, slug, name };
    })
    .filter((role) => {
      if (seen.has(role.slug)) return false;
      seen.add(role.slug);
      return true;
    });
}

export const PLATFORM_TEAM_ROLES = [
  'TENANT_ADMIN',
  'TENANT_USER',
  'VISITOR',
  'RESIDENT',
  'ORG_ADMIN',
  'SECURITY_MANAGER',
  'GATE_OPERATOR',
] as const;

export type OrgTypeMemberRole = {
  slug: string;
  name: string;
  orgType: OrganizationType;
  description: string;
};

export const ORG_TYPE_MEMBER_ROLES: readonly OrgTypeMemberRole[] = [
  {
    slug: 'REAL_ESTATE_PROPERTY_MANAGER',
    name: 'Property Manager',
    orgType: OrganizationType.REAL_ESTATE,
    description: 'Manages units, residents, and day-to-day property access',
  },
  {
    slug: 'REAL_ESTATE_CONCIERGE',
    name: 'Concierge',
    orgType: OrganizationType.REAL_ESTATE,
    description: 'Front-desk guest handling and QR lookups',
  },
  {
    slug: 'REAL_ESTATE_MAINTENANCE_STAFF',
    name: 'Maintenance Staff',
    orgType: OrganizationType.REAL_ESTATE,
    description: 'Maintenance work orders and gate access for contractors',
  },
  {
    slug: 'SCHOOL_PRINCIPAL',
    name: 'Principal',
    orgType: OrganizationType.SCHOOL,
    description: 'School-wide administration and staff access',
  },
  {
    slug: 'SCHOOL_TEACHER',
    name: 'Teacher',
    orgType: OrganizationType.SCHOOL,
    description: 'Classroom and student-contact access',
  },
  {
    slug: 'SCHOOL_GUARD',
    name: 'Guard',
    orgType: OrganizationType.SCHOOL,
    description: 'Gate scanning and campus entry control',
  },
  {
    slug: 'CLUB_MANAGER',
    name: 'Club Manager',
    orgType: OrganizationType.CLUB,
    description: 'Club operations, members, and gate assignments',
  },
  {
    slug: 'CLUB_MEMBER_SERVICES',
    name: 'Member Services',
    orgType: OrganizationType.CLUB,
    description: 'Member records and guest QR issuance',
  },
  {
    slug: 'CLUB_DOOR_STAFF',
    name: 'Door Staff',
    orgType: OrganizationType.CLUB,
    description: 'Door scanning and entry checks',
  },
  {
    slug: 'NIGHTCLUB_VENUE_MANAGER',
    name: 'Venue Manager',
    orgType: OrganizationType.NIGHTCLUB,
    description: 'Venue operations, VIP lists, and security',
  },
  {
    slug: 'NIGHTCLUB_BOUNCER',
    name: 'Bouncer',
    orgType: OrganizationType.NIGHTCLUB,
    description: 'Door control with scan override',
  },
  {
    slug: 'NIGHTCLUB_VIP_HOST',
    name: 'VIP Host',
    orgType: OrganizationType.NIGHTCLUB,
    description: 'VIP guest QR creation and contact handling',
  },
  {
    slug: 'EVENT_MANAGER',
    name: 'Event Manager',
    orgType: OrganizationType.EVENT_ORGANISER,
    description: 'Event operations, QR programs, and staff gates',
  },
  {
    slug: 'EVENT_STAFF_COORDINATOR',
    name: 'Staff Coordinator',
    orgType: OrganizationType.EVENT_ORGANISER,
    description: 'Staff gate assignments and roster view',
  },
  {
    slug: 'EVENT_TICKET_SCANNER',
    name: 'Ticket Scanner',
    orgType: OrganizationType.EVENT_ORGANISER,
    description: 'Ticket and pass scanning at event gates',
  },
];

for (const role of ORG_TYPE_MEMBER_ROLES) {
  ROLE_DISPLAY_NAMES[role.slug] = role.name;
}

function withBase(
  base: Record<Permission, boolean>,
  overrides: Partial<Record<Permission, boolean>>
): Record<Permission, boolean> {
  return { ...base, ...overrides };
}

const operator = DEFAULT_PERMISSIONS[BUILT_IN_ROLES.GATE_OPERATOR];
const manager = DEFAULT_PERMISSIONS[BUILT_IN_ROLES.SECURITY_MANAGER];
const admin = DEFAULT_PERMISSIONS[BUILT_IN_ROLES.ORG_ADMIN];

export const ORG_TYPE_ROLE_PERMISSIONS: Record<
  string,
  Record<Permission, boolean>
> = {
  REAL_ESTATE_PROPERTY_MANAGER: withBase(manager, {
    'units:view': true,
    'units:manage': true,
    'residents:manage': true,
    'contacts:manage': true,
  }),
  REAL_ESTATE_CONCIERGE: withBase(operator, {
    'qr:view': true,
    'contacts:manage': true,
  }),
  REAL_ESTATE_MAINTENANCE_STAFF: withBase(operator, {
    'maintenance:manage': true,
  }),
  SCHOOL_PRINCIPAL: admin,
  SCHOOL_TEACHER: withBase(operator, {
    'units:view': true,
    'contacts:manage': true,
    'qr:view': true,
    'qr:create': true,
  }),
  SCHOOL_GUARD: operator,
  CLUB_MANAGER: withBase(manager, {
    'users:view': true,
    'contacts:manage': true,
  }),
  CLUB_MEMBER_SERVICES: withBase(operator, {
    'qr:view': true,
    'qr:create': true,
    'contacts:manage': true,
    'units:view': true,
  }),
  CLUB_DOOR_STAFF: operator,
  NIGHTCLUB_VENUE_MANAGER: withBase(manager, {
    'contacts:manage': true,
    'qr:manage': true,
  }),
  NIGHTCLUB_BOUNCER: withBase(operator, {
    'scans:override': true,
  }),
  NIGHTCLUB_VIP_HOST: withBase(operator, {
    'qr:view': true,
    'qr:create': true,
    'contacts:manage': true,
  }),
  EVENT_MANAGER: withBase(manager, {
    'qr:create': true,
    'qr:manage': true,
  }),
  EVENT_STAFF_COORDINATOR: withBase(operator, {
    'users:view': true,
    'gates:assignments': true,
  }),
  EVENT_TICKET_SCANNER: operator,
};

export function isTeamRoleVisibleForOrg(
  roleName: string,
  orgType: OrganizationType,
  organizationId?: string | null
): boolean {
  if (organizationId) return true;
  const slug = roleSlug(roleName);
  if (slug === 'SUPER_ADMIN' || slug === 'ADMIN') return false;
  if ((PLATFORM_TEAM_ROLES as readonly string[]).includes(slug)) return true;
  return ORG_TYPE_MEMBER_ROLES.some(
    (role) => role.orgType === orgType && role.slug === slug
  );
}
