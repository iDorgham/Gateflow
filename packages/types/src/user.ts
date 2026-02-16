import type { Organization } from './organization';

export enum UserRole {
  ADMIN = 'ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  TENANT_USER = 'TENANT_USER',
  VISITOR = 'VISITOR',
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserWithOrganization extends User {
  organization?: Organization | null;
}

export type UserRoleType = keyof typeof UserRole;
