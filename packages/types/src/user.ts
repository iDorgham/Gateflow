import { Organization } from './organization';
/** Role name constants for JWT/auth (matches Role.name in DB) */
export const UserRole = {
  ADMIN: 'ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  TENANT_USER: 'TENANT_USER',
  VISITOR: 'VISITOR',
  RESIDENT: 'RESIDENT',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export type Permission =
  | 'gates:view'
  | 'gates:manage'
  | 'gates:assignments'
  | 'qr:view'
  | 'qr:create'
  | 'qr:manage'
  | 'scans:view'
  | 'scans:override'
  | 'scans:export'
  | 'workspace:manage'
  | 'roles:manage'
  | 'users:view'
  | 'users:manage'
  | 'analytics:view'
  | 'projects:view'
  | 'projects:manage'
  | 'units:view'
  | 'units:manage'
  | 'residents:manage'
  | 'contacts:manage';

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: Record<Permission, boolean>;
  isBuiltIn: boolean;
  organizationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string | null;
  name: string;
  avatarUrl?: string | null;
  bio?: string | null;
  passwordHash: string;
  roleId: string;
  role: Role;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserWithOrganization extends User {
  organization?: Organization | null;
}

export const BUILT_IN_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Organization Admin',
  SECURITY_MANAGER: 'Security Manager',
  GATE_OPERATOR: 'Gate Operator',
  RESIDENT: 'Resident',
} as const;

export const DEFAULT_PERMISSIONS: Record<string, Record<Permission, boolean>> = {
  [BUILT_IN_ROLES.SUPER_ADMIN]: {
    'gates:view': true,
    'gates:manage': true,
    'gates:assignments': true,
    'qr:view': true,
    'qr:create': true,
    'qr:manage': true,
    'scans:view': true,
    'scans:override': true,
    'scans:export': true,
    'workspace:manage': true,
    'roles:manage': true,
    'users:view': true,
    'users:manage': true,
    'analytics:view': true,
    'projects:view': true,
    'projects:manage': true,
    'units:view': true,
    'units:manage': true,
    'residents:manage': true,
    'contacts:manage': true,
  },
  [BUILT_IN_ROLES.ORG_ADMIN]: {
    'gates:view': true,
    'gates:manage': true,
    'gates:assignments': true,
    'qr:view': true,
    'qr:create': true,
    'qr:manage': true,
    'scans:view': true,
    'scans:override': true,
    'scans:export': true,
    'workspace:manage': true,
    'roles:manage': true,
    'users:view': true,
    'users:manage': true,
    'analytics:view': true,
    'projects:view': true,
    'projects:manage': true,
    'units:view': true,
    'units:manage': true,
    'residents:manage': true,
    'contacts:manage': true,
  },
  [BUILT_IN_ROLES.SECURITY_MANAGER]: {
    'gates:view': true,
    'gates:manage': true,
    'gates:assignments': true,
    'qr:view': true,
    'qr:create': false,
    'qr:manage': false,
    'scans:view': true,
    'scans:override': true,
    'scans:export': true,
    'workspace:manage': false,
    'roles:manage': false,
    'users:view': true,
    'users:manage': false,
    'analytics:view': true,
    'projects:view': true,
    'projects:manage': false,
    'units:view': false,
    'units:manage': false,
    'residents:manage': false,
    'contacts:manage': false,
  },
  [BUILT_IN_ROLES.GATE_OPERATOR]: {
    'gates:view': true,
    'gates:manage': false,
    'gates:assignments': false,
    'qr:view': false,
    'qr:create': false,
    'qr:manage': false,
    'scans:view': true,
    'scans:override': false,
    'scans:export': false,
    'workspace:manage': false,
    'roles:manage': false,
    'users:view': false,
    'users:manage': false,
    'analytics:view': false,
    'projects:view': false,
    'projects:manage': false,
    'units:view': false,
    'units:manage': false,
    'residents:manage': false,
    'contacts:manage': false,
  },
  [BUILT_IN_ROLES.RESIDENT]: {
    'gates:view': false,
    'gates:manage': false,
    'gates:assignments': false,
    'qr:view': true,
    'qr:create': true,
    'qr:manage': true,
    'scans:view': false,
    'scans:override': false,
    'scans:export': false,
    'workspace:manage': false,
    'roles:manage': false,
    'users:view': false,
    'users:manage': false,
    'analytics:view': false,
    'projects:view': false,
    'projects:manage': false,
    'units:view': false,
    'units:manage': false,
    'residents:manage': false,
    'contacts:manage': false,
  },
};
