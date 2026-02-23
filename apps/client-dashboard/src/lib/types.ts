/**
 * Type utilities for bridging Prisma-generated types with application types
 */

import type { UserRole as PrismaUserRoleEnum } from '@gate-access/db';
import { UserRole } from '@gate-access/types';

/**
 * Type to handle Prisma UserRole to Application UserRole conversion
 * Both are string enums with the same values, but TypeScript doesn't know this
 */
export type AppUserRole = PrismaUserRoleEnum;

/**
 * Convert Prisma UserRole to Application UserRole
 */
export function toUserRole(prismaRole: PrismaUserRoleEnum): UserRole {
  return prismaRole as UserRole;
}

/**
 * Validate that a string is a valid UserRole
 */
export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (value === 'ADMIN' ||
      value === 'TENANT_ADMIN' ||
      value === 'TENANT_USER' ||
      value === 'VISITOR')
  );
}

/**
 * Safe cast from Prisma role to application role
 * Use this when you've verified the role is valid
 */
export function castUserRole(prismaRole: PrismaUserRoleEnum): UserRole {
  if (!isUserRole(prismaRole)) {
    throw new Error(`Invalid user role: ${prismaRole}`);
  }
  return prismaRole;
}

/**
 * Type for audit trail entries
 */
export interface AuditTrailEntry {
  timestamp: string;
  action: string;
  resolvedBy: 'lww' | 'server' | 'client';
  details: Record<string, unknown>;
}

/**
 * Type for Prisma JSON field access
 */
export interface PrismaJsonField<T> {
  [key: string]: T;
}

/**
 * Get auditTrail from a Prisma ScanLog result
 */
export function getAuditTrail(scanLog: {
  auditTrail?: unknown[];
}): AuditTrailEntry[] {
  return (scanLog.auditTrail ?? []) as AuditTrailEntry[];
}
