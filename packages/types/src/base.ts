// Basic models without circular relations
export enum Plan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Organization {
  id: string;
  name: string;
  email: string | null;
  domain: string | null;
  plan: Plan;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  planExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

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
  | 'contacts:manage'
  | 'maintenance:view'
  | 'maintenance:manage';

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

export interface Gate {
  id: string;
  name: string;
  location: string;
  organizationId: string;
  isActive: boolean;
  lastAccessedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export enum QRCodeType {
  SINGLE = 'SINGLE',
  RECURRING = 'RECURRING',
  PERMANENT = 'PERMANENT',
  VISITOR = 'VISITOR',
  OPEN = 'OPEN',
}

export interface QRCode {
  id: string;
  code: string;
  type: QRCodeType;
  organizationId: string;
  gateId: string | null;
  maxUses: number | null;
  currentUses: number;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export enum ScanStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  MAX_USES_REACHED = 'MAX_USES_REACHED',
  INACTIVE = 'INACTIVE',
  DENIED = 'DENIED',
}

export interface ScanLog {
  id: string;
  status: ScanStatus;
  scannedAt: Date;
  userId: string | null;
  gateId: string;
  qrCodeId: string;
}

export interface Project {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum MaintenanceStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_PARTS = 'PENDING_PARTS',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

export enum MaintenancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum MaintenanceCategory {
  ELECTRICAL = 'ELECTRICAL',
  PLUMBING = 'PLUMBING',
  HVAC = 'HVAC',
  HARDWARE = 'HARDWARE',
  GENERAL = 'GENERAL',
  FACILITY = 'FACILITY',
}

export enum MaintenanceLocationType {
  GATE = 'GATE',
  UNIT = 'UNIT',
  PROJECT = 'PROJECT',
}

export interface WorkOrder {
  id: string;
  organizationId: string;
  title: string;
  description: string | null;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  category: MaintenanceCategory;
  locationType: MaintenanceLocationType;
  locationId: string | null;
  reporterId: string;
  assigneeId: string | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  gateId?: string | null;
  unitId?: string | null;
  projectId?: string | null;
}
