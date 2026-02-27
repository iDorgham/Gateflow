import { Organization } from './organization';
export type Permission =
  | 'gates:manage'
  | 'qr:create'
  | 'qr:manage'
  | 'scans:view'
  | 'scans:override'
  | 'workspace:manage'
  | 'roles:manage'
  | 'users:manage'
  | 'analytics:view'
  | 'projects:manage'
  | 'units:manage'
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
  email: string;
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
    'gates:manage': true,
    'qr:create': true,
    'qr:manage': true,
    'scans:view': true,
    'scans:override': true,
    'workspace:manage': true,
    'roles:manage': true,
    'users:manage': true,
    'analytics:view': true,
    'projects:manage': true,
    'units:manage': true,
    'contacts:manage': true,
  },
  [BUILT_IN_ROLES.ORG_ADMIN]: {
    'gates:manage': true,
    'qr:create': true,
    'qr:manage': true,
    'scans:view': true,
    'scans:override': true,
    'workspace:manage': true,
    'roles:manage': true,
    'users:manage': true,
    'analytics:view': true,
    'projects:manage': true,
    'units:manage': true,
    'contacts:manage': true,
  },
  [BUILT_IN_ROLES.SECURITY_MANAGER]: {
    'gates:manage': true,
    'qr:create': false,
    'qr:manage': false,
    'scans:view': true,
    'scans:override': true,
    'workspace:manage': false,
    'roles:manage': false,
    'users:manage': false,
    'analytics:view': true,
    'projects:manage': false,
    'units:manage': false,
    'contacts:manage': false,
  },
  [BUILT_IN_ROLES.GATE_OPERATOR]: {
    'gates:manage': false,
    'qr:create': false,
    'qr:manage': false,
    'scans:view': true,
    'scans:override': false,
    'workspace:manage': false,
    'roles:manage': false,
    'users:manage': false,
    'analytics:view': false,
    'projects:manage': false,
    'units:manage': false,
    'contacts:manage': false,
  },
  [BUILT_IN_ROLES.RESIDENT]: {
    'gates:manage': false,
    'qr:create': true,
    'qr:manage': true,
    'scans:view': false,
    'scans:override': false,
    'workspace:manage': false,
    'roles:manage': false,
    'users:manage': false,
    'analytics:view': false,
    'projects:manage': false,
    'units:manage': false,
    'contacts:manage': false,
  },
};
